  
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: false,
    authFlag: false,
    is_logged_in_first_time: false,
    user: {
        _id: '',
        email: '',
        address: '',
        country: '',
        zipcode: '',
        firstname: '',
        lastname: '',
        mobilenumber: '',
        register_type: '',
        avatar: '',
        wallet: '',
        date_form: '',
    },
};
  
  function authReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case 'USER_LOADED':
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          is_logged_in_first_time: payload.is_logged_in_first_time,
          user: payload
        };
      case 'REGISTER_SUCCESS':
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false,
          authFlag: true,
        };
      case 'SM_REGISTER_SUCCESS':
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false,
          authFlag: true,
        };
      case 'IS_USER_LOGGEDIN_FIRST_TIME': {
        return {
          ...state,
          is_logged_in_first_time: payload
        };
      }
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false,
          authFlag: true,
        };
      case 'ACCOUNT_DELETED':
      case 'AUTH_ERROR':
      case 'LOGOUT':
        return {
          ...state,
          token: null,
          is_logged_in_first_time: false,
          isAuthenticated: false,
          loading: false,
          user: {},
        };
      case 'SET_AUTH_FLAG':
        return {
          ...state,
          authFlag: false
        }
      case 'SET_VERIFYEMAIL':
        return {
          ...state,
          verify_email: payload
        }
      case 'SENDEMAIL_VERIFYCODE':
        return {
          ...state,
          sendmail_verifycode: payload
        }
      default:
        return state;
    }
  }
  
  export default authReducer;
  