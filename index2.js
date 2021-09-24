const { nextISSTimesForMyLocation } = require("./iss_promised");

// testing how it works
// fetchMyIP()
//   .then((ip) => {
//     console.log(ip);
//     fetchCoordsByIP(ip)
//       .then(coords => {
//         console.log(coords);
//         fetchISSFlyOverTimes(coords)
//           .then(responses => {
//             console.log(responses);
//           })
//       });
//   });

const printPassTimes = function (passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });