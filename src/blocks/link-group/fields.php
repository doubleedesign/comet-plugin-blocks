<?php
acf_add_local_field_group(array(
    'key'                   => 'layout__link-group',
    'title'                 => 'Link Group Block',
    'fields'                => array(
        array(
            'key'       => 'field__link-group__heading',
            'label'     => 'Heading',
            'name'      => 'heading',
            'type'      => 'text',
            'maxlength' => 120
        ),
        array(
            'key'               => 'field__link-group__links',
            'label'             => 'Links',
            'name'              => 'links',
            'type'              => 'repeater',
            'layout'            => 'table',
            'button_label'      => 'Add link',
            'rows_per_page'     => 20,
            'sub_fields'        => array(
                array(
                    'key'               => 'field__link-group__links__link',
                    'label'             => 'Link',
                    'name'              => 'link',
                    'type'              => 'link',
                    'return_format'     => 'array',
                    'parent_repeater'   => 'field_67be796fd2aad',
                ),
                array(
                    'key'               => 'field__link-group__links__link__description',
                    'label'             => 'Description',
                    'name'              => 'description',
                    'type'              => 'text',
                    'maxlength'         => 255,
                    'parent_repeater'   => 'field_67be796fd2aad',
                )
            ),
        ),
    ),
    'location'              => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/link-group',
            ),
        ),
    ),
    'menu_order'            => 0,
    'position'              => 'normal',
    'style'                 => 'default',
    'label_placement'       => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen'        => '',
    'active'                => true,
    'description'           => '',
    'show_in_rest'          => 0,
));
