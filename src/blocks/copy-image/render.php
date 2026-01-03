<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Column, Columns, ContentImageAdvanced, Copy};
use Doubleedesign\Comet\WordPress\{BlockRenderer, PreprocessedHTML};

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$image = [];
$image['styleName'] = 'polaroid'; // TODO: Make this configurable with a theme filter and/or block option

$image_field = get_field('image');
if (isset($image_field['image_id'])) {
    $meta = wp_get_attachment_metadata($image_field['image_id']);
    $dimensions = $meta['sizes']['image_advanced_resized'] ?? $meta;
    list('width' => $width, 'height' => $height) = $dimensions;
    if ($width > $height) {
        $image['originalImageOrientation'] = 'horizontal';
    }
    else if ($height > $width) {
        $image['originalImageOrientation'] = 'vertical';
    }
    else {
        $image['originalImageOrientation'] = null; // TODO: Test with square images
    }
}

$component = new Columns(
    array(
        'shortName'  => 'copy-image',
        'size'       => $block['data']['size'] ?? $block['attributes']['size']['default'],
        'vAlign'     => $block['data']['vAlign'] ?? $block['attributes']['vAlign']['default'],
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
            [...$image ? [new ContentImageAdvanced($image)] : []]
        ))->set_bem_modifier('image')
    )
);

$component->render();
