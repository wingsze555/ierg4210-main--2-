import db from '../../database.js';

export default function handler(req, res) {
    try {
        const { pid } = req.query;
        const sql = 'SELECT * FROM products WHERE pid = ?';
        db.all(sql, [pid], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            const productName = rows.map((row) => row.name);
            const productPrice = rows.map((row) => row.price);
            res.status(200).json({ productName, productPrice });
        });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

