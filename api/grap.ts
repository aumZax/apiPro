import express from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  RegisterPostRequest } from '../model/test_res';
import { ImagePostRequest } from "../model/image_res";

export const router = express.Router();

router.get('/:image_id', (req, res) => {
    const image_id = req.params.image_id;
    const date = new Date();
    date.setDate(date.getDate() - 7); // ลบ 7 วันจากวันปัจจุบัน
  
    let sql = "SELECT totalscore FROM votes WHERE image_id = ? AND DATE(date) >= ?";
    conn.query(sql, [image_id, date.toISOString().slice(0, 10)], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการติดต่อกับฐานข้อมูล" });
      }
  
      res.json(result);
    });
});