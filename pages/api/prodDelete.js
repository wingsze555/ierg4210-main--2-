import db from '../../database.js';

export default function handler(req, res) {
  try {
    let sql;
    const { prodDelete } = req.body;
    sql = `DELETE FROM products WHERE name = ?`;
    db.run(sql, [prodDelete]);
    res.status(200).json({ message: 'Success', prodDelete: prodDelete });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
