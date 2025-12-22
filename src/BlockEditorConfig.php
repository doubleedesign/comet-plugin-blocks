<?php
namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\{Config, Utils};
use WP_Theme_JSON_Data;

class BlockEditorConfig extends JavaScriptImplementation {
    public function __construct() {
        parent::__construct();

        remove_action('enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets');
        remove_action('enqueue_block_editor_assets', 'gutenberg_enqueue_block_editor_assets_block_directory');
        add_filter('should_load_separate_core_block_assets', '__return_true', 5);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_common_css_into_block_editor'], 10);
        add_action('enqueue_block_editor_assets', [$this, 'make_component_defaults_available_to_block_editor_js'], 250);

        add_action('init', [$this, 'load_merged_theme_json'], 5, 1);
        add_action('init', [$this, 'register_page_template'], 15, 2);

        add_filter('block_editor_settings_all', [$this, 'block_inspector_single_panel'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'disable_block_code_editor'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'disable_unwanted_appearance_settings'], 10, 2);
        add_filter('use_block_editor_for_post_type', [$this, 'selective_gutenberg'], 10, 2);
        add_action('after_setup_theme', [$this, 'disable_block_template_editor']);

        if (is_admin()) {
            add_action('admin_enqueue_scripts', [$this, 'admin_css']);
            add_filter('admin_body_class', [$this, 'block_editor_body_class'], 10, 1);
        }

    }

    public function enqueue_common_css_into_block_editor(): void {
        $css = array(
            [
                'path' => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/global.css',
                'url'  => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/global.css',
            ],
            [
                'path' => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/common.css',
                'url'  => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/common.css',
            ],
            [
                'path' => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/Container/container.css',
                'url'  => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/Container/container.css',
            ],
            [
                'path' => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/PageSection/page-section.css',
                'url'  => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/PageSection/page-section.css',
            ],
            [
                'path' => get_template_directory() . '/common.css',
                'url'  => get_template_directory_uri() . '/common.css',
            ],
            [
                'path' => get_stylesheet_directory() . '/common.css',
                'url'  => get_stylesheet_directory_uri() . '/common.css',
            ]
        );

        foreach ($css as $file_info) {
            if (file_exists($file_info['path'])) {
                wp_enqueue_style(
                    'comet-block-editor-common-' . md5($file_info['path']),
                    $file_info['url'],
                    array('wp-edit-blocks'),
                    filemtime($file_info['path']),
                    'all'
                );
            }
        }
    }

    /**
     * Load theme.json file from this plugin to set defaults of what's supported in the editor
     * and combine it with the theme's theme.json for actual theme stuff like colours
     *
     * @return void
     */
    public function load_merged_theme_json(): void {
        delete_option('wp_theme_json_data'); // clear cache

        add_filter('wp_theme_json_data_theme', function($theme_json) {
            $plugin_theme_json_path = plugin_dir_path(__FILE__) . 'theme.json';
            $plugin_theme_json_data = json_decode(file_get_contents($plugin_theme_json_path), true);
            if (is_array($plugin_theme_json_data)) {
                return new WP_Theme_JSON_Data(Utils::array_merge_deep($plugin_theme_json_data, $theme_json->get_data()));
            }

            return $theme_json;
        });
    }

    public function make_component_defaults_available_to_block_editor_js(): void {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return;
        }

        $defaults = Config::getInstance()->get('component_defaults');
        $background = Config::getInstance()->get_global_background();

        // Get theme.json colour palette
        $theme_json = \WP_Theme_JSON_Resolver::get_theme_data();
        $colours = $theme_json->get_data()['settings']['color']['palette'];
        if ($colours) {
            $colours = array_map(function($color_obj) {
                return [$color_obj['slug'] => $color_obj['color']];
            }, $colours);
            // Flatten the array
            $colours = array_merge(...$colours);
        }

        // Make the defaults available to the plugin's block-editor-config.js file
        wp_localize_script('comet-block-editor-config', 'comet', array(
            'defaults'         => $defaults,
            'globalBackground' => $background,
            'palette'          => $colours ?? [],
        ));
        // And to the custom attribute controls
        wp_localize_script('comet-blocks-custom-controls', 'comet', array(
            'defaults'         => $defaults,
            'globalBackground' => $background,
            'palette'          => $colours ?? [],
        ));
    }

    /**
     * Default blocks for a new page
     *
     * @return void
     */
    public function register_page_template(): void {
        $template = [
            [
                'comet/copy',
                []
            ],
        ];
        $post_type_object = get_post_type_object('page');
        $post_type_object->template = $template;
        $post_type_object->template_lock = false;
    }

    /**
     * Display all block settings in one panel in the block inspector sidebar
     *
     * @param  $settings
     *
     * @return mixed
     */
    public function block_inspector_single_panel($settings): mixed {
        $settings['blockInspectorTabs'] = array('default' => false);

        return $settings;
    }

    /**
     * Only use the block editor for certain content types
     * (This can be overridden by plugins depending on the priority of the filter)
     *
     * @param  $current_status
     * @param  $post_type
     *
     * @return bool
     */
    public function selective_gutenberg($current_status, $post_type): bool {
        if (in_array($post_type, ['page', 'shared_content'])) {
            return true;
        }

        return false;
    }

    /**
     * Disable block template editor option
     *
     * @return void
     */
    public function disable_block_template_editor(): void {
        remove_theme_support('block-templates');
    }

    /**
     * Disable access to the block code editor
     */
    public function disable_block_code_editor($settings, $context) {
        $settings['codeEditingEnabled'] = false;

        return $settings;
    }

    /**
     * Disable unwanted appearance settings in the block editor by default.
     * Note: Some of this can also be done in theme.json, but this is more definitive and debuggable if called at the right time.
     *
     * @param  $settings
     * @param  $context
     *
     * @return array
     */
    public function disable_unwanted_appearance_settings($settings, $context): array {
        $settings['__unstableGalleryWithImageBlocks'] = false;
        $settings['disableCustomFontSizes'] = true;
        $settings['disableCustomSpacingSizes'] = true;
        $settings['disableLayoutStyles'] = true;
        $settings['enableCustomSpacing'] = false;
        $settings['enableCustomLineHeight'] = false;
        $settings['__experimentalFeatures']['appearanceTools'] = false;
        $settings['__experimentalFeatures']['useRootPaddingAwareAlignments'] = false;
        $settings['__experimentalFeatures']['color']['caption'] = false;
        $settings['__experimentalFeatures']['color']['link'] = false;
        $settings['__experimentalFeatures']['color']['text'] = false;

        unset($settings['__experimentalFeatures']['border']);
        unset($settings['__experimentalFeatures']['spacing']);
        unset($settings['__experimentalFeatures']['typography']);
        unset($settings['__experimentalFeatures']['shadow']);
        unset($settings['__experimentalFeatures']['blocks']);
        unset($settings['__experimentalDiscussionSettings']);
        unset($settings['spacingSizes']);

        return $settings;
    }

    /**
     * Scripts to hackily hide stuff (e.g., the disabled code editor button)
     * and other CSS adjustments to the editor itself (not blocks) for simplicity
     *
     * @return void
     */
    public function admin_css(): void {
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);

        wp_enqueue_style('comet-block-editor-hacks', "$pluginDir/src/block-editor-config.css", array(), COMET_VERSION);
    }

    /**
     * Add some utility classes to the body tag for certain page types
     *
     * @param  $classes
     *
     * @return string
     */
    public function block_editor_body_class($classes): string {
        $id = get_the_id();
        // Note: loose comparison == because
        if ($id == get_option('page_on_front')) {
            $classes .= ' is-homepage';
        }
        if ($id == get_option('page_for_posts')) {
            $classes .= ' is-page-for-posts';
        }

        return $classes;
    }
}
