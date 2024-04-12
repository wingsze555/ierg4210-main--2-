import db from '../../database.js';

export default async function handler(req, res) {
    try {
        const { oldProduct, updateItem, updateValue } = req.body;
        let sql, params;

        switch (updateItem) {
            case 'name':
                sql = 'UPDATE products SET name = ? WHERE name = ?';
                params = [updateValue, oldProduct];
                break;
            case 'price':
                sql = 'UPDATE products SET price = ? WHERE name = ?';
                params = [updateValue, oldProduct];
                break;
            case 'inventory':
                sql = 'UPDATE products SET inventory = ? WHERE name = ?';
                params = [updateValue, oldProduct];
                break;
            case 'description':
                sql = 'UPDATE products SET description = ? WHERE name = ?';
                params = [updateValue, oldProduct];
                break;
            case 'image':
                sql = 'UPDATE products SET description = ? WHERE image = ?';
                params = [updateValue, oldProduct];
                break;
            default:
                throw new Error('Invalid update item');
        }

        db.run(sql, params);

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
}