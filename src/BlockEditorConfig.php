<?php
namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\{Config, Utils};
use Exception;
use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use WP_Theme_JSON_Data;

class BlockEditorConfig extends JavaScriptImplementation {
    public function __construct() {
        parent::__construct();

        remove_action('enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets');
        remove_action('enqueue_block_editor_assets', 'gutenberg_enqueue_block_editor_assets_block_directory');
        add_filter('should_load_separate_core_block_assets', '__return_true', 5);
        add_filter('should_load_block_assets_on_demand', '__return_true', 5);

        add_action('init', [$this, 'load_merged_theme_json'], 5, 1);
        add_action('init', [$this, 'register_page_template'], 15, 2);

        add_filter('block_editor_settings_all', [$this, 'block_inspector_single_panel'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'disable_block_code_editor'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'disable_unwanted_appearance_settings'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'disable_default_block_editor_styles'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'disable_miscellaneous_unwanted_features'], 10, 2);
        add_filter('use_block_editor_for_post_type', [$this, 'selective_gutenberg'], 10, 2);
        add_action('after_setup_theme', [$this, 'disable_block_template_editor']);
        add_filter('gettext', [$this, 'change_acf_expanded_editor_button_label'], 10, 3);

        if (is_admin()) {
            add_action('enqueue_block_assets', [$this, 'block_editor_ui_css_hacks']);
            add_filter('admin_body_class', [$this, 'block_editor_body_class'], 10, 1);
            add_action('init', [$this, 'register_comet_component_assets_for_use_in_block_json'], 5);
            // using enqueue_block_assets to ensure this runs in the new iframed experience (as opposed to enqueue_block_editor_assets)
            // but note that enqueue_block_assets  also runs on the front-end, hence the is_admin() check to ensure we don't double up on the front-end.
            add_action('enqueue_block_assets', [$this, 'enqueue_common_css_into_block_editor'], 10);
            add_action('enqueue_block_assets', [$this, 'make_component_defaults_available_to_block_editor_js'], 250);

            // NOTE: The bundled JS (core/dist/dist.js) is deliberately not loaded into the editor because of path resolution issues for the Vue components.
            // Vue-powered blocks should load the scripts individually for their editor previews in block.json using the "editorScript" field.
        }
    }

    /**
     * Register Comet Components' individual CSS and JS files so they can be loaded as-needed for blocks
     * by using the "editorStyle" or "style" field in block.json.
     *
     * Almost all component stylesheets should be registered here, except for global.css and common.css,
     * and components like SiteHeader and SiteFooter that are not intended to be used in blocks.
     *
     * Note: If loading all of Comet's CSS on the front-end using the bundled/dist file, use editorStyle here to avoid duplication on the front-end.
     *
     * @return void
     */
    public function register_comet_component_assets_for_use_in_block_json(): void {
        $excludedDirectories = ['SiteHeader', 'SiteFooter', 'Menu', 'PostNav'];
        $componentsDir = COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components';
        $componentsUrlbase = COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components';
        $registered_css = []; // for debugging
        $registered_js = []; // for debugging

        try {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($componentsDir, FilesystemIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            $iterator->setMaxDepth(3);

            foreach ($iterator as $file) {
                if (!$file->isDir()) {
                    continue;
                }

                if (in_array($file->getFilename(), $excludedDirectories)) {
                    continue;
                }

                $componentName = $file->getBasename();
                $shortName = Utils::kebab_case($componentName);

                $cssFile = $file->getPathname() . "/$shortName.css";
                if (file_exists($cssFile)) {
                    $handle = 'comet-' . $shortName;
                    $relativePath = str_replace($componentsDir, '', $file->getPathname());
                    $relativePath = str_replace('\\', '/', $relativePath) . '/';
                    wp_register_style(
                        $handle,
                        $componentsUrlbase . $relativePath . $shortName . '.css',
                        [],
                        COMET_VERSION
                    );
                    $registered_css[] = $handle;
                }

                $jsFile = $file->getPathname() . "/$shortName.js";
                if (file_exists($jsFile)) {
                    $handle = 'comet-' . $shortName . '-js';
                    $relativePath = str_replace($componentsDir, '', $file->getPathname());
                    $relativePath = str_replace('\\', '/', $relativePath) . '/';
                    wp_register_script(
                        $handle,
                        $componentsUrlbase . $relativePath . $shortName . '.js',
                        ['wp-blocks', 'wp-element', 'wp-editor'],
                        COMET_VERSION,
                        false
                    );
                    $registered_js[] = $handle;
                }
            }
        }
        catch (Exception $e) {
            if (function_exists('dump')) {
                dump('Error registering Comet component stylesheet: ' . $e->getMessage());
            }
            else {
                error_log('Error registering Comet component stylesheet: ' . $e->getMessage());
            }
        }
    }

    /**
     * Load global and common CSS from both Comet Components and the theme (if a common.css file is present) for all blocks in the editor.
     * Global CSS is intended to be things like CSS variables and the application of data-* attributes like color theme and background.
     * Common CSS should contain site-wide typography styles and the like.
     *
     * @return void
     */
    public function enqueue_common_css_into_block_editor(): void {
        $css = array(
            [
                'handle' => 'comet-components-global-styles',
                'path'   => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/global.css',
                'url'    => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/global.css',
            ],
            [
                'handle' => 'comet-components-common-styles',
                'path'   => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/src/components/common.css',
                'url'    => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/src/components/common.css',
            ],
            [
                'handle' => 'theme-foundation-styles',
                'path'   => get_template_directory() . '/common.css',
                'url'    => get_template_directory_uri() . '/common.css',
            ],
            [
                'handle' => 'theme-common-styles',
                'path'   => get_stylesheet_directory() . '/common.css',
                'url'    => get_stylesheet_directory_uri() . '/common.css',
            ],
        );

        foreach ($css as $file_info) {
            if (file_exists($file_info['path'])) {
                wp_enqueue_style(
                    $file_info['handle'],
                    $file_info['url'],
                    [],
                    filemtime($file_info['path']),
                );
            }
            else {
                if (function_exists('dump')) {
                    dump('File not found: ' . $file_info['path']);
                }
                else {
                    error_log('File not found: ' . $file_info['path']);
                }
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

        $data = array(
            'defaults'         => Config::getInstance()->get('component_defaults'),
            'globalBackground' => Config::getInstance()->get_global_background(),
            'palette'          => Config::getInstance()->get_theme_colours(),
            'colourPairs'      => Config::getInstance()->get_theme_colour_pairs(),
        );

        // Make the defaults available to the plugin's block-editor-config files
        wp_localize_script('comet-block-editor-config', 'comet', $data);
        wp_localize_script('comet-block-editor-config-iframe', 'comet', $data);
        // And to the custom attribute controls
        wp_localize_script('comet-blocks-custom-controls', 'comet', $data);
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
        $settings['supportsLayout'] = false;
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
     * If WP thinks we don't have our own editor styles for blocks, ensure it still doesn't load its defaults.
     *
     * @param  $settings
     * @param  $context
     *
     * @return array
     */
    public function disable_default_block_editor_styles($settings, $context): array {
        unset($settings['defaultEditorStyles']);

        return $settings;
    }

    public function disable_miscellaneous_unwanted_features($settings, $context): array {
        unset($settings['styles']);
        unset($settings['__experimentalBlockBindingsSupportedAttributes']);
        unset($settings['__experimentalAdditionalBlockPatterns']);
        unset($settings['__experimentalAdditionalBlockPatternCategories']);

        return $settings;
    }

    /**
     * Scripts to hackily hide stuff (e.g., the disabled code editor button)
     * and other CSS adjustments to the editor itself (not blocks) for simplicity
     *
     * @return void
     */
    public function block_editor_ui_css_hacks(): void {
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

    public function change_acf_expanded_editor_button_label($translated, $original, $domain): string {
        if ($domain === 'acf' && $original === 'Open Expanded Editor') {

            return __('Edit block content', 'comet');
        }

        return $translated;
    }
}
