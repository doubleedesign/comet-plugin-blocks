<?php
namespace Doubleedesign\Comet\WordPress;

class BlockRenderer {
    private static array $theme_json;

    public function __construct() {
        add_filter('wp_theme_json_data_default', [$this, 'filter_default_theme_json'], 10, 1);
        add_filter('the_content', [$this, 'clean_up_html'], 10, 1);
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

}
