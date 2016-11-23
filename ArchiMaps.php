<?php

namespace ArchiMaps;

class ArchiMaps
{
    public static function addScripts(\OutputPage &$out, \Skin &$skin)
    {
        global $wgScriptPath, $egMapsGMaps3ApiKey;
        if (in_array('ext.maps.leaflet', $out->getModules())) {
            $out->addScriptFile('https://maps.google.com/maps/api/js?v=3&key='.$egMapsGMaps3ApiKey);
            $out->addScriptFile(
                $wgScriptPath.'/extensions/ArchiMaps/bower_components/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js'
            );
            $out->addScriptFile($wgScriptPath.'/extensions/ArchiMaps/js/map.js');
        }
    }
}
