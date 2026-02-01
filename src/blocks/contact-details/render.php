<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Copy, PreprocessedHTML, Utils};

ob_start();
get_template_part('template-parts/contact-details');
$content = ob_get_clean();

$attributes = [
    ...Utils::array_pick($block, ['size', 'hAlign']),
    'shortName' => 'contact-details-wrapper',
];

$component = new Copy($attributes, [new PreprocessedHTML([], $content)]);
$component->render();
