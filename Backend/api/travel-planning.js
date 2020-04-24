const express = require('express');
const travelPlanning = require('../usecases/travel-planning');
const wrapAsync = require('../utilities/wrap-async');
const { formatDatetime, formatTime } = require('../utilities/formatter');
const db = require('../modules/db');

const router = express.Router();

router.get('/', wrapAsync(async (req, res) => {
  const {
    saturday,
    sunday,
    weekendFree,
  } = await travelPlanning.getWeekend();

  const {
    destination,
    connectionToDestination,
    connectionFromDestination,
  } = await travelPlanning.planRandomTrip({
    departure: saturday,
    arrival: sunday,
  });

  let textToDisplay = '';
  let textToRead = '';
  let furtherAction;
  let nextLink;

  if (weekendFree) {
    textToDisplay += 'Free next weekend.\n';
    textToRead += 'You are free next weekend.\n';
  } else {
    textToDisplay += 'Not free next weekend.\n';
    textToRead += 'Unfortunately you are not free next weekend, but I will try to find a '
      + 'travel destination anyway';
  }

  if (destination) {
    const {
      saturdayWeatherForecast,
      sundayWeatherForecast,
    } = await travelPlanning.getWeatherForecast({
      saturday,
      sunday,
      destination,
    });

    const totalPrice = connectionToDestination.price + connectionFromDestination.price;

    textToDisplay += `Destination: ${destination.name}.\n`
      + `To destination: ${formatDatetime(connectionToDestination.departure)} - `
      + `${formatTime(connectionToDestination.arrival)}.\n`
      + `From destination: ${formatDatetime(connectionFromDestination.departure)} - `
      + `${formatTime(connectionFromDestination.arrival)}.\n`
      + `Total price: ${totalPrice} €.\n`
      + `Saturday weather: ${saturdayWeatherForecast.day.shortPhrase}.\n`
      + `Sunday weather: ${sundayWeatherForecast.day.shortPhrase}.`;

    textToRead += `You could travel to ${destination.name}.\n`
      + `You start from the main station ${formatDatetime(connectionToDestination.departure)} `
      + `and arrive at ${formatTime(connectionToDestination.arrival)}.\n`
      + `The journey back starts ${formatDatetime(connectionFromDestination.departure)} `
      + `and ends at ${formatTime(connectionFromDestination.arrival)}.\n`
      + `The total price will be ${totalPrice} Euros.\n`
      + `The weather on Saturday will be ${saturdayWeatherForecast.day.longPhrase}.\n`
      + `On Sunday it will be ${sundayWeatherForecast.day.longPhrase}.`;


    furtherAction = 'Do you want to know how to get to the main station?';
    nextLink = 'travel-planning/confirm'
      + `?arrival=${connectionToDestination.departure.toISOString()}`;
  } else {
    textToDisplay += 'No travel destination found.';
    textToRead += 'Unfortunately I did not find a travel destination for the weekend. Sorry.';
  }

  res.send({
    textToDisplay,
    textToRead,
    furtherAction,
    nextLink,
  });
}));

// TODO store recommended travel destination for week
router.get('/confirm', wrapAsync(async (req, res) => {
  const connection = await travelPlanning.getConnectionToMainStation(req.query.arrival);

  let textToRead;
  let textToDisplay;
  let displayRouteOnMap;
  if (connection) {
    textToDisplay = `Leave home: ${formatDatetime(connection.departure)}.\n`
                    + `First stop: ${connection.legs[0].to}.\n`
                    + `Destination: ${connection.legs[connection.legs.length - 1].to}`;
    textToRead = `You have to leave at ${formatDatetime(connection.departure)}. `
                  + `Your first stop will be ${connection.legs[0].to}. `
                  + `Your destination is ${connection.legs[connection.legs.length - 1].to}`;
    displayRouteOnMap = {
      origin: connection.legs[0].from,
      destination: connection.legs[connection.legs.length - 1].to,
    };
  } else {
    textToDisplay = 'did not find route to starting point of your travel! Sorry!';
    textToRead = 'I did not find a route to your travel starting point. Sorry!';
    displayRouteOnMap = null;
  }

  res.send({
    textToDisplay,
    textToRead,
    displayRouteOnMap,
    displayPointOnMap: null,
    furtherAction: null,
    nextLink: null,
  });
}));

module.exports = router;
