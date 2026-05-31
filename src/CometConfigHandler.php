<?php

namespace Doubleedesign\Comet\WordPress;

use Doubleedesign\Comet\Core\{Config, AspectRatio};

class CometConfigHandler {

    public static function get_component_defaults(): array {
        if (!class_exists('Doubleedesign\Comet\Core\Config')) {
            return [];
        }

        return array(
            'defaults'              => Config::getInstance()->get('component_defaults'),
            'globalBackground'      => Config::getInstance()->get_global_background(),
            'palette'               => Config::getInstance()->get_theme_colours(),
            // Colours that have sufficient contrast when on the global background
            'filteredPalette'       => Config::getInstance()->get_colours_filtered_against_background_contrast(),
            'colourPairs'           => Config::getInstance()->get_theme_colour_pairs(),
            'colourPairOverrides'   => Config::getInstance()->get_theme_colour_pair_overrides(),
            'gradients'             => Config::getInstance()->get_theme_gradients(),
            // TODO: Test this with fully custom names so a theme can have something outside the ThemeColor and ThemeGradient bounds if explicitly set up
            'sectionBackgrounds'    => apply_filters('comet_canvas_section_backgrounds', array_merge(
                Config::getInstance()->get_theme_colours(),
                Config::getInstance()->get_theme_gradients(),
            )),
            'aspectRatios'          => array_map(fn($case) => ['name' => $case->name, 'value' => $case->value], AspectRatio::cases()),
        );
    }
}
