import db from '../../database.js';

export default async function handler(req, res) {
  try {

    const { orderData } = req.body;

    const invoiceID = orderData.purchase_units[0].invoice_id;
    const item = orderData.purchase_units[0].items;
    const itemsJSON = JSON.stringify(item);
    const status = orderData.status;
    const date = orderData.create_time;
    
    const sql = `UPDATE orders SET orderDetails = ?, status = ?, date = ? WHERE UUID = ?`;

    db.all(sql, [itemsJSON,status, date, invoiceID], (err, rows) => {
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