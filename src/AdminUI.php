<?php
namespace Doubleedesign\Comet\WordPress;
class AdminUI {

    public function __construct() {
        add_action('admin_menu', [$this, 'remove_patterns_site_editor_etc_from_admin_menu']);
        add_action('admin_init', [$this, 'redirect_away_from_site_editor_urls']);
        add_action('add_meta_boxes', [$this, 'remove_metaboxes'], 99);
        add_filter('gettext', [$this, 'change_excerpt_explanation'], 10, 3);
        add_filter('taxonomy_labels_category', [$this, 'change_category_description_explanation'], 10, 1);

        add_action('wp_head', function() {
            if (is_user_logged_in()) {
                echo '<style>
				#wpadminbar {
					padding: 0;
				}
					
				body:has(#wpadminbar) {
					margin-top: -32px !important;
				}
			</style>';
            }
        });
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

    /**
     * Remove unwanted metaboxes
     */
    public function remove_metaboxes(): void {
        remove_meta_box('nf_admin_metaboxes_appendaform', array('page', 'post'), 'side');
    }

    public function change_excerpt_explanation($translated_text, $text, $domain) {
        if (str_contains($text, 'Excerpts are optional hand-crafted summaries of your content that can be used in your theme')) {
            return 'Excerpts are hand-crafted summaries used in content lists such as the blog page and category indexes, and blocks such as Related Content, Latest Posts, and Child Pages.';
        }

        return $translated_text;
    }

    public function change_category_description_explanation($labels) {
        // Remove "The description is not prominent by default; however, some themes may show it." from the category edit screen
        $labels->desc_field_description = '';

        return $labels;
    }
}
