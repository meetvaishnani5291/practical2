const phase1 = require("./phases/phase1");
const phase2 = require("./phases/phase2");
const phase3 = require("./phases/phase3");
const inquirer = require("inquirer");

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
  switch (answer.phase) {
    case "phase1":
      phase1.getShopStatus(answer.Day, answer.CURRENT_TIME);
      break;
    case "phase2":
      phase2.getShopStatus(answer.Day, answer.CURRENT_TIME);
      break;
    case "phase3":
      phase3.getShopStatus(answer.Day, answer.CURRENT_TIME);
      break;
  }
});
