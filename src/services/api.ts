import createInstanceAxios from "services/axios.customize";

const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);
const axiosPayment = createInstanceAxios(
  import.meta.env.VITE_BACKEND_PAYMENT_URL
);

export const getVNPayUrlAPI = (
  amount: number,
  locale: string,
  paymentRef: string
) => {
  const urlBackend = "/vnpay/payment-url";
  return axiosPayment.post<IBackendRes<{ url: string }>>(urlBackend, {
    amount,
    locale,
    paymentRef,
  });
};
export const updatePaymentOrderAPI = (
  paymentStatus: string,
  paymentRef: string
) => {
  const urlBackend = "/api/v1/order/update-payment-status";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { paymentStatus, paymentRef },
    {
      headers: {
        delay: 1000,
      },
    }
  );
};
export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 1000,
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
      delay: 100,
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
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
    headers: { delay: 1000 },
  });
};
export const getCategoryAPI = () => {
  const urlBackend = `/api/v1/database/category`;
  return axios.get<IBackendRes<string[]>>(urlBackend);
};
export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<
    IBackendRes<{
      fileUploaded: string;
    }>
  >({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": folder,
    },
  });
};
export const createBookAPI = (
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string
) => {
  const urlBackend = `/api/v1/book`;
  return axios.post<IBackendRes<IBookTable>>(urlBackend, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};
export const updateBookAPI = (
  _id: string,
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string
) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.put<IBackendRes<IBookTable>>(urlBackend, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};
export const deleteBookAPI = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.delete<IBackendRes<IUserTable>>(urlBackend);
};
export const getBookByIdAPI = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.get<IBackendRes<IBookTable>>(urlBackend, {
    headers: {
      delay: 1000,
    },
  });
};
export const createOrderAPI = (
  name: string,
  address: string,
  phone: string,
  totalPrice: number,
  type: string,
  detail: any,
  paymentRef?: string
) => {
  const urlBackend = `/api/v1/order`;
  return axios.post<IBackendRes<IBookTable>>(urlBackend, {
    name,
    address,
    phone,
    totalPrice,
    type,
    detail,
    paymentRef,
  });
};
export const getHistoryAPI = () => {
  const urlBackend = `/api/v1/history`;
  return axios.get<IBackendRes<IHistory[]>>(urlBackend);
};
export const updateUserInfoAPI = (
  fullName: string,
  phone: string,
  avatar: string,
  _id: string
) => {
  const urlBackend = `/api/v1/user`;
  return axios.put<IBackendRes<IUser>>(urlBackend, {
    fullName,
    phone,
    avatar,
    _id,
  });
};

export const updateUserPasswordAPI = (
  email: string,
  oldpass: string,
  newpass: string
) => {
  const urlBackend = `/api/v1/user/change-password`;
  return axios.post<IBackendRes<IUser>>(urlBackend, {
    email,
    oldpass,
    newpass,
  });
};
export const getDashboardAPI = () => {
  const urlBackend = `/api/v1/database/dashboard`;
  return axios.get<
    // phaanf khai báo {... gợi ý code của Backend phản hồi có thể chưa dùng để là cái khác cũng dc}
    IBackendRes<{
      countOrder: number;
      countUser: number;
      countBook: number;
    }>
  >(urlBackend);
};
export const getOrderAPI = (query: string) => {
  const urlBackend = `/api/v1/order?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};
export const loginWithGoogleAPI = (type: string, email: string) => {
  const urlBackend = `/api/v1/auth/social-media`;
  return axios.post<IBackendRes<ILogin>>(urlBackend, {
    type,
    email,
  });
};
