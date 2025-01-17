const express = require("express");
const logs = express.Router();
const logsArray = require("../models/log");
const { validateLog } = require("../models/validations");

logs.get("/", (req, res) => {
  const { order, mistakes, lastCrisis } = req.query;
  let logsArrayCopy = [...logsArray];
  // Order query logic
  if (order === "asc") {
    logsArrayCopy.sort((logA, logB) => {
      return logA.title > logB.title ? 1 : -1;
    });
  } else if (order === "desc") {
    logsArrayCopy.sort((logA, logB) => {
      return logA.title > logB.title ? -1 : 1;
    });
  }

  // Mistakes Query logic
  if (mistakes === "true") {
    logsArrayCopy = logsArrayCopy.filter((log) => {
      return log.mistakesWereMadeToday;
    });
  } else if (mistakes === "false") {
    logsArrayCopy = logsArrayCopy.filter((log) => {
      return !log.mistakesWereMadeToday;
    });
  }

  // lastCrisis query logic
  if (lastCrisis === "gt10") {
    logsArrayCopy = logsArrayCopy.filter((log) => {
      return log.daysSinceLastCrisis > 10;
    });
  } else if (lastCrisis === "gt20") {
    logsArrayCopy = logsArrayCopy.filter((log) => {
      return log.daysSinceLastCrisis > 20;
    });
  } else if (lastCrisis === "lte5") {
    logsArrayCopy = logsArrayCopy.filter((log) => {
      return log.daysSinceLastCrisis <= 5;
    });
  }

  // Send logsArrayCopy
  res.json(logsArrayCopy);
});

// SHOW
logs.get("/:id", (req, res) => {
  const { id } = req.params;
  if (logsArray[id]) {
    res.json(logsArray[id]);
  } else {
    res.redirect("/*");
  }
});

// CREATE
logs.post("/", validateLog, (req, res) => {
  logsArray.push(req.body);
  res.json(logsArray[logsArray.length - 1]);
});

// DELETE
logs.delete("/:id", (req, res) => {
  if (logsArray[req.params.id]) {
    const deletedLog = logsArray.splice(req.params.id, 1);
    res.status(200).json(deletedLog);
  } else {
    res.status(404).json({ error: "Log not found" });
  }
});

// UPDATE
logs.put("/:id", (req, res) => {
  if (logsArray[req.params.id]) {
    logsArray[req.params.id] = req.body;
    res.status(200).json(logsArray[req.params.id]);
  } else {
    res.status(404).json({ error: "Log not found" });
  }
});

module.exports = logs;
