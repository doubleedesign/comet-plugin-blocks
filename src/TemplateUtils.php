<?php
namespace Doubleedesign\Comet\WordPress;
use Doubleedesign\Comet\Core\{Card, CardList, Config, Heading, Utils};

class TemplateUtils {

    /**
     * Create a CardList component from an array of post IDs.
     *
     * @param  array  $postIds
     * @param  array  $block  - The block attributes to extract data and attributes from
     *
     * @return CardList
     */
    public static function create_card_list(array $postIds, array $block): CardList {
        $cards = array_map(function($post_id) use ($postIds, $block) {
            $heading = get_the_title($post_id);
            $bodyText = get_the_excerpt($post_id) ?? '';
            $imageUrl = get_the_post_thumbnail_url($post_id, 'large') ?: '';
            $imageAlt = get_post_meta(get_post_thumbnail_id($post_id), '_wp_attachment_image_alt', true);
            $link = ['href' => get_permalink($post_id), 'content' => 'Read more'];

            // If there is only one, put the section heading inside the card after making some adjustments to it
            if (count($postIds) == 1) {
                $aboveContent = [new Heading(
                    ['classes' => ['is-style-small']],
                    self::singularise($block['data']['heading']) ?? 'Featured Post'
                )];
            }

            return new Card([
                'tagName'           => 'div',
                'heading'           => $heading,
                'bodyText'          => $bodyText,
                'image'             => [
                    'src'   => $imageUrl,
                    'alt'   => $imageAlt,
                ],
                'link'              => [
                    'href'      => $link['href'],
                    'content'   => $link['content'],
                    'isOutline' => true
                ],
                'colorTheme'        => $block['colorTheme'] ?? 'primary',
                'orientation'       => 'horizontal', // TODO: Make this configurable
                'cardAsLink'        => apply_filters('comet_blocks_related_content_card_list_card_as_link', false),
            ], $aboveContent ?? []);
        }, $postIds);

        $behaviour_when_fewer_than_max = apply_filters('comet_blocks_related_content_card_list_behaviour_when_fewer_than_max', 'default');
        $default_max_per_row = Config::getInstance()->get_component_defaults('card-list')['maxPerRow'] ?? 3;
        $max_per_row = apply_filters('comet_blocks_related_content_max_per_row', $default_max_per_row);
        if ($behaviour_when_fewer_than_max === 'expand') {
            $cardCount = count($cards);
            if ($cardCount < $default_max_per_row) {
                $max_per_row = $cardCount;
            }
        }

        return new CardList(
            [
                ...Config::getInstance()->get_component_defaults('card-list'),
                ...Utils::array_pick($block, ['size', 'colorTheme', 'backgroundColor', 'hAlign', 'layout']),
                'shortName' => str_replace('comet/', '', $block['name']),
                'heading'   => (count($postIds) > 1 && !empty($block['data']['heading'])) ? $block['data']['heading'] : null,
                'maxPerRow' => $max_per_row
            ],
            $cards
        );
    }

    public static function singularise(?string $text): string {
        if ($text === null) {
            return '';
        }

        $words = explode(' ', $text);
        $lastWord = array_pop($words);

        if (str_ends_with($lastWord, 'ies')) {
            $lastWord = substr($lastWord, 0, -3) . 'y';
        }
        elseif (str_ends_with($lastWord, 's')) {
            $lastWord = substr($lastWord, 0, -1);
        }

        $words[] = $lastWord;

        return implode(' ', $words);
    }
}
