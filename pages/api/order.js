import db from '../../database.js';

export default function handler(req, res) {
  try {
    const sql = `SELECT * FROM orders`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const orders = rows.map((row) => row);
      res.status(200).json({ orders: orders });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

