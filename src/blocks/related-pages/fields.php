<?php
acf_add_local_field_group(array(
    'key'        => 'layout_related-pages',
    'name'       => 'related_pages',
    'label'      => 'Related pages',
    'display'    => 'block',
    'fields'     => array(
        array(
            'key'           => 'field__related-pages__heading',
            'label'         => 'Heading',
            'name'          => 'heading',
            'type'          => 'text',
            'default_value' => 'Related pages',
            'placeholder'   => 'Related pages',
        ),
        array(
            'key'           => 'field__related-pages__pages',
            'label'         => 'Pages',
            'name'          => 'pages',
            'type'          => 'post_object',
            'post_type'     => array('page', 'cpt_index'),
            'multiple'      => true,
            'return_format' => 'id',
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/related-pages',
            ),
        ),
    )
));
