const express = require('express');
//const xml2js = require('xml2js');
const request = require('request');
const dartStops = require('dartStops');
//const parser =  xml2js.parseString
var parseString = require('xml2js').parseString;



const accountSid = 'ACd2e8ba7e18fe4d57bbac54afab8a5014';
const authToken = '55b6750e02a76cc0705147d66a6155d7';

// require the Twilio module and create a REST client

const app = express();

const port = 3000;
console.log(dartStops)

app.listen(port, () => {
  console.log('server on port 3000');
})

//function parseXmlfromIrishRail(xml, )

app.get('/api/stations', (req, res) => {
    request('http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D', (err, Apires, body) => {
    if (err) { return console.log(err); }
    parseString(body , (err , jsRes) => {
        stations = jsRes.ArrayOfObjStation.objStation;
        stationList = []
        stations.forEach(function (station){
          stationList.push(station.StationDesc[0]);
        })
        console.log(stationList);
        res.send(stationList);
    })
  });
})


app.get('/api/times/:name' , (req, res) => {

  request('http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=' + req.params.name, (err, Apires, body) => {
  if (err) { return console.log(err); }
  parseString(body , (err , jsRes) => {
      trains = jsRes.ArrayOfObjStationData.objStationData;
      trainList = []
      trains.forEach(function (train){
        trainObj = {
          Direction : train.Direction,
          Origin : train.Origin,
          Destination : train.Destination,
          Lastlocation : train.Lastlocation,
          Status : train.Status,
          Duein : train.Duein,
          Exparrival : train.Exparrival,
          Schdepart : train.Schdepart
          }
          trainList.push(trainObj);
        })
      res.send(trainList);
    })
});

})

app.get('/', (req, res) => {
  res.sendfile('index.html')
})
