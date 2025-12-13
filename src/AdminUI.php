<?php
namespace Doubleedesign\Comet\WordPress;
class AdminUI {

    public function __construct() {
        add_action('admin_menu', [$this, 'remove_patterns_site_editor_etc_from_admin_menu']);
        add_action('admin_init', [$this, 'redirect_away_from_site_editor_urls']);
    }

    /**
     * Remove all references to Patterns, Site Editor, FSE, etc. from the admin menu if patterns are disabled
     *
     * @return void
     */
    public function remove_patterns_site_editor_etc_from_admin_menu(): void {
        global $menu, $submenu;

        if (!class_exists('WP_Block_Type_Registry')) {
            return;
        }

        $registered_blocks = \WP_Block_Type_Registry::get_instance()->get_all_registered();
        if (array_key_exists('core/block', $registered_blocks)) {
            $submenu['themes.php'] = array_filter(
                $submenu['themes.php'],
                function($item) {
                    return !in_array($item[0], ['Patterns', 'Design']) && !str_contains($item[2], 'site-editor.php');
                }
            );
        }
    }

    /**
     * If someone lands on a Site Editor admin via direct URL or there's a rogue link somewhere,
     * redirect them to the main admin dashboard
     *
     * @return void
     */
    public function redirect_away_from_site_editor_urls(): void {
        if (!is_admin()) return;

        if (str_contains($_SERVER['DOCUMENT_URI'], 'site-editor.php')) {
            wp_redirect(admin_url());
            exit;
        }
    }
}
