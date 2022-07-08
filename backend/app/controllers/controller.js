const db = require("../models");
const App = db.apps;
const ipRegex = require('ip-regex');

exports.create = (req, res) => {
  if (!req.body.hostname) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!ipRegex({ exact: true }).test(req.body.ip)) {
    res.status(400).send({ message: "Invalid IP" });
    return;
  }
  const app = new App({
    hostname: req.body.hostname,
    ip: req.body.ip,
    enabled: req.body.enabled ? req.body.enabled : false,
  });

  app
    .save(app)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the App."
      });
    });
};

exports.findAll = (req, res) => {
  const hostname = req.query.hostname;
  var condition = hostname ? { hostname: { $regex: new RegExp(hostname), $options: "i" } } : {};

  App.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving apps."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  App.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found App with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving App with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  App.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update App with id=${id}. Maybe App was not found!`
        });
      } else res.send({ message: "App was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating App with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  App.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete App with id=${id}. Maybe App was not found!`
        });
      } else {
        res.send({
          message: "App was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete App with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  App.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Apps were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all apps."
      });
    });
};

exports.findAllPublished = (req, res) => {
  App.find({ enabled: true })
    .then(data => {
      res.send(data);
      console.log
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving apps."
      });
    });
};