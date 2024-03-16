import express from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  RegisterPostRequest } from '../model/test_res';

export const router = express.Router();

// router.get("/:username", (req, res) => {
//     // const name = req.query.name;
//     let sql = "SELECT * FROM users where username = ?";
  
//     conn.query(sql, (err, result) => {
//       if (err) {
//         res.json(err);
//       } else {
//         res.json(result);
//       }
//     });s
  
//   });

// router.get("/:uid",(req, res)=> {
//     const uid = req.params.uid;
//     let sql = "SELECT * FROM users where uid = ?";
//     conn.query(sql,[uid], (err, result) => {
//       if (err) {
//         res.status(400).json(err);
//       } else {
//         res.json(result);
//       }
//     });
// });




 
  
  
  