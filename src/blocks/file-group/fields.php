<?php
acf_add_local_field_group(array(
    'key'                   => 'group_67bafb4622e47',
    'title'                 => 'File Group Block',
    'fields'                => array(
        array(
            'key'       => 'field_67bafb4671235',
            'label'     => 'Heading',
            'name'      => 'heading',
            'type'      => 'text',
            'maxlength' => 120
        ),
        array(
            'key'               => 'field_67bafb4673236',
            'label'             => 'Files',
            'name'              => 'files',
            'type'              => 'gallery',
            'return_format'     => 'array',
            'library'           => 'all',
            'mime_types'        => 'pdf, docx, doc, xlsx, xls',
            'insert'            => 'append',
            'preview_size'      => 'medium',
        ),
    ),
    'location' => array(
        array(
            array(
                'param'    => 'block',
                'operator' => '==',
                'value'    => 'comet/file-group',
            ),
        ),
    ),
    'menu_order'            => 0,
    'position'              => 'normal',
    'style'                 => 'default',
    'label_placement'       => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen'        => '',
    'active'                => true,
    'show_in_rest'          => 0,
));
