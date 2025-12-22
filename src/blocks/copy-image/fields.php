<?php
acf_add_local_field_group(array(
    'key'    => 'layout_copy-image',
    'title'  => 'Copy + Image',
    'fields' => array(
        array(
            'key'           => 'field__copy-image__content',
            'label'         => 'Text content',
            'name'          => 'copy',
            'type'          => 'wysiwyg',
            'toolbar'       => 'basic',
            'tabs'          => 'all',
            'media_upload'  => false,
            'repeatable'    => true,
            'wrapper'       => ['width' => 50],
        ),
        array(
            'key'           => 'field__copy-image__image',
            'label'         => 'Image',
            'name'          => 'image',
            'type'          => class_exists('Doubleedesign\ACF\AdvancedImageField\AdvancedImageField') ? 'image_advanced' : 'image',
            'required'      => true,
            'return_format' => 'array',
            'preview_size'  => 'full',
            'library'       => 'all',
            'wrapper'       => ['width' => 50],
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/copy-image',
            ),
        ),
    ),
));
