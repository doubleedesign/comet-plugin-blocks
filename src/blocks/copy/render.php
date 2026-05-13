<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Copy, PreprocessedHTML, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$wrapperAttributes = [
    'size'       => $block['size'] ?? $block['attributes']['size']['default'],
    'tagName'    => $block['tagName'] ?? 'section'
];

$attributes = Utils::array_pick($block, ['size', 'colorTheme', 'backgroundColor', 'tagName']);

$component = new Copy(
    $attributes,
    [new PreprocessedHTML([], function_exists('get_field') ? get_field('copy') ?? '' : '')]
);

$component->render();
