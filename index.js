const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const productsRoutes = require("./src/routes/products");
const usersRoutes = require("./src/routes/user");
const orderRoutes = require("./src/routes/order");
const productDiscoveryRoutes = require("./src/routes/productDiscovery");
require("dotenv/config");

const app = express();

//setting nama image dan lokasi image yang masuk ke DB
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

//filter format image sebelum masuk DB
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//middleware file image
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//handle get image
app.use("/images", express.static(path.join(__dirname, "/images")));

//handle body-parser untuk get data dari request
app.use(express.json()); //type JSON

// handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

//handle route
app.use("/v1", productsRoutes);
app.use("/users", usersRoutes);
app.use("/order", orderRoutes);
app.use("/discovery", productDiscoveryRoutes);
//middleware untuk menangkap error message default
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(4000, () => console.log("connect!"));
  })
  .catch((error) => console.log(error));
