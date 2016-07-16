/*jslint browser: true, for: true*/
/*global L, GeocoderJS, window, mw*/
var archimap = (function () {
    "use strict";
    var addresses;
    var map;
    var api;

    function openAddress(e) {
        window.location = mw.config.get("wgArticlePath").replace("$1", e.target.title);
    }

    function setTitle(e) {
        e.target._container.setAttribute("title", e.target.title.replace("Adresse:", ""));
    }

    function addMarker(result) {
        var coords = [result[0].latitude, result[0].longitude];
        L.marker(coords, {clickable: false}).addTo(addresses);
    }

    function addMarkerAndOther(result) {
        var coords = [result[0].latitude, result[0].longitude];
        L.marker(coords, {clickable: false}).addTo(addresses);
        api.get({
            action: "query",
            list: "geosearch",
            gsradius: 10000,
            gscoord: result[0].latitude + "|" + result[0].longitude,
            gsnamespace: 4000,
            gsprimary: "all"
        }).done(function (data) {
            if (data.query.geosearch.length > 1) {
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
                            marker.on("add", setTitle);
                            marker.title = item.title;
                            marker.on("click", openAddress);
                            if (i === data.query.geosearch.length - 1) {
                                map.fitBounds(addresses.getBounds());
                            }
                        }
                    }
                );
            } else {
                map.fitBounds(addresses.getBounds());
            }
        });
    }

    return {
        init: function () {
            var div = document.getElementById("archimap");
            if (div) {
                map = L.map(div, {fullscreenControl: true});
                var geo = GeocoderJS.createGeocoder("openstreetmap");
                var layers = {
                    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "&copy; Contributeurs d'<a href=\"http://osm.org/copyright\">OpenStreetMap</a>"
                    }),
                    "Google Maps (satelitte)": new L.Google("SATELLITE"),
                    "Google Maps (plan)": new L.Google("ROADMAP")
                };
                addresses = L.featureGroup().addTo(map);
                api = new mw.Api();
                var i;
                map.addLayer(layers.OpenStreetMap);
                map.addControl(new L.Control.Layers(layers, {}));
                for (i = 1; i < 10; i += 1) {
                    if (div.dataset["address" + i]) {
                        div.dataset["address" + i] = div.dataset["address" + i].replace("l' ", "l'");
                        div.dataset["address" + i] = div.dataset["address" + i].replace("d' ", "d'");
                        if (i === 1) {
                            geo.geocode(div.dataset["address" + i] + ", " + div.dataset.city + ", " + div.dataset.country, addMarkerAndOther);
                        } else {
                            geo.geocode(div.dataset["address" + i] + ", " + div.dataset.city + ", " + div.dataset.country, addMarker);
                        }
                    }
                }
            }
        }
    };
}());
window.addEventListener("load", archimap.init, false);
