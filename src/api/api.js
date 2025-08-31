import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const getToken = ()=> {
  return document.cookie.replace(/(?:^|.*;\s*)todolistToken\s*=\s*([^;]*).*$/i, '$1');
}

//登入驗證
export const postSignInData = async(fromData) => {
    return axios.post(`${apiUrl}/users/sign_in`, fromData);
};

//註冊驗證
export const postSignUpData = async(fromData) => {
    return axios.post(`${apiUrl}/users/sign_up`, fromData);
};

//登出驗證
export const postSignOutData = async() => {
    const token = getToken();
    if (!token) { return; }
    return axios.post(`${apiUrl}/users/sign_out`,
      {},
      { headers: { Authorization: `${token}` } }
    );
}

//驗證使用者
export const getUserData = async() => {
  const token = getToken();
  if (!token) { return; }
  return axios.get(`${apiUrl}/users/checkout`,
    { headers: { Authorization:`${token}` } }
  );
}

//取得Todo
export const getTodo = async() => {
  const token = getToken();
  if (!token) { return; }
  return axios.get(`${apiUrl}/todos/`,
    { headers: { Authorization: `${token}` } }
  );
}

//新增Todo
export const postTodo = async(newTodo) => {
  const token = getToken();
  if (!token) {
      return;
  }
  return axios.post(`${apiUrl}/todos/`,
    { content: newTodo },
    { headers: { Authorization: `${token}` } }
  );
}

//刪除Todo
export const deleteTodo = async(item) => {
    const token = getToken();
    if (!token) { return; }
    return axios.delete(`${apiUrl}/todos/${item.id}`,
      { headers: { Authorization: `${token}` } }
    );
};

//切換Todo狀態
export const patchTodo = async(item) => {
    const token = getToken();
    if (!token) { return; }
    return axios.patch(`${apiUrl}/todos/${item.id}/toggle`,
      {},
      { headers: { Authorization: `${token}` } }
    );
};