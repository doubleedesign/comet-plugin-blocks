<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{LinkGroup, Utils};

$heading = get_field('heading');
$links = get_field('links');
if (!is_array($links) || empty($links)) {
    return;
}

$links = array_map(function($data) {
    return [
        'href'        => $data['link']['url'] ?? '#',
        'target'      => $data['link']['target'] ?? '_self',
        'label'       => $data['link']['title'] ?? 'Untitled link',
        'description' => $data['description'] ?? null,
    ];
}, $links);

$attributes = [
    ...Utils::array_pick($block, ['colorTheme', 'size', 'layout']),
    'hAlign'        => $block['horizontalAlignment'] ?? null,
    'maxPerRow'     => count($links) % 3 === 0 ? 3 : 4, // TODO: Make this configurable
];
if ($heading) {
    $attributes['heading'] = $heading;
}

$component = new LinkGroup($attributes, $links);
$component->render();
