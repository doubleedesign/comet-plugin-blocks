<?php
namespace Doubleedesign\Comet\WordPress;
use Doubleedesign\Comet\Core\{Config, Container, ContainerSize, PageSection, Renderable, Utils};

class BlockRenderer {

    public function __construct() {
        add_filter('the_content', [$this, 'clean_up_html'], 10, 1);
        add_filter('render_block', [$this, 'wrap_third_party_blocks'], 10, 2);
    }

    public function clean_up_html($content): string {
        // Remove empty <p> tags that sometimes get added around blocks
        return preg_replace('/<p>(\s|&nbsp;)*<\/p>/', '', $content);
    }

    /**
     * Wrap third-party blocks with Comet components for consistent theming and layout
     * if a render file exists in blocks/third-party/{block-name}/render.php.
     * Works in conjunction with Comet attributes being added to the block in BlockRegistry.php AND block-registry.js.
     *
     * Note: For Ninja Forms, this doesn't work out of the box in the editor
     * - we need to do some customisation to editor rendering in block-registry.js.
     * This may be similar for some other third-party blocks.
     *
     * TODO: Add documentation for this in README.md and/or Comet docs site.
     *
     * @param  $block_content
     * @param  $block
     *
     * @return string
     */
    public function wrap_third_party_blocks($block_content, $block): string {
        $block_file = __DIR__ . "/blocks/third-party/{$block['blockName']}/render.php";

        if (file_exists($block_file)) {
            ob_start();
            include $block_file;

            return ob_get_clean();
        }

        return $block_content;
    }

    /**
     * Wrap the given component in a PageSection if it is not nested, has a section background, or has a size set.
     *
     * @param  array  $attributes  - The block attributes
     * @param  Renderable  $component
     *
     * @return PageSection|Renderable
     */
    public static function maybe_wrap_component(array $attributes, Renderable $component): PageSection|Renderable {
        if (method_exists($component, 'get_is_nested')) {
            if ($component->get_is_nested()) {
                return $component;
            }
        }

        // Some default attributes don't come through when acf_render_block is called to render a block within a block
        // (e.g., shared content blocks in the editor), so we need to put them back in to ensure correct rendering
        $defaults = Config::getInstance()->get_component_defaults($component->get_name());
        $section_bg = $attributes['sectionBackground'] ?? $defaults['sectionBackground'] ?? null;
        $size = $attributes['size']; // Some cases like 'image-row' where the *block* supports size, but the Comet Component in it doesn't directly, thus wrapping it
        $supports_container_size = method_exists($component, 'get_size');
        if ($supports_container_size) {
            $size = $attributes['size'] ?? $defaults['size'] ?? ContainerSize::DEFAULT;
        }

        // But also, we don't want redundant section backgrounds
        $section_bg_to_use = $section_bg;
        if ($section_bg_to_use === Config::getInstance()->get_global_background()) {
            $section_bg_to_use = null;
        }

        if (isset($section_bg) || isset($size)) {
            return new PageSection([
                'backgroundColor' => $section_bg_to_use,
                'size'            => $size,
            ], [$component]);
        }

        return $component;
    }

    /**
     * Render the editor (or placeholder) for blocks that have inner blocks.
     *
     * @param  array  $block
     * @param  \WP_Block_List|null  $innerblocks
     * @param  bool  $is_editor
     *
     * @return bool
     */
    public static function maybe_render_innerblocks_editor(array $block, ?\WP_Block_List $innerblocks, bool $is_editor): bool {
        if (!$is_editor) {
            return false;
        }
        if (!$block['supports']['innerBlocks'] || empty($block['allowed_blocks'])) {
            return false;
        }

        $allowedBlocks = json_encode($block['allowed_blocks'], JSON_UNESCAPED_SLASHES);
        $prioritisedBlocks = json_encode(['comet/copy'], JSON_UNESCAPED_SLASHES);
        $placeholder = "Click here to start adding content to the {$block['title']}";

        // Prepare class name for the InnerBlocks container to match what the block will have on the front-end
        $name = str_replace('comet/', '', $block['name']);
        $class = "{$name}";

        // Handle block attributes
        $attributeKeys = array_filter(array_keys($block['attributes'] ?? []), fn($key) => !in_array($key, ['align', 'isParent', 'mode', 'name', 'data', 'size', 'sectionBackground']));
        $attributes = Utils::array_pick($block, $attributeKeys);
        $transformedAttrs = array_reduce(array_keys($attributes), function($result, $key) use ($attributes, $innerblocks) {
            if (in_array($key, ['hAlign', 'vAlign'])) {
                $result["data-{$key}"] = $attributes[$key];

                return $result;
            }

            if ($key === 'backgroundColor') {
                $result["data-background"] = $attributes[$key];

                return $result;
            }

            if ($key === 'qty') {
                $result["data-cols"] = $attributes[$key];
                $result["data-count"] = isset($innerblocks) ? $innerblocks->count() : 1;

                return $result;
            }

            $htmlKey = "data-" . Utils::kebab_case($key);
            $result[$htmlKey] = $attributes[$key];

            return $result;
        }, []);
        $transformedAttrs = self::associative_array_to_string_for_html_attributes($transformedAttrs);
        $wrapperAttrs = self::associative_array_to_string_for_html_attributes([
            'data-size'       => $block['size'] ?? null,
            'data-background' => $block['sectionBackground'] ?? null
        ]);

        $innerBlocksEditor = "<InnerBlocks allowedBlocks={$allowedBlocks} prioritizedInserterBlocks={$prioritisedBlocks} placeholder=\"{$placeholder}\" />";
        // We can add a class name to <InnerBlocks> but unfortunately not attributes, thus the extra wrapper
        echo <<<HTML
			<div class='$name-wrapper' $wrapperAttrs>
				<div class='$class' $transformedAttrs>
					$innerBlocksEditor
				</div>
			</div>
		HTML;

        return true;
    }

    private static function associative_array_to_string_for_html_attributes(array $attributes): string {
        return implode(' ', array_map(function($key) use ($attributes) {
            if (is_bool($attributes[$key])) {
                return $attributes[$key] ? $key : '';
            }

            return "{$key}=\"{$attributes[$key]}\"";
        }, array_keys($attributes)));
    }

    /**
     * Determine if we can render a block with its innerblocks on the front-end.
     *
     * @param  $wp_block
     *
     * @return bool
     */
    public static function ready_to_render_innerblocks_frontend($wp_block): bool {
        if (!isset($wp_block)) {
            return false;
        }
        if (!function_exists('acf_render_block')) {
            return false;
        }

        $innerBlocks = $wp_block->inner_blocks;
        if (isset($innerBlocks) && $innerBlocks->count() === 0) {
            return false;
        }

        return true;
    }

    /**
     * Return early in the editor if the block content is empty,
     * because that will trigger the built-in placeholder rather than a zero-height block of nothing.
     * This should be used directly in block render templates,
     * which have access to a $is_preview variable to pass in $is_editor like so:
     * $is_editor = isset($is_preview) && $is_preview;
     *
     * @param  array  $block
     * @param  bool  $is_editor
     *
     * @return bool
     */
    public static function maybe_render_editor_placeholder(array $block, bool $is_editor): bool {
        if (!$is_editor) {
            return false;
        }

        $filtered_data = self::filter_fields_for_determining_if_block_has_content($block['data'] ?? []);

        return self::block_data_array_is_effectively_empty($filtered_data);
    }

    private static function filter_fields_for_determining_if_block_has_content(array $data): array {
        // The $data array of an ACF block contains the field names prefixed with an underscore with the field key as the value.
        // We don't want that for this, so filter them out first.
        $filtered_data = array_filter($data, function($key) {
            return !str_starts_with($key, '_');
        }, ARRAY_FILTER_USE_KEY);

        // Also skip some fields with default values
        $filtered_data = array_filter($filtered_data, function($key) {
            return !str_ends_with($key, 'aspect_ratio')
                && !str_ends_with($key, 'focal_point')
                && !str_ends_with($key, 'image_offset')
                && !str_contains($key, 'button');
        }, ARRAY_FILTER_USE_KEY);

        return $filtered_data;
    }

    private static function block_data_array_is_effectively_empty(array $filtered_data): bool {
        $non_empty_values = array_filter($filtered_data, function($value) {
            if (is_array($value)) {
                $sub_filtered = self::filter_fields_for_determining_if_block_has_content($value);

                return !self::block_data_array_is_effectively_empty($sub_filtered);
            }
            if (is_string($value)) {
                return trim($value) !== '' && trim($value) !== '0';
            }
            if (is_numeric($value)) {
                return $value < 1;
            }

            return !empty($value);
        });

        return count($non_empty_values) === 0;
    }

    public static function transform_block_data_to_acf_style_result(?array $field_data, string $prefix) {
        if ($field_data === null || !is_array($field_data) || count($field_data) === 0) {
            return $field_data;
        }

        // Remove the $prefix from the field keys
        return array_reduce(array_keys($field_data), function($result, $key) use ($field_data, $prefix) {
            $short_key = str_replace($prefix, '', $key);
            $result[$short_key] = $field_data[$key];

            return $result;
        }, []);
    }
}
