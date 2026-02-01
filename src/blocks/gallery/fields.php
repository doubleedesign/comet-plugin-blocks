<?php
acf_add_local_field_group(array(
    'key'    => 'layout_gallery',
    'title'  => 'Gallery',
    'fields' => array(
        array(
            'key'               => 'field__gallery__images',
            'label'             => 'Images',
            'name'              => 'images',
            'type'              => 'gallery',
            'return_format'     => 'array',
            'preview_size'      => 'medium',
            'insert'            => 'append',
            'library'           => 'all',
            'min'               => 1,
            'max'               => 20,
            'mime_types'        => '',
            'repeatable'        => true,
        ),
        array(
            'key'           => 'field__gallery__caption',
            'label'         => 'Caption',
            'name'          => 'caption',
            'type'          => 'text',
            'instructions'  => 'Caption describing the gallery as a whole',
            'default_value' => '',
            'placeholder'   => '',
        )
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/gallery',
            ),
        ),
    ),
));
