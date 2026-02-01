<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Column, Columns, ContentImageAdvanced, Copy, PreprocessedHTML, Utils};
use Doubleedesign\Comet\WordPress\{BlockRenderer};

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$image = [];

$image_field = get_field('image');
if (isset($image_field['image_id'])) {
    $image = Utils::camel_case_array_keys(Utils::array_pick($image_field, ['aspect_ratio', 'focal_point', 'image_offset']));
    $image['styleName'] = apply_filters('comet_blocks_copy-image_image-style-name', null);
    $image['alt'] = get_post_meta(get_post_thumbnail_id($image_field['image_id']), '_wp_attachment_image_alt', true) ?? '';

    $meta = wp_get_attachment_metadata($image_field['image_id']);
    if (isset($meta['sizes']['image_advanced_resized'])) {
        $image['src'] = wp_get_attachment_image_url($image_field['image_id'], 'image_advanced_resized');
    }
    else {
        $image['src'] = wp_get_attachment_image_url($image_field['image_id'], 'full');
    }

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

    $imageComponent = new ContentImageAdvanced($image);
}

$component = new Columns(
    array(
        'shortName'       => 'copy-image',
        'size'            => $block['size'] ?? $block['attributes']['size']['default'],
        'vAlign'          => $block['vAlign'] ?? $block['attributes']['vAlign']['default'],
        'data-order'      => $block['order'] ?? 'row'
    ),
    array(
        (new Column(
            ['context' => 'copy-image'],
            [new Copy(
                array(
                    'colorTheme' => $block['colorTheme'] ?? $block['attributes']['colorTheme']['default'],
                    'isNested'   => true,
                ),
                array(
                    new PreprocessedHTML([], get_field('copy') ?? '')
                )
            )]
        ))->set_bem_modifier('copy'),
        (new Column(['context' => 'copy-image'], [$imageComponent ?? []]))->set_bem_modifier('image')
    )
);

$component->render();
