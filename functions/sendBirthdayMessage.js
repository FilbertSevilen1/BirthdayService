const UserModel = require("../models/User");
const { DateTime } = require("luxon");
module.exports.SendBirthdayMessage = async () => {
  try {
    const users = await UserModel.find({});

    const nowUTC = DateTime.utc();

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
