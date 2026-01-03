<?php
/** @var $block array */

use Doubleedesign\Comet\Core\{Button, ButtonGroup, CallToAction, Config, Heading, Utils};
use Doubleedesign\Comet\WordPress\{BlockRenderer, PreprocessedHTML};

$is_editor = isset($is_preview) && $is_preview;
$render_placeholder = BlockRenderer::maybe_render_editor_placeholder($block, $is_editor);
if ($render_placeholder) {
    return;
}

$defaults = Config::getInstance()->get_component_defaults('call-to-action');
$attributes = [
    ...$defaults,
    ...Utils::array_pick($block, ['size', 'colorTheme']),
    'innerBackground' => $block['backgroundColor'] ?? null,
];

$heading = get_field('heading');
$description = get_field('description');
$buttons = get_field('buttons') ?? [];
$headingClasses = apply_filters('comet_blocks_cta_heading_classes', []);
$buttonGroupAttrs = [
    'colorTheme'  => $block['colorTheme'],
    ...apply_filters('comet_blocks_cta_button_group_attributes', [])
];

$component = new CallToAction(
    $attributes,
    array(
        ...(!empty($heading) ? [new Heading(['classes' => $headingClasses], $heading)] : []),
        ...(!empty($description) ? [new PreprocessedHTML([], $description)] : []),
        ...(!empty($buttons) ? [new ButtonGroup(
            $buttonGroupAttrs,
            array_map(
                function($button) use ($block) {
                    return new Button(
                        [
                            'href'        => $button['link']['url'] ?? '#',
                            'target'      => $button['link']['target'] ?? '',
                            'isOutline'   => $button['style'] === 'isOutline',
                            'colorTheme'  => null // let the CSS inherit from the button group
                        ],
                        $button['link']['title']
                    );
                },
                (is_array($buttons) ? $buttons : [])
            )
        )] : []),
    ));

$component->render();
