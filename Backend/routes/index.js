const router = require('express').Router();

const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const welcomeMessage = "Welcome to Gunter's heart - I am the backend. Feel free to leave, since you should let the frontend talk to me.";

/**********************
 **** Landing page ****
 **********************/
router.get('/', (req, res) => {
	logger.trace("router - index - GET called on /");
	res.status(200).send({ status: 200, data: welcomeMessage });
});

/**********************
 **** API page for Felix ****
 **********************/
router.get('/api', (req, res) => {
	logger.trace("router - index - GET called on /api");
	res.status(200).send({ status: 200, data: welcomeMessage });
});

router.use('/user', require('./user'));

module.exports = router;