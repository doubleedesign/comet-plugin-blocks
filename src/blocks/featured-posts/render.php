<?php
/** @var $block array */

use Doubleedesign\Comet\WordPress\TemplateUtils;

$page_ids = get_field('posts');

if (!$page_ids) {
    return; // Do not render at all if no posts are selected
}

$component = TemplateUtils::create_card_list($page_ids, $block, true);
$component->render();
