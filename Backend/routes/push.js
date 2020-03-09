const router = require('express').Router();
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const webpush = require('web-push');

webpush.setVapidDetails(
	'https://gunter.felixsz.de',
	process.env.PUSH_KEY_PUBLIC,
	process.env.PUSH_KEY_PRIVATE,
);

router.post('/subscribe', function (req, res) {
	logger.trace("router - push - POST /subscribe");

	// TODO store req.body in the database
	const subscription = req.body;

	setTimeout(() => {
		webpush.sendNotification(subscription, "hello world");
	}, 1000);

	res.status(200).send({});
});

module.exports = router;
