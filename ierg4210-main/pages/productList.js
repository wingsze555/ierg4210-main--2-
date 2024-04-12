import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ProductList.module.css";

export default function ProductList({ productAll, updateCartProduct }) {
  const [categories, setCategories] = useState([]);
  const [cartProduct, setCartProduct] = useState([]);

  const addToCart = (product) => {
    const cartProduct = JSON.parse(localStorage.getItem("cartProduct")) || [];
    const productExists = cartProduct.some((p) => p.pid === product.pid);

    if (!productExists) {
      const updatedCart = [...cartProduct, product];
      setCartProduct(updatedCart);
      localStorage.setItem("cartProduct", JSON.stringify(updatedCart));
      updateCartProduct(updatedCart);
    }
  };

  const searchCid = async (cid) => {
    const response = await fetch(`/api/catSearch?cid=${cid}`, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Error in network response');
    }
    const data = await response.json();
    return data.category;
  };

  useEffect(() => {
    setCartProduct(JSON.parse(localStorage.getItem("cartProduct")));
    const fetchCategories = async () => {
      const categoryPromises = productAll.map((product) => searchCid(product.cid));
      const resolvedCategories = await Promise.all(categoryPromises);
      setCategories(resolvedCategories);
    };

    fetchCategories();
  }, [productAll]);

  return (
    <div className={styles.productContainer}>
      {productAll.map((product, index) => (
        <div className={styles.product} key={index}>
          <Link
            to={{
              pathname:
                categories[index] &&
                `/${categories[index].map((category) => category).join(", ")}/${product.pid}`,
            }}
            state={{ product: product }}
          >
            <img src={product.image} className={styles.image} alt={product.name} />
          </Link>
          <Link
            to={{
              pathname:
                categories[index] &&
                `/${categories[index].map((category) => category).join(", ")}/${product.pid}`,
            }}
            state={{ product: product }}
          >
            <h6 className={styles.name}>{product.name}</h6>
          </Link>
          <span className={styles.price}>${product.price}</span>
          <button className={styles.addToCart} onClick={() => addToCart({ pid: product.pid, quantity: 1 })}>Add To Cart</button>
        </div>
      ))}
    </div>
  );
}
