<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{File, FileGroup};

$heading = get_field('heading');

$fileItems = get_field('files');
if (!$fileItems) {
    return;
}
$files = array_map(function($file) {
    return new File([
        'url'         => $file['url'],
        'title'       => $file['title'],
        'description' => $file['description'],
        'mimeType'    => $file['mime_type'],
    ]);
}, get_field('files'));

$attributes = [
    'colorTheme' => $block['colorTheme'] ?? 'primary',
    'size'       => $block['size'] ?? 'contained'
];
if ($heading) {
    $attributes['heading'] = $heading;
}

$component = new FileGroup($attributes, $files);
$component->render();
