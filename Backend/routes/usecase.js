const router = require('express').Router();
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const Quote = require('../modules/quote');
const User = require('../modules/user');
const Weather = require('../modules/weather');
const Alarm = require('../modules/alarm');

router.get('/1', (req, res) => {
  logger.trace('router - usecase - GET called on /1');
  Promise.all([
    Quote.getPreferredQuoteOfTheDay(),
    User.getUsersPreparationTime(),
    Weather.getCurrentWeatherForUserLocation(),
    Alarm.getFirstEventWithTimeToLeave(),
  ])
    .then((usecaseData) => {
      const quote = usecaseData[0];
      const preparationTime = usecaseData[1];
      const weather = usecaseData[2];
      const firstEvent = usecaseData[3];
      const { timeToLeave } = firstEvent;
      delete firstEvent.timeToLeave;

      const response = {
        quote,
        preparationTime,
        weather,
        firstEvent,
        timeToLeave,
      };
      res.status(200).send({ status: 200, data: response });
    })
    .catch((error) => res.status(500).send({ status: 500, error: error.message }));
});

router.get('/2', (req, res) => {
  logger.trace('router - usecase - GET called on /2');
  Promise.all([2])
    .then((usecaseData) => {
      const stuff = usecaseData[0];

      const response = {
        stuff,
      };
      res.status(200).send({ status: 200, data: response });
    })
    .catch((error) => res.status(500).send({ status: 500, error: error.message }));
});

router.get('/3', (req, res) => {
  logger.trace('router - usecase - GET called on /3');
  Promise.all([3])
    .then((usecaseData) => {
      const stuff = usecaseData[0];

      const response = {
        stuff,
      };
      res.status(200).send({ status: 200, data: response });
    })
    .catch((error) => res.status(500).send({ status: 500, error: error.message }));
});

router.get('/4', (req, res) => {
  logger.trace('router - usecase - GET called on /4');
  Promise.all([4])
    .then((usecaseData) => {
      const stuff = usecaseData[0];

      const response = {
        stuff,
      };
      res.status(200).send({ status: 200, data: response });
    })
    .catch((error) => res.status(500).send({ status: 500, error: error.message }));
});

module.exports = router;
