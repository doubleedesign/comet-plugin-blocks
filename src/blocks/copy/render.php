<?php
use Doubleedesign\Comet\Core\Copy;
use Doubleedesign\Comet\WordPress\PreprocessedHTML;

$is_editor = isset($is_preview) && $is_preview;

$component = new Copy([
    'size'       => $block['containerSize'] ?? $block['attributes']['containerSize']['default'],
    'colorTheme' => $block['colorTheme'] ?? $block['attributes']['colorTheme']['default'],
],
    [new PreprocessedHTML([], get_field('copy'))]
);

$component->render();
