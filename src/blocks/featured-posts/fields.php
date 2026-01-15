<?php
acf_add_local_field_group(array(
    'key'        => 'layout_featured-posts',
    'name'       => 'featured_posts',
    'label'      => 'Featured posts',
    'display'    => 'block',
    'fields'     => array(
        array(
            'key'           => 'field__featured-posts__heading',
            'label'         => 'Heading',
            'name'          => 'heading',
            'type'          => 'text',
            'default_value' => 'Featured articles',
            'placeholder'   => 'Featured articles',
        ),
        array(
            'key'           => 'field__featured-posts__posts',
            'label'         => 'posts',
            'name'          => 'posts',
            'type'          => 'post_object',
            'post_type'     => array('post'),
            'multiple'      => true,
            'return_format' => 'id',
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/featured-posts',
            ),
        ),
    )
));
