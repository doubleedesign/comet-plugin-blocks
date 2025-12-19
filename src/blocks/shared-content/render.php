<?php
if (!isset($block)) {
    return;
}
if (!isset($block['data']['shared_content_item'])) {
    return;
}

$shared_content_id = $block['data']['shared_content_item'];
if ($shared_content_id) {
    $post = get_post($shared_content_id);
    if ($post) {
        echo apply_filters('the_content', $post->post_content);
    }
}
