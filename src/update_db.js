'use strict';

// Input Vars
var cmdArgs = process.argv.slice(2);

switch (cmdArgs[0]) {
case 'debug':
  var debugSqliteFile = '/Users/scott/Projects/personal/wdw_wait_times/.vscode/test/wdw_wait_times.db';
  break;
}

// Constants
const moment = require('moment-timezone');
const Themeparks = require("themeparks");
const sqlite3 = require('sqlite3');
const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
const DisneyWorldEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
const DisneyWorldHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
const DisneyWorldAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();

var sqliteFile = debugSqliteFile || '/db/wdw_wait_times.db';
Themeparks.Settings.Cache = __dirname + "/themeparks.db";

// Update wait times DB Table
function UpdateWaitTimes () {
  let currTime = moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:[00.000]');
  var mkTimes = [];
  var epTimes = [];
  var hsTimes = [];
  var akTimes = [];
  
  DisneyWorldMagicKingdom.GetWaitTimes().then((rideTimes) => {
    rideTimes.forEach((ride) => {
      if (ride.waitTime == null) {
        ride.waitTime = 0;
      }
      mkTimes.push(
        {
          "park": "Magic Kingdom",
          "name": ride.name.replace(' - Temporarily Unavailable','').replace(/["]/g,''),
          "wait_time": ride.waitTime,
        }
      );
    });
  }).catch((error) => {
    console.error(error);
  }).then(() => {
    let db = new sqlite3.Database(sqliteFile);
    mkTimes.forEach(ride => {
      db.run(`INSERT INTO wdw_wait_times (park, name, wait_time, timestamp) VALUES ("${ride.park}", "${ride.name}", ${ride.wait_time}, "${currTime}");`,[],function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
    });
    db.close();
  });
  DisneyWorldEpcot.GetWaitTimes().then((rideTimes) => {
    rideTimes.forEach((ride) => {
      if (ride.waitTime == null) {
        ride.waitTime = 0;
      }
      epTimes.push(
        {
          "park": "Epcot",
          "name": ride.name.replace(' - Temporarily Unavailable','').replace(/["]/g,''),
          "wait_time": ride.waitTime,
        }
      );
    });
  }).catch((error) => {
    console.error(error);
  }).then(() => {
    let db = new sqlite3.Database(sqliteFile);
    epTimes.forEach(ride => {
      db.run(`INSERT INTO wdw_wait_times (park, name, wait_time, timestamp) VALUES ("${ride.park}", "${ride.name}", ${ride.wait_time}, "${currTime}");`,[],function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
    });
    db.close();
  });
  DisneyWorldHollywoodStudios.GetWaitTimes().then((rideTimes) => {
    rideTimes.forEach((ride) => {
      let sql = `INSERT INTO wdw_wait_times ("park", "name", "wait_time", "timestamp") VALUES ("${ride.name}", "Hollywood Studios", ${ride.waitTime}, "${currTime}");`
      if (ride.waitTime == null) {
        ride.waitTime = 0;
      }
      hsTimes.push(
        {
          "park": "Hollywood Studios",
          "name": ride.name.replace(' - Temporarily Unavailable','').replace(/["]/g,''),
          "wait_time": ride.waitTime,
        }
      );
    });
  }).catch((error) => {
    console.error(error);
  }).then(() => {
    let db = new sqlite3.Database(sqliteFile);
    hsTimes.forEach(ride => {
      db.run(`INSERT INTO wdw_wait_times (park, name, wait_time, timestamp) VALUES ("${ride.park}", "${ride.name}", ${ride.wait_time}, "${currTime}");`,[],function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
    });
    db.close();
  });
  DisneyWorldAnimalKingdom.GetWaitTimes().then((rideTimes) => {
    rideTimes.forEach((ride) => {
      if (ride.waitTime == null) {
        ride.waitTime = 0;
      }
      akTimes.push(
        {
          "park": "Animal Kingdom",
          "name": ride.name.replace(' - Temporarily Unavailable','').replace(/["]/g,''),
          "wait_time": ride.waitTime,
        }
      );
    });
  }).catch((error) => {
    console.error(error);
  }).then(() => {
    let db = new sqlite3.Database(sqliteFile);
    akTimes.forEach(ride => {
      db.run(`INSERT INTO wdw_wait_times (park, name, wait_time, timestamp) VALUES ("${ride.park}", "${ride.name}", ${ride.wait_time}, "${currTime}");`,[],function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
    });
    db.close();
  })
};

UpdateWaitTimes();