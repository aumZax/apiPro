import express, { Router } from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  ImagePostRequest } from '../model/image_res';
import { voteModel } from "../model/voteModel";

export const router = express.Router();

router.get("/:image_id", (req, res) => {
  const today = new Date(Date.now()).toISOString().slice(0, 10); 
  const image_id = req.params.image_id;

  const query = "SELECT COUNT(*) as count FROM votes WHERE image_id = ? AND date(date) = ?";
  conn.query(query, [image_id, today], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการติดต่อกับฐานข้อมูล" });
    }

    const hasData = result[0].count > 0;
    res.json(hasData); // ส่งเฉพาะค่า true หรือ false อย่างเดียว
  });

});


router.get('/vid/:image_id', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const image_id = req.params.image_id;

  let sql = "SELECT vid FROM votes WHERE image_id = ? AND DATE(date) = ?";
  conn.query(sql, [image_id, today], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการติดต่อกับฐานข้อมูล" });
    }

    // รีเทิร์นแค่ vid เท่านั้น
    res.json({ vid: result[0].vid });
  });
});





router.post("/", (req, res) => {
  let Votes: voteModel = req.body;
  let sql = "INSERT INTO `votes`(`image_id`, `totalscore`, `date` ) VALUES (?,?,FROM_UNIXTIME(? / 1000))";

  sql = mysql.format(sql, [Votes.image_id, Votes.totalscore, Votes.date]);

  conn.query(sql, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Failed to insert data" });
      }
      res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.put("/:vid", (req, res) =>{
  const vid = req.params.vid;
  const votes: voteModel = req.body;
  let sql = "UPDATE `votes` SET `totalscore` = ?, `date` = FROM_UNIXTIME(? / 1000) WHERE `vid` = ?";

    sql = mysql.format(sql, [
      votes.totalscore,
      votes.date,
      vid
      
    ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows });
  });

});