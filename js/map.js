/*jslint browser: true, for: true*/
/*global L, window, mw*/
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
                "Google Maps (satelitte)": L.gridLayer.googleMutant({ type: "satellite"}),
                "Google Maps (plan)": L.gridLayer.googleMutant({ type: "roadmap"})
            };
            map.addLayer(layers.OpenStreetMap);
            map.addControl(new L.Control.Layers(layers, {}));
            map.addControl(new L.Control.geocoder());
            var defaultLayer = mw.user.options.get('map-layer');
            if (defaultLayer) {
                layers[defaultLayer].addTo(map);
            }
        },
        pollForMap (time) {
            if ($('#map_leaflet_1').length > 0) {
                if (maps && maps.leafletList[0] && maps.leafletList[0].map) {
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
