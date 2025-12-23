<?php
/** @var $block array */
use Doubleedesign\Comet\Core\Copy;
use Doubleedesign\Comet\WordPress\PreprocessedHTML;

$is_editor = isset($is_preview) && $is_preview;

$component = new Copy([
    'size'       => $block['size'] ?? $block['attributes']['size']['default'],
    'colorTheme' => $block['colorTheme'] ?? $block['attributes']['colorTheme']['default'],
],
    [new PreprocessedHTML([], get_field('copy'))]
);

$component->render();
