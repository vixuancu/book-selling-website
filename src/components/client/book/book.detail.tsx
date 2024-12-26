import { useEffect, useRef, useState } from "react";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";
import ImageGallery from "react-image-gallery";
import { App, Breadcrumb, Col, Divider, Rate, Row } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import { useCurrentApp } from "@/components/context/app.context";
import { Link, useNavigate } from "react-router-dom";

interface IProps {
  currentBook: IBookTable | null;
}
type UserAction = "MINUS" | "PLUS"; // xem handleChangeButton() de biet cach dung

const BookDetail = (props: IProps) => {
  const { currentBook } = props;
  const { carts, setCarts, user } = useCurrentApp();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [imgGallery, setImgGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string; // class này cho vào để custom Css
      thumbnailClass: string; // 2 cái này để cho vào css
    }[]
  >([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const refGallery = useRef<ImageGallery>(null); // thuộc tính truy cập trực tiếp vào DOM, mà không làm cho component render
  const [currentQuanity, setCurrentQuantity] = useState<number>(1); // quản lí dữ liệu input số lượng

  useEffect(() => {
    //console.log("currentBook:", currentBook);
    if (currentBook) {
      // build images
      const images = [];
      if (currentBook.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          originalClass: "original-image", // class này cho vào để custom Css
          thumbnailClass: "thumbnail-image", // 2 cái này để cho vào css
        });
      }
      if (currentBook.slider) {
        // slider laf 1 mảng nên dùng map để push, cũng như bên phần admin phần updateBook
        currentBook.slider.map((item) => {
          images.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item}`,
            originalClass: "original-image", // class này cho vào để custom Css
            thumbnailClass: "thumbnail-image", // 2 cái này để cho vào css
          });
        });
      }
      setImgGallery(images);
    }
  }, [currentBook]);

  const handleOnClickImage = () => {
    //get current index onClick  để hiện modal
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0); // thêm dấu ?? không thì bị lỗi,muốn test có thể bỏ ?? rồi test chatgpt
    // console.log("check index:", refGallery.current?.getCurrentIndex()); // tuỳ bài toán mới dùng index ,đọc tài liệu trước khi dùng
  };
  /**
   *  exam:
   * // Định nghĩa kiểu UserAction
type UserAction = "MINUS" | "PLUS";

// Hàm nhận tham số kiểu UserAction
function handleAction(action: UserAction) {
  if (action === "MINUS") {
    console.log("Thực hiện trừ.");
  } else if (action === "PLUS") {
    console.log("Thực hiện cộng.");
  }
}
   */
  const handleChangeButton = (type: UserAction) => {
    if (type === "MINUS") {
      if (currentQuanity - 1 <= 0) return;
      setCurrentQuantity(currentQuanity - 1);
    }
    if (type === "PLUS" && currentBook) {
      // có thể kiểm tra currentBook ở đây
      // if(currentQuanity=== +currentBook?.quantity) return; bị báo lỗi currentBook có thể là undefined, có thể sửa dấu + ở đầu
      if (currentQuanity === +currentBook?.quantity) return;
      setCurrentQuantity(currentQuanity + 1);
    }
  };
  const handleOnchangeInput = (value: string) => {
    if (!isNaN(+value)) {
      if (currentBook && +value > 0 && +value <= currentBook.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };
  const handleAddToCart = (isBuyNow = false) => {
    if (!user) {
      message.error("Bạn cần đăng nhập để thực hiện tính năng này.");
      return;
    }
    // update localStorage
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && currentBook) {
      // update
      const carts = JSON.parse(cartStorage) as ICart[]; // chuyển từ JSON sang data và có đặt kiểu dữ liệu
      //check exist
      let isExistIndex = carts.findIndex((c) => c._id === currentBook._id);
      if (isExistIndex > -1) {
        // có rồi thì cái đấy rồi cập nhật thêm
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + currentQuanity;
      } else {
        // chưa có thì thêm nó vào giỏ hàng
        carts.push({
          _id: currentBook._id,
          quantity: currentQuanity, // cú pháp ở đây không có dấu ! vì đã được đảm bảo ở điều kiện if ở bên trên là nó ko null
          detail: currentBook,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts)); // lưu vào localStorage
      //sync React Context
      setCarts(carts);
    } else {
      //create
      const data = [
        {
          _id: currentBook?._id!, // về phần dấu !,Khi viết _id: currentBook?._id!, người lập trình có thể đảm bảo rằng họ chắc chắn _id sẽ luôn có giá trị khi được gán.
          quantity: currentQuanity,
          detail: currentBook!,
        },
      ];
      localStorage.setItem("carts", JSON.stringify(data)); // localStorage có kiểu string,string nên phải convert data sang String
      //sync React Context | lưu vào conText
      setCarts(data);
    }

    if (isBuyNow) {
      navigate("/order");
    } else {
      message.success("Thêm sản phẩm vào giỏ hàng thành công.");
    }
  };
  console.log("carts:", carts);
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1170,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to={"/"}>Trang Chủ</Link>,
            },
            {
              title: "Xem chi tiết sách",
            },
          ]}
        />
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          <Row gutter={[20, 20]}>
            {/* book detail left */}
            <Col md={10} xs={0} sm={0}>
              {" "}
              <ImageGallery
                ref={refGallery}
                items={imgGallery} // dùng state quảng li
                showPlayButton={false} //hide play button
                showFullscreenButton={false} //hide fullscreen button
                renderLeftNav={() => <></>} //left arrow === <> </>
                renderRightNav={() => <></>} //right arrow === <> </>
                slideOnThumbnailOver={true} //onHover => auto scroll images khi hover auto chạy
                onClick={() => handleOnClickImage()}
              />{" "}
            </Col>
            {/* book detail right============ */}
            <Col md={14} sm={24}>
              <Col md={0} xs={24} sm={24}>
                {" "}
                <ImageGallery
                  ref={refGallery}
                  items={imgGallery}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  showThumbnails={false}
                />{" "}
              </Col>
              <Col span={24}>
                <div className="author">
                  Tác giả : <a href="#">{currentBook?.author}</a>
                </div>
                <div className="title">{currentBook?.mainText}</div>
                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />
                  <span className="sold">
                    {" "}
                    <Divider type="vertical" /> {currentBook?.sold ?? 0}
                  </span>
                </div>
                <div className="price">
                  <span className="currency">
                    {/* format tiền */}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentBook?.price ?? 0)}
                  </span>
                </div>
                <div className="delivery">
                  <div>
                    <span className="left">Vận chuyển</span>
                    <span className="right">Miễn phí vận chuyển</span>
                  </div>
                </div>
                <div className="quantity">
                  <span className="left">Số lượng</span>
                  <span className="right">
                    <button onClick={() => handleChangeButton("MINUS")}>
                      <MinusOutlined />
                    </button>
                    <input
                      value={currentQuanity}
                      onChange={(event) =>
                        handleOnchangeInput(event.target.value)
                      }
                    />
                    <button onClick={() => handleChangeButton("PLUS")}>
                      <PlusOutlined />
                    </button>
                  </span>
                </div>
                <div className="buy">
                  <button
                    className="cart"
                    onClick={() => handleAddToCart(false)}
                  >
                    <BsCartPlus className="icon-cart" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button className="now" onClick={() => handleAddToCart(true)}>
                    Mua ngay
                  </button>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={imgGallery}
        title={currentBook?.mainText ?? ""}
      />
    </div>
  );
};
export default BookDetail;
