const db = require("../models");
const Home = db.homes;
const ipRegex = require('ip-regex');

exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if (!ipRegex({ exact: true }).test(req.body.description)) {
    res.status(400).send({ message: "Invalid IP" });
    return;
  }
  const tutorial = new Home({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Home."
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Home.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Home.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Home with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Home with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Home.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Home with id=${id}. Maybe Home was not found!`
        });
      } else res.send({ message: "Home was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Home with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Home.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Home with id=${id}. Maybe Home was not found!`
        });
      } else {
        res.send({
          message: "Home was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Home with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Home.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Homes were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

exports.findAllPublished = (req, res) => {
  Home.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};