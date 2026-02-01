<?php
/** @var $block array */

use Doubleedesign\Comet\WordPress\TemplateUtils;

$query = new WP_Query([
    'post_type'      => 'post',
    'posts_per_page' => get_field('item_count') ?: 3,
    'orderby'        => 'date',
    'order'          => 'DESC',
    'post_status'    => 'publish',
    'tax_query'      => get_field('categories') ? [
        [
            'taxonomy' => 'category',
            'field'    => 'term_id',
            'terms'    => get_field('categories'),
        ],
    ] : [],
]);
$post_ids = wp_list_pluck($query->posts, 'ID');

if (!$post_ids) {
    return; // Do not render at all if the query returns no posts
}

$link = apply_filters('comet_blocks_latest_posts_link', [
    'url'       => get_permalink(get_option('page_for_posts')),
    'title'     => 'View all articles',
    'isOutline' => true
], $post_ids);

$component = TemplateUtils::create_card_list(
    $post_ids,
    $block,
    true,
    !empty($link) ? $link : null
);
$component->render();
