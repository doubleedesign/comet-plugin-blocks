<?php
acf_add_local_field_group(array(
    'key'        => 'layout_child-pages',
    'name'       => 'child_pages',
    'label'      => 'Child pages',
    'display'    => 'block',
    'fields'     => array(
        array(
            'key'           => 'field__child-pages__heading',
            'label'         => 'Heading',
            'name'          => 'heading',
            'type'          => 'text',
            'default_value' => 'In this section',
            'placeholder'   => 'In this section',
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/child-pages',
            ),
        ),
    )
));
