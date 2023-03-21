const fs = require("fs");
const inquirer = require("inquirer");

const getTimeObject = function (timeString) {
  const PMToAMOffset = timeString.split(" ")[1].toUpperCase() === "PM" ? 12 : 0;
  return {
    hour: Number(timeString.split(":")[0]) + PMToAMOffset,
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

const getShopStatus = function (dayString, timeString, phase) {
  const day = dayNumber.get(dayString);
  const time = getTimeObject(timeString);
  const shopSchedule = getShopSchedule();
  const shopScheduleForDay = shopSchedule[day];
  if (phase === "phase1") {
    if (
      shopScheduleForDay !== undefined &&
      compareTime(shopScheduleForDay.open, time) <= 0 &&
      compareTime(shopScheduleForDay.close, time) >= 0
    ) {
      console.log("Open");
    } else {
      console.log("Close");
    }
  } else if (phase === "phase2") {
    if (
      shopScheduleForDay !== undefined &&
      compareTime(shopScheduleForDay.open, time) <= 0 &&
      compareTime(shopScheduleForDay.close, time) >= 0
    ) {
      let hours = compareTime(shopScheduleForDay.close, time);
      console.log(
        `Open, The shop will be closed within ${hours.toFixed(2)} Hrs`
      );
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
        console.log(nextOpenDay);
        hours =
          compareTime(shopSchedule[nextOpenDay % 7].open, time) +
          Math.abs(nextOpenDay - day) * 24;
      }

      console.log(
        `Closed. The shop will be open after ${hours.toFixed(2)} Hrs`
      );
    }
  } else if (phase === "phase3") {
  }
};

const questions = [
  {
    type: "list",
    name: "Day",
    message: "select Day",
    choices: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    type: "input",
    name: "CURRENT_TIME",
    message: "time ex. 10:00 PM",
    default() {
      const defaultDate = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      return defaultDate.slice(0, -3) + " " + defaultDate.slice(-2);
    },
    validate(time) {
      const regex = /^(1[012]|[1-9]|0[1-9]):[0-5][0-9](\s)(AM|PM)$/i;
      if (regex.test(time)) return true;
      return "please enter in correct format";
    },
  },
  {
    type: "list",
    name: "phase",
    message: "select phase",
    choices: ["phase1", "phase2", "phase3"],
  },
];

inquirer.prompt(questions).then((answer) => {
  getShopStatus(answer.Day, answer.CURRENT_TIME, answer.phase);
});
