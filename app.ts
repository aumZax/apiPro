import express from "express";
import { router as index } from "./api/index";
import { router as test } from "./api/test";
import { router as login } from "./api/login";
import { router as user } from "./api/user";
import { router as image } from "./api/image";
import { router as random } from "./api/random";
import { router as vote } from "./api/vote";
import { router as upload } from "./api/upload";
import { router as allvote } from "./api/selectallvote";
import { router as ranking } from "./api/ranking";
import { router as deleterank } from "./api/deleterank";
import { router as checkrank } from "./api/checkrank";
import { router as imageuser } from "./api/imageuser";
import { router as grap } from "./api/grap";
import { router as adminselect } from "./api/adminselect";
import { router as adminrank } from "./api/adminrank";


import bodyParser from "body-parser";
import cors from "cors";

export const app = express();
// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
app.use(
    cors({
      origin: "*",
    })
  );

app.use(bodyParser.text());
app.use(bodyParser.json());
// app.use("/", index);
app.use("/user", user);
app.use("/test", test);
app.use("/login", login);
app.use("/image", image);
app.use("/random", random);
app.use("/vote", vote);
app.use("/upload", upload);
app.use("/allvote", allvote);
app.use("/ranking", ranking);
app.use("/deleterank", deleterank);
app.use("/checkrank", checkrank);
app.use("/imageuser", imageuser);
app.use("/grap", grap);
app.use("/adminselect", adminselect);
app.use("/adminrank", adminrank);




// app.use("/",(req,res)=>{
//   res.send("AAA");
// });