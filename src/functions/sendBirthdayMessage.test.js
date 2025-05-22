const { sendBirthdayMessage } = require("./sendBirthdayMessage");
const UserModel = require("../models/User");
const { DateTime } = require("luxon");

jest.mock("../models/User");

describe("sendBirthdayMessage", () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log birthday message at 9:00 AM user time", async () => {
    const nowUTC = DateTime.fromISO("2025-10-12T02:00:00.000Z");

    jest.spyOn(DateTime, "utc").mockReturnValue(nowUTC);
    UserModel.find.mockResolvedValue([
      {
        name: "Jack",
        email: "jack@example.com",
        birthday: new Date("1990-05-17"),
        timezone: "Europe/Berlin",
      },
      {
        name: "Kei",
        email: "kei@example.com",
        birthday: new Date("1991-10-12"),
        timezone: "Asia/Jakarta",
      },
    ]);

    await sendBirthdayMessage();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Happy Birthday to Kei (kei@example.com)")
    );
    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Jack")
    );
  });

  it("should not log anything if it's not 9:00 AM", async () => {
    const nowUTC = DateTime.fromISO("2025-05-17T06:59:00.000Z");

    jest.spyOn(DateTime, "utc").mockReturnValue(nowUTC);

    UserModel.find.mockResolvedValue([
      {
        name: "Charlie",
        email: "charlie@example.com",
        birthday: new Date("1990-05-17"),
        timezone: "Europe/Berlin",
      },
    ]);

    await sendBirthdayMessage();

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should log error if fetching users fails", async () => {
    const now = DateTime.utc().set({ hour: 9 });
    jest.spyOn(DateTime, "utc").mockReturnValue(now);

    const error = new Error("Database error");
    jest.spyOn(UserModel, "find").mockRejectedValueOnce(error);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await sendBirthdayMessage();

    expect(UserModel.find).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch users:",
      error.message
    );

    consoleErrorSpy.mockRestore();
  });
});
