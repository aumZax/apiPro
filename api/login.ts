import express from "express";
import { conn, queryAsync } from "../dbconn";
import mysql from "mysql";
import {  RegisterPostRequest } from '../model/test_res';

export const router = express.Router();

router.get("/:username", (req, res) => {
    const username = req.query.username;
    
    let sql = "SELECT * FROM users where username = ?";
  
    conn.query(sql,[username], (err, result, fields) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  
  });
  

  
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/", async (req, res) => {
  let User: RegisterPostRequest = req.body;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(User.password, saltRounds);
  
  // Check if password and confirm password match
  if (User.password === User.conpassword) {
    let sql =
    "INSERT INTO `users`(`type`, `username`, `password`, `name`, `profile`) VALUES (?,?,?,?,?)";
    sql = mysql.format(sql, [User.type, User.username, hashedPassword, User.name, User.profile]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  } else {
    return res.status(400).json({ message: "Password and confirm password do not match" });
  }
});


  