import { useCurrentApp } from "@/components/context/app.context";
import { DeleteTwoTone } from "@ant-design/icons";
import { Col, Divider, InputNumber, Row } from "antd";
import Item from "antd/es/list/Item";
import { useEffect, useState } from "react";
import "styles/order.scss";

const DetailOrder = () => {
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const handleOnChangeInput = (value: number, book: IBookTable) => {
    if (!value || value < 1) return;
    if (!isNaN(+value)) {
      // ép kiểu cho chắc logic
      // update localStorage
      const cartStorage = localStorage.getItem("carts");
      if (cartStorage && book) {
        //update
        const carts = JSON.parse(cartStorage) as ICart[];
        // checl exist kiểm tra nó có tồn tại không , nếu có thì cập nhập giá trị , lưu local,conText
        let isExistIndex = carts.findIndex((item) => item._id === book._id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = +value;
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);
      }
    }
  };
  const handleRemoveBook = (id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      // update
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== id);
      // lưu cả localStorage và react Context
      localStorage.setItem("carts", JSON.stringify(newCarts));
      //sync React Context
      setCarts(newCarts);
    }
  };

  useEffect(() => {
    // tính tổng giá trị giỏ hàng
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
    <div style={{ background: "#efefef", padding: "20px 40px" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((item, index) => {
              const currentBookPrice = item?.detail?.price ?? 0;
              return (
                <div className="order-book" key={`index-${index}`}>
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item?.detail?.thumbnail
                      }`}
                    />
                    <div className="title">{item?.detail?.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentBookPrice)}
                    </div>
                  </div>
                  <div className="action">
                    <div className="quantity">
                      <InputNumber
                        onChange={(value) =>
                          handleOnChangeInput(value as number, item.detail)
                        }
                        value={item.quantity}
                      />
                    </div>
                    <div className="sum">
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentBookPrice * (item?.quantity ?? 0))}
                    </div>

                    <DeleteTwoTone
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={() => handleRemoveBook(item._id)}
                      twoToneColor="#eb2f96"
                    />
                  </div>
                </div>
              );
            })}
          </Col>
          <Col md={6} xs={24}>
            <div className="order-sum">
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
                <span>Tổng tiền</span>
                <span className="sum-final">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <button>Mua Hàng ({carts?.length ?? 0})</button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default DetailOrder;
