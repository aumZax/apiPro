import express, { Router } from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  ImagePostRequest } from '../model/image_res';
import { voteModel } from "../model/voteModel";
import { Static } from "../model/static";

export const router = express.Router();

router.delete("/", async (req, res) => {
    let today = new Date().toISOString().split('T')[0]; // วันที่วันนี้ในรูปแบบ YYYY-MM-DD
  
    let sql =
      "DELETE s FROM `statistics` s INNER JOIN `votes` v ON s.`vote_id` = v.`vid` WHERE DATE(v.`date`) = ?";
    sql = mysql.format(sql, [today]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json({ affected_row: result.affectedRows });
    });
  });