//記録追加API
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'gymcore.db'));

router.post('/', verifyToken, async (req, res) => {
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

router.get('/:exerciseId', verifyToken, (req, res) => {
    const exerciseId = req.params.exerciseId;
    db.all('SELECT * FROM records WHERE exercise_id = ?', [exerciseId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'サーバーエラー' });
        }
        if (!rows) {
            return res.status(404).json({ error: '種目が見つかりません' });
        }
        res.status(200).json(rows);
    })
})

//記録削除機能

router.delete('/:id', verifyToken, (req, res) => {
    const recordId = req.params.id;

    db.run('DELETE FROM records WHERE id = ?', [recordId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'サーバーエラー' });
            }
            if(this.changes === 0) {
                return res.status(404).json({error: '指定された記録が見つかりません' })
            }

            res.status(200).json({ message: '削除しました', deletenum: this.changes });
        }
    )
})

//記録更新

router.put('/:id', verifyToken, (req, res) => {
    const recordId = req.params.id;
    const { weight, reps, sets, date, memo } = req.body;

    db.run(
        'UPDATE records SET weight = ?, reps = ?, sets = ?, date = ?, memo = ? WHERE id = ?',
        [weight, reps, sets, date, memo, recordId],
        function (err) {
              if (err) {
                return res.status(500).json({ error: 'サーバーエラー' });
            }
            if(this.changes === 0) {
                return res.status(404).json({error: '指定された記録が見つかりません' })
            }

            res.status(200).json({ message: '変更しました', changenum: this.changes });
        }
        )
})
module.exports = router;