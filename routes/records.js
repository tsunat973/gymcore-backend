//記録追加API
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'gymcore.db'));

router.post('/',verifyToken,  async (req, res) => {
    const { exercise_id, date, weight, reps, sets, memo } = req.body;
    db.run(
        'INSERT INTO records (exercise_id, date, weight, reps, sets, memo) VALUES (?, ?, ?, ?, ?, ?)',
        [exercise_id, date, weight, reps, sets, memo],
        function (err) {
            if (err) {
                return res.status(400).json({ error: '必須項目が未入力です' });
            }
                            //this.lastIDとは

            res.status(201).json({ message: '登録成功', recordId: this.lastID });
        }
    );


});

module.exports = router;