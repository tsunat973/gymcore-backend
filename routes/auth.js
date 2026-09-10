//登録、ログイン用
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');


const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'gymcore.db'));

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'メールアドレスとパスワードを入力してください' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword],
            function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ error: 'そのメールアドレスは既に使われています' });
                }
                res.status(201).json({ message: '登録成功', userId: this.lastID });
            }

        );
    } catch (err) {
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'メールアドレスとパスワードを入力してください' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email],
        async function (err, user) {
            if (err) {
                return res.status(500).json({ error: 'サーバーエラー' });
            }
            if (!user) {
                return res.status(400).json({ error: 'ユーザーが見つかりません' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: 'パスワードが違います' });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // ここまで来たらログイン成功
            res.status(200).json({ message: 'ログイン成功', token });



        })
})

router.get('/me', verifyToken, (req, res) => {
  // ここに来る時点で、verifyTokenを通過済み(=本人確認OK)
  db.get('SELECT * FROM users WHERE id = ?', [req.userId], (err, user) => {
    if(err) {
        return res.status(500).json({ error: 'サーバーエラー' });
    }
    if( !user) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }
    res.status(200).json({ id: user.id,email: user.email });
  });
});



module.exports = router;