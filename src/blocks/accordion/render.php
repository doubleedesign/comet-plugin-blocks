<?php

use Doubleedesign\Comet\Core\{Accordion, AccordionPanel, Heading};
use Doubleedesign\Comet\WordPress\{BlockRenderer, PreprocessedHTML};

/** @var $block array */
$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$heading = get_field('heading');
$intro_text = get_field('intro_copy');
$colorTheme = $block['colorTheme'];

$beforeComponents = [];
if ($heading) {
    array_push($beforeComponents, new Heading([], $heading));
}
if ($intro_text) {
    array_push($beforeComponents, new PreprocessedHTML([], $intro_text));
}

$panelItems = get_field('panels');
if ($panelItems) {
    $panels = array_map(function($item) {
        return new AccordionPanel(
            ['title' => $item['heading']],
            [new PreprocessedHTML([], $item['panel_content'])]
        );
    }, $panelItems ?? []);
}

$component = new Accordion(
    ['colorTheme' => $colorTheme, 'size' => $block['size'] ?? 'contained'],
    $panels ?? [],
    $beforeComponents
);

$component->render();
