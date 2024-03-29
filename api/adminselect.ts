import express, { Router } from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";


export const router = express.Router();


router.get('/', (req, res) => {
    let sql = "SELECT * FROM users WHERE uid <> 1"; // เพิ่มเงื่อนไข WHERE เพื่อไม่นำข้อมูลที่ uid เท่ากับ 1 มาดึง
    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        res.json(result);
    });
});


router.get("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("select * from users where uid = ?" , [id], (err, result, fields) => {
    if (err) throw err;
      res.json(result);
    });
  });
