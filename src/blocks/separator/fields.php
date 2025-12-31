<?php
acf_add_local_field_group(array(
    'key'    => 'layout_separator',
    'title'  => 'Separator',
    'fields' => array(
        array(
            'key'               => 'field__separator__style',
            'label'             => 'Style',
            'name'              => 'style',
            'type'              => 'select',
            'choices'           => apply_filters('comet_blocks_separator_styles', [
                'default' => 'Default',
                'dots'    => 'Dots'
            ]),
            'repeatable'        => true,
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/separator',
            ),
        ),
    ),
));
