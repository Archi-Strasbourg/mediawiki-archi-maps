/*jslint browser: true, for: true*/
/*global L, window, mw, maps, $*/
var archimap = (function () {
    "use strict";

    const api = new mw.Api();

    /**
     * @param {object} e
     */
    function customizePopup(e) {
        if (!e.popup.hasImage) {
            const title = jQuery(e.popup.getContent()).find('a').attr('title');
            if (typeof title != 'undefined') {
                api.get({
                    action: 'ask',
                    query: '[[' + title + ']]|?Image principale'
                    // Obligé de faire des fonctions anonymes pour garder la référence au popup.
                }).done(
                    /**
                     * @param {object} data
                     */
                    function (data) {
                        const results = Object.values(data.query.results);
                        const filename = results[0].printouts['Image principale'][0].fulltext;

                        api.get({
                            action: 'parse',
                            contentmodel: 'wikitext',
                            text: '[[' + filename + '|center|200px]]'
                        }).done(
                            /**
                             * @param {object} result
                             */
                            function addImage(result) {
                                e.popup.setContent(e.popup.getContent() + result.parse.text['*']);
                                e.popup.hasImage = true;
                            }
                        );
                    }
                );
            }
        }
    }

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

        map.on('popupopen', customizePopup);
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
