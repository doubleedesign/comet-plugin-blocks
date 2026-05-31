<?php
/** @var $block array */

use Doubleedesign\Comet\Core\Utils;
use Doubleedesign\Comet\WordPress\{BlockRenderer, TemplateUtils};

$page_ids = wp_list_pluck((new WP_Query([
    'post_type'      => 'page',
    'post_parent'    => get_the_id(),
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
    'posts_per_page' => -1,
]))->posts, 'ID');

if (!$page_ids) {
    return; // Do not render at all if no child pages exist
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
