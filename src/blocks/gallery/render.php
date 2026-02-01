<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{AspectRatio, ContentImageBasic, Gallery, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$images = get_field('images');
$caption = get_field('caption');
$attributes = Utils::array_pick($block, ['tagName', 'size', 'maxPerRow', 'lightbox']);

$images = array_map(function($image) use ($block) {
    $attrs = $block['captions'] ? Utils::array_pick($image, ['alt', 'caption']) : Utils::array_pick($image, ['alt']);
    $attrs['src'] = $image['sizes']['large']; // The image to display as the thumbnail in the gallery
    $attrs['aspectRatio'] = $block['aspectRatio'] ?? AspectRatio::SQUARE->value;

    if (isset($block['lightbox']) && $block['lightbox']) {
        $attrs['href'] = $image['url'];
    }

    return new ContentImageBasic($attrs);
}, $images ?? []);

$component = new Gallery([...$attributes, 'imageCrop' => true, 'caption' => $caption], $images);
$component->render();
