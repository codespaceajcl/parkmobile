import React, { useState, useEffect } from 'react';
import mainLogo from "./assets/main_logo.png";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Spinner } from 'react-bootstrap';
import { errorNotify, successNotify } from './toast/toast';

function App() {
  const [password, setPassword] = useState('')
  const [changePassword, setChangePassword] = useState('');
  const [getToken, setGetToken] = useState('')
  const [loading, setLoading] = useState(false)

  const location = useLocation();

  useEffect(() => {

    const token = new URLSearchParams(location.search).get('token');
    setGetToken(token)

  }, [location.search]);

  const changePasswordHandler = () => {
    if (password === changePassword) {
      setLoading(true)

      const data = {
        password,
        token: getToken
      }

      axios.post("https://crms.ajcl.net:7790/auth/confirm/", data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          successNotify("Password Change Successfully!")
          setPassword('')
          setChangePassword('')
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          setPassword('')
          setChangePassword('')
          errorNotify(e?.response?.data?.password ? e?.response?.data?.password[0] : "Token is Expired!")
        });

    }
    else {
      errorNotify("Password are not same");
    }
  }

  return (
    <div className="App">
      <div className='set_password_main'>
        <img src={mainLogo} alt='' />

        <h3>Set Password</h3>

        <div className='input_field'>
          <label>New Password <span>*</span></label>
          <input required placeholder='Enter New Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className='input_field'>
          <label>Confirm Password <span>*</span></label>
          <input required placeholder='Enter Confirm Password' type='password' value={changePassword} onChange={(e) => setChangePassword(e.target.value)} />
        </div>

        <div>
          <button onClick={changePasswordHandler}>
            {loading ? <Spinner animation='border' size='sm' /> : 'Set Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
