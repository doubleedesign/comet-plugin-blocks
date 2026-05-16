<?php
/** @var $context array */

use Doubleedesign\Comet\Core\{Separator, Utils};

/** @var $block array */
$attributes = [
    'style'      => get_field('style'),
    ...Utils::array_pick($block, ['size', 'colorTheme'])
];
if (isset($context['isNested'])) {
    unset($attributes['size']);
}

$component = new Separator($attributes);

// FIXME: wrapper is a workaround for something causing subsequent blocks to not render.
// This is a hr specific issue and occurs even when directly rendering a <hr/> here and not involving Comet objects at all.
echo '<span class="separator-wrapper">';
$component->render();
echo '</span>';
