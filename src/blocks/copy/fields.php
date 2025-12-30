<?php
acf_add_local_field_group(array(
    'key'    => 'layout_copy',
    'title'  => 'Copy',
    'fields' => array(
        array(
            'key'               => 'field__copy__content',
            'label'             => 'Content',
            'name'              => 'copy',
            'type'              => 'wysiwyg',
            'tabs'              => 'all',
            'toolbar'           => 'full',
            'media_upload'      => true,
            'delay'             => false,
            'repeatable'        => true,
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/copy',
            ),
        ),
    ),
));
