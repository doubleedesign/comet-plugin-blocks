<?php
namespace Doubleedesign\Comet\WordPress;

class ComponentAssets {

    public function __construct() {
        if (!function_exists('register_block_type')) {
            // Block editor is not available.
            return;
        }

        add_action('wp_enqueue_scripts', [$this, 'enqueue_comet_combined_component_css'], 10);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_comet_combined_component_js'], 10);
        add_filter('script_loader_tag', [$this, 'script_type_module'], 10, 3);
        add_filter('script_loader_tag', [$this, 'script_base_path'], 10, 5);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_css'], 10);
    }

    /**
     * Combined stylesheet for all components, to be used both for the front-end and the back-end editor
     *
     * @return void
     */
    public function enqueue_comet_combined_component_css(): void {
        $libraryDir = COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core';
        wp_enqueue_style('comet-components', "$libraryDir/dist/dist.css", array(), COMET_VERSION, 'all');
    }

    /**
     * Bundled JS for all components for the front-end
     *
     * @return void
     */
    public function enqueue_comet_combined_component_js(): void {
        $libraryDir = COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core';
        wp_enqueue_script('comet-components-js', "$libraryDir/dist/dist.js", array(), COMET_VERSION, true);
    }

    /**
     * Add type=module to script tags
     *
     * @param  $tag
     * @param  $handle
     * @param  $src
     *
     * @return mixed|string
     */
    public function script_type_module($tag, $handle, $src): mixed {
        // If it already has the type="module" attribute, skip
        if (str_contains($tag, 'type="module"')) {
            return $tag;
        }

        if (str_starts_with($handle, 'comet-')) {
            return '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '" ></script>';
        }

        return $tag;
    }

    /**
     * Add data-base-path attribute to Comet Components script tag
     * so Vue SFC loader can find its templates
     *
     * @param  $tag
     * @param  $handle
     * @param  $src
     *
     * @return mixed|string
     */
    public function script_base_path($tag, $handle, $src): mixed {
        $libraryDir = COMET_COMPOSER_VENDOR_URL . '/doubleedesign/comet-components-core';
        $libraryDirShort = str_replace(get_site_url(), '', $libraryDir);
        $src = esc_url($src);

        if ($handle === 'comet-components-js') {
            $tag = <<<HTML
			<script type="module" src="{$src}" id="{$handle}" data-base-path="{$libraryDirShort}"></script>
			HTML;
        }

        // If in block editor iframe context, comet-components-js (the bundled JS) is intentionally not loaded,
        // so we need to attach the base path to something else relevant to that context.
        if ($handle === 'comet-block-registry') {
            $tag = <<<HTML
			<script type="module" src="{$src}" id="{$handle}" data-base-path="{$libraryDirShort}"></script>
			HTML;
        }

        return $tag;
    }

    /**
     * Admin CSS overrides for things outside the block editor
     *
     * @return void
     */
    public function enqueue_admin_css(): void {
        // Load in the theme's common typography and whatnot so that it gets used by the TinyMCE styleselect,
        // general admin styles, etc. like it does when loaded into pages with the block editor using enqueue_block_editor_assets
        // but for pages that don't trigger that book.
        // Note: If using external fonts (e.g., Typekit) you may need to enqueue those separately within the theme, using the admin_enqueue_scripts hook.
        $theme_common_css = array(
            [
                'path' => get_template_directory() . '/admin.css',
                'url'  => get_template_directory_uri() . '/admin.css',
            ],
            [
                'path' => get_stylesheet_directory() . '/admin.css',
                'url'  => get_stylesheet_directory_uri() . '/admin.css',
            ]
        );

        foreach ($theme_common_css as $file_info) {
            if (file_exists($file_info['path'])) {
                $version = filemtime($file_info['path']);
                wp_enqueue_style(
                    'comet-admin-theme-common-' . md5($file_info['path']),
                    $file_info['url'],
                    array(),
                    $version,
                    'all'
                );
            }
        }

        // Load admin-specific CSS after the theme common stuff, so it can override it if needed
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);
        $admin_css_path = $pluginDir . '/src/admin.css';
        wp_enqueue_style('comet-admin-styles', $admin_css_path, array(), COMET_VERSION);
    }
}
