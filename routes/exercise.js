//種目追加
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'gymcore.db'));


router.post('/', verifyToken, async (req, res) => {
    const { name } = req.body; //種目名だけフロントから受け取る

    db.run(
        'INSERT INTO exercises (user_id, name) VALUES (?, ?)',
        [req.userId, name],
        function (err) {
            if (err) {
                return res.status(400).json({ error: '種目の追加に失敗しました' });
            }
            res.status(201).json({ message: '種目を追加しました', exerciseId: this.lastID });
        }
    );
});

module.exports = router;