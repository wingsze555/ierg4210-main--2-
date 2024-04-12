import React, { useState, useEffect, useRef } from 'react';
import styles from "../styles/Cart.module.css";

export default function Cart({ updateCart }) {
  const [cartList, setCartList] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [amount, setAmount] = useState(0);
  const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);

  const [dbUUID, setdbUUID] = useState('');
  const dbUUIDRef = useRef(dbUUID); 
  useEffect(() => {
    dbUUIDRef.current = dbUUID;
  }, [dbUUID]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const cartProduct = localStorage.getItem("cartProduct");
      if (cartProduct) {
        const parsedCartProduct = JSON.parse(cartProduct);
        setCartList(parsedCartProduct);
        const names = [];
        const prices = [];
        let total = 0;

        for (const cartProduct of parsedCartProduct) {
          const response = await fetch(`/api/productDetail?pid=${cartProduct.pid}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Error in network response');
          }
          const data = await response.json();
          const productName = data.productName || 'error';
          const productPrice = data.productPrice || 'error';
          names.push(productName);
          prices.push(productPrice);

          const quantity = parseInt(cartProduct.quantity, 10);
          const price = parseFloat(productPrice);
          total += quantity * price;
        }

        setProductNames(names);
        setProductPrices(prices);
        setAmount(total);
      }
    };

    fetchProductDetail();
  }, [updateCart]);

  const handleQuantityChange = (event, index) => {
    const updatedCartList = [...cartList];
    updatedCartList[index].quantity = event.target.value;

    if (updatedCartList[index].quantity === '0') {
      const filteredCartList = updatedCartList.filter((item, i) => i !== index);
      setCartList(filteredCartList);
      localStorage.setItem("cartProduct", JSON.stringify(filteredCartList));
    } else {
      setCartList(updatedCartList);
      localStorage.setItem("cartProduct", JSON.stringify(updatedCartList));
    }

    let total = 0;
    for (let i = 0; i < updatedCartList.length; i++) {
      const quantity = parseInt(updatedCartList[i].quantity, 10);
      const price = parseFloat(productPrices[i]);
      total += quantity * price;
    }
    setAmount(total);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AbHFfbCtUNqCG5Und58mmTaL_fZvwCzFccXFltgbvf4aYpSaJqr4AWmH3sUdHZbvcm-tU7xQzO1j9YkI&components=buttons';
    script.async = true;
    script.onload = () => {
      setIsPayPalScriptLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isPayPalScriptLoaded) {
      paypal.Buttons({
        createOrder: async function (data, actions) {
          const cartProduct = localStorage.getItem("cartProduct");
          const url = new URL('/api/getOrder', window.location.href);
          url.searchParams.append('cartList', cartProduct);
          //url.searchParams.append('userName', UserName);

          if(cartProduct.length === 0){
            return
          }

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const orderDetails = await response.json();
          const { purchase_units } = orderDetails;

          if (orderDetails && orderDetails.purchase_units && orderDetails.purchase_units.length > 0) {
            const invoiceId = purchase_units[0].invoice_id;
            setdbUUID(invoiceId);
          } else {
            console.log('No purchase units found.');
          }

          return actions.order.create(orderDetails);
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function(orderData) {
            fetch('/api/saveOrder', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderData }),
            });
            localStorage.removeItem("cartProduct"); 
            window.location.reload();
          });
        },
        onCancel: function (data) {
          console.log(dbUUIDRef.current);
          fetch('/api/delOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: dbUUIDRef.current }),
          });
        },
      }).render('#paypal-button-container');
    }
  }, [isPayPalScriptLoaded]);



  return (
    <div>
      <div className={styles.cart}>Shopping Cart: ${amount}</div>
      {cartList.map((product, index) => (
        <div className={styles.item} key={index}>
          <div>{productNames[index]} ${productPrices[index]}</div>
          <div className={styles.row}>
            <span>Quantity:</span>
            <input className={styles.inputField} type="number" min="0" value={product.quantity} onChange={(event) => handleQuantityChange(event, index)} />
          </div>
        </div>
      ))}

{isPayPalScriptLoaded && (
        <div id="paypal-button-container" className={styles.paypalButton}></div>
      )}
      {!isPayPalScriptLoaded && (
        <button className={styles.checkoutButton}>Checkout</button>
      )}
    </div>
  );
}
