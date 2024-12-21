import { useRef, useState } from "react";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";
import ImageGallery from "react-image-gallery";
import { Col, Divider, Rate, Row } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
interface IProps {}
const BookDetail = (props: IProps) => {
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const refGallery = useRef<ImageGallery>(null); // thuộc tính truy cập trực tiếp vào DOM, mà không làm cho component render
  const images = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
      originalClass: "original-image", // class này cho vào để custom Css
      thumbnailClass: "thumbnail-image", // 2 cái này để cho vào css
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    },
  ];
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
          maxWidth: 1440,
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
                items={images}
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
                  items={images}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  showThumbnails={false}
                />{" "}
              </Col>
              <Col span={24}>
                <div className="author">
                  Tác giả : <a href="#">Jo Hemmings</a>
                </div>
                <div className="title">
                  How Psychology Works - Hiểu Hết Về Tâm Lý Học
                </div>
                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />
                  <span className="sold">
                    {" "}
                    <Divider type="vertical" /> đã bán 1000
                  </span>
                </div>
                <div className="price">
                  <span className="currency">
                    {/* format tiền */}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(696966666)}
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
                  <button className="now">Mua ngay</button>v
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
        items={images}
        title={"hardcode"}
      />
    </div>
  );
};
export default BookDetail;