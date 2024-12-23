import { useCurrentApp } from "@/components/context/app.context";
import { createOrderAPI } from "@/services/api";
import { DeleteTwoTone } from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Space,
} from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import "styles/order.scss";
const { TextArea } = Input;
type UserMethod = "COD" | "BANKING";
type FieldType = {
  fullName: string;
  phone: string;
  address: string;
  method: UserMethod;
};
interface IProps {
  setCurrentStep: (v: number) => void;
}
//  clone lại trang cũ
const Payment = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCarts, user } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const handlePlaceOrder: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, phone, address, method } = values;
    const detail = carts.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      bookName: item.detail.mainText,
    }));

    setIsSubmit(true);
    const res = await createOrderAPI(
      fullName,
      address,
      phone,
      totalPrice,
      method,
      detail
    );
    if (res?.data) {
      localStorage.removeItem("carts");
      setCarts([]);
      message.success("Mua hàng thành công!");
      setCurrentStep(2);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message) // xét điều kiện respon message
            ? res.message[0]
            : res.message,
        duration: 3,
      });
    }
    setIsSubmit(false);
  };
  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      //update
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      //sync React Context
      setCarts(newCarts);
    }
  };
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
        method: "COD",
      });
    }
  }, [user]);
  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);
  return (
    <Row gutter={[20, 20]}>
      <Col md={17} xs={24}>
        {carts?.map((book, index) => {
          const currentBookPrice = book?.detail?.price ?? 0;
          return (
            <div className="order-book" key={`index-${index}`}>
              <div className="book-content">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div className="title">{book?.detail?.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentBookPrice)}
                </div>
              </div>
              <div className="action">
                <div className="quantity">Số lượng: {book?.quantity}</div>
                <div className="sum">
                  Tổng:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentBookPrice * (book?.quantity ?? 0))}
                </div>
                <DeleteTwoTone
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveBook(book._id)}
                  twoToneColor="#eb2f96"
                />
              </div>
            </div>
          );
        })}
        <div>
          <span style={{ cursor: "pointer" }} onClick={() => setCurrentStep(0)}>
            Quay trở lại
          </span>
        </div>
      </Col>
      <Col md={7} xs={24}>
        <Form
          form={form}
          name="payment-form"
          onFinish={handlePlaceOrder}
          autoComplete="off"
          layout="vertical"
        >
          <div className="order-sum">
            <Form.Item<FieldType> label="Hình thức thanh toán" name="method">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                  <Radio value={"BANKING"}>Chuyển khoản ngân hàng</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item<FieldType>
              label="Họ tên"
              name="fullName"
              rules={[
                { required: true, message: "Họ tên không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Địa chỉ nhận hàng"
              name="address"
              rules={[
                { required: true, message: "Địa chỉ không được để trống!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <div className="calculate">
              <span> Tạm tính</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="calculate">
              <span> Tổng tiền</span>
              <span className="sum-final">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            {/* <button type="submit">Đặt Hàng ({carts?.length ?? 0})</button> */}
            <Button
              color="danger"
              variant="solid"
              htmlType="submit"
              loading={isSubmit}
            >
              Đặt Hàng ({carts?.length ?? 0})
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};
export default Payment;
