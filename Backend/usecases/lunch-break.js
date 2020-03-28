/**
 * Many people want to explore different alternatives during their lunch breaks, but the search for
 * restaurants is a time-consuming task. For this use case, the assistant sends a notification
 * shortly before the lunch break. This depends on the calendar and on the preferred lunch break
 * time (preferences). When the user clicks on the notification, the lunch break use case is
 * opened. The user can also open the use case at any other time using the web app. After opening
 * the use case, the assistant presents a restaurant to go to during the lunch break (maps).
 * Dialog: If the user wants to go to that restaurant during the lunch break, the assistant presents
 * the route taken to the destination (VVS).
 */

const schedule = require('node-schedule');
const pino = require('pino');
const moment = require('moment-timezone');
const calendar = require('../modules/calendar');
const places = require('../modules/places');
const notifications = require('../modules/notifications');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// TODO from preferences
const startHour = 11;
const endHour = 14;
const minTime = 60;
const radius = 1;
const timeBeforeStart = 30;

async function getFreeSlotForLunchbreak() {
  const start = new Date();
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(start.getTime());
  end.setHours(endHour, 0, 0, 0);

  const freeSlots = await calendar.getFreeSlots({ start, end });
  if (freeSlots.length === 0) {
    return undefined;
  }

  // find the longest slot and check if it sufficiently long
  const freeSlot = freeSlots.sort((a, b) => (b.end - b.start) - (a.end - a.start))[0];
  if (moment.duration(moment(freeSlot.end).diff(freeSlot.start)).asMinutes() < minTime) {
    return undefined;
  }

  return freeSlot;
}

async function getRandomRestaurantNear({ latitude, longitude }) {
  const restaurants = await places.getPOIsAround({
    latitude, longitude, category: 'restaurant', limit: 100, radius,
  });
  if (restaurants.length === 0) {
    return undefined;
  }

  return restaurants[Math.floor(Math.random() * restaurants.length)];
}

async function run() {
  try {
    const freeSlot = await getFreeSlotForLunchbreak();

    const notificationTime = moment(freeSlot.start).subtract(timeBeforeStart, 'minutes');

    schedule.scheduleJob(notificationTime, async () => {
      await notifications.sendNotifications({
        title: 'Recommended restaurant for your lunch break',
        options: {
          body: `You have some time to spare during your lunch break at ${moment(freeSlot.start)}, why not try a restaurant?`,
          icon: '/favicon.jpg',
          badge: '/badge.png',
          data: {
            usecase: 'lunch-break',
          },
        },
      });
    });
  } catch (error) {
    logger.error(error);
  }
}

function init() {
  // every day at 00:00, but not on the weekend
  schedule.scheduleJob({ minute: 0, hour: 0, dayOfWeek: [1, 2, 3, 4, 5] }, run);
}

module.exports = {
  init, run, getFreeSlotForLunchbreak, getRandomRestaurantNear,
};
