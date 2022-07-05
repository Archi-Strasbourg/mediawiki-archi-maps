/*jslint browser: true, for: true*/
/*global L, window, mw, maps, $*/

const archimap = (function () {
    "use strict";

    const api = new mw.Api();

    /**
     * @param {object} popup
     * @param {string} html
     */
    function addImage(popup, html) {
        popup.setContent(popup.getContent() + html);
        popup.hasImage = true;
    }

    /**
     * @param {string[]} dates
     * @param {object} date
     */
    function addDate(dates, date) {
        dates.push(date.fulltext);
    }

    /**
     * @param {string[]} names
     * @param {object} person
     */
    function addPerson(names, person) {
        // noinspection JSNonASCIINames
        if (person['Métier'].item[0] === 'Architecte') {
            names.push(person['Nom'].item[0].fulltext.replace('Personne:', ''));
        }
    }

    /**
     * @param {object} popup
     * @param {object} data
     */
    function handleAddressInfo(popup, data) {
        const results = Object.values(data.query.results);
        const filename = results[0].printouts['Image principale'][0].fulltext;

        let text = '';

        const dates = [];
        results[0].printouts['Date de construction'].forEach(addDate.bind(null, dates));
        if (dates.length > 0) {
            text += 'Date de construction&nbsp;: ' + dates.join(', ') + '<br/>';
        }

        const names = [];
        results[0].printouts['Personne'].forEach(addPerson.bind(null, names));
        if (names.length > 0) {
            text += 'Architecte&nbsp;: ' + names.join(', ') + '<br/>';
        }

        text += '[[' + filename + '|center|200px]]';

        api.parse(text).done(addImage.bind(null, popup));
    }

    /**
     * @param {object} popup
     * @param {string} title
     * @param {string} html
     * @return {jQuery.Promise|*}
     */
    function insertLink(popup, title, html) {
        popup.setContent(html);

        api.get({
            action: 'ask',
            query: '[[' + 'Adresse:' + title + ']]|?Image principale|?Date de construction|?Personne'
        }).done(handleAddressInfo.bind(null, popup));
    }

    /**
     * @param {object} e
     */
    function customizePopup(e) {
        if (!e.popup.hasImage) {
            /*
            On ne met pas directement le lien dans le JSON généré par Maps
            parce que ça alourdit pas mal le JSON.
             */
            const title = jQuery(e.popup.getContent()).text();

            if (typeof title != 'undefined') {
                api.parse("'''[[" + 'Adresse:' + title + "]]'''").done(insertLink.bind(null, e.popup, title));
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
