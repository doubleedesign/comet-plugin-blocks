<?php
acf_add_local_field_group(array(
    'key'    => 'group_6944c3e145433',
    'title'  => 'Shared content block',
    'fields' => array(
        array(
            'key'               => 'field_6944c3e153452',
            'label'             => 'Shared content item',
            'name'              => 'shared_content_item',
            'type'              => 'post_object',
            'required'          => true,
            'post_type'         => array(
                0 => 'shared_content',
            ),
            'post_status' => array(
                0 => 'publish',
                1 => 'future',
            ),
            'return_format'        => 'id',
            'multiple'             => false,
            'allow_null'           => false,
            'allow_in_bindings'    => false,
            'bidirectional'        => true,
            'ui'                   => true,
            'bidirectional_target' => array(
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/shared-content',
            ),
        ),
    ),
    'menu_order'            => 0,
    'position'              => 'normal',
    'style'                 => 'default',
    'label_placement'       => 'top',
    'instruction_placement' => 'label',
    'active'                => true,
    'show_in_rest'          => 0,
));
