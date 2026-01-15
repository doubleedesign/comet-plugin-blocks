<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Column, Columns, Copy, PreprocessedHTML};
use Doubleedesign\Comet\WordPress\{BlockRenderer};

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$has_second_column = get_field('field__copy__content__split') && !empty(get_field('field__copy__content_2'));
$wrapperAttributes = [
    'size'       => $block['size'] ?? $block['attributes']['size']['default'],
];

if ($has_second_column) {
    $copyAttributes = [
        'colorTheme' => $block['colorTheme'] ?? $block['attributes']['colorTheme']['default'],
        'isNested'   => true,
    ];

    $first_column = new Copy($copyAttributes, [new PreprocessedHTML([], get_field('copy'))]);
    $second_column = new Copy($copyAttributes, [new PreprocessedHTML([], get_field('field__copy__content_2'))]);

    $component = new Columns(
        $wrapperAttributes,
        array(
            new Column(
                [],
                [$first_column]
            ),
            new Column(
                [],
                [$second_column]
            )
        ));
}
else {
    $component = new Copy(
        [...$wrapperAttributes, 'colorTheme' => $block['colorTheme'] ?? $block['attributes']['colorTheme']['default']],
        [new PreprocessedHTML([], get_field('copy'))]
    );
}

$component->render();
