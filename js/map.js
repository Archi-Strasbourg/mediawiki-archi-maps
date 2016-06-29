/*jslint browser: true*/
/*global L, GeocoderJS, window*/
var archimap = (function () {
    "use strict";
    return {
        init: function () {
            var div = document.getElementById("archimap");
            var map = L.map(div, {fullscreenControl: true}).setView([48.573392, 7.752353], 13);
            var geo = GeocoderJS.createGeocoder("openstreetmap");
            var layers = {
                "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; Contributeurs d'<a href=\"http://osm.org/copyright\">OpenStreetMap</a>"
                }),
                "Google Maps (satelitte)": new L.Google("SATELLITE"),
                "Google Maps (plan)": new L.Google("ROADMAP")
            };
            map.addLayer(layers.OpenStreetMap);
            map.addControl(new L.Control.Layers(layers, {}));
            geo.geocode(div.dataset.address + ", " + div.dataset.city + ", " + div.dataset.country, function (result) {
                var coords = [result[0].latitude, result[0].longitude];
                L.marker(coords).addTo(map);
                map.setView(coords, 15);
            });
        }
    };
}());
window.addEventListener("load", archimap.init, false);
