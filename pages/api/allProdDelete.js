import db from '../../database.js';

export default function handler(req, res) {
    try {
        const { category } = req.body;
        const sql = `DELETE FROM products WHERE cid = ?`;
        db.run(sql, [category]);
        res.status(200).json({ message: 'Success', category: category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
