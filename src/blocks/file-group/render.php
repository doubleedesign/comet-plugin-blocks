<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{File, FileGroup};
use Doubleedesign\Comet\WordPress\BlockRenderer;

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$heading = get_field('heading');
$fileItems = get_field('files');
if (!$fileItems) {
    return;
}
$files = array_map(function($file) {
    if (is_string($file) || is_numeric($file)) {
        return new File([
            'url'         => wp_get_attachment_url($file),
            'title'       => get_the_title($file),
            'description' => get_the_excerpt($file),
            'mimeType'    => get_post_mime_type($file),
        ]);
    }

    return new File([
        'url'         => $file['url'],
        'title'       => $file['title'],
        'description' => $file['description'],
        'mimeType'    => $file['mime_type'],
    ]);
}, $fileItems);

$attributes = [
    'colorTheme' => $block['colorTheme'] ?? 'primary',
    'size'       => $block['size'] ?? 'contained'
];
if ($heading) {
    $attributes['heading'] = $heading;
}

$component = new FileGroup($attributes, $files);
$component->render();
