<?php
/**
 * ArchiMaps class.
 */

namespace ArchiMaps;

/**
 * Add missing features to Leaflet maps.
 */
class ArchiMaps
{
    /**
     * Add scripts to <head>.
     *
     * @param \OutputPage $out HTML output
     */
    public static function addScripts(\OutputPage &$out)
    {
        global $wgScriptPath, $egArchiMapsGMapsKey;
        if (in_array('ext.maps.leaflet', $out->getModules())) {
            $out->addScriptFile('https://maps.google.com/maps/api/js?v=3&key='.$egArchiMapsGMapsKey);
            $out->addScriptFile(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js'
            );
            $out->addScriptFile(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-control-geocoder/dist/Control.Geocoder.js'
            );
            $out->addStyle(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-control-geocoder/dist/Control.Geocoder.css'
            );
            $out->addScriptFile($wgScriptPath.'/extensions/ArchiMaps/js/map.js');
        }
    }

    public static function addPreferences(\User $user, array &$preferences)
    {
        $selectedLayer = $user->getOption('map-layer');
        if (!isset($selectedLayer)) {
            $selectedLayer = 'OpenStreetMap';
        }
        $preferences['map-layer'] = [
            'type' => 'radio',
            'label-message' => 'map-layer',
            'section' => 'rendering/advancedrendering',
            'options' => [
                'OpenStreetMap'=>'OpenStreetMap',
                'Google Maps (satelitte)'=>'Google Maps (satelitte)',
                'Google Maps (plan)'=>'Google Maps (plan)',
            ],
            'default' => $selectedLayer
        ];

        return true;
    }
}
