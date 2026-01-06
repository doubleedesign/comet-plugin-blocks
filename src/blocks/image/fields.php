<?php
acf_add_local_field_group(array(
    'key'        => 'layout_image',
    'title'      => 'Image',
    'fields'     => array(
        array(
            'key'           => 'field__image__image',
            'name'          => 'image',
            'label'         => 'Image',
            'display'       => 'block',
            'type'          => class_exists('Doubleedesign\ACF\AdvancedImageField\AdvancedImageField') ? 'image_advanced' : 'image',
            'return_format' => 'array',
            'preview_size'  => 'full',
            'library'       => 'all',
        )
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/image',
            ),
        ),
    ),
));
