import express, { Router } from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  ImagePostRequest } from '../model/image_res';
import { voteModel } from "../model/voteModel";
import { Static } from "../model/static";

export const router = express.Router();


router.get('/', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    let sql = "SELECT * FROM votes INNER JOIN statistics ON votes.vid = statistics.vote_id INNER JOIN images ON votes.image_id = images.image_id INNER JOIN users ON images.uid = users.uid WHERE DATE(votes.date) = ? ORDER BY votes.totalscore DESC LIMIT 10";

    conn.query(sql, [today], (err, result) => {
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


