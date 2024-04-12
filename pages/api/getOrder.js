import db from '../../database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    const { cartList } = req.query;
    const parsedCartList = JSON.parse(cartList);

    if (!Array.isArray(parsedCartList)) {
      throw new Error('cartList should be an array');
    }

    const quantities = [];
    const items = [];
    const names = [];
    const prices = [];

    for (let i = 0; i < parsedCartList.length; i++) {
      quantities.push(parsedCartList[i].quantity);
    }

    let sql = 'SELECT * FROM products WHERE pid = ?';

    await Promise.all(
      parsedCartList.map(async (item) => {
        const rows = await new Promise((resolve, reject) => {
          db.all(sql, [item.pid], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });

        const productName = rows.map((row) => row.name);
        const productPrice = rows.map((row) => row.price);

        names.push(productName);
        prices.push(productPrice);
      })
    );

    for (let i = 0; i < parsedCartList.length; i++) {
      items.push({
        name: names[i][0],
        unit_amount: { currency_code: 'USD', value: parseInt(prices[i][0]) },
        quantity: quantities[i],
      });
    }

    let total = 0;
    for (let i = 0; i < parsedCartList.length; i++) {
      total += quantities[i] * parseInt(prices[i][0]);
    }

    const amount = {
      currency_code: 'USD',
      value: total.toFixed(2),
      breakdown: { item_total: { currency_code: 'USD', value: total.toFixed(2) } },
    };

    const invoice_id = uuidv4();

    let salt;
    const email = 'sb-gmpbl29841825@business.example.com';
    const generateDigest = async () => {
      salt = await bcrypt.genSalt(10);
      const digest = await bcrypt.hash(`${items}, ${amount}, ${email}`, salt);
      return digest;
    };

    const custom_id = await generateDigest();

    const purchase_units = [
      {
        amount,
        items,
        custom_id,
        invoice_id,
      },
    ];

    sql = `INSERT INTO orders (UUID, username, digest, salt) VALUES(?,?,?,?)`;

    db.run(sql, [invoice_id,'', custom_id, salt],(err) => {
        if (err) return console.error(err.message);
      }
    );

    res.status(200).json({ purchase_units });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}