import express from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  RegisterPostRequest } from '../model/test_res';
import { ImagePostRequest } from "../model/image_res";

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

router.get("/:uid", (req, res) => {
    const uid = req.params.uid;
  
    // สุ่ม image_id 1 ตัวจาก uid ที่ส่งมา
    let sql = `SELECT image_id FROM images WHERE uid = ? ORDER BY RAND() LIMIT 1`;
    conn.query(sql, [uid], (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        if (result.length === 0) {
          // กรณีไม่พบ image_id ใดๆ
          res.status(404).json({ message: "No image found for this user." });
        } else {
          const image_id = result[0].image_id;
  
          // เลือกข้อมูลภาพทั้งหมดจาก image_id ที่สุ่มได้
          sql = `SELECT * FROM images WHERE image_id = ?`;
          conn.query(sql, [image_id], (err, result) => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.json(result[0]);
            }
          });
        }
      }
    });
  });
  

  router.get("/image/:image_id",(req, res)=> {
    const image_id = req.params.image_id;
    let sql = "SELECT * FROM images where image_id = ?";
    conn.query(sql,[image_id], (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.json(result);
      }
    });
});


  router.put("/:image_id", (req, res) =>{
    const image_id = req.params.image_id;
    const data: ImagePostRequest = req.body;
    let sql =
  "update  images set score= ?  where image_id= ?";
      sql = mysql.format(sql, [
        data.score,
        image_id

      ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });

  });
  
  




 
  
  
  