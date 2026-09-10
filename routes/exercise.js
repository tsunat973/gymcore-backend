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

//種目一覧
router.get('/', verifyToken, (req, res) => {
  // ここに来る時点で、verifyTokenを通過済み(=本人確認OK)
  db.all('SELECT * FROM exercises WHERE user_id = ?', [req.userId], (err, rows) => {
    if(err) {
        return res.status(500).json({ error: 'サーバーエラー' });
    }
    if( !rows) {
        return res.status(404).json({ error: '種目が見つかりません' });
    }
    res.status(200).json(rows);
  })
});


router.delete('/:id', verifyToken, (req, res) => {
    const recordId = req.params.id;

    db.run('DELETE FROM exercises WHERE id = ?', [recordId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'サーバーエラー' });
            }
            if(this.changes === 0) {
                return res.status(404).json({error: '指定された種目が見つかりません' });
            }
            res.status(200).json({ message: '削除しました', deletenum: this.changes });
        }
    )
})

router.put('/:id', verifyToken, (req, res) => {
    const recordId = req.params.id;
    const { name } = req.body;

    db.run(
        'UPDATE exercises SET name = ? WHERE id = ?',
        [name, recordId],
        function (err) {
              if (err) {
                return res.status(500).json({ error: 'サーバーエラー' });
            }
            if(this.changes === 0) {
                return res.status(404).json({error: '指定された種目が見つかりません' });
            }

            res.status(200).json({ message: '変更しました', changenum: this.changes });
        }
        )
})

module.exports = router;