import db from '../../database.js';

export default function handler(req, res) {
    try {
        const { cid } = req.query;
        const sql = 'SELECT * FROM products WHERE cid = ?';
        db.all(sql, [cid], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            const productAll = rows.map((row) => row);
            res.status(200).json({ productAll });
        });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

