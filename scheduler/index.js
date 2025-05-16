const cron = require("node-cron");
const { SendBirthdayMessage } = require("../functions/sendBirthdayMessage");

cron.schedule("* * * * *", () => {
  SendBirthdayMessage();
});
