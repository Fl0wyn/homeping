module.exports = app => {
  const homes = require("../controllers/controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", homes.create);

  // Retrieve all Tutorials
  router.get("/", homes.findAll);

  // Retrieve all published Tutorials
  router.get("/published", homes.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", homes.findOne);

  // Update a Tutorial with id
  router.put("/:id", homes.update);

  // Delete a Tutorial with id
  router.delete("/:id", homes.delete);

  // Create a new Tutorial
  router.delete("/", homes.deleteAll);

  app.use("/api/homes", router);
};
