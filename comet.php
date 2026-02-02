<?php
/**
 * Plugin name: Comet Components (Blocks)
 * Description: Double-E Design's foundational components and customisations for the WordPress block editor.
 *
 * Dev note: The dependency on Gutenberg is because at the time of development, justification controls incorrectly show up for the Panels block.
 *             This was fixed in version 19.8.0 which had not yet been merged into WordPress core.
 *             See https://github.com/WordPress/gutenberg/pull/67059
 *
 * Author:              Double-E Design
 * Author URI:          https://www.doubleedesign.com.au
 * Version:             0.6.0
 * Requires at least:   6.7.0
 * Requires PHP:        8.4
 * Requires plugins:    advanced-custom-fields-pro
 * Text Domain:         comet
 *
 * @package Comet
 */
if (!defined('COMET_COMPOSER_VENDOR_URL')) {
    define('COMET_COMPOSER_VENDOR_URL', get_site_url() . '/wp-content/plugins/comet-plugin-blocks/vendor');
}
if (!defined('COMET_COMPOSER_VENDOR_PATH')) {
    define('COMET_COMPOSER_VENDOR_PATH', __DIR__ . '/vendor');
}

require_once __DIR__ . '/vendor/autoload.php';

add_action('plugins_loaded', function() {
    if (!class_exists('Doubleedesign\Comet\Core\Config')) {
        wp_die('<p>Comet Components Core Config class not found in Comet Components Blocks plugin. Perhaps you need to install or update Composer dependencies.</p><p>If you are working locally with symlinked packages, you might want <code>$env:COMPOSER = "composer.local.json"; composer update</code>.</p>');
    }
    // Ensure global config is initialized
    Doubleedesign\Comet\Core\Config::getInstance();
});

use Doubleedesign\Comet\WordPress\{AdminUI,
    BlockEditorConfig,
    BlockFieldHandler,
    BlockPatternHandler,
    BlockRegistry,
    BlockRenderer,
    ComponentAssets,
    GlobalSettings,
    SharedBlocks,
    ThemeStyle,
    TinyMceConfig};

new AdminUI();
new GlobalSettings();
new BlockRegistry();
new BlockRenderer();
new BlockEditorConfig();
new ComponentAssets();
new ThemeStyle();
new BlockPatternHandler();
new BlockFieldHandler();
new TinyMceConfig();
new SharedBlocks();

/**
 * Disable the default WP dashboard welcome panel because it may promote unsupported features
 * Note: Double-E Base Plugin replaces it with a custom welcome panel, but I've kept this here for sites not using that
 *
 * @return void
 */
function comet_dashboard_home(): void {
    remove_action('welcome_panel', 'wp_welcome_panel');
}
add_action('admin_init', 'comet_dashboard_home');
