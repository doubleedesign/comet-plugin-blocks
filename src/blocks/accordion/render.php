<?php

use Doubleedesign\Comet\Core\{Accordion, AccordionPanel, Heading, PreprocessedHTML, Config, Utils};
use Doubleedesign\Comet\WordPress\{BlockRenderer};

/** @var $block array */
$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$heading = $block['data']['heading'] ?? $block['data']['field__accordion__heading'] ?? '';
$intro_text = $block['data']['intro_copy'] ?? $block['data']['field_accordion__intro'] ?? '';
$defaults = Config::getInstance()->get_component_defaults('call-to-action');
$attributes = [
    ...$defaults,
    ...Utils::array_pick($block, ['size', 'colorTheme']),
    'backgroundColors' => !empty($block['sectionBackground'])
        ? array($block['sectionBackground'], $block['backgroundColor'])
        : $block['backgroundColor'],
    'shortName' => 'test'
];

$beforeComponents = [];
if ($heading) {
    array_push($beforeComponents, new Heading([], $heading));
}
if ($intro_text) {
    array_push($beforeComponents, new PreprocessedHTML([], $intro_text));
}

$panelItems = function_exists('get_field') ? get_field('panels') : [];
if ($panelItems) {
    $panels = array_map(function($item) {
        return new AccordionPanel(
            ['title' => $item['heading']],
            [new PreprocessedHTML([], $item['panel_content'])]
        );
    }, $panelItems);
}

$component = new Accordion(
    $attributes,
    $panels ?? [],
    $beforeComponents
);

$component->render();
