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
}
