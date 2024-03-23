const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors()); // cho phép tất cả
app.use(express.static(".")); // định vị lại đường load tài nguyên
app.listen(8080);

const rootRoute = require("./routers/rootRouter");
app.use(rootRoute);

// ORM: Object Relational mapping
// seque
