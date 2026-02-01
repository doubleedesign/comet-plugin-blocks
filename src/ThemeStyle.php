<?php
namespace Doubleedesign\Comet\WordPress;
use Doubleedesign\Comet\Core\{ColorUtils, Config, ThemeColor, Utils};
use Exception;

class ThemeStyle {

    public function __construct() {
        // Set defaults for components as per Config class in the core package
        add_action('init', [$this, 'set_colours'], 5);
        add_action('init', [$this, 'set_global_background'], 10);
        add_action('init', [$this, 'set_icon_prefix'], 10);
        add_action('init', [$this, 'set_component_defaults'], 5);

        // Load styles into the various required places
        add_action('wp_head', [$this, 'add_css_variables_to_head'], 25);
        add_action('admin_head', [$this, 'add_css_variables_to_head'], 25);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_theme_stylesheets'], 20);
        add_action('enqueue_block_assets', [$this, 'add_css_variables_to_block_editor_iframe'], 20);

        // Miscellaneous
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails', array('post', 'page', 'event', 'person', 'cpt_index'));
        add_post_type_support('page', 'excerpt');
    }

    public function set_colours(): void {
        $theme_json = \WP_Theme_JSON_Resolver::get_theme_data(); 	// TODO: Implement gradient handling
        $defaults = array_reduce($theme_json->get_data()['settings']['color']['palette'], function($acc, $item) {
            $acc[$item['slug']] = $item['color'];

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

        if (class_exists('Doubleedesign\Comet\Core\Config')) {
            Config::getInstance()->set_theme_colours($colours);
            Config::getInstance()->maybe_add_theme_colour_pairs($maybe_pairs);
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
            $defaults = apply_filters('comet_canvas_component_defaults', []);
            // Merge them with existing defaults
            foreach ($defaults as $componentName => $settings) {
                $key = Utils::kebab_case($componentName);
                $existing = Config::getInstance()->get_component_defaults($key);

                Config::getInstance()->set_component_defaults($key, array_merge($existing, $settings));
            }
        }
    }

    public function add_css_variables_to_head(): void {
        echo '<style>:root {' . $this->get_css_variables_from_theme_config() . '}</style>';
    }

    public function add_css_variables_to_block_editor_iframe(): void {
        if (!is_admin()) {
            return;
        }

        wp_add_inline_style('comet-components-common-styles', ':root {' . $this->get_css_variables_from_theme_config() . '}');
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

    private function get_css_variables_from_theme_config(): string {
        $colours = Config::getInstance()->get_theme_colours();
        $css = "";

        foreach ($colours as $key => $hex) {
            $css .= '--color-' . $key . ': ' . $hex . ";\n";

            try {
                $readable_name = ColorUtils::get_readable_colour(ThemeColor::tryFrom($key))->value;
                $readable_hex = ColorUtils::get_theme_value_for_colour_name($readable_name);
                $css .= '--readable-color-' . $key . ': ' . $readable_hex . ";\n";
            }
            catch (Exception $e) {
                if (function_exists('dump')) {
                    dump($e->getMessage());
                }
                else {
                    error_log($e->getMessage());
                }
            }
        }

        return $css;
    }
}
