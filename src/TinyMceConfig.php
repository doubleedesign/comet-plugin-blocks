<?php
namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\{Config};

class TinyMceConfig {

    public function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'editor_css']);
        add_filter('tiny_mce_before_init', [$this, 'editor_css_acf']);
        add_filter('doublee_tinymce_theme_colours', [$this, 'add_theme_colours_to_tinymce_tools']);
        add_filter('tiny_mce_before_init', [$this, 'add_theme_colours_to_tinymce_content']);
        add_action('admin_enqueue_scripts', [$this, 'make_data_available_to_tinymce_js'], 20);
    }

    /**
     * Utility function to define all the CSS files to load in the various TinyMCE contexts
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
                'path' => get_stylesheet_directory() . '/tinymce.css',
                'url'  => get_stylesheet_directory_uri() . '/tinymce.css',
            ],
            [
                'path' => __DIR__ . DIRECTORY_SEPARATOR . 'tinymce' . DIRECTORY_SEPARATOR . 'components.css',
                'url'  => plugin_dir_url(__FILE__) . 'tinymce/components.css',
            ],
        );
    }

    /**
     * Load CSS in default TinyMCE
     *
     * @return void
     */
    public function editor_css(): void {
        $css = $this->get_css_files();

        foreach ($css as $file_info) {
            if (file_exists($file_info['path'])) {
                add_editor_style($file_info['url']);
            }
        }
    }

    /**
     * Load CSS in ACF WYSIWYG fields
     * Ref: https://pagegwood.com/web-development/custom-editor-stylesheets-advanced-custom-fields-wysiwyg/
     *
     * @param  $mce_init
     *
     * @return array
     */
    public function editor_css_acf($mce_init): array {
        $css = $this->get_css_files();

        foreach ($css as $file_info) {
            if (file_exists($file_info['path'])) {
                $version = filemtime($file_info['path']);
                $css = $file_info['url'] . '?v=' . $version; // it caches hard, use this to force a refresh
                if (isset($mce_init['content_css'])) {
                    $mce_init['content_css'] .= ',' . $css;
                }
                else {
                    $mce_init['content_css'] = $css;
                }
            }
        }

        return $mce_init;
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
     * Add colours from theme.json as CSS variables to TinyMCE content
     *
     * @param  $settings
     *
     * @return array
     */
    public function add_theme_colours_to_tinymce_content($settings): array {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return $settings;
        }

        $colours = Config::getInstance()->get_theme_colours();
        $embedded_css = ':root {';

        if (!empty($colours)) {
            foreach ($colours as $label => $value) {
                $embedded_css .= '--color-' . strtolower($label) . ':' . $value . ';';
            }
        }

        $embedded_css .= '}';

        if (isset($settings['content_style'])) {
            $settings['content_style'] .= ' ' . $embedded_css;
        }
        else {
            $settings['content_style'] = $embedded_css;
        }

        return $settings;
    }

    /**
     * Make theme colours and other config available to TinyMCE JS (primarily for use in the miniblocks plugin)
     *
     * @return void
     */
    public function make_data_available_to_tinymce_js(): void {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return;
        }

        try {
            $defaults = Config::getInstance()->get('component_defaults');
            $background = Config::getInstance()->get_global_background();
            $palette = Config::getInstance()->get_theme_colours();

            wp_localize_script('wp-tinymce', 'comet', array(
                'defaults'         => $defaults,
                'globalBackground' => $background,
                'palette'          => $palette,
                'ajaxUrl'          => admin_url('admin-ajax.php'),
                'nonce'            => wp_create_nonce('comet_ajax_nonce'),
                'context'          => [
                    // TODO: Handle taxonomy term types here too
                    'object_type' => get_post_type(),
                    'id'		        => get_the_id(),
                ]
            ));
        }
        catch (\Exception $e) {
            if (function_exists('dump')) {
                dump($e->getMessage());
            }
            else {
                error_log($e->getMessage());
            }
        }
    }
}
