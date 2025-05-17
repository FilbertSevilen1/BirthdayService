const cron = require("node-cron");
const { SendBirthdayMessage } = require("../functions/sendBirthdayMessage");

cron.schedule("0 * * * *", () => {
  SendBirthdayMessage();
});
