/*jslint browser: true, for: true*/
/*global L, window, mw, maps, $*/
var archimap = (function () {
    "use strict";

    function init() {
        var map = maps.leafletList[0].map;
        var OSMlayer;
        map.eachLayer(
            function (layer) {
                if (layer._url) {
                    OSMlayer = layer;
                }
            }
        );
        var layers = {
            "OpenStreetMap": OSMlayer,
            "Google Maps (satelitte)": L.gridLayer.googleMutant({type: "satellite"}),
            "Google Maps (plan)": L.gridLayer.googleMutant({type: "roadmap"})
        };
        map.addLayer(layers.OpenStreetMap);
        map.addControl(new L.Control.Layers(layers, {}));
        map.addControl(L.Control.geocoder());
        var defaultLayer = mw.user.options.get("map-layer");
        if (defaultLayer) {
            map.removeLayer(layers.OpenStreetMap);
            layers[defaultLayer].addTo(map);
        }
    }

    function pollForMap(e, time) {
        if ($("#map_leaflet_1").length > 0) {
            if (maps && maps.leafletList[0] && maps.leafletList[0].map) {
                init();
            } else {
                if (!time) {
                    time = 50;
                }
                setTimeout(function () {
                    pollForMap(e, time * 2);
                }, time);
            }
        }
    }

    return {
        pollForMap: pollForMap
    };
}());

if (typeof $ === "function") {
    $(document).ready(archimap.pollForMap);
} else {
    throw "jQuery is not loaded";
}
