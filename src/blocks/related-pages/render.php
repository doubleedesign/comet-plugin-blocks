<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Card, CardList, Utils};

$page_ids = get_field('pages');
if (!$page_ids) {
    return; // Do not render at all if no child pages exist
}

// If there is 1-2 pages, render as a horizontal card; otherwise vertical
$orientation = 'vertical';
if (count($page_ids) <= 2) {
    $orientation = 'horizontal';
}

$cards = array_map(function($page_id) use ($orientation) {
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
        'orientation'       => $orientation,
        'cardAsLink'        => apply_filters('comet_blocks_child_pages_card_as_link', false),
    ]);
}, $page_ids);

$component = new CardList(
    array(
        ...Utils::array_pick($block, ['size', 'colorTheme', 'backgroundColor']),
        'heading'    => get_field('heading'),
        'hAlign'     => 'center',
        'maxPerRow'  => count($cards) > 3 ? 4 : 3
    ),
    $cards
);

$component->render();
