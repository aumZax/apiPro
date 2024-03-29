import express from "express";
import path from "path";
import multer from "multer";
import { conn } from "../dbconn";
export const router = express.Router();
import mysql from "mysql";
import {  UploadPostRequest } from '../model/upload_res';
import { Request, Response } from "express"; // Import Express types if not already imported

router.get("/",(req,res)=>{
    res.send("Upload");
});


import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL,deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCcDgOYgiiMQqeEY-cUzHgI6ogTedq9be8",
    authDomain: "project-eade5.firebaseapp.com",
    projectId: "project-eade5",
    storageBucket: "project-eade5.appspot.com",
    messagingSenderId: "271363591909",
    appId: "1:271363591909:web:69239a743f419f05b98e0c",
    measurementId: "G-KR83WCFFRS"
  };


initializeApp(firebaseConfig);
const storage = getStorage();


class FileMiddleware {
    filename = "";
    public readonly diskLoader = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 67108864 
        }
    });
}
const fileupload = new FileMiddleware();


//add
router.post("/", fileupload.diskLoader.single("file"), async (req, res) => {
    const filename = Math.round(Math.random() * 100000) + '.png';
    const storageRef = ref(storage, "/images/" + filename);
    const metadata = { contentType: req.file!.mimetype };
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);
    const url = await getDownloadURL(snapshot.ref);
    res.status(200).json({
        filename: filename,
        url :url
    });
});

//-------------------------------------------------------------------------------------------------

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/add/", async (req, res) => {
  // let ImageData = req.body;
  let add : UploadPostRequest = req.body;
  

  let sql =
    "INSERT INTO `images`(`uid`, `image`, `title`, `score`, `filename`) VALUES (?,?,?,?,?)";
  sql = mysql.format(sql, [add.uid, add.image, add.title, add.score,add.filename]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
  // } else {
  //   return res.status(400).json({ message: "Password and confirm password do not match" });
  // }
});
//-------------------------------------------------------------------------------------------------



//delete firebase
router.delete("/:name", async (req, res) => {
  const filenameToDelete =req.params.name;
  const fileRef = ref(storage, "/images/"+ filenameToDelete);
  try {
    await deleteObject(fileRef);
    res.status(200).json({ message: `File ${filenameToDelete} has been deleted successfully. `});
  } catch (error) {
    console.error(`Error deleting file ${filenameToDelete}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the file.' });
  }
});


//delete database
router.delete("/dabase/:image_id", async (req, res) => {
  const image_id =req.params.image_id;

  let sql =
    "DELETE FROM images WHERE image_id = ?";
  sql = mysql.format(sql, [image_id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRows });
  });
});