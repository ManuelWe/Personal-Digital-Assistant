const router = require('express').Router();
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const User = require('../modules/user');

/** ********************
 * Get the user's info
 ********************* */
router.get('/', (req, res) => {
  logger.trace('router - users - GET called on /');
  User.getUser()
    .then((user) => res.status(200).send({ status: 200, data: user }))
    .catch((error) => {
      logger.error(error);
      res.status(500).send({ status: 500, error: error.message });
    })
    .finally(() => logger.trace('router - /users/coordinates - responded'));
});

/** ********************
 * Update the user's current coordinates
 ********************* */
router.put('/coordinates', (req, res) => {
  logger.trace('router - users - PUT called on /coordinates');

  User.setCoordinates(req.body)
    .then((message) => res.status(200).send({ status: 200, data: message }))
    .catch((error) => {
      logger.error(error);
      res.status(500).send({ status: 500, error });
    })
    .finally(() => logger.trace('router - /users - responded'));
});

module.exports = router;
