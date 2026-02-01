<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Banner, Button, ButtonGroup, Heading, PreprocessedHTML, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$attributes = Utils::array_pick($block, ['size', 'colorTheme', 'backgroundColor', 'backgroundType', 'backgroundOpacity', 'vAlign', 'hAlign', 'contentMaxWidth']);
$imageAttrs = get_field('image');
$imageProps = [
    ...Utils::array_pick($imageAttrs, ['alt', 'aspect_ratio', 'focal_point']),
    'src'      => wp_get_attachment_image_src($imageAttrs['image_id'], 'full')[0] ?? '',
    'parallax' => $block['isParallax'] ?? false
];
$attributes['imageProps'] = Utils::camel_case_array_keys($imageProps);

$innerComponents = [];

$heading = apply_filters('comet_canvas_page_header_title', get_field('heading') ?? '');
if ($heading) {
    array_push($innerComponents, new Heading([
        'level'   => apply_filters('comet_blocks_banner_heading_level', 2),
        'classes' => apply_filters('comet_blocks_banner_heading_classes', [])
    ], $heading));
}

$bodyText = get_field('text');
if ($bodyText) {
    array_push($innerComponents, new PreprocessedHTML([], $bodyText));
}

$buttons = get_field('buttons');
if (is_array($buttons) && !empty($buttons)) {
    $buttonGroupAttrs = apply_filters('comet_blocks_banner_button_group_attributes', ['colorTheme' => $block['backgroundColor']]);
    $buttons = array_map(
        function($button) use ($block) {
            return new Button(
                [
                    'href'        => $button['link']['url'] ?? '#',
                    'target'      => $button['link']['target'] ?? '',
                    'isOutline'   => $button['style'] === 'isOutline',
                    'colorTheme'  => null // let the CSS inherit from the button group
                ],
                $button['link']['title'] ?? 'Button'
            );
        },
        ($buttons)
    );
    array_push($innerComponents, new ButtonGroup($buttonGroupAttrs, $buttons));
}

$component = new Banner($attributes, $innerComponents);
$component->render();
