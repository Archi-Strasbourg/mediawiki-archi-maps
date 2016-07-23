<?php

namespace ArchiMaps;

class ArchiMaps
{
    public static function addScripts(\OutputPage &$out, \Skin &$skin)
    {
        global $wgScriptPath;
        $out->addStyle(
            $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-fullscreen/dist/leaflet.fullscreen.css'
        );
        $out->addScriptFile(
            $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-fullscreen/dist/Leaflet.fullscreen.min.js'
        );
        $out->addScriptFile('https://maps.google.com/maps/api/js?v=3');
        $out->addScriptFile(
            $wgScriptPath.'/extensions/ArchiMaps/bower_components/leaflet-plugins/layer/tile/Google.js'
        );
        $out->addScriptFile($wgScriptPath.'/extensions/ArchiMaps/js/map.js');
    }
}
