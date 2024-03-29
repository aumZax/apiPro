import express from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  RegisterPostRequest } from '../model/test_res';
import { ImagePostRequest } from "../model/image_res";

export const router = express.Router();

// router.get('/:uid', async (req, res) => {
//     const today = new Date().toISOString().slice(0, 10);
//     const uid = req.params.uid; // Get uid from request parameters

//     let sql = "SELECT * FROM votes INNER JOIN statistics ON votes.vid = statistics.vote_id INNER JOIN images ON votes.image_id = images.image_id INNER JOIN users ON images.uid = users.uid WHERE DATE(votes.date) = ? AND users.uid = ? ORDER BY votes.totalscore DESC";

//     conn.query(sql, [today, uid], (err, todayResult) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'An error occurred' });
//             return;
//         }

//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         const yesterdayStr = yesterday.toISOString().slice(0, 10);

//         let yesterdaySql = "SELECT * FROM votes INNER JOIN statistics ON votes.vid = statistics.vote_id INNER JOIN images ON votes.image_id = images.image_id INNER JOIN users ON images.uid = users.uid WHERE DATE(votes.date) = ? AND users.uid = ? ORDER BY votes.totalscore DESC";

//         conn.query(yesterdaySql, [yesterdayStr, uid], (err, yesterdayResult) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).json({ error: 'An error occurred' });
//                 return;
//             }

//             const imageId = 1; // กำหนดค่า imageId เป็นตัวอย่าง

//             // Compare ranks and return the comparison result with image_id
//             const compareResult = compareRank(todayResult, yesterdayResult);
//             res.json(compareResult);
//         });
//     });
// });

// function compareRank(todayResult: any[], yesterdayResult: any[]): { image_id: number, rankDifference: number }[] {
//     return todayResult.map((todayItem, index) => {
//         const imageId = todayItem.image_id;
//         const yesterdayItem = yesterdayResult.find(item => item.image_id === imageId);

//         if (!yesterdayItem) {
//             // If imageId not found in yesterday's results, skip
//             return { image_id: imageId, rankDifference: 0 }; // Return 0 for change if imageId not found
//         }

//         const todayRank = index + 1;
//         const yesterdayRank = yesterdayResult.indexOf(yesterdayItem) + 1;
//         const rankDifference = yesterdayRank - todayRank;

//         return { image_id: imageId, rankDifference: rankDifference };
//     });
// }

router.get('/:uid', async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const uid = req.params.uid; // Get uid from request parameters

    let sql = "SELECT * FROM votes INNER JOIN statistics ON votes.vid = statistics.vote_id INNER JOIN images ON votes.image_id = images.image_id INNER JOIN users ON images.uid = users.uid WHERE DATE(votes.date) = ?  ORDER BY votes.totalscore DESC";

    conn.query(sql, [today, uid], (err, todayResult) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        let yesterdaySql = "SELECT * FROM votes INNER JOIN statistics ON votes.vid = statistics.vote_id INNER JOIN images ON votes.image_id = images.image_id INNER JOIN users ON images.uid = users.uid WHERE DATE(votes.date) = ? ORDER BY votes.totalscore DESC";

        conn.query(yesterdaySql, [yesterdayStr, uid], (err, yesterdayResult) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred' });
                return;
            }

            const imageId = 1; // กำหนดค่า imageId เป็นตัวอย่าง

            // เปรียบเทียบ rank ของข้อมูลวันนี้กับข้อมูลของวันก่อนหน้า
            const compareResult = compareRank(todayResult, yesterdayResult);
            res.json(compareResult);
        });
    });
});

function compareRank(todayResult: any[], yesterdayResult: any[]): { image_id: number, rankDifference: number }[] {
    return todayResult.map((todayItem, index) => {
        const imageId = todayItem.image_id;
        const yesterdayItem = yesterdayResult.find(item => item.image_id === imageId);

        if (!yesterdayItem) {
            // If imageId not found in yesterday's results, skip
            // return 0; // Return 0 for change if imageId not found
            return { image_id: imageId, rankDifference: 0 }; // Return 0 for change if imageId not found
        }

        const todayRank = index + 1;
        const yesterdayRank = yesterdayResult.indexOf(yesterdayItem) + 1;
        const rankDifference = yesterdayRank - todayRank;

        // return rankDifference;
        return { image_id: imageId, rankDifference: rankDifference };
    });
}