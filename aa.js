// console.log('sim sim salabim');

const dotenv = require('dotenv');
// mb = require('mapbox.js');
// const moment = require('moment-timezone'); 

let geoData = require('./data/geoData.json');
// console.log(geoData[0].OutputGeocodes[0].OutputGeocode.Latitude)
// console.log(geoData[30].InputAddress.StreetAddress)
let zoneData = require('./data/allZones.json');
// console.log(zoneData[30].address)

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
    //'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF1MmxoMjZnazNwbW8ya2dsZTRtNyJ9.mJ1kRVrVnwTFNdoKlQu_Cw'
}).addTo(mymap);
for (var i = 0; i < combinedData.length; i++) {
    L.marker([combinedData[i].lat, data[i].lon]).bindPopup(JSON.stringify(data[i].address)).addTo(mymap);
}