<?php

use Doubleedesign\Comet\Core\{Config, Separator};

/** @var $block array */
$attributes = [
    'style'      => get_field('style'),
    // TODO: More concise way of grabbing all defaults from Config and then overriding with attributes present - for all blocks
    'size'       => $block['size'] ?? Config::getInstance()->get_component_defaults('separator')['size'] ?? 'contained',
    'colorTheme' => $block['colorTheme'] ?? Config::getInstance()->get_component_defaults('separator')['colorTheme'] ?? 'primary',
];

$component = new Separator($attributes);

// FIXME: wrapper is a workaround for something causing subsequent blocks to not render.
// This is a hr specific issue and occurs even when directly rendering a <hr/> here and not involving Comet objects at all.
echo '<span class="separator-wrapper">';
$component->render();
echo '</span>';
