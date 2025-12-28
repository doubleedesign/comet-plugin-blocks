<?php
/** @var $block array */
use Doubleedesign\Comet\Core\{Button, ButtonGroup, CallToAction, ColorUtils, Config, Heading, Utils};
use Doubleedesign\Comet\WordPress\PreprocessedHTML;

$defaults = Config::getInstance()->get_component_defaults('call-to-action');
$attributes = [
    ...$defaults,
    ...Utils::array_pick($block, ['size', 'colorTheme', 'backgroundColor']),
    'innerBackground' => $block['colorTheme'] ?? 'primary',
    'colorTheme'      => $block['colorTheme'] ? ColorUtils::get_readable_colour($block['colorTheme'], ['accent']) : 'primary',
];

$description = get_field('description');
$buttons = get_field('buttons');
$headingClasses = apply_filters('comet_blocks_cta_heading_classes', []);
$buttonGroupAttrs = [
    'colorTheme'  => ColorUtils::get_readable_colour($block['colorTheme'], ['accent']),
    ...apply_filters('comet_blocks_cta_button_group_attributes', [])
];

$component = new CallToAction(
    $attributes,
    array(
        new Heading(['classes' => $headingClasses], get_field('heading')),
        ...(!empty($description) ? [new PreprocessedHTML([], $description)] : []),
        new ButtonGroup(
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
        )
    ));

$component->render();
