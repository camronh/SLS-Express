# Controllers

Controllers are the glue between the models and the views. They are responsible for handling the user's requests and returning the appropriate response. They are also responsible for handling the business logic of the application.

When defining endpoints in express we can consider the following:

```javascript
app.get("/", function (req, res) {
```

The function that follows the path is the controller. It is responsible for handling the request and returning the response, but it is a simple function that can be imported.

By modularizing the controllers, we can run tests on them without having to run full integration tests. We can also mock the models and services to test the controllers in isolation.
