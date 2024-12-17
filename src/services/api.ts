import axios from "services/axios.customize";
export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 3000,
      },
    }
  );
};
export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<ILogin>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};
export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
    headers: {
      delay: 1000,
    },
  });
};
export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<ILogin>>(urlBackend);
};
export const getUserAPI = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};
export const createUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = `/api/v1/user`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};
export const bulkCreateUserAPI = (
  data: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
  }[]
) => {
  const urlBackend = `/api/v1/user/bulk-create`;
  return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
};
export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackend = `/api/v1/user`;
  return axios.put<IBackendRes<IUserTable>>(urlBackend, {
    _id,
    fullName,
    phone,
  });
};
export const deleteUserAPI = (_id: string) => {
  const urlBackend = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<IUserTable>>(urlBackend);
};
export const getBookAPI = (query: string) => {
  const urlBackend = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
};
