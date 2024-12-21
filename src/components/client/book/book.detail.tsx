import { useEffect, useRef, useState } from "react";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";
import ImageGallery from "react-image-gallery";
import { Col, Divider, Rate, Row } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
interface IProps {
  currentBook: IBookTable | null;
}
const BookDetail = (props: IProps) => {
  const { currentBook } = props;

  const [imgGallery, setImgGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string; // class này cho vào để custom Css
      thumbnailClass: string; // 2 cái này để cho vào css
    }[]
  >([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const refGallery = useRef<ImageGallery>(null); // thuộc tính truy cập trực tiếp vào DOM, mà không làm cho component render

  useEffect(() => {
    console.log("currentBook:", currentBook);
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
    console.log("check index:", refGallery.current?.getCurrentIndex()); // tuỳ bài toán mới dùng index ,đọc tài liệu trước khi dùng
  };
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
                    <button>
                      <MinusOutlined />
                    </button>
                    <input defaultValue={1} />
                    <button>
                      <PlusOutlined />
                    </button>
                  </span>
                </div>
                <div className="buy">
                  <button className="cart">
                    <BsCartPlus className="icon-cart" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button className="now">Mua ngay</button>
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
