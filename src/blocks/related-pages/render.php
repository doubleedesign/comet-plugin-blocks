<?php
/** @var $block array */

use Doubleedesign\Comet\WordPress\TemplateUtils;

$page_ids = get_field('pages');

if (!$page_ids) {
    return; // Do not render at all if no pages are selected
}

$component = TemplateUtils::create_card_list($page_ids, $block);
$component->render();
