<?php
namespace Doubleedesign\Comet\WordPress;

class GlobalSettings {
    public function __construct() {
        add_filter('doublee_integrations_settings_fields', [$this, 'add_integrations_settings_fields'], 10, 1);
        add_filter('doublee_integrations_settings_contributors', [$this, 'add_this_plugin_to_integrations_settings_about_tab'], 10, 1);

    }

    /**
     * Add fields to the Global Options provided by the Double-E Design Base Plugin
     * or registered by this one if that one is not active / has not registered the field group.
     *
     * @param  $fields
     *
     * @return array
     */
    public function add_integrations_settings_fields($fields): array {
        $font_awesome_kit_field = array(
            'key'               => 'field_font_awesome_kit',
            'label'             => 'Font Awesome kit code (for icons)',
            'name'              => 'font_awesome_kit',
            'type'              => 'text',
            'instructions'      => 'If your developer has not included this, you can sign up and create a kit at https://fontawesome.com/',
        );

        // Find the "Accounts & Assets" tab
        $index = array_search('Assets', array_column($fields['fields'], 'label'));
        if ($index !== false) {
            // Insert the new field after the tab
            array_splice($fields['fields'], $index + 1, 0, [$font_awesome_kit_field]);
        }
        else {
            // If the tab is not found, just append the field to the end
            $fields['fields'][] = $font_awesome_kit_field;
        }

        return $fields;
    }

    public function add_this_plugin_to_integrations_settings_about_tab($contributors) {
        array_push($contributors, 'Comet Components plugin');

        return $contributors;
    }

}
