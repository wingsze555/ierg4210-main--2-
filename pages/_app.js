import React, { useState, useEffect } from 'react';
import "../styles/globals.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./index.js";
import Product from "./detail.js";
import Admin from "./admin.js";
import Login from "./login.js";

export default function App() {
  const [isServer, setIsServer] = useState(true);
  const [allCategory, setallCategory] = useState([]);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    setIsServer(false);
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
  }, []);

  if (isServer) return null;

  const navigation = [
    { name: 'Home', path: '/' },
  ];

  const findProduct = async (category) => {
    try {
      const response = await fetch(`/api/product?cid=${category}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Error in network response');
      }
      const data = await response.json();
      setProduct(data.productAll);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  //Change
  const redirectToLogin = () => {
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              navigation={navigation}
              findProduct={findProduct}
              product={product}
            />
          }
        />
        {allCategory.map((category) => (
          <Route
            key={category.name}
            path={`/${category.name}`}
            element={
              <Home
                navigation={[
                  { name: 'Home', path: '/' },
                  { name: category.name, path: `/${category.name}` },
                ]}
                findProduct={findProduct}
                product={product}
              />
            }
          />
        ))}
        {allCategory.map((category) => (
          <Route
            key={category.name}
            path={`/${category.name}/:product`}
            element={
              <Product
                navigation={[
                  { name: 'Home', path: '/' },
                  { name: category.name, path: `/${category.name}` },
                  { name: 'Product', path: '' },
                ]}
                findProduct={findProduct}
              />
            }
          />
        ))}
        {/*<Route path="*" element={<Navigate to="/" />} />*/}
        <Route path="/" element={redirectToLogin} />
        <Route exact path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}