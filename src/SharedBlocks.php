<?php

namespace Doubleedesign\Comet\WordPress;

class SharedBlocks {

    public function __construct() {
        add_action('init', [$this, 'create_shared_content_cpt']);
        add_action('acf/include_fields', [$this, 'register_fields']);
        add_action('save_post_shared_content', [$this, 'save_administrative_title']);
        add_filter('template_include', [$this, 'use_plugin_template'], 20);
        add_filter('breadcrumbs_filter_post_types', [$this, 'disable_breadcrumbs']);
    }

    /**
     * Create the custom post type
     *
     * @return void
     */
    public function create_shared_content_cpt(): void {
        $labels = array(
            'name'                  => _x('Shared Content', 'Post Type General Name', 'comet'),
            'singular_name'         => _x('Shared Content', 'Post Type Singular Name', 'comet'),
            'menu_name'             => __('Shared Content', 'comet'),
            'name_admin_bar'        => __('Shared Content', 'comet'),
            'archives'              => __('About Us', 'comet'),
            'attributes'            => __('Shared Content Attributes', 'comet'),
            'parent_item_colon'     => __('Parent shared content:', 'comet'),
            'all_items'             => __('Content Items', 'comet'),
            'add_new_item'          => __('Add new shared content', 'comet'),
            'add_new'               => __('Add New', 'comet'),
            'new_item'              => __('New Shared Content', 'comet'),
            'edit_item'             => __('Edit Shared Content', 'comet'),
            'update_item'           => __('Update Shared Content', 'comet'),
            'view_item'             => __('View Shared Content', 'comet'),
            'view_items'            => __('View Shared Content', 'comet'),
            'search_items'          => __('Search Shared Content', 'comet'),
            'not_found'             => __('Not found', 'comet'),
            'not_found_in_trash'    => __('Not found in Trash', 'comet'),
            'featured_image'        => __('Logo', 'comet'),
            'set_featured_image'    => __('Set featured image', 'comet'),
            'remove_featured_image' => __('Remove image', 'comet'),
            'use_featured_image'    => __('Use as featured image', 'comet'),
            'insert_into_item'      => __('Insert into content', 'comet'),
            'uploaded_to_this_item' => __('Uploaded to this content item', 'comet'),
            'items_list'            => __('Shared Contents list', 'comet'),
            'items_list_navigation' => __('Shared Contents list navigation', 'comet'),
            'filter_items_list'     => __('Filter items list', 'comet'),
        );
        $rewrite = array(
            'slug'       => 'shared',
            'with_front' => true,
            'pages'      => true,
            'feeds'      => true,
        );
        $args = array(
            'label'               => __('Shared Content', 'comet'),
            'description'         => __('Content that can be used across multiple pages, edited in this central place to ensure content and design stays consistent across those usages', 'comet'),
            'labels'              => $labels,
            'rewrite'             => $rewrite,
            'show_in_rest'        => true, // required to enable block editor for this CPT
            'supports'            => array('revisions', 'editor'),
            'hierarchical'        => false,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 10,
            'menu_icon'           => 'dashicons-share',
            'show_in_admin_bar'   => true,
            'show_in_nav_menus'   => true,
            'can_export'          => true,
            'has_archive'         => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => true,
            'capability_type'     => 'page',
        );

        register_post_type('shared_content', $args);
    }

    public function register_fields(): void {
        acf_add_local_field_group(array(
            'key'    => 'group_shared_content_admin_fields',
            'title'  => 'Admin',
            'fields' => array(
                array(
                    'key'               => 'field_shared_content_admin_label',
                    'label'             => 'Administrative label',
                    'name'              => 'administrative_label',
                    'type'              => 'text',
                    'required'          => true,
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param'    => 'post_type',
                        'operator' => '==',
                        'value'    => 'shared_content',
                    ),
                ),
            ),
            'menu_order'            => 0,
            'position'              => 'side',
            'style'                 => 'default',
            'label_placement'       => 'top',
            'instruction_placement' => 'label',
            'active'                => true,
            'show_in_rest'          => true,
        ));
    }

    /**
     * On post save, save the value of the administrative title ACF field as the post title.
     * This allows us to have it in the sidebar for editors, rather than the default block editor page title.
     *
     * @return void
     */
    public function save_administrative_title(): void {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Prevent infinite loop
        if (defined('DOING_WP_UPDATE_POST') && DOING_WP_UPDATE_POST) {
            return;
        }

        if (isset($_POST['acf']['field_shared_content_admin_label'])) {
            $admin_label = sanitize_text_field($_POST['acf']['field_shared_content_admin_label']);
            $post_id = get_the_ID();

            if (get_the_title() !== $admin_label) {
                // Set flag to prevent recursion
                if (!defined('DOING_WP_UPDATE_POST')) {
                    define('DOING_WP_UPDATE_POST', true);
                }

                wp_update_post(array(
                    'ID'         => $post_id,
                    'post_title' => $admin_label,
                ));
            }
        }
    }

    public function use_plugin_template($template) {
        if (is_singular('shared_content')) {
            $plugin_template = plugin_dir_path(__FILE__) . 'templates/single-shared_content.php';
            if (file_exists($plugin_template)) {
                return $plugin_template;
            }
        }

        return $template;
    }

    public function disable_breadcrumbs($post_types) {
        unset($post_types['shared_content']);

        return $post_types;
    }
}
