import db from '../../database.js';

export default function handler(req, res) {
  try {
    let sql;
    sql = `SELECT * FROM products`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const allProducts = rows.map((row) => row);
      res.status(200).json({ allProducts: allProducts });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

