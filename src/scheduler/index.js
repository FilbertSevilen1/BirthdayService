const cron = require("node-cron");
const { sendBirthdayMessage } = require("../functions/sendBirthdayMessage");

cron.schedule("* * * * *", () => {
  sendBirthdayMessage();
});
