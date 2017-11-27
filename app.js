const express = require('express');
//const xml2js = require('xml2js');
const request = require('request');
//const parser =  xml2js.parseString
var parseString = require('xml2js').parseString;




const app = express();

const port = 3000;


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
        res.send(stationList);
    })
  });
})

http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=Bayside


app.get('/api/times/:name' , (req, res) => {
  console.log(req.params.name)
  request('http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=' + req.params.name, (err, Apires, body) => {
  if (err) { return console.log(err); }
  parseString(body , (err , jsRes) => {
      trains = jsRes.ArrayOfObjStationData.objStationData;
      console.log(trains)
      trainList = []
      trains.forEach(function (train){
        trainObj = {
          Direction : train.Direction,
          Origin : train.Origin,
          Destination : train.Destination,
          Lastlocation : train.Lastlocation,
          Status : train.Status,
          Duein : train.Duein,
          Exparrival : train.Exparrival
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
