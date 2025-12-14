<?php

namespace Doubleedesign\Comet\WordPress;

class SharedContent {

    public function __construct() {
        add_action('init', array($this, 'create_shared_content_cpt'));
        add_filter('manage_shared_content_posts_columns', array($this, 'add_admin_list_columns'), 20);
        add_filter('manage_shared_content_posts_custom_column', array($this, 'populate_admin_list_columns'), 30, 2);
        add_action('init', [$this, 'register_post_template'], 20);
    }

    /**
     * Create the custom post type
     *
     * @return void
     */
    public function create_shared_content_cpt(): void {
        $labels = array(
            'name'                  => _x('Shared Content', 'Post Type General Name', 'starterkit'),
            'singular_name'         => _x('Shared Content', 'Post Type Singular Name', 'starterkit'),
            'menu_name'             => __('Shared Content', 'starterkit'),
            'name_admin_bar'        => __('Shared Content', 'starterkit'),
            'archives'              => __('About Us', 'starterkit'),
            'attributes'            => __('Shared Content Attributes', 'starterkit'),
            'parent_item_colon'     => __('Parent shared content:', 'starterkit'),
            'all_items'             => __('Shared blocks', 'starterkit'),
            'add_new_item'          => __('Add new shared block', 'starterkit'),
            'add_new'               => __('Add New', 'starterkit'),
            'new_item'              => __('New Shared Content', 'starterkit'),
            'edit_item'             => __('Edit Shared Content', 'starterkit'),
            'update_item'           => __('Update Shared Content', 'starterkit'),
            'view_item'             => __('View Shared Content', 'starterkit'),
            'view_items'            => __('View Shared Content', 'starterkit'),
            'search_items'          => __('Search Shared Content', 'starterkit'),
            'not_found'             => __('Not found', 'starterkit'),
            'not_found_in_trash'    => __('Not found in Trash', 'starterkit'),
            'featured_image'        => __('Logo', 'starterkit'),
            'set_featured_image'    => __('Set featured image', 'starterkit'),
            'remove_featured_image' => __('Remove image', 'starterkit'),
            'use_featured_image'    => __('Use as featured image', 'starterkit'),
            'insert_into_item'      => __('Insert into content', 'starterkit'),
            'uploaded_to_this_item' => __('Uploaded to this content item', 'starterkit'),
            'items_list'            => __('Shared Contents list', 'starterkit'),
            'items_list_navigation' => __('Shared Contents list navigation', 'starterkit'),
            'filter_items_list'     => __('Filter items list', 'starterkit'),
        );
        $rewrite = array(
            'slug'       => 'shared',
            'with_front' => true,
            'pages'      => true,
            'feeds'      => true,
        );
        $args = array(
            'label'               => __('Shared Content', 'starterkit'),
            'description'         => __('Shared Contents', 'starterkit'),
            'labels'              => $labels,
            'rewrite'             => $rewrite,
            'show_in_rest'        => true, // required to enable block editor for this CPT
            'supports'            => array('title', 'revisions', 'editor'),
            'hierarchical'        => false,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 10,
            'menu_icon'           => 'dashicons-share-alt2',
            'show_in_admin_bar'   => true,
            'show_in_nav_menus'   => true,
            'can_export'          => true,
            'has_archive'         => false,
            'exclude_from_search' => false,
            'publicly_queryable'  => true,
            'capability_type'     => 'page',
        );

        register_post_type('shared_content', $args);
    }

    /**
     * Add custom columns to the admin list
     *
     * @param  $columns
     *
     * @return array
     */
    public function add_admin_list_columns($columns): array {
        $one = array_slice($columns, 0, (array_search('title', array_keys($columns))) + 1, true);
        $two = array_diff($columns, $one);

        return array_merge(
            $one,
            array(
                'is_global_footer_content' => 'Global footer content?',
            ),
            $two
        );
    }
}
