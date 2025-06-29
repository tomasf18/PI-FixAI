let map, hexLayer;

const GeoUtils = {
    EARTH_RADIUS_METERS: 6371000,

    radiansToDegrees: (r) => r * 180 / Math.PI,
    degreesToRadians: (d) => d * Math.PI / 180,

    getDistanceOnEarthInMeters: (lat1, lon1, lat2, lon2) => {
        const lat1Rad  = GeoUtils.degreesToRadians(lat1);
        const lat2Rad  = GeoUtils.degreesToRadians(lat2);
        const lonDelta = GeoUtils.degreesToRadians(lon2 - lon1);
        const x = Math.sin(lat1Rad) * Math.sin(lat2Rad) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDelta);
        return GeoUtils.EARTH_RADIUS_METERS * Math.acos(Math.max(Math.min(x, 1), -1));
    }
};

const ZOOM_TO_H3_RES_CORRESPONDENCE = {
    5: 1,
    6: 2,
    7: 3,
    8: 3,
    9: 4,
    10: 5,
    11: 6,
    12: 6,
    13: 7,
    14: 8,
    15: 9,
    16: 9,
    17: 10,
    18: 10,
    19: 11,
    20: 11,
    21: 12,
    22: 13,
    23: 14
};

const H3_RES_TO_ZOOM_CORRESPONDENCE = {};
for (const [zoom, res] of Object.entries(ZOOM_TO_H3_RES_CORRESPONDENCE)) {
    H3_RES_TO_ZOOM_CORRESPONDENCE[res] = zoom;
}

const getH3ResForMapZoom = (mapZoom) => {
    return ZOOM_TO_H3_RES_CORRESPONDENCE[mapZoom] ?? Math.floor((mapZoom - 1) * 0.7);
};

const h3BoundsToPolygon = (lngLatH3Bounds) => {
    lngLatH3Bounds.push(lngLatH3Bounds[0]); // "close" the polygon
    return lngLatH3Bounds;
};

/**
 * Parse the current Query String and return its components as an object.
 */
const parseQueryString = () => {
    const queryString = window.location.search;
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
};

const queryParams = parseQueryString();

const copyToClipboard = (text) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
};

var app = new Vue({
    el: "#app",

    data: {
        searchH3Id: undefined,
        gotoLatLon: undefined,
        currentH3Res: undefined,
        lastResponse: undefined,
    },

    computed: {
    },

    methods: {
        arraysAreEqual: function(arr1, arr2) {
            if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
                return false;
            }
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false; // Found a difference
                }
            }
            return true; // Arrays are identical
        },

        computeAverageEdgeLengthInMeters: function(vertexLocations) {
            let totalLength = 0;
            let edgeCount = 0;
            for (let i = 1; i < vertexLocations.length; i++) {
                const [fromLat, fromLng] = vertexLocations[i - 1];
                const [toLat, toLng] = vertexLocations[i];
                const edgeDistance = GeoUtils.getDistanceOnEarthInMeters(fromLat, fromLng, toLat, toLng);
                totalLength += edgeDistance;
                edgeCount++;
            }
            return totalLength / edgeCount;
        },

        updateMapDisplay: async function() {
            const organization_id = "c62f55eb-4db2-450f-a8d4-df4d88c776b5"
            const response = await fetch("https://pedropinto.info/api/v1/incidents/check-nearby/stats?organization_id=" + organization_id, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const res = await response.json();
            const h3s = res["sight"]
            const incidents = res["incidents"]

            if (this.lastResponse && this.arraysAreEqual(this.lastResponse["incidents"], incidents) && this.arraysAreEqual(this.lastResponse["sight"], h3s)) {
                console.log("No new data");
                return;
            }
            this.lastResponse = res;

            console.log("Updating map with new data");
            console.log(h3s);

            if (hexLayer) {
                hexLayer.remove();
            }

            hexLayer = L.layerGroup().addTo(map);

            const zoom = map.getZoom();
            this.currentH3Res = 14;
            const { _southWest: sw, _northEast: ne} = map.getBounds();

            const boundsPolygon =[
                [ sw.lat, sw.lng ],
                [ ne.lat, sw.lng ],
                [ ne.lat, ne.lng ],
                [ sw.lat, ne.lng ],
                [ sw.lat, sw.lng ],
            ];

            for (const h3id of h3s) {
                
                const polygonLayer = L.layerGroup()
                    .addTo(hexLayer);

                const isSelected = incidents.includes(h3id);
                console.log("isSelected");

                const style = isSelected ? { fillColor: "red" } : {};

                const h3Bounds = h3.cellToBoundary(h3id);
                const averageEdgeLength = this.computeAverageEdgeLengthInMeters(h3Bounds);
                const cellArea = h3.cellArea(h3id, "m2");

                // const tooltipText = `
                // Cell ID: <b>${ h3id }</b>
                // <br />
                // Average edge length (m): <b>${ averageEdgeLength.toLocaleString() }</b>
                // <br />
                // Cell area (m^2): <b>${ cellArea.toLocaleString() }</b>
                // `;

                const h3Polygon = L.polygon(h3BoundsToPolygon(h3Bounds), style)
                    .on('click', () => copyToClipboard(h3id))
                    // .bindTooltip(tooltipText)
                    .addTo(polygonLayer);

                // less SVG, otherwise perf is bad
                if (Math.random() > 0.8 || isSelected) {
                    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
                    svgElement.setAttribute('viewBox', "0 0 200 200");
                    //svgElement.innerHTML = `<text x="20" y="70" class="h3Text">${h3id}</text>`;
                    var svgElementBounds = h3Polygon.getBounds();
                    L.svgOverlay(svgElement, svgElementBounds).addTo(polygonLayer);
                }
            }
        },

        gotoLocation: function() {
            const [lat, lon] = (this.gotoLatLon || "").split(",").map(Number);
            if (Number.isFinite(lat) && Number.isFinite(lon)
                && lat <= 90 && lat >= -90 && lon <= 180 && lon >= -180) {
                map.setView(
                    [lat, lon],
                    undefined, // don't change zoom level
                    { animate: true }
                );
            }
        },

        findH3: function() {
            if (!h3.isValidCell(this.searchH3Id)) {
                return;
            }
            const h3Boundary = h3.cellToBoundary(this.searchH3Id);

            let bounds = undefined;

            for ([lat, lng] of h3Boundary) {
                if (bounds === undefined) {
                    bounds = new L.LatLngBounds([lat, lng], [lat, lng]);
                } else {
                    bounds.extend([lat, lng]);
                }
            }

            map.fitBounds(bounds);

            const newZoom = H3_RES_TO_ZOOM_CORRESPONDENCE[h3.getResolution(this.searchH3Id)];
            map.setZoom(newZoom);
        }
    },

    beforeMount() {
    },

    mounted() {
        document.addEventListener("DOMContentLoaded", () => {
            map = L.map('mapid');

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                minZoom: 5,
                maxNativeZoom: 19,
                maxZoom: 23,
                attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            }).addTo(map);
            pointsLayer = L.layerGroup([]).addTo(map);

            const initialLat = queryParams.lat ?? 40.637752;
            const initialLng = queryParams.lng ?? -8.648732;
            const initialZoom = queryParams.zoom ?? 16;
            map.setView([initialLat, initialLng], initialZoom);

            const { h3 } = queryParams;
            console.log(h3)
            if (h3) {
                this.searchH3Id = h3;
                window.setTimeout(() => this.findH3(), 50);
            }

            this.updateMapDisplay();
            setInterval(() => {
                console.log("updating map display");
                this.updateMapDisplay();
            }, 100); // every second
        });
    }
});
