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
    let hours = compareTime(shopScheduleForDay.close, time);
    console.log(`Open, The shop will be closed within ${hours.toFixed(2)} Hrs`);
  } else {
    let hours;
    if (
      shopScheduleForDay !== undefined &&
      compareTime(shopScheduleForDay.open, time) > 0
    ) {
      hours = compareTime(shopScheduleForDay.open, time);
    } else {
      let nextOpenDay = day + 1;
      for (let i = 0; i < 7; i++) {
        if (shopSchedule[nextOpenDay % 7] !== undefined) break;
        nextOpenDay++;
      }
      hours =
        compareTime(shopSchedule[nextOpenDay % 7].open, time) +
        Math.abs(nextOpenDay - day) * 24;
    }
    const days = parseInt(hours / 24);
    if (days === 0) {
      console.log(
        `Shop is Currently Closed. and it will be open after ${hours.toFixed(
          2
        )} Hrs`
      );
    } else if (days === 1) {
      console.log(
        `Shop is Currently Closed. and it will be open after ${days} Day and ${
          hours % 24
        } Hrs`
      );
    } else {
      console.log(
        `Shop is Currently Closed. and it will be open after ${days} Days and ${(
          hours % 24
        ).toFixed(2)} Hrs`
      );
    }
  }
};
