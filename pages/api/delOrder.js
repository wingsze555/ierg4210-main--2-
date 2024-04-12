import db from '../../database.js';

export default async function handler(req, res) {
  try {
    const { order } = req.body;
    console.log(order);
    
    const sql = `DELETE FROM orders WHERE UUID = ?`;

    db.all(sql, [order], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Success' });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}