const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request(
    `https://api.ipify.org?format=json`, (error, response, body) => {

      if (error) {
        callback(error, null);
        return;
      }
      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const data = JSON.parse(body);
      callback(null, data);
    }
  );
};

const fetchCoordsByIP = function (ip, callback) {

  request(
    `https://freegeoip.app/json/${ip}?`, (error, response, body) => {

      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching location. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const data = JSON.parse(body);
      let location = {};
      location.latitude = data.latitude;
      location.longitude = data.longitude;
      callback(null, location);
    }
  );
};

"https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}";
//49.2643
//-123.0869

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  request(
    `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS fly over times. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      let responseObj = {};
      responseObj = JSON.parse(body);
      callback(null, responseObj.response);
    }
  );
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {

  let ipAddress = "";
  let coordinates = { latitude: 1, longitude: 1 };
  let flyovers = [];

  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log('It worked! Returned IP:', ip);
    ipAddress = ip;
  });

  fetchCoordsByIP(ipAddress, (error, coords) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log('It worked! Returned coords:', coords);
    coordinates = coords;
  });

  fetchISSFlyOverTimes(coordinates, (error, times) => {
    console.log(coordinates.latitude);
    console.log(coordinates.longitude)
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log('It worked! Returned ISS flyover times:', times);
    flyovers = times;

    callback(null, flyovers);
  });
}

module.exports = { nextISSTimesForMyLocation };