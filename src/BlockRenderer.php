<?php
namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\{PageSection, Utils};

class BlockRenderer {

    public function __construct() {
        add_filter('the_content', [$this, 'clean_up_html'], 10, 1);
        add_filter('render_block', [$this, 'wrap_third_party_blocks'], 10, 2);
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

    public static function maybe_wrap_component($attributes, $component) {
        if (isset($attributes['sectionBackground'])) {
            return new PageSection([
                'backgroundColor' => $attributes['sectionBackground'],
                ...Utils::array_pick($attributes, ['size'])
            ], [$component]);
        }

        return $component;
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

    public static function transform_block_data_to_acf_style_result(?array $field_data, string $prefix) {
        if ($field_data === null || !is_array($field_data) || count($field_data) === 0) {
            return $field_data;
        }

        // Remove the $prefix from the field keys
        return array_reduce(array_keys($field_data), function($result, $key) use ($field_data, $prefix) {
            $short_key = str_replace($prefix, '', $key);
            $result[$short_key] = $field_data[$key];

            return $result;
        }, []);
    }
}
