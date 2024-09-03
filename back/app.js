const express = require('express');
const mongoose = require('mongoose');
const expressListEndpoints = require('express-list-endpoints');
const userRouter = require("./routes/userRoute");
const loginRouter = require("./routes/authRoute");
const googleApiRouter = require("./routes/googleApiRoute");
const savedTripRouter = require("./routes/savedTripRoute");
const suggestionRouter = require("./routes/suggestionRoute");
const journeyRouter = require("./routes/journeyRoute");
const cors = require("cors");
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');


// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nom de votre API',
      version: '1.0.0',
      description: 'Description de votre API',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// MongoDB
const mongoURI = 'mongodb+srv://admin:ewuXrOL2cQQym9Rq@cluster0.gwkwwvf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error', err);
  });

// Define middleware
app.use(express.json());

// Cors
app.use(cors());

// Define routes
app.use("/users", userRouter);
app.use("/users", loginRouter);
app.use(googleApiRouter);
app.use("/journey", journeyRouter);
app.use("/suggestion", suggestionRouter);
app.use("/savedTrip", savedTripRouter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server connected on port 4000`);
});


// Routes 
console.log(expressListEndpoints(app));


module.exports = app;