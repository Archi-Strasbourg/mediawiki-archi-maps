/*jslint browser: true, for: true*/
/*global L, window, mw, maps, $*/
var archimap = (function () {
    "use strict";

    function init() {
        const map = window.mapsLeafletList[0].map;
        const layers = {
            "OpenStreetMap": new L.tileLayer.provider('OpenStreetMap'),
            "Google Maps (satelitte)": L.gridLayer.googleMutant({type: "satellite"}),
            "Google Maps (plan)": L.gridLayer.googleMutant({type: "roadmap"})
        };
        map.addLayer(layers.OpenStreetMap);
        map.addControl(new L.Control.Layers(layers, {}));
        map.addControl(L.Control.geocoder());
        map.addControl(L.control.locate());

        const defaultLayer = mw.user.options.get("map-layer");
        if (defaultLayer) {
            map.removeLayer(layers.OpenStreetMap);
            layers[defaultLayer].addTo(map);
        }
    }

    return {
        init: init
    };
}());

if (typeof $ === "function") {
    $(document).ready(archimap.init);
} else {
    throw "jQuery is not loaded";
}
