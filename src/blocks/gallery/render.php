<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Config, ContentImageBasic, Gallery, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$images = get_field('images');
$caption = get_field('caption');
$defaults = Config::getInstance()->get_component_defaults('gallery');
$attributes = array_merge(
    $defaults,
    Utils::array_pick($block, ['size', 'maxPerRow', 'lightbox', 'backgroundColor', 'imageCrop', 'aspectRatio']),
    ['captionAsHeading' => get_field('caption_as_heading')]
);

$items = [];
if ($images) {
    $items = array_map(function($image) use ($block) {
        $attrs = Utils::array_pick($image, ['alt']);
        $attrs['src'] = $image['sizes']['large']; // The image to display as the thumbnail in the gallery
        if ($block['captions']) {
            if (!empty($image['description'])) {
                $caption = '<strong>' . $image['caption'] . '</strong>';
                $caption .= '<span>' . $image['description'] . '</span>';
            }
            else {
                $caption = $image['caption'];
            }

            $attrs['caption'] = apply_filters('comet_blocks_gallery_image_caption', $caption, $image);
        }

        if (isset($block['lightbox']) && $block['lightbox']) {
            $attrs['href'] = $image['url'];
        }

        if (isset($block['externalLinks']) && $block['externalLinks']) {
            $image_id = $image['id'];
            $external_link = get_post_meta($image_id, 'external_url', true);
            if ($external_link) {
                $attrs['href'] = $external_link;
                $attrs['target'] = '_blank';
            }
        }

        return new ContentImageBasic($attrs);
    }, $images ?? []);
}

$component = new Gallery([...$attributes, 'caption' => $caption], $items);
$component->render();
