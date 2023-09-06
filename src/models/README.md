# Models

Here is where we want to store our models. In the case of a typical DB API, we would store our class and our interfaces here. I like to keep my zod
schemas here as well and infer the types from them.

We also want to handle our legwork inside of the model methods. So storing in the db and all that will happen inside of the model. Factory methods should
should be static. So for example, `User.create` should be a static method that returns a new user object. `User.save` should be an instance method that
saves the user to the db and we might want to make that one private. 
