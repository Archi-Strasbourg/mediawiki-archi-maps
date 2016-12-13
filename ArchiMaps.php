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
        global $wgScriptPath, $egMapsGMaps3ApiKey;
        if (in_array('ext.maps.leaflet', $out->getModules())) {
            $out->addScriptFile('https://maps.google.com/maps/api/js?v=3&key='.$egMapsGMaps3ApiKey);
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
}
