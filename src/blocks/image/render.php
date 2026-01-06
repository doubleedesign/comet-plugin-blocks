<?php
/** @var $block array */
// \Symfony\Component\VarDumper\VarDumper::dump($block);
use Doubleedesign\Comet\Core\{Container, ContentImageAdvanced, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$wrapperAttrs = [
    'shortName' => 'image-row',
    ...Utils::array_pick($block, ['size', 'hAlign']),
    'style' => array_filter([
        'margin-block-start' => $block['negativeTopMargin'] ?? null,
        'margin-block-end'   => $block['negativeBottomMargin'] ?? null
    ])
];
$imageAttrs = [
    ...Utils::camel_case_array_keys(Utils::array_pick(get_field('image'), ['src', 'alt', 'aspect_ratio', 'focal_point', 'image_offset'])),
    'context'   => 'image-row',
    'styleName' => str_replace('is-style-', '', explode(' ', $block['className'])[0] ?? ''),
    'style'     => array_filter(['max-width' => "{$block['contentMaxWidth']}%" ?? null]),
];

$component = new Container($wrapperAttrs, array(
    new ContentImageAdvanced($imageAttrs)
));
$component->render();
