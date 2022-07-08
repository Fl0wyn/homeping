module.exports = app => {
  const apps = require("../controllers/controller.js");

  var router = require("express").Router();

  // Create a new App
  router.post("/", apps.create);

  // Retrieve all Apps
  router.get("/", apps.findAll);

  // Retrieve all published Apps
  router.get("/published", apps.findAllPublished);

  // Retrieve a single App with id
  router.get("/:id", apps.findOne);

  // Update a App with id
  router.put("/:id", apps.update);

  // Delete a App with id
  router.delete("/:id", apps.delete);

  // Create all App
  router.delete("/", apps.deleteAll);

  app.use("/api/apps", router);
};
