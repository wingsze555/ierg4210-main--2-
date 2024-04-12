import db from '../../database.js';

export default function handler(req, res) {
  try {
    let sql;
    sql = `SELECT * FROM categories`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const categoryNames = rows.map((row) => row.name);
      const allCategory = rows.map((row) => row);
      res.status(200).json({ categories: categoryNames, allCategory: allCategory });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

