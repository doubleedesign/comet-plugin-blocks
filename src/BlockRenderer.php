<?php
namespace Doubleedesign\Comet\WordPress;

class BlockRenderer {

    public function __construct() {
        add_filter('wp_theme_json_data_default', [$this, 'filter_default_theme_json'], 10, 1);
        add_filter('the_content', [$this, 'clean_up_html'], 10, 1);
        add_filter('render_block', [$this, 'wrap_third_party_blocks'], 10, 2);
    }

    /**
     * Filter the default theme.json data to remove some of the WP defaults
     * that add unwanted CSS variables
     *
     * @param  $theme_json
     *
     * @return object (WP_Theme_JSON_Data, or WP_Theme_JSON_Data_Gutenberg if the Gutenberg plugin is installed to get latest features/fixes)
     */
    public function filter_default_theme_json($theme_json): object {
        $data = $theme_json->get_data();
        // Remove unused WP defaults that become the --wp--preset-* CSS variables and clog up the CSS
        $data['settings']['color']['palette']['default'] = [];
        $data['settings']['color']['duotone']['default'] = [];
        $data['settings']['color']['gradients']['default'] = [];
        $data['settings']['shadow']['presets']['default'] = [];
        $data['settings']['typography']['fontSizes']['default'] = [];
        $data['settings']['spacing']['spacingSizes']['default'] = [];

        // Remove some only on the front-end, because they're needed in the editor
        if (!is_admin()) {
            $data['settings']['dimensions']['aspectRatios'] = [];
        }

        $theme_json->update_with($data);

        return $theme_json;
    }

    public function clean_up_html($content): string {
        // Remove empty <p> tags that sometimes get added around blocks
        return preg_replace('/<p>(\s|&nbsp;)*<\/p>/', '', $content);
    }

    /**
     * Wrap third-party blocks with Comet components for consistent theming and layout
     * if a render file exists in blocks/third-party/{block-name}/render.php.
     * Works in conjunction with Comet attributes being added to the block in BlockRegistry.php AND block-registry.js.
     *
     * Note: For Ninja Forms, this doesn't work out of the box in the editor
     * - we need to do some customisation to editor rendering in block-registry.js.
     * This may be similar for some other third-party blocks.
     *
     * TODO: Add documentation for this in README.md and/or Comet docs site.
     *
     * @param  $block_content
     * @param  $block
     *
     * @return string
     */
    public function wrap_third_party_blocks($block_content, $block): string {
        $block_file = __DIR__ . "/blocks/third-party/{$block['blockName']}/render.php";

        if (file_exists($block_file)) {
            ob_start();
            include $block_file;

            return ob_get_clean();
        }

        return $block_content;
    }

    /**
     * Return early in the editor if the block content is empty,
     * because that will trigger the built-in placeholder rather than a zero-height block of nothing.
     * This should be used directly in block render templates,
     * which have access to a $is_preview variable to pass in $is_editor like so:
     * $is_editor = isset($is_preview) && $is_preview;
     *
     * @param  array  $block
     * @param  bool  $is_editor
     *
     * @return bool
     */
    public static function maybe_render_editor_placeholder(array $block, bool $is_editor): bool {
        if (!$is_editor) {
            return false;
        }

        $filtered_data = self::filter_fields_for_determining_if_block_has_content($block['data'] ?? []);

        return self::block_data_array_is_effectively_empty($filtered_data);
    }

    private static function filter_fields_for_determining_if_block_has_content(array $data): array {
        // The $data array of an ACF block contains the field names prefixed with an underscore with the field key as the value.
        // We don't want that for this, so filter them out first.
        $filtered_data = array_filter($data, function($key) {
            return !str_starts_with($key, '_');
        }, ARRAY_FILTER_USE_KEY);

        // Also skip some fields with default values
        $filtered_data = array_filter($filtered_data, function($key) {
            return !str_ends_with($key, 'aspect_ratio')
                && !str_ends_with($key, 'focal_point')
                && !str_ends_with($key, 'image_offset')
                && !str_contains($key, 'button');
        }, ARRAY_FILTER_USE_KEY);

        return $filtered_data;
    }

    private static function block_data_array_is_effectively_empty(array $filtered_data): bool {
        $non_empty_values = array_filter($filtered_data, function($value) {
            if (is_array($value)) {
                $sub_filtered = self::filter_fields_for_determining_if_block_has_content($value);

                return !self::block_data_array_is_effectively_empty($sub_filtered);
            }
            if (is_string($value)) {
                return trim($value) !== '' && trim($value) !== '0';
            }
            if (is_numeric($value)) {
                return $value < 1;
            }

            return !empty($value);
        });

        return count($non_empty_values) === 0;
    }
}
