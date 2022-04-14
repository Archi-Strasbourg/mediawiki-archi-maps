<?php
/**
 * ArchiMaps class.
 */

namespace ArchiMaps;

use OutputPage;

/**
 * Add missing features to Leaflet maps.
 */
class ArchiMaps
{
    /**
     * Add scripts to <head>.
     *
     * @param OutputPage $out HTML output
     */
    public static function addScripts(OutputPage &$out)
    {
        global $egArchiMapsGMapsKey;
        // Only load the scripts if the Leaflet module is available on this page
        if (in_array('ext.maps.leaflet.loader', $out->getModules())
            || $out->getTitle()->getFullText() == 'Spécial:RunQuery/Recherche avancée'
        ) {
            $out->addScriptFile('https://maps.google.com/maps/api/js?v=3&key=' . $egArchiMapsGMapsKey);
            $out->addModules('ext.archimaps');
        }
    }

    public static function addPreferences(\User $user, array &$preferences)
    {
        $selectedLayer = $user->getOption('map-layer');
        if (!isset($selectedLayer)) {
            $selectedLayer = 'OpenStreetMap';
        }
        $preferences['map-layer'] = [
            'type'          => 'radio',
            'label-message' => 'map-layer',
            'section'       => 'rendering/advancedrendering',
            'options'       => [
                'OpenStreetMap'          => 'OpenStreetMap',
                'Google Maps (satelitte)'=> 'Google Maps (satelitte)',
                'Google Maps (plan)'     => 'Google Maps (plan)',
            ],
            'default' => $selectedLayer,
        ];

        return true;
    }
}
