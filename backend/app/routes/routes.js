module.exports = app => {
  const apps = require("../controllers/controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", apps.create);

  // Retrieve all Tutorials
  router.get("/", apps.findAll);

  // Retrieve all published Tutorials
  router.get("/published", apps.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", apps.findOne);

  // Update a Tutorial with id
  router.put("/:id", apps.update);

  // Delete a Tutorial with id
  router.delete("/:id", apps.delete);

  // Create a new Tutorial
  router.delete("/", apps.deleteAll);

  app.use("/api/apps", router);
};
