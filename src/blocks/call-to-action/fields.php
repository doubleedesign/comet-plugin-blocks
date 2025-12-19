<?php
use Doubleedesign\Comet\WordPress\BlockFieldHandler;

acf_add_local_field_group(array(
    'key'        => 'layout_call-to-action',
    'title'      => 'Call-to-action',
    'fields'     => array(
        array(
            'key'               => 'field__call-to-action__heading',
            'label'             => 'Heading',
            'name'              => 'heading',
            'type'              => 'text',
            'required'          => true,
            'maxlength'         => 120,
            'repeatable'        => true,
        ),
        array(
            'key'               => 'field__call-to-action__description',
            'label'             => 'Description',
            'name'              => 'description',
            'type'              => 'wysiwyg',
            'toolbar'           => 'minimal',
            'media_upload'      => false,
            'required'          => false,
        ),
        BlockFieldHandler::create_button_group_repeater('call-to-action', true),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/call-to-action',
            ),
        ),
    ),
));
