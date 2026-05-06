<?php
namespace Doubleedesign\Comet\WordPress;
use Doubleedesign\Comet\Core\{Config, ThemeColor, ThemeGradient, Utils};

class ThemeStyle {

    public function __construct() {
        // Set defaults for components as per Config class in the core package
        add_action('init', [$this, 'set_colours'], 5);
        add_action('init', [$this, 'set_global_background'], 10);
        add_action('init', [$this, 'set_icon_prefix'], 10);
        add_action('init', [$this, 'set_component_defaults'], 5);

        // Load styles into the various required places
        add_action('wp_enqueue_scripts', [$this, 'enqueue_theme_stylesheets'], 20);

        // Miscellaneous
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails', array('post', 'page', 'event', 'person', 'cpt_index'));
        add_post_type_support('page', 'excerpt');

        // Clear out theme.json style nodes, because whatever they are, I am not using them, and they serve only to fuck with my styling by loading unwanted default CSS
        add_filter('wp_theme_json_get_style_nodes', fn($nodes) => []);
    }

    public function set_colours(): void {
        $colorNames = array_column(ThemeColor::cases(), 'value');
        $defaults = array_reduce($colorNames, function($acc, $item) {
            $acc[$item] = "var(--color-{$item})";

            return $acc;
        }, []);
        $colours = apply_filters('comet_canvas_theme_colours', $defaults);
        $maybe_pairs = apply_filters('comet_canvas_theme_colour_pairs_maybe', array(
            ['accent', 'primary'],
            ['accent', 'secondary'],
            ['primary', 'dark'],
            ['primary', 'light'],
            ['secondary', 'dark'],
            ['secondary', 'light'],
        ));
        $pair_overrides = apply_filters('comet_canvas_colour_pair_overrides', []);

        $gradients = apply_filters('comet_canvas_theme_gradients', array(
            new ThemeGradient(ThemeColor::WHITE, ThemeColor::DARK),
            new ThemeGradient(ThemeColor::DARK, ThemeColor::WHITE),
        ));

        if (class_exists('Doubleedesign\Comet\Core\Config')) {
            Config::getInstance()->set_theme_colours($colours);
            Config::getInstance()->maybe_add_theme_colour_pairs($maybe_pairs);
            Config::getInstance()->set_colour_pair_overrides($pair_overrides);
            Config::getInstance()->set_theme_gradients($gradients);
        }
    }

    public function set_global_background(): void {
        if (is_plugin_active('comet-plugin-blocks/comet.php')) {
            $color = apply_filters('comet_canvas_global_background', 'white');
            Config::getInstance()->set_global_background($color);
        }
    }

    public function set_icon_prefix(): void {
        if (is_plugin_active('comet-plugin-blocks/comet.php')) {
            $prefix = apply_filters('comet_canvas_default_icon_prefix', 'fa-solid');
            Config::getInstance()->set_icon_prefix($prefix);
        }
    }

    public function set_component_defaults(): void {
        $themeData = wp_get_theme();
        $authorName = $themeData->get('Author');
        $authorUrl = $themeData->get('AuthorURI');
        $siteName = get_bloginfo('name');
        $startYear = 2025; // TODO: Make this configurable via a filter
        $endYear = date('Y');

        // Set some defaults that require use of WordPress functions to define (thus not putting them directly in the Config class)
        if (class_exists('Doubleedesign\Comet\Core\Config')) {
            Config::getInstance()->set_component_defaults('site-footer', array(
                'copyright' => [
                    'siteName'        => $siteName,
                    'startYear'       => $startYear,
                    'endYear'         => $endYear,
                ],
                'devCredit'  => [
                    'authorName'      => $authorName,
                    'authorUrl'       => $authorUrl,
                ]
            ));

            // Grab any site-specific defaults set via the 'comet_canvas_component_defaults' filter
            $defaults = apply_filters('comet_canvas_component_defaults', Config::getInstance()->get_all_component_defaults());
            // Merge them with existing defaults
            foreach ($defaults as $componentName => $settings) {
                $key = Utils::kebab_case($componentName);
                Config::getInstance()->set_component_defaults($key, $settings);
            }
        }
    }

    public function enqueue_theme_stylesheets(): void {
        $parent = get_template_directory() . '/style.css';
        $child = get_stylesheet_directory() . '/style.css';
        $deps = is_admin() ? array('wp-edit-blocks') : [];

        if (file_exists($parent)) {
            $parent = get_template_directory_uri() . '/style.css';
            wp_enqueue_style('comet-canvas-blocks', $parent, $deps, COMET_VERSION);
        }

        if (file_exists($child)) {
            $child = get_stylesheet_directory_uri() . '/style.css';
            $theme = wp_get_theme();
            $slug = sanitize_title($theme->get('Name'));

            if (defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'local') {
                wp_enqueue_style($slug, $child, $deps, time()); // bust cache locally
            }
            else {
                wp_enqueue_style($slug, $child, $deps, $theme->get('Version'));
            }
        }
    }
}
