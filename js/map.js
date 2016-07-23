/*jslint browser: true, for: true*/
/*global L, GeocoderJS, window, mw*/
var archimap = (function () {
    'use strict';
    return {
        init: function () {
            var map = maps.leafletList[0].map;
            var OSMlayer;
            maps.leafletList[0].map.eachLayer(
                function (layer) {
                    if (layer._url) {
                        OSMlayer = layer;
                    }
                }
            );
            var layers = {
                "OpenStreetMap": OSMlayer,
                "Google Maps (satelitte)": new L.Google("SATELLITE"),
                "Google Maps (plan)": new L.Google("ROADMAP")
            };
            map.addLayer(layers.OpenStreetMap);
            map.addControl(new L.Control.Layers(layers, {}));
            map.addControl(new L.control.fullscreen());
        },
        pollForMap (time) {
            if ($('#map_leaflet_1').length > 0) {
                if (maps && maps.leafletList[0]) {
                    archimap.init();
                } else {
                    if (!time) {
                        time = 50;
                    }
                    setTimeout(function () {
                        archimap.pollForMap(time * 2)
                    }, time);
                }
            }
        }
    };
}());
window.addEventListener('load', archimap.pollForMap, false);
