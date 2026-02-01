<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Copy, PreprocessedHTML};
use Doubleedesign\Comet\WordPress\{BlockRenderer};

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$wrapperAttributes = [
    'size'       => $block['size'] ?? $block['attributes']['size']['default'],
    'tagName'    => $block['tagName'] ?? 'section'
];

$component = new Copy(
    [...$wrapperAttributes, 'colorTheme' => $block['colorTheme'] ?? $block['attributes']['colorTheme']['default']],
    [new PreprocessedHTML([], get_field('copy'))]
);

$component->render();
