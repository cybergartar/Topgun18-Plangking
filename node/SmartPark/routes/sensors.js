var express = require("express");
var router = express.Router();

var temperature = require("../controllers/TemperatureController.js");
var accelerometer = require("../controllers/AccelerometerController.js");
var din1 = require("../controllers/Din1Controller.js");

router.get("/sensor_get", function(req, res) {
  var sensor = req.query.sensor;
  var start_time = req.query.starttime;
  var end_time = req.query.stoptime;
  switch (sensor) {
    case "temperature":
      temperature.filterRange(start_time, end_time, function(temperature) {
        res.json({ result: splitTeam(temperature) });
      });
      break;
    case "accelerometer":
      accelerometer.filterRange(start_time, end_time, function(accelerometer) {
        res.json({ result: splitTeamXYZ(accelerometer) });
      });
      break;
    case "din1":
      din1.filterRange(start_time, end_time, function(din1) {
        res.json({ result: splitTeam(din1) });
      });
      break;
    default:
      console.log("Bad access /sensor_get");
      break;
  }
});

router.get("/list/:sensor", function(req, res) {
  var sensor = req.params.sensor;

  switch (sensor) {
    case "temperature":
      temperature.list(req, res);
      break;
    case "accelerometer":
      accelerometer.list(req, res);
      break;
    case "din1":
      din1.list(req, res);
      break;
    default:
      console.log("No " + sensor);
      break;
  }
});

function splitTeam(teamArray) {
  var allTable = [];
  var lastTeam = 0;
  teamArray.sort((a, b) => a.teamID - b.teamID);
  for (var i = 0; i < teamArray.length; i++) {
    if (teamArray[i].teamID != lastTeam) {
      allTable.push({
        sensor: "temperature",
        teamName: teamName[teamArray[i].teamID],
        teamID: teamArray[i].teamID,
        keys: ["sensID", "val", "date"],
        data: [teamArray[i]]
      });
    } else {
      allTable[allTable.length - 1].data.push(teamArray[i]);
    }
    lastTeam = teamArray[i].teamID;
  }
  return allTable;
}

function splitTeamXYZ(teamArray) {
  var allTable = [];
  var lastTeam = 0;
  teamArray.sort((a, b) => a.teamID - b.teamID);
  for (var i = 0; i < teamArray.length; i++) {
    if (teamArray[i].teamID != lastTeam) {
      allTable.push({
        sensor: "accelerometer",
        teamName: teamName[teamArray[i].teamID],
        teamID: teamArray[i].teamID,
        keys: ["sensID", "val_x", "val_y", "val_z", "date"],
        data: [teamArray[i]]
      });
    } else {
      allTable[allTable.length - 1].data.push(teamArray[i]);
    }
    lastTeam = teamArray[i].teamID;
  }
  return allTable;
}

module.exports = router;
