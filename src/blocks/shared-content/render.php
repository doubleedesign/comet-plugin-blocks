<?php
if (!isset($block)) {
    return;
}
if (!isset($block['data']['shared_content_item'])) {
    return;
}

$shared_content_id = $block['data']['shared_content_item'];
if (!is_numeric($shared_content_id)) {
    return;
}

$post = get_post($shared_content_id);
if (!$post) {
    return;
}

// Work around issue where nested ACF blocks do not render when loaded in preview mode on initial page load
$is_editor = isset($is_preview) && $is_preview;
if ($is_editor) {
    $blocks = parse_blocks($post->post_content);
    foreach ($blocks as $block_data) {
        acf_render_block(
            [
                'id' => $block_data['id'] ?? uniqid(),
                ...$block_data['attrs']
            ],
            $post->post_content,
            true
        );
    }
}
else {
    echo apply_filters('the_content', $post->post_content);
}
