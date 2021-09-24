const request = require('request-promise-native');

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json");
}

/* 
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function (unParsedIp) {

  const ip = JSON.parse(unParsedIp).ip;
  return request(`https://freegeoip.app/json/${ip}`)
    .then(obj => {
      const coords = JSON.parse(obj);

      const latitude = coords.latitude;
      const longitude = coords.longitude;

      return { latitude, longitude };
    });
};

const fetchISSFlyOverTimes = function (coords) {

  return request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
    .then(obj => {
      const responses = JSON.parse(obj).response;
      return responses;
    });

}

const nextISSTimesForMyLocation = function () {
  return fetchMyIP() //promises return promises, if use a then, the next will get the body from the previous
    .then("fetchCoordsByIP")
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      let objectOfTimes = {};
      objectOfTimes = data;
      return objectOfTimes;
    });
};



module.exports = { nextISSTimesForMyLocation };


