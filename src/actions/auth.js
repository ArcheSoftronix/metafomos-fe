import axios from 'axios';
import api from '../utils/api';
import { toast } from 'react-toastify';

// Load User
export const loadUser = () => async dispatch => {
  try {
    const res = await api.get('/auth');
    dispatch({
      type: 'USER_LOADED',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR'
    });
  }
};

export const generateTokenTwo = () => async dispatch => {
  try {
    const res = await api.post('/auth/generate-token2');
    dispatch({
      type: 'IS_USER_LOGGEDIN_FIRST_TIME',
      payload: res.data.is_logged_in_first_time
    });
    console.log('Res from generating token two >>> ', res.data);

  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR'
    });
  }
};

// Register User
export const register = formData => async dispatch => {
  try {
    const res = await api.post('/auth/register', formData);

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data
    });
    dispatch(loadUser());
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => 
        toast.error(error.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          })  
      );
    }
    dispatch({
      type: 'REGISTER_FAIL'
    });
  }
};

// Get Facebook access token from GRAPH API
export const getAccessTokenFromFb = () => async dispatch => {
  try {
    const res = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=680493446295538&client_secret=eafd897d70c305694abbc5b95e4e630a&grant_type=client_credentials`)

  } catch (err) {

  }
}

// Social Media User Register
export const socialMediaSignUp = formData => async dispatch => {
  try {
    const res = await api.post('/auth/sm-signup', formData);
    dispatch({
      type: 'SM_REGISTER_SUCCESS',
      payload: res.data
    });
    dispatch({
      type: 'IS_USER_LOGGEDIN_FIRST_TIME',
      payload: res.data.is_logged_in_first_time
    })
    dispatch(loadUser());
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => 
        toast.error(error.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          })  
      );
    }
    dispatch({
      type: 'SM_REGISTER_FAIL'
    });
  }
};

// Login User
export const login = formData => async dispatch => {

  try {
    const res = await api.post('/auth/login', formData);

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => {
        toast.error(error.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });
    }

    dispatch({
      type: 'LOGIN_FAIL'
    });
  }
};

export const socialMediaLogin = formData => async dispatch => {

  try {
    const res = await api.post('/auth/sm-login', formData);

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => {
        toast.error(error.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });
    }

    dispatch({
      type: 'LOGIN_FAIL'
    });
  }
};

export const logout = () => async dispatch => {
  dispatch({
    type: 'LOGOUT'
  });
  dispatch({
    type: 'BLOCK_CLEAR'
  })
};

export const setAuthFlag = () => ({ type: 'SET_AUTH_FLAG' });