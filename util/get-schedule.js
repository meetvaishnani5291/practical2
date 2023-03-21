const fs = require("fs");

const getTimeObject = function (timeString) {
  const PMTo24Offset = timeString.split(" ")[1].toUpperCase() === "PM" ? 12 : 0;
  return {
    hour: Number(timeString.split(":")[0]) + PMTo24Offset,
    minute: Number(timeString.split(":")[1].split(" ")[0]),
  };
};
const dayNumber = new Map([
  ["Mon", 0],
  ["Tue", 1],
  ["Wed", 2],
  ["Thu", 3],
  ["Fri", 4],
  ["Sat", 5],
  ["Sun", 6],
]);
const getShopSchedule = function () {
  const shopSchedule = JSON.parse(fs.readFileSync("shop-schedule.json"));
  const updatedShopSchedule = [];

  shopSchedule.forEach((dayObject) => {
    updatedShopSchedule[dayNumber.get(dayObject.day)] = {
      open: getTimeObject(dayObject.open),
      close: getTimeObject(dayObject.close),
    };
  });
  return updatedShopSchedule;
};
const compareTime = function (time1, time2) {
  let diffrence = time1.hour - time2.hour;
  diffrence += (time1.minute - time2.minute) / 60;
  return diffrence;
};

module.exports = { compareTime, getShopSchedule, dayNumber, getTimeObject };
