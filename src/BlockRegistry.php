<?php
namespace Doubleedesign\Comet\WordPress;
use WP_Block_Type_Registry;

class BlockRegistry extends JavaScriptImplementation {
    private WP_Block_Type_Registry $wpInstance;

    public function __construct() {
        parent::__construct();
        $this->wpInstance = WP_Block_Type_Registry::get_instance();

        add_action('init', [$this, 'register_blocks'], 10);
        add_filter('block_type_metadata', [$this, 'modify_block_json_dynamically'], 10, 1);
        add_filter('register_block_type_args', [$this, 'modify_third_party_block_json'], 100, 2);
        add_action('acf/include_fields', [$this, 'register_block_fields'], 10, 2);

        add_filter('allowed_block_types_all', [$this, 'filter_allowed_blocks_server_side'], 10, 2);
        add_filter('block_editor_settings_all', [$this, 'filter_allowed_blocks_client_side'], 20, 2);
    }

    /**
     * Register custom blocks
     *
     * @return void
     */
    public function register_blocks(): void {
        $block_folders = scandir(dirname(__DIR__, 1) . '/src/blocks');

        foreach ($block_folders as $block_name) {
            if ($block_name === '.' || $block_name === '..') continue;

            $folder = dirname(__DIR__, 1) . '/src/blocks/' . $block_name;
            if (!file_exists("$folder/block.json")) continue;

            register_block_type($folder);
        }
    }

    /**
     * Modify block metadata from block.json centrally for some common settings
     *
     * @param  array  $metadata
     *
     * @return array
     */
    public function modify_block_json_dynamically(array $metadata): array {
        if ((!isset($metadata['textdomain']) || $metadata['textdomain'] !== 'comet')) {
            return $metadata;
        }

        $shortName = str_replace('comet/', '', $metadata['name']);
        // TODO: Dynamically get this from the field group registrations
        $hasWysiwgField = in_array($shortName, ['copy', 'copy-image', 'accordion', 'call-to-action']);
        if (!$hasWysiwgField) {
            return $metadata;
        }

        // Ensure blocks with WYSIWYG load the component styles needed for the "miniblocks" available in TinyMCE
        // @see TinyMceConfig.php
        $metadata['editorStyle'] = [
            ...$metadata['editorStyle'] ?? [],
            'comet-button-group',
            'comet-button',
            'comet-pullquote',
            'comet-callout',
            'comet-table'
        ];

        return $metadata;
    }

    /**
     * Add some of our common custom attributes to some third-party blocks
     * in a way that will pass server-side validation so we can use a custom PHP render template
     * (see wrap_third_party_blocks in BlockRenderer.php)
     *
     * @param  array  $args
     * @param  string  $name
     *
     * @return array
     */
    public function modify_third_party_block_json(array $args, string $name): array {
        if ($name === 'ninja-forms/form') {
            $args['attributes']['colorTheme'] = [
                'type'    => 'string',
                'default' => 'primary',
            ];
            $args['attributes']['size'] = [
                'type'    => 'string',
                'default' => 'contained'
            ];
        }

        return $args;
    }

    /**
     * Register ACF fields for custom blocks if there is a fields.php file containing them in the block folder
     *
     * @return void
     */
    public function register_block_fields(): void {
        $block_folders = scandir(dirname(__DIR__, 1) . '/src/blocks');

        foreach ($block_folders as $block_name) {
            $file = dirname(__DIR__, 1) . '/src/blocks/' . $block_name . '/fields.php';

            if (file_exists($file) && function_exists('acf_add_local_field_group')) {
                require_once $file;
            }
        }
    }

    /**
     * By default, disable all core blocks and some known unwanted plugin blocks,
     * while allowing other plugins and themes to selectively override this.
     *
     * @param  $blocks
     * @param  $editor_context
     *
     * @return array|bool
     */
    public function filter_allowed_blocks_server_side($blocks, $editor_context): array|bool {
        // The allowed_block_types_all filter is really weird. It returns true/false for enabling ALL blocks, or returns an array of allowed blocks.
        // This results in inconsistent results if this filter is used in multiple places, or at a hook priority that doesn't do what you expect.
        // The only foolproof way to handle this and always return an array is to...load up the registered blocks and then filter them out so this never returns a boolean.
        if (!is_array($blocks)) {
            $blocks = array_keys($this->wpInstance->get_all_registered());
        }

        $default = array_filter($blocks, function($block) {
            return !str_starts_with($block, 'core/') && !in_array($block, ['ninja-forms/submissions-table']);
        });

        return apply_filters('comet_allowed_blocks', $default);
    }

    /**
     * Make sure the allowed blocks are filtered in the block editor settings for the client side.
     * Note: This also requires some JavaScript to prevent blocks from appearing in the inserter.
     * See block-registry.js for that implementation.
     *
     * @param  $settings
     * @param  $context
     *
     * @return array
     */
    public function filter_allowed_blocks_client_side($settings, $context): array {
        $allowed_blocks = $this->filter_allowed_blocks_server_side(true, null);

        $settings['allowedBlockTypes'] = $allowed_blocks;

        return $settings;
    }
}
