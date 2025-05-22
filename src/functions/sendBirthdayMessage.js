const UserModel = require("../models/User");
const { DateTime } = require("luxon");

async function sendBirthdayMessage() {
  const nowUTC = DateTime.utc();

  const possibleDays = [nowUTC];
  const possibleMonthDays = possibleDays.map((dt) => ({
    month: dt.month,
    day: dt.day,
  }));

  let users;
  try {
    users = await UserModel.find({
      $expr: {
        $or: possibleMonthDays.map(({ month, day }) => ({
          $and: [
            { $eq: [{ $month: "$birthday" }, month] },
            { $eq: [{ $dayOfMonth: "$birthday" }, day] },
          ],
        })),
      },
    });
  } catch (err) {
    console.error("Failed to fetch users:", err.message);
    return;
  }

  for (const user of users) {
    const userTime = nowUTC.setZone(user.timezone);
    const birthday = DateTime.fromJSDate(user.birthday);
    const isBirthday =
      userTime.month === birthday.month && userTime.day === birthday.day;
    const isNineAM = userTime.hour === 9;

    if (isBirthday && isNineAM) {
      await sendWithRetry(user);
    }
  }
}

async function sendWithRetry(user, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Happy Birthday to ${user.name} (${user.email})`);
      break; 
    } catch (err) {
      console.error(`Send to ${user.email} failed (Attempt ${attempt}): ${err.message}`);
      if (attempt === maxRetries) {
        console.error(`Giving up on ${user.email} after ${maxRetries} attempts.`);
      } else {
        const delay = 3000;
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
}

module.exports = {
  sendBirthdayMessage,
};
