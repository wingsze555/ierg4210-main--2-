import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import styles from "../styles/Detail.module.css";
import { Link, useLocation } from 'react-router-dom';
import Image from "next/image";
import Cart from './cart.js';

export default function Product({ navigation, findProduct }) {
  const location = useLocation();
  const { product } = location?.state;
  const [cartProduct, setCartProduct] = useState([]);
  const [allCategory, setallCategory] = useState([]);

  useEffect(() => {
    fetch('/api/category')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error in network response');
        }
        return response.json();
      })
      .then(data => {
        setallCategory(data.allCategory);
      })
      .catch(error => {
        console.error('Error in fetching data:', error);
      });

    if (location.pathname === '/') {
      fetch('/api/allProduct')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error in network response');
          }
          return response.json();
        })
        .then(data => {
          setProductAll(data.allProducts);
        })
        .catch(error => {
          console.error('Error in fetching data:', error);
        });
    }
  }, []);

  useEffect(() => {
    findProduct(product.cid);
  }, []);

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

  const updateCartProduct = (updatedCartProduct) => {
    setCartProduct(updatedCartProduct);
  };

  return (
    <div>
      <header className={styles.topNav}>
        <div className={styles.leftNav}>
          <header className={styles.title}>
            <Link href="/">Grocery Store</Link>
          </header>
        </div>
        <div className={styles.middleNav}>
          <ul className={styles.navList}>
            <span>
              {allCategory.map(category => (
                <Link to={`/${category.name}`} key={category.name}>
                  <button
                    className={styles.categoryList}
                    value={category.name}
                    onClick={() => findProduct(category.cid)}
                  >
                    {category.name}
                  </button>
                </Link>
              ))}
            </span>
          </ul>
        </div>
        <div className={styles.rightNav}>
          <div className={styles.shoppingList}>
            <div className={styles.shoppingList}>
              <FontAwesomeIcon icon={faCartShopping} />
              <div className={styles.submenu}>
                <Cart updateCart={cartProduct} />
              </div>
            </div>
            <div className={styles.submenu}>
              <Cart updateCart={cartProduct} />
            </div>
          </div>
        </div>
      </header>
      <div className={styles.wrapper}>
        <div className={styles.divider}>:</div>
        <nav className={styles.navigationBar}>
          {navigation.map((item, index) => (
            <React.Fragment key={item.path}>
              {index !== 0 && ' > '}
              <Link to={item.path} state={{ product: product }}>
                {item.name}
              </Link>
            </React.Fragment>
          ))}
        </nav>
        <div className={styles.productContainer}>
          <Image src={product.image} className={styles.imgPosition} alt={product.name} height={100} width={100} />
          <div className={styles.right}>
            <h1 className={styles.name}>{product.name}</h1>
            <span className={styles.description}>Description: {product.description}</span>
            <h2 className={styles.price}>${product.price}</h2>
            {product.inventory > 0 && (
              <h5 className={styles.inStock}>In Stock</h5>
            )}
            {product.inventory <= 0 && (
              <h5 className={styles.outOfStock}>Out of Stock</h5>
            )}
            <h2 className={styles.status}>{product.status}</h2>
            {product.inventory >= 3 && (
              <h5 className={styles.stock}>Inventory: {product.inventory}</h5>
            )}
            {product.inventory < 3 && product.inventory > 0 && (
              <h5 className={styles.stock2}>Only {product.inventory} left!</h5>
            )}
            <button className={styles.addToCart} type="button" onClick={() => addToCart({ pid: product.pid, quantity: 1 })}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
