<?php
namespace Doubleedesign\Comet\WordPress;

class BlockFieldHandler {

    public function __construct() {
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_custom_block_controls']);
    }

    public function enqueue_custom_block_controls(): void {
        $currentDir = plugin_dir_url(__FILE__);
        $pluginDir = dirname($currentDir, 1);

        wp_enqueue_script(
            'comet-blocks-custom-controls',
            "$pluginDir/src/editor/CustomControlsWrapper/CustomControlsWrapper.dist.js",
            ['wp-blocks', 'wp-element', 'wp-editor', 'comet-block-registry'],
            COMET_VERSION,
            true
        );
    }

    /**
     * Utility function to generate an ACF repeater field for a button group.
     * Intended to be used in the field registration for a block using add_acf_local_field_group.
     *
     * @param  string  $parent_key
     * @param  bool  $required
     *
     * @return array
     */
    public static function create_button_group_repeater(string $parent_key, bool $required = false): array {
        return array(
            'key'               => "field__{$parent_key}__button-group",
            'label'             => 'Buttons',
            'name'              => 'buttons',
            'type'              => 'repeater',
            'min'               => 1,
            'max'               => 3,
            'layout'            => 'table',
            'button_label'      => 'Add button',
            'repeatable'        => true,
            'sub_fields'        => array(
                array(
                    'key'               => "field__{$parent_key}__button-group__button",
                    'label'             => 'Link',
                    'name'              => 'link',
                    'type'              => 'link',
                    'return_format'     => 'array',
                    'repeatable'        => true,
                    'required'          => $required,
                    'wrapper'           => array(
                        'width' => 70,
                    ),
                ),
                array(
                    'key'           => "field__{$parent_key}__button-group__button__style",
                    'label'         => 'Style',
                    'name'          => 'style',
                    'type'          => 'button_group',
                    'choices'       => array(
                        'default'     => 'Solid',
                        'isOutline'   => 'Outline',
                    ),
                    'wrapper' => array(
                        'width' => 30,
                    ),
                )
            ),
        );
    }
}
