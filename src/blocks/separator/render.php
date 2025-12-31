<?php

use Doubleedesign\Comet\Core\{Separator, Utils};

/** @var $block array */
$attributes = array_merge(
    Utils::array_pick($block, ['size', 'colorTheme']),
    ['style' => get_field('style')]
);
$component = new Separator($attributes);
$component->render();
