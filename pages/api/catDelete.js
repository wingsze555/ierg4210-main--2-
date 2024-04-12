import db from '../../database.js';

export default function handler(req, res) {
  try {
    let sql;
    const { catDelete } = req.body;
    if (catDelete != '') {
      sql = `DELETE FROM categories WHERE name = ?`;
      db.run(sql, [catDelete]);
    }
    res.status(200).json({ message: 'Success', catDelete: catDelete });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
