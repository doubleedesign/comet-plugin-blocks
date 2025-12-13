<?php
use Doubleedesign\Comet\Core\Copy;
use Doubleedesign\Comet\WordPress\PreprocessedHTML;

$component = new Copy([
    'size'       => $block['containerSize'],
    'colorTheme' => $block['colorTheme']
],
    [new PreprocessedHTML([], $block['data']['copy'])]
);

$component->render();
