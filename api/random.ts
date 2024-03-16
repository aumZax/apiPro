import express from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  RegisterPostRequest } from '../model/test_res';

export const router = express.Router();

router.get("/", (req, res) => {
    let sql = `
      SELECT uid 
      FROM users 
      WHERE uid != 1 
      AND EXISTS (
        SELECT 1 
        FROM images 
        WHERE images.uid = users.uid
      )
      ORDER BY RAND() 
      LIMIT 2
    `;
    conn.query(sql, (err: any, results: any[]) => {
        if (err) {
            res.status(400).json(err);
        } else {
            if (results.length < 2) {
                res.status(404).json({ message: "Insufficient users found." });
            } else {
                const uid1 = results[0].uid;
                const uid2 = results[1].uid;

                sql = `SELECT * FROM images WHERE uid = ? ORDER BY RAND() LIMIT 1;`;
                conn.query(sql, [uid1], (err: any, results1: any[]) => {
                    if (err) { 
                        res.status(400).json(err);
                    } else {
                        if (results1.length === 0) {
                            res.status(404).json({ message: `No images found for user ${uid1}.` });
                            return;
                        }
                        const image1 = results1[0];

                        conn.query(sql, [uid2], (err: any, results2: any[]) => {
                            if (err) {
                                res.status(400).json(err);
                            } else {
                                if (results2.length === 0) {
                                    res.status(404).json({ message: `No images found for user ${uid2}.` });
                                    return;
                                }
                                const image2 = results2[0];

                                const data = { 
                                    uid1: uid1,
                                    image1: image1,
                                    uid2: uid2,
                                    image2: image2
                                };
                                res.json(data);
                            }
                        });
                    }
                });
            }
        }
    });
});
