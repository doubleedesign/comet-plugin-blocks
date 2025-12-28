<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Column, Columns, ContentImageAdvanced, Copy};
use Doubleedesign\Comet\WordPress\PreprocessedHTML;

$component = new Columns(
    array(
        'shortName'  => 'copy-image',
        'size'       => $block['data']['size'] ?? $block['attributes']['size']['default'],
        'vAlign'     => $block['data']['verticalAlignment'] ?? $block['attributes']['verticalAlignment']['default'],
    ),
    array(
        (new Column(
            ['context' => 'copy-image'],
            [new Copy(
                array(
                    'colorTheme' => $block['data']['colorTheme'] ?? $block['attributes']['colorTheme']['default'],
                    'isNested'   => true,
                ),
                array(
                    new PreprocessedHTML([], get_field('copy') ?? '')
                )
            )]
        ))->set_bem_modifier('copy'),
        (new Column(
            ['context' => 'copy-image'],
            [...get_field('image') ? [new ContentImageAdvanced(get_field('image'))] : []]
        ))->set_bem_modifier('image')
    )
);

$component->render();
