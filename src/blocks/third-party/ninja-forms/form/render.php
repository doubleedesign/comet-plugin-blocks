<?php
// This file is called in BlockRenderer.php on the render_block filter to render Ninja Forms blocks with Comet-esque layout wrapping and theming.
// block.json and fields.php in this directory will have no effect.
// I just put this here instead of directly doing the wrapping the output in the filter function for consistency with other blocks.
// Comet theming attributes are added to this block to match those in block.json of Comet's blocks via JavaScript; see block-registry.js.

/** @var $block array */

use Doubleedesign\Comet\Core\{Container, Group, PreprocessedHTML};

$formId = is_numeric($block['attrs']['formID']) ? (int)$block['attrs']['formID'] : 0;
ob_start();
echo do_shortcode("[ninja_form id='$formId']");
$formHtml = ob_get_clean();

// Note: Unlike ACF blocks, attributes are not directly in $block here, they are in $block['attrs']
$component = new Container(
    ['shortName' => 'form-wrapper', 'size' => $block['attrs']['size'] ?? 'contained'],
    [new Group(
        [
            'shortName'  => 'form',
            'colorTheme' => $block['colorTheme'] ?? 'primary'
        ],
        [new PreprocessedHTML([], $formHtml)]
    )]
);
$component->render();
