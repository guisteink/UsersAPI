const express = require("express");
const cors = require("cors");
const server = express();
const port = process.env.PORT || 4040;

server.use(cors());
server.use(express.json());

require('./controller/AuthController')(server)

// server.use('./controller/AuthController.js')

const UserRoutes = require("./route/UserRoutes");
server.use("/users", UserRoutes)

server.listen(port, function (err) {
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", port);

  server.get("/", function (req, res) {
    return res.send("<h1>REST Fullstack Challenge 2020-12-09 Running</h1>")
  })

});