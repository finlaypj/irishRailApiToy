const http = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const request = require('request');
var parseString = require('xml2js').parseString;

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();

const dartStops = [ 'Malahide','Portmarnock','Clongriffin','Sutton','Bayside','Howth Junction','Howth','Kilbarrack','Raheny','Harmonstown','Killester','Clontarf Road','Dublin Connolly','Tara Street','Dublin Pearse','Grand Canal Dock','Lansdowne Road','Sandymount','Sydney Parade','Booterstown','Blackrock','Seapoint','Salthill','Dun Laoghaire','Sandycove','Glenageary','Dalkey','Killiney','Shankill','Bray','Greystones','Kilcoole' ]


app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sms', function (req, res) {
  const body = req.body.Body
  if(body == 'All')
  {
    stops = "Dart stops available: "
    dartStops.forEach(function(stop_i){
      stops = stops + stop_i + ",\n"
    });
    res.set('Content-Type', 'text/plain');
    res.send(stops);

  }
  else if(dartStops.includes(body)){
    trainsMessageN = "Northbound - The next trains are due in:";
    trainsMessageS = "\nSouthbound - The next trains are due in:";
    request('http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=' + 'Blackrock', (err, Apires, body) => {
    if (err) { return console.log(err); }
    parseString(body , (err , jsRes) => {
        trains = jsRes.ArrayOfObjStationData.objStationData;
        trainsMessage =
        trains.forEach(function (train){
            if(train.Direction == 'Northbound')
            {
              trainsMessageN = trainsMessageN + " " + train.Duein + "mins,";
            }
            else
            {
              trainsMessageS = trainsMessageS + " " + train.Duein + "mins,";
            }
          })
          res.set('Content-Type', 'text/plain');
          res.send(trainsMessageN + trainsMessageS);
      })
    })
  }
  else
  {
    res.set('Content-Type', 'text/plain');
    res.send("Sorry, Couldn't find the station you're looking for!");
  }

})






app.post('/', (req, res) => {
  text = req.body.Body;
  console.log(req)
  console.log(text)


  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
