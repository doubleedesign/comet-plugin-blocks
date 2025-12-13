<?php
namespace Doubleedesign\Comet\WordPress;

class BlockFieldHandler {

    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_custom_block_controls']);
    }

    public function enqueue_custom_block_controls(): void {
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);

        wp_enqueue_script('comet-blocks-custom-controls', "$pluginDir/src/editor/CustomControlsWrapper/CustomControlsWrapper.dist.js", ['wp-blocks', 'wp-element', 'wp-editor'], COMET_VERSION, true);
    }
}
