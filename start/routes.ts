import Route from "@ioc:Adonis/Core/Route";

// Authentication endpoints
Route.post("api/auth/register", "AuthController.register");
Route.post("api/auth/login", "AuthController.login");
Route.get("api/auth/logout", "AuthController.logout");


// user management api - admin, consumer, maker
Route.group(() => {
  Route.get(":userId", "UsersController.show"); // get user details
  Route.post(":userId", "UsersController.store"); // create or update user details
})
  .prefix("api/user")
  // .middleware("auth");



// job management api
Route.group(() => {
    Route.get("jobs", "JobsController.index"); // List all jobs
    Route.post("jobs", "JobsController.store"); // Create a new job
    Route.put("jobs/:jobId", "JobsController.update"); // Update a job by ID
    Route.get("jobs/:jobId", "JobsController.show"); // Get a job by ID
    Route.delete("jobs/:jobId", "JobsController.destroy"); // Delete a job by ID
  })
    .prefix("api/:userId")
    // .middleware("auth");



// cloth type api
Route.get("api/cloth_types", "ClothTypesController.index");


// image upload api
Route.post("api/images/:jobId", "ImagesController.upload");