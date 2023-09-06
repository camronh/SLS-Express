# Services

Services are util functions to be used in the controllers. These services will encapsulate the logic of the application. For example, if we want to create a new user, we will have a service that will create a new user and return the user object. The controller will then send the user object to the client.

The logic for storing to the database will live in the Model and will be called by the service. The service will then return the object to the controller.

