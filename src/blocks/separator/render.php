<?php

use Doubleedesign\Comet\Core\{Separator, Utils};

/** @var $block array */
$attributes = array_merge(
    Utils::array_pick($block, ['size', 'colorTheme']),
    ['style' => get_field('style')]
);
$component = new Separator($attributes);

// FIXME: div is a workaround for something causing subsequent blocks to not render.
// This is a hr specific issue and occurs even when directly rendering a <hr/> here and not involving Comet objects at all.
echo '<div class="separator-wrapper">';
$component->render();
echo '</div>';
