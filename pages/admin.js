import React, { useState, useEffect } from 'react';
import styles from "../styles/Admin.module.css";
import Link from 'next/link';

export default function Admin() {
    const [updateValue, setUpdateValue] = useState('');
    const [oldCategory, setOldCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [catUpdate, setcatUpdate] = useState('');
    const [catDelete, setcatDelete] = useState('');
    const [oldProduct, setOldProduct] = useState('');
    const [updateItem, setUpdateItem] = useState('');
    const [prodDeleteByCatid, setProdDeleteByCatid] = useState('');
    const [prodDelete, setprodDelete] = useState('');
    const [admin, setAdmin] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);
    const [error, setMessage] = useState('');

    const handlecatUpdateChange = (event) => {
        setcatUpdate(event.target.value);
    };

    const handleOldCategoryChange = (event) => {
        setOldCategory(event.target.value);
    };

    const handleOldProductChange = (event) => {
        setOldProduct(event.target.value);
    };

    const handleUpdateItemChange = (event) => {
        setUpdateItem(event.target.value);
    };

    const handleUpdateValueChange = (event) => {
        setUpdateValue(event.target.value);
    };

    const handlecatDeleteChange = (event) => {
        setcatDelete(event.target.value);
    };

    const handleprodDeleteChange = (event) => {
        setprodDelete(event.target.value);
    };

    const handleprodDeleteByCatidChange = (event) => {
        setProdDeleteByCatid(event.target.value);
    };

    const handlecatDeleteClick = async () => {
        try {
            const response = await fetch('/api/catDelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ catDelete }),
            });

            if (response.ok) {
                console.log('Category deleted successfully!');
            } else {
                console.error('Error deleting category:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handlecatUpdate = async () => {
        try {
            const response = await fetch('/api/catUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ catUpdate, oldCategory }),
            });

            if (response.ok) {
                console.log('Product updated successfully!');
            } else {
                console.error('Error updating product:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleNewProduct = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'productName':
                setProductName(value);
                break;
            case 'productPrice':
                setProductPrice(value);
                break;
            case 'productInventory':
                setProductInventory(value);
                break;
            case 'productDescription':
                setProductDescription(value);
                break;
            default:
                break;
        }
    };

    const handleprodEdit = async () => {
        try {
            const response = await fetch('/api/prodEdit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldProduct, updateItem, updateValue }),
            });

            if (response.ok) {
                console.log('Product updated successfully!');
            } else {
                console.error('Error updating product:', response.statusText);
            } s
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleprodDeleteClick = async () => {
        try {
            const response = await fetch('/api/prodDelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prodDelete }),
            });

            if (response.ok) {
                console.log('Product deleted successfully!');
            } else {
                console.error('Error deleting product:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleProdDeleteByCatidClick = async () => {
        try {
            const response = await fetch('/api/allProdDelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prodDelete: prodDeleteByCatid }),
            });

            if (response.ok) {
                console.log('Products deleted successfully!');
            } else {
                console.error('Error deleting products:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleNewCategoryChange = (event) => {
        setNewCategory(event.target.value);
    };

    const handleNewCategoryClick = async () => {
        try {
            const response = await fetch('/api/catInsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newCategory }),
            });

            if (response.ok) {
                console.log('Category inserted successfully!');
            } else {
                console.error('Error inserting category:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const [allCategory, setallCategory] = useState([]);
    const [productAll, setProductAll] = useState([]);

    useEffect(() => {
        fetch('/api/category')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error in network response');
                }
                return response.json();
            })
            .then((data) => {
                setallCategory(data.allCategory);
            })
            .catch((error) => {
                console.error('Error in fetching data:', error);
            });
        fetch('/api/allProduct')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error in network response');
                }
                return response.json();
            })
            .then((data) => {
                setProductAll(data.allProducts);
            })
            .catch((error) => {
                console.error('Error in fetching data:', error);
            });
    }, []);

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(undefined);
    const [productInventory, setProductInventory] = useState(undefined);
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState(undefined);
    const [newProductCategory, setNewProductCategory] = useState('');

    const handleProductImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProductImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNewProductCategory = (event) => {
        setNewProductCategory(event.target.value);
    };

    const handleNewProductClick = async () => {
        try {
            const response = await fetch('/api/prodInsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName, productPrice, productInventory, productDescription, productImage, newProductCategory }),
            });

            if (response.ok) {
                console.log('Product inserted successfully!');
            } else {
                console.error('Error inserting product:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleadminChange = (event) => {
        setAdmin(event.target.value);
    };

    const handlepasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLoginClick = () => {
        if (admin !== 'admin' || password !== 'Adm1n') {
            setLogin(false);
            setMessage('Please try again');
        } else {
            setLogin(true);
        }
    };

    return (
        <div className={styles.topNav}>
            <header>
                <h1>Grocery Store - Admin Panel</h1>
                <div className={styles.divider}></div>
                <Link href="/" className={styles.link}>Back to Grocery Stores</Link>
            </header>
            {/*
            {login === false && (
                <div>
                    <div>{error}</div>
                    <br></br>
                    <label className={styles.label}>Account: </label>
                    <input type="text" id="admin" name="admin" value={admin} onChange={handleadminChange} required />
                    <br></br>
                    <label className={styles.label}>Password: </label>
                    <input type="text" id="password" name="password" value={password} onChange={handlepasswordChange} required />
                    <br></br>
                    <button className={styles.submitButton} onClick={handleLoginClick}>Login</button>
                </div>
            )}
            {login === true && (
            */}
                <div>
                    <div className={styles.divider}></div>
                    <h2>By Category:</h2>

                    <tr>
                        <td>
                            <fieldset className={styles.adminList}>
                                <legend className={styles.panelList}> New Category</legend>
                                <form>
                                    <label className={styles.label}>Name *</label>
                                    <input type="text" id="newCategory" name="newCategory" value={newCategory} onChange={handleNewCategoryChange} required />
                                    <button className={styles.submitButton} onClick={handleNewCategoryClick}>Submit</button>
                                </form>
                            </fieldset>
                        </td>
                        <td>
                            <fieldset className={styles.adminList}>
                                <legend className={styles.panelList}> Edit Category</legend>
                                <form>
                                    <label className={styles.label}>Name *</label>
                                    <select name="oldCategory" id="oldCategory" onChange={handleOldCategoryChange} required>
                                        <option value="">Select</option>
                                        {allCategory.map((category) => {
                                            if (category.name !== "Sample") {
                                                return (
                                                    <option key={category.name} value={category.name}>{category.name}</option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </select>
                                    <label className={styles.label}>New Name *</label>
                                    <input type="text" id="catUpdate" name="catUpdate" value={catUpdate} onChange={handlecatUpdateChange} required />
                                    <button className={styles.submitButton} onClick={handlecatUpdate}>Submit</button>
                                </form>
                            </fieldset>
                        </td>
                        <td>
                            <fieldset className={styles.adminList}>
                                <legend class="panelList"> Delete Category</legend>
                                <form>
                                    <label className={styles.label}>Category </label>
                                    <select name="category" id="category" onChange={handlecatDeleteChange} required>
                                        <option value="">Select</option>
                                        {allCategory.map((category) => {
                                            if (category.name !== "Sample") {
                                                return (
                                                    <option key={category.name} value={category.name}>{category.name}</option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </select>
                                    <div className={styles.warning}>*This action cannot be undone.</div>
                                    <button className={styles.deleteButton} onClick={handlecatDeleteClick}>Submit</button>
                                </form>
                            </fieldset>
                        </td>
                    </tr>

                    <div className={styles.divider}></div>
                    <h2>By Product:</h2>
                    <tr>
                        <td>
                            <fieldset className={styles.adminList}>
                                <legend className={styles.panelList}> New Product</legend>
                                <form>
                                    <label className={styles.label}>Category *</label>
                                    <select name="newProductCategory" id="newProductCategory" onChange={handleNewProductCategory} required>
                                        <option value="">Select</option>
                                        {allCategory.map((category) => {
                                            if (category.name !== "Sample") {
                                                return (
                                                    <option key={category.cid} value={category.cid}>{category.name}</option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </select>
                                    <label className={styles.label}>Name *</label>
                                    <input type="text" id="productName" name="productName" onChange={handleNewProduct} required />
                                    <label className={styles.label}>Price *</label>
                                    <input type="number" id="productPrice" name="productPrice" onChange={handleNewProduct} required />
                                    <label className={styles.label}>Inventory *</label>
                                    <input type="number" id="productInventory" name="productInventory" onChange={handleNewProduct} required />
                                    <label className={styles.label}>Description *</label>
                                    <textarea type="text" id="productDescription" name="productDescription" onChange={handleNewProduct} required />
                                    <label className={styles.label}>Image *</label>
                                    <div className={styles.ImageInput}>
                                        <div>
                                            <input className={styles.imgButton} type="file" id="productImage" name="productImage" accept="image/jpeg, image/gif, image/png" onChange={handleProductImage} required />
                                        </div>
                                    </div>
                                    <button className={styles.submitButton} onClick={handleNewProductClick}>Submit</button>
                                </form>
                            </fieldset>
                        </td>
                        <td>
                            <fieldset className={styles.adminList}>
                                <legend className={styles.panelList}>Edit Product</legend>
                                <form>
                                    <label className={styles.label}>Product *</label>
                                    <select className={styles.Select} name="oldProduct" id="oldProduct" onChange={handleOldProductChange} required>
                                        <option value="">Select</option>
                                        {productAll.map((category) => {
                                            if (category.name !== "Sample") {
                                                return (
                                                    <option key={category.name} value={category.name}>{category.name}</option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </select>
                                    <label className={styles.label}>Update Item *</label>
                                    <select name="updateItem" id="updateItem" onChange={handleUpdateItemChange} required>
                                        <option value="">Select</option>
                                        <option value="name">Name</option>
                                        <option value="price">Price</option>
                                        <option value="inventory">Inventory</option>
                                        <option value="description">Description</option>
                                        <option value="image">Image</option>
                                    </select>
                                    {updateItem === "name" && (
                                        <input className={styles.textMargin} type="text" id="updateValue" name="updateValue" onChange={handleUpdateValueChange} required />
                                    )}
                                    {updateItem === "price" && (
                                        <input className={styles.textMargin} type="number" id="updateValue" name="updateValue" onChange={handleUpdateValueChange} required />
                                    )}
                                    {updateItem === "inventory" && (
                                        <input className={styles.textMargin} type="number" id="updateValue" name="updateValue" onChange={handleUpdateValueChange} required />
                                    )}
                                    {updateItem === "description" && (
                                        <textarea className={styles.textMargin} id="updateValue" name="updateValue" onChange={handleUpdateValueChange} required />
                                    )}
                                    {updateItem === "image" && (
                                        <input className={`${styles.textMargin} ${styles.imgButton}`} type="file" id="updateValue" name="updateValue" accept="image/jpeg, image/gif, image/png" onChange={handleUpdateValueChange} required />
                                    )}
                                    <button className={styles.submitButton} onClick={handleprodEdit}>Submit</button>
                                </form>
                            </fieldset>
                        </td>
                        <td>
                            <fieldset className={styles.adminList}>
                                <legend class="panelList"> Delete Product</legend>
                                <form>
                                    <label className={styles.label}>Product </label>
                                    <select className={styles.Select} name="product" id="product" onChange={handleprodDeleteChange} required>
                                        <option value="">Select</option>
                                        {productAll.map((product) => {
                                            if (product.name !== "Sample") {
                                                return (
                                                    <option key={product.pid} value={product.name}>{product.name}</option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </select>
                                    <div className={styles.warning}>*This action cannot be undone.</div>
                                    <button className={styles.deleteButton} onClick={handleprodDeleteClick}>Submit</button>
                                </form>
                            </fieldset>
                            <fieldset className={styles.adminList}>
                                <legend className="panelList">Delete All Products in the same Category</legend>
                                <form>
                                    <label className={styles.label}>Category</label>
                                    <select name="category" id="category" onChange={handleprodDeleteByCatidChange} required>
                                        <option value="">Select</option>
                                        {allCategory.map((category) => {
                                            if (category.name !== "Sample") {
                                                return (
                                                    <option key={category.name} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                );
                                            }
                                            return null;
                                        })}
                                    </select>
                                    <div className={styles.warning}>*This action cannot be undone.</div>
                                    <button className={styles.deleteButton} onClick={handleProdDeleteByCatidClick}>
                                        Submit
                                    </button>
                                </form>
                            </fieldset>
                        </td>
                    </tr>
                </div>
            {/*})} */}
        </div>

    );

}
