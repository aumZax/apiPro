import express, { Router } from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  ImagePostRequest } from '../model/image_res';
import { voteModel } from "../model/voteModel";
import { Static } from "../model/static";

export const router = express.Router();


router.get('/', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    let sql = "SELECT * FROM votes WHERE DATE(date) = ? ORDER BY totalscore DESC";
  
    conn.query(sql, [today], (err, result) => {
      if (err) {
        console.error(err);
        // ในกรณีเกิดข้อผิดพลาด ควรจะส่งข้อความผิดพลาดกลับไป
        res.status(500).json({ error: 'An error occurred' });
        return;
      }
  
      // รีเทิร์นข้อมูลทั้งหมดในตาราง votes
      res.json(result);
    });
  });
  
//------------------------------กำหนดวัน-----------------------------------

// router.get('/', (req, res) => {
//     const customDate = '2024-03-14';//**********
//     let sql = "SELECT * FROM votes WHERE DATE(date) = ? ORDER BY totalscore DESC";

//     conn.query(sql, [customDate], (err, result) => {
//         if (err) {
//             console.error(err);
//             // ในกรณีเกิดข้อผิดพลาด ควรจะส่งข้อความผิดพลาดกลับไป
//             res.status(500).json({ error: 'An error occurred' });
//             return;
//         }

//         // รีเทิร์นข้อมูลทั้งหมดในตาราง votes
//         res.json(result);
//     });
// });



const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/", async (req, res) => {
  // let ImageData = req.body;
  let add : Static = req.body;
  

  let sql =
    "INSERT INTO `statistics`(`image_id`, `vote_id`, `rank`) VALUES (?,?,?)";
  sql = mysql.format(sql, [ add.image_id, add.vote_id, add.rank]);
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
  




router.get("/check/", async (req, res) => {
  let today = new Date().toISOString().split('T')[0]; // วันที่วันนี้ในรูปแบบ YYYY-MM-DD

  let sql =
    "SELECT COUNT(*) AS count FROM `statistics` s INNER JOIN `votes` v ON s.`vote_id` = v.`vid` WHERE DATE(v.`date`) = ?";
  sql = mysql.format(sql, [today]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ exists: result[0].count > 0 });
  });
});