<?php
namespace Doubleedesign\Comet\WordPress;

class BlockEditorConfig extends JavaScriptImplementation {
    public function __construct() {
        parent::__construct();

        remove_action('enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets');
        remove_action('enqueue_block_editor_assets', 'gutenberg_enqueue_block_editor_assets_block_directory');
        add_filter('should_load_separate_core_block_assets', '__return_true', 5);
        add_filter('should_load_block_assets_on_demand', '__return_true', 5);

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

            // For some reason, the bundled JS works in the editor when loaded on enqueue_block_editor_assets or admin_enqueue_scripts, but not on enqueue_block_assets
            add_action('enqueue_block_editor_assets', [$this, 'enqueue_js_into_block_editor']);
            add_action('enqueue_block_assets', [$this, 'enqueue_font_awesome_into_block_editor']);

            // using enqueue_block_assets to ensure this runs in the new iframed experience (as opposed to enqueue_block_editor_assets)
            // but note that enqueue_block_assets also runs on the front-end, hence the is_admin() check to ensure we don't double up on the front-end.
            add_action('enqueue_block_assets', [$this, 'enqueue_css_into_block_editor'], 10);
            add_action('enqueue_block_assets', [$this, 'make_component_defaults_available_to_block_editor_js'], 250);
        }
    }

    /**
     * Load bundled Comet Components CSS + common CSS from the theme (if a common.css file is present) for all blocks in the editor.
     *
     * Registering per-block styles for the block editor doesn't conditionally load them,
     * so it's simpler to just load the same single bundled stylesheet that the front-end uses.
     *
     * @return void
     */
    public function enqueue_css_into_block_editor(): void {
        $css = array(
            [
                'handle' => 'comet-components-bundled-styles',
                'path'   => COMET_COMPOSER_VENDOR_PATH . '/doubleedesign/comet-components-core/dist/dist.css',
                'url'    => COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/dist/dist.css',
            ],
	        [
		        'handle' => 'comet-canvas-base-styles',
		        'path'   => get_template_directory() . '/style.css',
		        'url'    => get_template_directory_uri() . '/style.css',
	        ],
            [
                'handle' => 'theme-styles',
                'path'   => get_stylesheet_directory() . '/style.css',
                'url'    => get_stylesheet_directory_uri() . '/style.css',
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

    public function enqueue_js_into_block_editor(): void {
        wp_enqueue_script('comet-blocks', COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core/dist/dist.js', array(), COMET_VERSION, true);
    }

	public function enqueue_font_awesome_into_block_editor(): void {
		$kit_id = get_option('options_font_awesome_kit');
		if ($kit_id) {
			wp_enqueue_script('font-awesome', "https://kit.fontawesome.com/$kit_id.js", [], '7', false);
		}
	}

    public function make_component_defaults_available_to_block_editor_js(): void {
        $data = CometConfigHandler::get_component_defaults();

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
