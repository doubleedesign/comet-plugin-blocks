<?php

use Doubleedesign\Comet\WordPress\BlockFieldHandler;

acf_add_local_field_group(array(
    'key'        => 'layout_banner',
    'title'      => 'Banner',
    'fields'     => array(
        array(
            'key'           => 'field__banner__image',
            'label'         => 'Image',
            'name'          => 'image',
            'type'          => 'image_advanced',
            'instructions'  => 'Note: Aspect ratio may be ignored on small viewports',
            'required'      => 1,
            'return_format' => 'array',
            'preview_size'  => 'full',
            'library'       => 'all',
        ),
        array(
            'key'           => 'field__banner__heading',
            'label'         => 'Heading',
            'name'          => 'heading',
            'type'          => 'text',
            'required'      => 0,
            'maxlength'     => 120,
            'repeatable'    => true,
        ),
        array(
            'key'           => 'field__banner__text',
            'label'         => 'Text',
            'name'          => 'text',
            'type'          => 'wysiwyg',
            'tabs'          => 'all',
            'toolbar'       => 'minimal',
            'media_upload'  => 0,
            'default_value' => '',
            'repeatable'    => true,
        ),
        BlockFieldHandler::create_button_group_repeater('banner', true),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/banner',
            ),
        ),
    ),
));
