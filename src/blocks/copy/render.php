<?php
/** @var $block array */
/** @var $context array */

use Doubleedesign\Comet\Core\{Copy, PreprocessedHTML, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
	return;
}

$attributes = Utils::array_pick($block, ['colorTheme', 'backgroundColor']);
$component = new Copy(
    $attributes,
    [new PreprocessedHTML([], function_exists('get_field') ? get_field('copy') ?? '' : '')]
);

if (isset($context['isNested']) && $context['isNested']) {
    $component->render();
}
else {
    $wrapperAttributes = Utils::array_pick($block, ['size', 'sectionBackground']);
    $wrapper = BlockRenderer::maybe_wrap_component($wrapperAttributes, $component);
    $wrapper->render();
}
