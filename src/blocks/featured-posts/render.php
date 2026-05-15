<?php
/** @var $block array */

use Doubleedesign\Comet\WordPress\{BlockRenderer, TemplateUtils};

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
	return;
}

$post_ids = function_exists('get_field') ? get_field('posts') : [];
if (!$post_ids) {
    return; // Do not render at all if no posts are selected
}

$component = TemplateUtils::create_card_list($post_ids, $block, true);
$component->render();
