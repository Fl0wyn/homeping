const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const path = require('path')

const app = express();

/* var corsOptions = {
  origin: "http://localhost:8082"
};

app.use(cors(corsOptions)); */
app.use(cors());


// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
/* app.get("/", (req, res) => { */
  //res.json({ message: "Welcome to PingMonitor application." });
/*   res.sendFile(path.join(__dirname, 'dist/'));
}); */

http://192.168.20.100:8080/api/Apps


app.get('/ip', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:")
    ip = ip.substr(7)

  res.json(ip);
});

require("./app/routes/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
