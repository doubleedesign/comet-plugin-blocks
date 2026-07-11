<?php

namespace Doubleedesign\Comet\WordPress;

class MediaHandler {

    public function __construct() {
        add_action('acf/include_fields', [$this, 'register_additional_media_fields']);
    }

    public function register_additional_media_fields(): void {
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }

        acf_add_local_field_group(array(
            'key'    => 'group_comet_media_settings',
            'title'  => 'Additional settings',
            'fields' => array(
                array(
                    'key'          => 'field_image_external_url',
                    'label'        => 'External URL',
                    'name'         => 'external_url',
                    'type'         => 'url',
                    'instructions' => 'URL to navigate to when this image is clicked on in contexts that have implemented this field (such as the gallery block).',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param'    => 'attachment',
                        'operator' => '==',
                        'value'    => 'image',
                    ),
                ),
            ),
            'menu_order'            => 0,
            'position'              => 'normal',
            'style'                 => 'seamless',
            'label_placement'       => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen'        => '',
            'active'                => true,
            'description'           => '',
            'show_in_rest'          => true,
            'display_title'         => '',
        ));
    }
}
