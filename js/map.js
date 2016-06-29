/*jslint browser: true*/
/*global L, GeocoderJS, window, mw*/
var archimap = (function () {
    "use strict";
    function openAddress(e) {
        window.location = mw.config.get("wgArticlePath").replace("$1", e.target.title);
    }
    return {
        init: function () {
            var div = document.getElementById("archimap");
            if (div) {
                var map = L.map(div, {fullscreenControl: true});
                var geo = GeocoderJS.createGeocoder("openstreetmap");
                var layers = {
                    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "&copy; Contributeurs d'<a href=\"http://osm.org/copyright\">OpenStreetMap</a>"
                    }),
                    "Google Maps (satelitte)": new L.Google("SATELLITE"),
                    "Google Maps (plan)": new L.Google("ROADMAP")
                };
                var api = new mw.Api();
                var addresses = L.featureGroup().addTo(map);
                map.addLayer(layers.OpenStreetMap);
                map.addControl(new L.Control.Layers(layers, {}));
                geo.geocode(div.dataset.address + ", " + div.dataset.city + ", " + div.dataset.country, function (result) {
                    var coords = [result[0].latitude, result[0].longitude];
                    L.marker(coords, {clickable: false}).addTo(addresses);
                    api.get({
                        action: "query",
                        list: "geosearch",
                        gsradius: 10000,
                        gscoord: result[0].latitude + "|" + result[0].longitude,
                        gsnamespace: 4000
                    }).done(function (data) {
                        data.query.geosearch.forEach(
                            function (item, i) {
                                if (item.title.replace("Adresse:", "") !== mw.config.get("wgTitle")) {
                                    var marker = L.circle(
                                        item,
                                        5,
                                        {
                                            title: item.title.replace("Adresse:", "")
                                        }
                                    ).addTo(addresses);
                                    marker.title = item.title;
                                    marker.on("click", openAddress);
                                    if (i === data.query.geosearch.length - 1) {
                                        map.fitBounds(addresses.getBounds());
                                    }
                                }
                            }
                        );
                    });
                });
            }
        }
    };
}());
window.addEventListener("load", archimap.init, false);
