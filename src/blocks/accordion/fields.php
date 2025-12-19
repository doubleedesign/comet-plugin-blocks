<?php
acf_add_local_field_group(array(
    'key'    => 'layout_accordion',
    'title'  => 'Accordion',
    'fields' => array(
        array(
            'key'               => 'field__accordion__heading',
            'label'             => 'Heading (optional)',
            'name'              => 'heading',
            'type'              => 'text',
            'repeatable'        => true,
        ),
        array(
            'key'           => 'field__accordion__edit_intro',
            'label'         => 'Show intro editor',
            'name'          => 'edit_intro',
            'type'          => 'true_false',
            'ui'            => 1,
            'ui_on_text'    => 'Editing',
            'ui_off_text'   => 'Closed',
            'default_value' => 0,
            'repeatable'    => false,
            'wrapper' 	     => array(
                'width' => 33,
            ),
        ),
        array(
            'key'               => 'field_accordion__intro',
            'label'             => 'Intro copy',
            'name'              => 'intro_copy',
            'type'              => 'wysiwyg',
            'tabs'              => 'all',
            'toolbar'           => 'minimal',
            'media_upload'      => 1,
            'delay'             => 0,
            'repeatable'        => true,
            'conditional_logic' => array(
                array(
                    array(
                        'field'    => 'field__accordion__edit_intro',
                        'operator' => '==',
                        'value'    => '1',
                    ),
                ),
            ),
        ),
        array(
            'key'               => 'field__accordion__panels',
            'label'             => 'Panels',
            'name'              => 'panels',
            'type'              => 'repeater',
            'collapsed'         => 'field__accordion-panel__heading',
            'min'               => 0,
            'max'               => 20,
            'layout'            => 'block',
            'button_label'      => 'Add panel',
            'rows_per_page'     => 20,
            'repeatable'        => true,
            'sub_fields'        => array(
                array(
                    'key'               => 'field__accordion-panel__heading',
                    'label'             => 'Heading',
                    'name'              => 'heading',
                    'type'              => 'text',
                    'parent_repeater'   => 'field__accordion__panels',
                    'repeatable'        => true,
                ),
                array(
                    'key'               => 'field__accordion-panel__content',
                    'label'             => 'Panel content',
                    'name'              => 'panel_content',
                    'type'              => 'wysiwyg',
                    'tabs'              => 'all',
                    'toolbar'           => 'minimal',
                    'button_label'      => 'Add content',
                    'wrapper'           => array(
                        'data-nested' => true
                    )
                ),
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/accordion',
            ),
        ),
    ),
));
