import React, { useState } from 'react';
import styles from "../styles/Admin.module.css";
import { Navigate } from 'react-router-dom';
import Admin from './admin';

export default function User() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, setLoginUser] = useState(false);
  const [error, setError] = useState('');

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginUserClick = () => {
    if (user === 'user' && password === 'User') {
      setLoginUser(true);
    } else if (user === 'admin' && password === 'Adm1n') {
      setLoginUser('admin');
    } else {
      setLoginUser(false);
      setError('Please try again');
    }
  };

  if (loginUser === true) {
    return <Navigate to="/" />; // Redirect to /
  } else if (loginUser === 'admin') {
    return <Navigate to="/admin" />; // Redirect to /admin
  }

  return (
    <div className={styles.topNav}>
      <header></header>
      {loginUser === false && (
        <div>
          <div>{error}</div>
          <br />
          <label className={styles.label}>Account: </label>
          <input type="text" id="user" name="user" value={user} onChange={handleUserChange} required />
          <br />
          <label className={styles.label}>Password: </label>
          <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} required />
          <br />
          <button className={styles.submitButton} onClick={handleLoginUserClick}>Login</button>
        </div>
      )}
      {loginUser && user === 'admin' && <Admin />}
    </div>
  );
}