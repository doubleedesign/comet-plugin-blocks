<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Card, CardList, Utils};

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

$cards = array_map(function($page_id) {
    $heading = get_the_title($page_id);
    $bodyText = get_the_excerpt($page_id) ?? '';
    $imageUrl = get_the_post_thumbnail_url($page_id, 'large') ?: '';
    $imageAlt = get_post_meta(get_post_thumbnail_id($page_id), '_wp_attachment_image_alt', true);
    $link = ['href' => get_permalink($page_id), 'content' => 'Read more'];

    return new Card([
        'tagName'           => 'div',
        'heading'           => $heading,
        'bodyText'          => $bodyText,
        'image'             => [
            'src'   => $imageUrl,
            'alt'   => $imageAlt,
        ],
        'link'              => [
            'href'      => $link['href'],
            'content'   => $link['content'],
            'isOutline' => true
        ],
        'colorTheme'        => $block['colorTheme'] ?? 'primary',
        'orientation'       => 'horizontal', // TODO: Make this configurable
        'cardAsLink'        => apply_filters('comet_blocks_child_pages_card_as_link', false),
    ]);
}, $page_ids);

$component = new CardList(
    array(
        'shortName' => 'child-pages',
        ...Utils::array_pick($block, ['size', 'colorTheme', 'backgroundColor']),
        'heading'    => get_field('heading'),
        'hAlign'     => 'center',
        'maxPerRow'  => 3 // TODO: Make this configurable
    ),
    $cards
);

$component->render();
