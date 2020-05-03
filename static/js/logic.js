// Level 1: Basic Visualization
// Creating map object
var myMap = L.map("map", {
    center: [0,0],
    zoom:2
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v9",
    accessToken: API_KEY,
    fillColor: 'gray',
}).addTo(myMap);

function getColor(magnitude) {
    return magnitude < 1 ? '#5bbd00' :
        magnitude < 2 ? '#b5ff72' :
        magnitude < 3 ? '#f6f578' :
        magnitude < 4 ? '#ffc400' :
        magnitude < 5 ? '#ff9900' :
                        '#ca431d';
}

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson", function (data) {
    let features = data.features;
    if (features) {
        features.forEach(function (feature) {
            if (feature && feature.geometry && feature.properties) {
                let coordinates = feature.geometry.coordinates.splice(0, 2).reverse();
                let magnitude = feature.properties.mag;
                let place = feature.properties.place;
                let type = feature.properties.type;
                let eventDate = new Date(feature.properties.time).toLocaleString();
                let updateDate = new Date(feature.properties.updated).toLocaleString();
                let url = feature.properties.url;
                let status = feature.properties.status;
                let alert = feature.properties.alert || 'N/A';

                L.circle(coordinates, {
                    opacity: 1,
                    fillOpacity: 0.5,
                    color: getColor(magnitude),
                    // fillColor: getColor(magnitude),
                    radius: magnitude * 50000,
                    weight: 1,
                    // stroke: false
                }).bindPopup(
                    `<h4><a href="${url}" target="_blank">${place}</a></h4>\
                    <p><b>Type:</b> ${type}<br>\
                    <b>Maginitude:</b> ${magnitude}<br>\
                    <b>Event Date:</b> ${eventDate}<br>\
                    <b>Update Date:</b> ${updateDate}<br>\
                    <b>Status:</b> ${status}<br>\
                    <b>Alert:</b><span style="color:${alert}"> ${alert}</span></p>`
                    ).addTo(myMap);
            
            }
        })
    }
});

// Level 2: More Data (Optional)
