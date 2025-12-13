<?php
namespace Doubleedesign\Comet\WordPress;

class BlockPatternHandler {

    public function __construct() {
        add_filter('should_load_remote_block_patterns', '__return_false');
        add_filter('allowed_block_types_all', [$this, 'disable_block_patterns'], 100, 2);
        add_filter('block_editor_settings_all', [$this, 'remove_patterns_from_inserter']);
        add_action('init', [$this, 'allowed_block_patterns'], 10, 2);
    }

    /**
     * Disable reusable blocks (synced patterns)
     * NOTE: This must run AFTER the filtering in BlockRegistry.php or that will accidentally override this
     *
     * @param  $allowed_block_types
     *
     * @return array
     */
    public function disable_block_patterns($allowed_block_types): array {
        unset($allowed_block_types['core/block']);

        return $allowed_block_types;
    }

    /**
     * More sure patterns are removed from the inserter if they somehow get re-enabled elsewhere
     * because the whole thing doesn't really work for clients -
     * you can create patterns but then to be able to insert them you need to add code,
     * the inserter UI is a bit shit IMO (because of how much it differs from blocks)
     * and I'd rather keep everything in the one Blocks area
     *
     * @param  $editor_settings
     *
     * @return array
     */
    public function remove_patterns_from_inserter($editor_settings): array {
        if (isset($editor_settings['__experimentalFeatures'])) {
            $editor_settings['__experimentalFeatures']['showPatternsList'] = false;
        }

        return $editor_settings;
    }

    /**
     * Make sure core Block Patterns are disabled, so if somehow patterns are re-enabled elsewhere these still won't show
     * Note: Also ensure loading of remote patterns is disabled using add_filter('should_load_remote_block_patterns', '__return_false');
     *
     * @return void
     */
    public function allowed_block_patterns(): void {
        unregister_block_pattern('core/query-offset-posts');
        unregister_block_pattern('core/query-large-title-posts');
        unregister_block_pattern('core/query-grid-posts');
        unregister_block_pattern('core/query-standard-posts');
        unregister_block_pattern('core/query-medium-posts');
        unregister_block_pattern('core/query-small-posts');
    }

}
