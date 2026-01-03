<?php
if (!isset($block)) {
    return;
}
if (!get_field('shared_content_item')) {
    return;
}

$shared_content_id = get_field('shared_content_item');
if (!is_numeric($shared_content_id)) {
    return;
}

$post = get_post($shared_content_id);
if (!$post) {
    return;
}

$is_editor = isset($is_preview) && $is_preview;
// $post->post_content is not parsed in block editor context, so we need to parse and render the blocks
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
