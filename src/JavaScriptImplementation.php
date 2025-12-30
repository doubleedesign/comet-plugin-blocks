<?php
namespace Doubleedesign\Comet\WordPress;

/**
 * When customising WordPress blocks and the block editor, some things can be done in PHP but some must be done in JavaScript.
 * This class is a base class for PHP classes that do their work in conjunction with some JavaScript,
 * explicitly signalling to the developer that the class has a JavaScript counterpart (with `extends JavaScriptImplementation`),
 * and centrally handles the enqueuing of the JavaScript file in the editor.
 *
 * NOTE: The JavaScript file must be in the same directory as the PHP file, and must be named with a kebab-case version of the PHP class name.
 */
abstract class JavaScriptImplementation {

    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_companion_javascript'], 200);
        add_action('enqueue_block_assets', [$this, 'enqueue_companion_javascript_in_iframe'], 200);
        add_filter('script_loader_tag', [$this, 'script_type_module'], 10, 3);
    }

    public function enqueue_companion_javascript(): void {
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);
        // Get the last bit of the class name (to remove the namespace)
        $class_name = array_reverse(explode('\\', get_class($this)))[0];
        // Kebab case it
        $handle = $this->kebab_case($class_name);

        // Enqueue the matching JS file
        // TODO: We probably don't need so many dependencies
        wp_enqueue_script("comet-$handle", "$pluginDir/src/$handle.js", array('wp-dom', 'wp-dom-ready', 'wp-blocks', 'wp-edit-post', 'wp-editor', 'wp-element', 'wp-plugins', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-compose', 'wp-i18n', 'wp-hooks', 'wp-block-editor', 'wp-block-library'), COMET_VERSION, false);
    }

    /**
     * Load specific JS into the block editor's iframe.
     *
     * @return void
     */
    public function enqueue_companion_javascript_in_iframe(): void {
        if (!is_admin()) return; // the enqueue_block_assets hook runs on both the front and back-end, but we only want this on the back-end

        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);
        // Get the last bit of the class name (to remove the namespace)
        $class_name = array_reverse(explode('\\', get_class($this)))[0];
        // Kebab case it
        $handle = $this->kebab_case($class_name) . '-iframe';

        // Enqueue the matching JS file
        if (file_exists(__DIR__ . "/{$this->kebab_case($class_name)}-iframe.js")) {
            wp_enqueue_script("comet-$handle", "$pluginDir/src/$handle.js", array('wp-dom', 'wp-dom-ready', 'wp-blocks', 'wp-block-editor'), COMET_VERSION, false);
        }
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
     * Utility function to convert to kebab case
     *
     * @param  string  $value
     *
     * @return string
     */
    public static function kebab_case(string $value): string {
        // Account for PascalCase
        $value = preg_replace('/([a-z])([A-Z])/', '$1 $2', $value);

        // Convert whitespace to hyphens and make lowercase
        return trim(strtolower(preg_replace('/\s+/', '-', $value)));
    }
}
