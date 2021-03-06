/**
 * In the morning, most people always repeat the same set of tasks. For this use case, the assistant
 * sends a notification to the user depending on the start of the first event in the calendar, the
 * travel time to the first event (VVS), and the time they need to get ready (preferences) (time of
 * notification = start of the first event - travel time - time to get ready). The notification is
 * not sent during the weekend. When the user clicks on the notification, the morning routine use
 * case is opened in the web app. The user can also open the use case at any other time using the
 * web app. After opening the use case, the assistant presents the route to the first event in the
 * calendar (VVS) and the weather forecast for the day. Dialog: If the user confirms that they want
 * to hear the daily quote, a daily quote is also presented to the user.
 */

const schedule = require('node-schedule');
const moment = require('moment-timezone');
const logger = require('../utilities/logger');
const calendar = require('../modules/calendar');
const vvs = require('../modules/vvs');
const weather = require('../modules/weather');
const preferences = require('../modules/preferences');
const notifications = require('../modules/notifications');
const quote = require('../modules/quote');
const { formatTime } = require('../utilities/formatter');

const timezone = 'Europe/Berlin';

/**
 * @return Object containing `quote` and `author`.
 */
async function getQuoteOfTheDay() {
  const pref = await preferences.getChecked();

  return quote.getQuoteOfTheDay(pref.morningRoutineQuoteCategory);
}

async function getFirstEvent() {
  const now = moment.tz(timezone);
  const todayStart = now.clone().startOf('day');
  const todayEnd = todayStart.clone().endOf('day');
  const tomorrowStart = todayStart.clone().add(1, 'day');
  const tomorrowEnd = tomorrowStart.clone().endOf('day');

  const events = await calendar.getEventsStartingBetween({
    start: todayStart,
    end: tomorrowEnd,
  });

  let event = events
    .filter((ev) => ev.end <= todayEnd)
    .find(() => true);

  if (event === undefined || event.start < now) {
    // no event today or first event today already started - look for first event tomorrow
    event = events
      .filter((ev) => ev.start > todayEnd)
      .find(() => true);
  }

  return event;
}

/**
 * @return Object containing `wakeUpTime`, `event` and `connection`. If there is no event today or
 *         tomorrow, all properties are undefined. If the event has no location or no connection to
 *         the event location can be found, `connection` is undefined.
 */
async function getWakeUpTime() {
  const pref = await preferences.getChecked();

  const event = await getFirstEvent();
  if (event === undefined) {
    // no event today, first event today already started, or no event tomorrow
    return {};
  }

  if (!event.location) {
    // event has no location set
    const wakeUpTime = moment(event.start)
      .subtract(pref.morningRoutineMinutesForPreparation, 'minutes');
    return {
      event,
      wakeUpTime,
    };
  }

  const connection = await vvs.getConnection({
    originCoordinates: pref.location,
    destinationAddress: event.location,
    arrival: event.start,
  });
  if (connection === undefined) {
    // no connection found
    const wakeUpTime = moment(event.start)
      .subtract(pref.morningRoutineMinutesForPreparation, 'minutes');
    return {
      event,
      wakeUpTime,
    };
  }

  const wakeUpTime = moment(connection.departure)
    .subtract(pref.morningRoutineMinutesForPreparation, 'minutes');

  return {
    event,
    connection,
    wakeUpTime,
  };
}

/**
 * @parm datetime Datetime for which the daily forecast should be returned.
 */
async function getWeatherForecast(datetime) {
  const pref = await preferences.getChecked();

  const weatherForecast = await weather.getForecast({
    ...pref.location,
    duration: 5,
  });

  const now = moment.tz(timezone).startOf('day');
  const daysTo = moment.tz(datetime, timezone).endOf('day').diff(now, 'days');

  return weatherForecast[daysTo];
}

async function run() {
  try {
    logger.debug(`Morning routine usecase: Running at ${new Date().toISOString()}`);

    const { event, connection, wakeUpTime } = await getWakeUpTime();
    if (event === undefined) {
      logger.debug('Morning routine usecase: No event found');
      return;
    }

    let body = `${event.summary} starts at ${formatTime(event.start)}.`;

    if (connection !== undefined) {
      body += ` You have to leave at ${formatTime(connection.departure)}.`;
    }

    schedule.scheduleJob(new Date(wakeUpTime), async () => {
      await notifications.sendNotifications({
        title: 'Wake up!',
        options: {
          body,
          icon: '/favicon.jpg',
          badge: '/badge.png',
          data: {
            usecase: 'morning-routine',
          },
        },
      });

      logger.debug(`Morning routine usecase: Sent notification with body '${body}'`);
    });

    logger.debug(`Morning routine usecase: Scheduled notification at ${wakeUpTime.toISOString()} with body '${body}'`);
  } catch (error) {
    logger.error(error);
  }
}

function init() {
  // every day at 00:00, but not on the weekend
  const job = schedule.scheduleJob(
    {
      minute: 0,
      hour: 0,
      dayOfWeek: [1, 2, 3, 4, 5],
      tz: timezone,
    },
    run,
  );

  logger.info(`Morning routine usecase: First invocation at ${job.nextInvocation().toISOString()}`);
}

module.exports = {
  init,
  getWakeUpTime,
  getWeatherForecast,
  getQuoteOfTheDay,
  run,
};
