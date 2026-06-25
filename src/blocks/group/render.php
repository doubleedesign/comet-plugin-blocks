<?php
/** @var $block array */
/** @var $context array */
/** @var $wp_block WP_Block */

use Doubleedesign\Comet\Core\{Group, PreprocessedHTML, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$rendered = BlockRenderer::maybe_render_innerblocks_editor($block, $wp_block->inner_blocks, $is_editor);
if ($rendered || $is_editor) {
    return;
}
if (!BlockRenderer::ready_to_render_innerblocks_frontend($wp_block)) {
    return;
}

$innerBlocks = $wp_block->inner_blocks;
$innerComponents = [];
for ($index = 0; $index < $innerBlocks->count(); $index++) {
    $innerBlock = $innerBlocks->offsetGet($index);

    if (!isset($innerBlock->attributes['id'])) {
        $innerBlock->attributes['id'] = $block['name'] . '--' . $index;
    }

    ob_start();
    acf_render_block($innerBlock->attributes, '', false, $innerBlock->context['postId'] ?? 0, $innerBlock, $innerBlock->context);
    $content = ob_get_clean();

    array_push($innerComponents, new PreprocessedHTML([], $content));
}

$component = new Group([...Utils::array_pick($block, ['backgroundColor']), ...Utils::array_pick($context, ['isNested'])], $innerComponents);
$component->render();
