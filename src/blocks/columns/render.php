<?php
/** @var $block array */
/** @var $wp_block WP_Block */

use Doubleedesign\Comet\Core\{Column, Columns, PreprocessedHTML, Utils};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$rendered = BlockRenderer::maybe_render_innerblocks_editor($block, $is_editor);
if ($rendered || $is_editor) {
    return;
}
if (!BlockRenderer::ready_to_render_innerblocks_frontend($wp_block)) {
    return;
}

$innerBlocks = $wp_block->inner_blocks;
$renderedColumns = [];
$wrapperAttrs = Utils::array_pick($block, ['size', 'sectionBackground']);
$isColumnsNested = isset($block['sectionBackground']) && $block['sectionBackground'] !== 'none';
$columnsAttrs = [
    ...Utils::array_pick($block, ['size', 'backgroundColor', 'qty', 'hAlign', 'columnLayout']),
    'isNested' => $isColumnsNested
];

for ($index = 0; $index < $innerBlocks->count(); $index++) {
    $innerBlock = $innerBlocks->offsetGet($index);
    if (!isset($innerBlock->attributes['id'])) {
        $innerBlock->attributes['id'] = $block['name'] . '--' . $index;
    }

    // Because we are using one block per column, we can shuffle attributes to ensure the backgrounds behave as expected
    // without any extra CSS that might not work well in other use cases (e.g., 100% height on column content).
    // We also pass down the vAlign to the individual columns for similar reasons.
    $columnAttrs = array_merge(
        Utils::array_pick($innerBlock->attributes, ['backgroundColor']),
        Utils::array_pick($block, ['vAlign'])
    );
    $blockAttrs = array_diff_key($innerBlock->attributes, $columnAttrs);

    ob_start();
    acf_render_block($blockAttrs, '', false, $innerBlock->context['postId'] ?? 0, $innerBlock, $innerBlock->context);
    $content = ob_get_clean();

    array_push($renderedColumns, new Column($columnAttrs, [new PreprocessedHTML([], $content)]));
}

$component = BlockRenderer::maybe_wrap_component($wrapperAttrs, new Columns($columnsAttrs, $renderedColumns));
$component->render();
