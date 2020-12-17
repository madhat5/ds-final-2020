var express = require('express'), 
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone');
const handlebars = require('handlebars');
var fs = require('fs');
let async = require("async");

const sensorSource = fs.readFileSync("templates/sensor.txt").toString();
var sensortemplate = handlebars.compile(sensorSource, { strict: true });

const pbSource = fs.readFileSync("templates/blog.txt").toString();
var pbtemplate = handlebars.compile(pbSource, { strict: true });

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_UN;
db_credentials.host = process.env.AWSRDS_HT; 
db_credentials.database = process.env.AWSRDS_DB;
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// create templates
var hx = `<html lang="en">

<head>
    <meta charset="utf-8">
    <title>AA Meetings</title>
    <meta name="description" content="Meetings of AA in Manhattan">
    <meta name="author" content="AA">
    <link rel="stylesheet" href="../public/style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
</head>

<body>

    <!-- <div id="mapid"></div> -->

    <div id="map-wrapper">
        <h1>AA: Where are the meetings?</h1>
        <div id="map-content">
            <!-- <div id="mapid"></div> -->
        </div>
        <div id="map-sidebar">
            <div style="width: 100%; ">
                <div style="width: 350px; float: left;">
                    <h2>Data: by meeting location, and closest other meetings(2-3)</h2>
                    <p>
                        In this visualization you'll select a meeting, and view that location along with the other closest meetings.
                    </p>
                    <p>
                        The intended user is one looking for a meeting, but not sure they can go through with it. This gives them an opportunity to walk around/cool off, while still knowing they are in the vicinity of a few other meetings.
                    </p>
                </div>
                <div style="margin-left: 370px; width: 1000px;">
                    <div id="mapid"></div>
                </div>
            </div>
        </div>
        <div id="cleared"></div>
    </div>

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" type="text/javascript"></script> -->
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
        crossorigin=""></script>
    <script>
        let data = 
  `;
  
var jx = `;
        
        var mymap = L.map('mapid').setView([40.734636, -73.994997], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoibWFscGFyc29ucyIsImEiOiJja2k2Y2w1Ym4yam8wMnhxcWtqNjB0NDczIn0.RyKP1V2plcjZxNXTJaN-4A'
        }).addTo(mymap);
        for (var i = 0; i < data.length; i++) {
            L.marker([data[i].lat, data[i].lon]).bindPopup(JSON.stringify(data[i].address)).addTo(mymap);
        }
    </script>
    <script src="/aa.js"></script>
</body>

</html>`;


app.get('/', function(req, res) {
    res.send('<h3>Code demo site</h3><ul><li><a href="/aa">aa meetings</a></li><li><a href="/temperature">temp sensor</a></li><li><a href="/processblog">process blog</a></li></ul>');
}); 

// respond to requests for /aa
app.get('/aa', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings
                 FROM aadatall 
                 WHERE day = ` + dayy + 'and shour >= ' + hourr + 
                 `GROUP BY lat, lon
                 ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

app.get('/temperature', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var q = `SELECT * FROM db-sensor-data;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.end(sensortemplate({ sensordata: JSON.stringify(qres.rows)}));
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
}); 

app.get('/processblog', function(req, res) {
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    let queryArr = [ "108", "122", "135", "151", "152", "161", "173", "190", "197", "198", "199", "203", "220", "225", "244", "246", "255", "256", "274", "277", "283", "294", "298", "300", "309", "315", "321", "323", "330", "333", "381", "388", "394", "399", "417", "421", "433", "447", "448", "461", "463", "468", "477", "485", "488", "493", "501", "512", "513", "533", "557", "578", "582", "586", "595", "601", "608", "621", "635", "638", "648", "649", "707", "714", "724", "726", "736", "750", "761", "762", "764", "782", "799", "812", "831", "843", "845", "860", "869", "886", "888", "912", "914", "920", "927", "953", "957", "962", "963", "995", "1007", "1021", "1022", "1038", "1056", "1063", "1069", "1079", "1089", "1092"]
    let dataArr = [];

    // DynamoDB (NoSQL) query
    // WORKING FOR SINGLE ITEM (CHECK)
    // let params = {
    //     TableName : "processblog-20",
    //     KeyConditionExpression: "pk = :d",
    //     ExpressionAttributeValues: {
    //         ":d": {"N": "108"}
    //     }
    // }
    
    // set loop here
    // add res to empty array
    // keeping item in loop each time, push new items
    // use async https://caolan.github.io/async/v3/docs.html#eachSeries
    // dynamodb.query(params, function(err, data) {
    //     if (err) {
    //         console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    //         throw (err);
    //     }
    //     else {
    //         console.log(data.Items)
    //         res.end(pbtemplate({ pbdata: JSON.stringify(data.Items)})); // goes to callback 
    //         console.log('3) responded to request for process blog data');
    //     }
    // });
    
    // WORKING FOR ALL ITEMS BUT getting 504 timeout...
    async.forEachOf(queryArr, (value, key, callback) => {
        let params = {
            TableName : "processblog-20",
            KeyConditionExpression: "pk = :d",
            ExpressionAttributeValues: {
                ":d": {"N": value}
            }
        }
    
        dynamodb.query(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                throw (err);
            }
            else {
                console.log(data.Items)
                dataArr.push(data.Items)
                // console.log(JSON.stringify(dataArr))
            }
        });
        res.end(pbtemplate({ pbdata: JSON.stringify(dataArr)})); 
    }, err => {
        if (err) console.error(err.message);
        
        // res.end(pbtemplate({ pbdata: JSON.stringify(dataArr)})); 
        console.log('3) responded to request for process blog data');
    });
    
    
});

// serve static files in /public
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// listen on port 8080
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Server listening...');
});