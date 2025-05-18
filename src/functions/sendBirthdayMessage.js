const UserModel = require("../models/User");
const { DateTime } = require("luxon");

module.exports.sendBirthdayMessage = async () => {
  try {
    const nowUTC = DateTime.utc();

    const possibleDays = [
      nowUTC,
      nowUTC.minus({ days: 1 }),
      nowUTC.plus({ days: 1 }),
    ];

    const possibleMonthDays = possibleDays.map((dt) => ({
      month: dt.month,
      day: dt.day,
    }));

    const users = await UserModel.find({
      $expr: {
        $or: possibleMonthDays.map(({ month, day }) => ({
          $and: [
            { $eq: [{ $month: "$birthday" }, month] },
            { $eq: [{ $dayOfMonth: "$birthday" }, day] },
          ],
        })),
      },
    });

    for (const user of users) {
      const userTime = nowUTC.setZone(user.timezone);
      const birthday = DateTime.fromJSDate(user.birthday);
      const isBirthday =
        userTime.month === birthday.month && userTime.day === birthday.day;
      const isNineAM = userTime.hour === 9 && userTime.minute === 0;

      if (isBirthday && isNineAM) {
        console.log(
          `Happy Birthday to ${user.name} (${user.email}) - Timezone: ${user.timezone}`
        );
      }
    }
  } catch (err) {
    console.error("Error sending birthday messages:", err);
  }
};
