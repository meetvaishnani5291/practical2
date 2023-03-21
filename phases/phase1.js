const {
  compareTime,
  getShopSchedule,
  dayNumber,
  getTimeObject,
} = require("../util/get-schedule");

exports.getShopStatus = function (dayString, timeString) {
  const day = dayNumber.get(dayString);
  const time = getTimeObject(timeString);
  const shopSchedule = getShopSchedule();
  const shopScheduleForDay = shopSchedule[day];

  if (
    shopScheduleForDay !== undefined &&
    compareTime(shopScheduleForDay.open, time) <= 0 &&
    compareTime(shopScheduleForDay.close, time) >= 0
  ) {
    console.log("Open");
  } else {
    console.log("Close");
  }
};
