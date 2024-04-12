import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import ProductList from './productList.js';
import Cart from './cart.js';

export default function Home({ navigation, findProduct, product }) {
  const location = useLocation();

  const [allCategory, setallCategory] = useState([]);
  const [productAll, setProductAll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartProduct, setCartProduct] = useState([]);

  const infiniteScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement || document.body;

    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    const fetchCategory = () => {
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
    };

    const fetchAllProducts = () => {
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
          console.error('Error fetching all products data:', error);
        });
    };

    fetchCategory();

    if (location.pathname === '/') {
      fetchAllProducts();
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      if (location.pathname === '/') {
        fetch(`/api/allProduct?page=${currentPage}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error in network response');
            }
            return response.json();
          })
          .then(data => {
            setProductAll(prevProducts => [...prevProducts, ...data.allProducts]);
          })
          .catch(error => {
            console.error('Error in fetching data:', error);
          });
      }
    };
    fetchData();
  }, [currentPage, location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll);
    return () => {
      window.removeEventListener('scroll', infiniteScroll);
    };
  }, []);


  const updateCartProduct = updatedCartProduct => {
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

      <div className={styles.global}>
        <div className={styles.divider}></div>
        <body className={styles.card}>
          <div className={styles.navigationBar}>
            {navigation.map((item, index) => (
              <React.Fragment key={item.path}>
                {index !== 0 && ' > '}
                <Link to={item.path} onClick={() => { if (item.path === '/') { router.reload() } }}>
                  {item.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
          <ProductList productAll={location.pathname === '/' ? productAll : product} updateCartProduct={updateCartProduct} />
        </body>
      </div>
    </div>
  );
}
