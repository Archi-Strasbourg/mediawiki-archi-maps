<?php

namespace ArchiMaps;

class ArchiMaps
{
    public static function addScripts(\OutputPage &$out, \Skin &$skin)
    {
        global $wgScriptPath, $egMapsGMaps3ApiKey;
        if (in_array('ext.maps.leaflet', $out->getModules())) {
            $out->addStyle(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-fullscreen/dist/leaflet.fullscreen.css'
            );
            $out->addScriptFile(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-fullscreen/dist/Leaflet.fullscreen.min.js'
            );
            $out->addScriptFile('https://maps.google.com/maps/api/js?v=3&key='.$egMapsGMaps3ApiKey);
            $out->addScriptFile(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-plugins/layer/tile/Google.js'
            );
            $out->addScriptFile($wgScriptPath.'/extensions/ArchiMaps/js/map.js');
        }
    }
}
