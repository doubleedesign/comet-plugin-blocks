<?php
namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\{Config};

class TinyMceConfig {
    // TODO: Add callout and possibly some other miniblocks
    private array $comet_miniblocks = ['comet_miniblocks_pullquote', 'comet_miniblocks_callout'];

    public function __construct() {
        add_filter('tiny_mce_before_init', [$this, 'init_settings'], 10, 1);
        add_filter('acf/fields/wysiwyg/toolbars', [$this, 'customise_wysiwyg_toolbars_acf'], 10, 1);
        add_filter('tiny_mce_before_init', [$this, 'customise_tinymce_toolbars_default'], 20, 1);
        add_filter('tiny_mce_before_init', [$this, 'add_theme_colours_to_tinymce_content']);
        add_filter('tiny_mce_before_init', [$this, 'populate_styleselect']);

        add_filter('mce_external_plugins', [$this, 'register_miniblocks_plugin'], 1, 1);
        add_action('admin_enqueue_scripts', [$this, 'register_miniblocks_admin_css'], 20);
        add_filter('mce_buttons', [$this, 'register_miniblock_buttons'], 5);
        add_action('admin_enqueue_scripts', [$this, 'make_theme_colours_available_to_tinymce_js'], 20);

        add_action('after_setup_theme', [$this, 'editor_css']);
        add_filter('tiny_mce_before_init', [$this, 'editor_css_acf']);
    }

    /**
     * Some default TinyMCE settings
     *
     * @param  $settings
     *
     * @return array
     */
    public function init_settings($settings): array {
        $settings['paste_as_text'] = true; // default to "Paste as text"
        $settings['wordpress_adv_hidden'] = false; // keep the "kitchen sink" open

        return $settings;
    }

    private function filter_buttons(array $buttons): array {
        // Note: formatselect is the standard paragraph/heading selector, but we are replacing this with the custom format selector
        $always_remove = ['formatselect', 'forecolor', 'fullscreen', 'wp_more', 'alignjustify', 'indent', 'outdent', 'underline', 'blockquote', 'wp_adv'];
        $rows = array_keys($buttons);
        foreach ($rows as $row) {
            $buttons[$row] = array_filter($buttons[$row], function($button) use ($always_remove) {
                return !in_array($button, $always_remove);
            });
            $buttons[$row] = array_unique($buttons[$row]); // ensure no accidental duplicates
        }

        return $buttons;
    }

    /**
     * Customise the buttons available in WYSIWYG field editors.
     * Notes: Themes and other plugins may have their own customisations
     *        The "full" toolbar is affected by TinyMCE filters such as tinymce_before_init and mce_buttons.
     *
     * @param  $toolbars
     *
     * @return array
     */
    public function customise_wysiwyg_toolbars_acf($toolbars): array {
        $filtered_basic = array_filter($toolbars['Basic']['1'], function($button) {
            return !in_array($button, ['underline', 'fullscreen', 'blockquote']);
        });

        // Specify basic toolbar for ACF fields
        $toolbars['Basic']['1'] = array_merge(
            ['styleselect', 'removeformat'],
            $filtered_basic,
            $this->comet_miniblocks,
            ['charmap', 'pastetext', 'undo', 'redo']
        );

        // Specify minimal toolbar for ACF fields
        $toolbars['Minimal']['1'] = array_merge(
            ['styleselect', 'removeformat'],
            array_filter($filtered_basic, function($button) {
                return !in_array($button, ['alignleft', 'alignjustify', 'aligncenter', 'alignright', 'bullist', 'numlist']);
            }),
            $this->comet_miniblocks,
            ['charmap', 'pastetext', 'undo', 'redo'],
        );

        // Rearrange some items in the Full toolbars to match the others
        $toolbars['Full']['1'] = array_merge(
            ['styleselect', 'removeformat'],
            array_filter(
                $toolbars['Full']['1'],
                function($button) {
                    return !in_array($button, ['formatselect', 'underline', 'fullscreen', 'blockquote']);
                }
            ),
            $this->comet_miniblocks,
            array_filter(
                $toolbars['Full']['2'],
                function($button) {
                    return !in_array($button, ['pastetext', 'undo', 'redo']);
                }
            ),
            ['charmap']
        );
        usort($toolbars['Full']['1'], function($a, $b) use ($toolbars) {
            $order = $toolbars['Basic']['1'];

            $pos_a = array_search($a, $order);
            $pos_b = array_search($b, $order);

            // If not in the basic list, put them at the end
            if ($pos_a === false) {
                $pos_a = PHP_INT_MAX;
            }
            if ($pos_b === false) {
                $pos_b = PHP_INT_MAX;
            }

            return $pos_a - $pos_b;
        });
        $toolbars['Full']['2'] = ['pastetext', 'undo', 'redo'];

        // Loop through all toolbars used by ACF (including "Full" and any not shown here) and remove globally unwanted buttons
        return array_map(function(array $rows) {
            return $this->filter_buttons($rows);
        }, $toolbars);
    }

    /**
     * Use the same configuration for default TinyMCE as for the "full" toolbar configuration used for ACF TinyMCE fields
     *
     * @param  $settings
     *
     * @return array
     */
    public function customise_tinymce_toolbars_default($settings): array {
        $acf_toolbars = (new \acf_field_wysiwyg())->get_toolbars();
        if (!isset($acf_toolbars['Full'])) {
            return $settings;
        }

        $settings['toolbar1'] = implode(' ', $acf_toolbars['Full']['1']);
        $settings['toolbar2'] = implode(' ', $acf_toolbars['Full']['2']);
        $settings['toolbar3'] = implode(' ', $acf_toolbars['Full']['3']);
        $settings['toolbar4'] = implode(' ', $acf_toolbars['Full']['4']);

        return $settings;
    }

    /**
     * Utility function to get theme colour palette from theme.json
     *
     * @return array
     */
    public static function get_theme(): array {
        $theme = get_stylesheet_directory() . '/theme.json';
        $parent = get_template_directory() . '/theme.json';
        $plugin = __DIR__ . '/theme.json';
        $json = null;

        if (file_exists($theme)) {
            $json = file_get_contents($theme);
        }
        else if (file_exists($parent)) {
            $json = file_get_contents($parent);
        }
        else if (file_exists($plugin)) {
            $json = file_get_contents($plugin);
        }

        $colours = $json ? json_decode($json, true)['settings']['color']['palette'] : [];

        return array_reduce($colours, function($acc, $item) {
            $acc[$item['slug']] = $item['color'];

            return $acc;
        }, []);
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
                'path' => __DIR__ . DIRECTORY_SEPARATOR . 'tinymce' . DIRECTORY_SEPARATOR . 'miniblock-plugin.css',
                'url'  => plugin_dir_url(__FILE__) . 'tinymce/miniblock-plugin.css',
            ]
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
     * Add colours from theme.json as CSS variables to TinyMCE content
     *
     * @param  $settings
     *
     * @return array
     */
    public function add_theme_colours_to_tinymce_content($settings): array {
        $colours = $this->get_theme();
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
     * Populate custom formats menu in TinyMCE
     * Notes: - 'selector' for block-level element that format is applied to; 'inline' to add wrapping tag e.g.'span'
     *        - Using 'attributes' to apply the classes instead of 'class' ensures previous classes are replaced rather than added to
     *        - 'styles' are inline styles that are applied to the items in the menu, not the output; options are pretty limited but enough to add things like colours
     *          (further styling customisation to the menu may be done in the admin stylesheet)
     *
     * @param  $settings
     *
     * @return array
     */
    public function populate_styleselect($settings): array {
        $style_formats = array(
            array(
                'title'   => 'Lead paragraph',
                'block'   => 'p',
                'classes' => 'is-style-lead'
            ),
            array(
                'title' => 'Small style heading',
                'items' => array(
                    array(
                        'title'   => 'H2',
                        'block'   => 'h2',
                        'classes' => 'is-style-small'
                    ),
                    array(
                        'title'   => 'H3',
                        'block'   => 'h3',
                        'classes' => 'is-style-small'
                    ),
                    array(
                        'title'   => 'H4',
                        'block'   => 'h4',
                        'classes' => 'is-style-small'
                    ),
                    array(
                        'title'   => 'H5',
                        'block'   => 'h5',
                        'classes' => 'is-style-small'
                    ),
                    array(
                        'title'   => 'H6',
                        'block'   => 'h6',
                        'classes' => 'is-style-small'
                    )
                )
            ),
            array(
                'title' => 'Accent style heading',
                'items' => array(
                    array(
                        'title'   => 'H2',
                        'block'   => 'h2',
                        'classes' => 'is-style-accent'
                    ),
                    array(
                        'title'   => 'H3',
                        'block'   => 'h3',
                        'classes' => 'is-style-accent'
                    ),
                    array(
                        'title'   => 'H4',
                        'block'   => 'h4',
                        'classes' => 'is-style-accent'
                    ),
                    array(
                        'title'   => 'H5',
                        'block'   => 'h5',
                        'classes' => 'is-style-accent'
                    ),
                    array(
                        'title'   => 'H6',
                        'block'   => 'h6',
                        'classes' => 'is-style-accent'
                    )
                )
            )
        );

        $settings['style_formats'] = json_encode($style_formats);
        unset($settings['preview_styles']);

        return $settings;
    }

    /**
     * Register custom plugin for "miniblocks" in TinyMCE
     *
     * @param  array  $plugins
     *
     * @return array
     */
    public function register_miniblocks_plugin(array $plugins): array {
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);
        $plugins['comet_miniblocks'] = $pluginDir . '/src/tinymce/miniblock-plugin.dist.js';

        return $plugins;
    }

    public function register_miniblocks_admin_css() {
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);
        wp_enqueue_style('comet-miniblocks-admin-css', $pluginDir . '/src/tinymce/miniblock-plugin.css', array(), null);
    }

    public function register_miniblock_buttons($buttons) {
        array_push($buttons, $this->comet_miniblocks);

        return $buttons;
    }

    /**
     * Make theme colours and other config available to TinyMCE JS (primarily for use in the miniblocks plugin)
     *
     * @return void
     */
    public function make_theme_colours_available_to_tinymce_js(): void {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return;
        }

        try {
            $defaults = Config::getInstance()->get('component_defaults');
            $background = Config::getInstance()->get_global_background();

            wp_localize_script('wp-tinymce', 'comet', array(
                'defaults'         => $defaults,
                'globalBackground' => $background,
                'palette'          => $this->get_theme(),
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
