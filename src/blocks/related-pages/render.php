<?php
/** @var $block array */

use Doubleedesign\Comet\WordPress\{BlockRenderer, TemplateUtils};
use Doubleedesign\Comet\Core\Utils;

$page_ids = get_field('pages');

if (!$page_ids) {
    return; // Do not render at all if no pages are selected
}

$component = TemplateUtils::create_card_list($page_ids, $block);
if (isset($context['isNested']) && $context['isNested']) {
    $component->render();
}
else {
    $wrapperAttributes = Utils::array_pick($block, ['size', 'sectionBackground']);
    $wrapper = BlockRenderer::maybe_wrap_component($wrapperAttributes, $component);
    $wrapper->render();
}
