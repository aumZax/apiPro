import express, { Router } from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  ImagePostRequest } from '../model/image_res';
import { voteModel } from "../model/voteModel";
import { Static } from "../model/static";

export const router = express.Router();

router.get('/:uid', (req, res) => {
    const uid = req.params.uid;

    let sql = "SELECT * FROM images WHERE uid = ?"
    conn.query(sql, [uid], (err, result) => {
        if (err) {
            console.error(err);
            // ในกรณีเกิดข้อผิดพลาด ควรจะส่งข้อความผิดพลาดกลับไป
            res.status(500).json({ error: 'An error occurred' });
            return;
        }

        // รีเทิร์นข้อมูลทั้งหมดที่เชื่อมกันระหว่างตาราง votes, statistics, images, และ users (10 รายการแรก)
        res.json(result);
    });
});