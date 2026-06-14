<?php
namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\Config;

class TinyMceConfig {

    public function __construct() {
        add_filter('editor_stylesheets', [$this, 'add_editor_css'], 10);
        add_filter('doublee_tinymce_theme_colours', [$this, 'add_theme_colours_to_tinymce_tools']);
        add_filter('doublee_tinymce_miniblock_defaults', [$this, 'add_component_defaults_to_tinymce_tools']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_custom_tinymce_js'], 11);
        add_action('admin_enqueue_scripts', [$this, 'make_component_defaults_available_to_tinymce_js'], 12);
    }

    /**
     * Utility function to define all the CSS files to load in the various TinyMCE contexts.
     * - Global CSS is intended to be things like CSS variables and the application of data-* attributes like color theme and background.
     * - Common CSS should contain site-wide typography styles, common component atoms, theme-level overrides for colour variables, etc.
     * - tinymce/components.css should contain the component CSS for any components used by the custom TinyMCE plugins, such as buttons and callouts.
     * - tinymce.css is for styles specific to the WYSIWYG editor context, such as adding padding around the content.
     *
     * @return array[]
     */
    private function get_css_files(): array {
        return array(
            [
                'path' => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/global.css',
                'url'  => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/global.css',
            ],
            [
                'path' => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/common.css',
                'url'  => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/common.css',
            ],
            [
                'path' => get_template_directory() . '/tinymce.css',
                'url'  => get_template_directory_uri() . '/tinymce.css',
            ],
            [
                'path' => get_stylesheet_directory() . '/common.css',
                'url'  => get_stylesheet_directory_uri() . '/common.css',
            ],
            [
                'path' => get_stylesheet_directory() . '/tinymce.css',
                'url'  => get_stylesheet_directory_uri() . '/tinymce.css',
            ],
            [
                'path' => __DIR__ . DIRECTORY_SEPARATOR . 'tinymce' . DIRECTORY_SEPARATOR . 'components.css',
                'url'  => COMET_PLUGIN_URL . '/tinymce/components.css',
            ],
        );
    }

    /**
     * Load CSS in default TinyMCE
     *
     * @param  $stylesheets  - already loaded stylesheets
     *
     * @return array
     */
    public function add_editor_css($stylesheets): array {
        $css = $this->get_css_files();

        foreach ($css as $file_info) {
            if (file_exists($file_info['path'])) {
                $version = filemtime($file_info['path']); // cache bust
                array_push($stylesheets, add_query_arg('v', $version, $file_info['url']));
            }
        }

        return $stylesheets;
    }



    /**
     * Add theme colours to the custom plugins added in the Double-E TinyMCE plugin
     *
     * @param  $colours
     *
     * @return array
     */
    public function add_theme_colours_to_tinymce_tools($colours): array {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return $colours;
        }

        $theme_colours = Config::getInstance()->get_theme_colours();
        $filtered = array_filter($theme_colours, fn($key) => !in_array($key, ['black', 'white']), ARRAY_FILTER_USE_KEY);

        return array_unique(array_merge($colours, $filtered));
    }

    /**
     * Add some component defaults to TinyMCE miniblock defaults
     *
     * @param  $defaults
     *
     * @return array
     */
    public function add_component_defaults_to_tinymce_tools($defaults): array {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return $defaults;
        }

        return array_merge($defaults, [
            'button-group' => Config::getInstance()->get_component_defaults('button-group'),
            'pullquote'    => Config::getInstance()->get_component_defaults('pullquote'),
            'callout'      => Config::getInstance()->get_component_defaults('callout'),
        ]);
    }

    public function enqueue_custom_tinymce_js(): void {
        wp_enqueue_script(
            'comet-tinymce',
	        COMET_PLUGIN_URL . '/tiny-mce-config.js',
            [],
            COMET_VERSION,
            true
        );
    }

    public function make_component_defaults_available_to_tinymce_js(): void {
        $data = CometConfigHandler::get_component_defaults();
        wp_localize_script('comet-tinymce', 'comet', $data);
    }

}
