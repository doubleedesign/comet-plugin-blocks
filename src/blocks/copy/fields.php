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
        array(
            'key'           => 'field__copy__content__split',
            'label'         => 'Split into two columns',
            'name'          => 'two_column',
            'instructions'  => 'Split into two content columns. Note: The content will appear stacked in one column on small viewports.',
            'type'          => 'true_false',
            'ui'            => 1,
            'ui_on_text'    => 'Yes',
            'ui_off_text'   => 'No',
            'default_value' => false,
            'repeatable'    => false
        ),
        array(
            'key'               => 'field__copy__content_2',
            'label'             => 'Content (second column)',
            'name'              => 'copy_2',
            'type'              => 'wysiwyg',
            'tabs'              => 'all',
            'toolbar'           => 'full',
            'media_upload'      => true,
            'delay'             => false,
            'repeatable'        => true,
            'conditional_logic' => array(
                array(
                    array(
                        'field'    => 'field__copy__content__split',
                        'operator' => '==',
                        'value'    => '1'
                    ),
                ),
            ),
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
