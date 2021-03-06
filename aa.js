// console.log('sim sim salabim');

const dotenv = require('dotenv');
let fs = require('fs');
// const moment = require('moment-timezone'); 

let geoData = require('./data/geoData.json');
// console.log(geoData[0].OutputGeocodes[0].OutputGeocode.Latitude)
// console.log(geoData[30].InputAddress.StreetAddress)
let zoneData = require('./data/allZones.json');
// console.log(zoneData[30].address)
let newGeoData = require('./data/newGeoData.json');
console.log(newGeoData)
// $.getJSON("./data/newGeoData.json", (json) => {
//     console.log(json); // this will show the info it in firebug console
// });


let combinedData = geoData.map((d, i) => {
    return {
        lat: geoData[i].OutputGeocodes[0].OutputGeocode.Latitude,
        lon: geoData[i].OutputGeocodes[0].OutputGeocode.Longitude,
        name: zoneData[i].locationName,
        address: geoData[i].InputAddress.StreetAddress,
        origAddress: zoneData[i].address,
    }
})
// console.log(combinedData)
function writeFile(fsName, fsData) {
    fs.writeFileSync('data/' + fsName + '.json', JSON.stringify(fsData));
    console.log('*** *** *** *** ***');
    console.log('writeFile complete for', fsName);
};
// writeFile('newGeoData', combinedData);

// ==================================================


dotenv.config();
const API_KEY = process.env.MAPBOX_KEY;
const API_URL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'


var mymap = L.map('mapid').setView([40.734636, -73.994997], 13);
L.tileLayer(API_URL, {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
}).addTo(mymap);
for (var i = 0; i < newGeoData.length; i++) {
    L.marker([newGeoData[i].lat, newGeoData[i].lon]).bindPopup(JSON.stringify(newGeoData[i].name)).addTo(mymap);
}