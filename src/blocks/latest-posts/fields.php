<?php
acf_add_local_field_group(array(
    'key'        => 'layout_latest-posts',
    'name'       => 'latest_posts',
    'label'      => 'Latest posts',
    'display'    => 'block',
    'fields'     => array(
        array(
            'key'           => 'field__latest-posts__heading',
            'label'         => 'Heading',
            'name'          => 'heading',
            'type'          => 'text',
            'default_value' => 'Latest Articles',
            'placeholder'   => 'Latest Articles',
        ),
        array(
            'key'           => 'field__latest-posts__categories',
            'label'         => 'Categories',
            'name'          => 'categories',
            'type'          => 'taxonomy',
            'taxonomy'      => 'category',
            'field_type'    => 'multi_select',
            'return_format' => 'id',
            'add_term'      => false
        ),
        array(
            'key'           => 'field__latest-posts__item-count',
            'label'         => 'Number of posts to show',
            'name'          => 'item_count',
            'type'          => 'number',
            'default_value' => 3,
        )
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/latest-posts',
            ),
        ),
    )
));
