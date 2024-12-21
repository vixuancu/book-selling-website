import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "styles/book.scss";
interface IProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentIndex: number;
  items: {
    original: string;
    thumbnail: string;
    originalClass: string;
    thumbnailClass: string;
  }[];
  title: string;
}
const ModalGallery = (props: IProps) => {
  const { isOpen, setIsOpen, currentIndex, items, title } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const refGallery = useRef<ImageGallery>(null);
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
    }
  }, [isOpen, currentIndex]);
  return (
    <Modal
      className="modal-gallery"
      centered
      open={isOpen}
      width={"60vw"}
      onCancel={() => setIsOpen(false)}
      footer={null} //hide footer
      closable={false} // ẩn icon x ở góc bên phải
    >
      <Row gutter={[20, 20]}>
        <Col span={16}>
          <ImageGallery
            ref={refGallery}
            startIndex={currentIndex} // start at current index
            items={items}
            showPlayButton={false} //hide play button
            showFullscreenButton={false} //hide fullscreen button
            showThumbnails={false}
            onSlide={(index) => setActiveIndex(index)}
            slideDuration={0} //duration between slices hiệu ứng chuyển slide sẽ bị vô hiệu hóa, tức là việc thay đổi từ ảnh này sang ảnh khác sẽ diễn ra ngay lập tức,
          />
        </Col>
        <Col span={8}>
          <div>{title}</div>
          <div>
            <Row gutter={[20, 20]}>
              {items?.map((item, index) => {
                return (
                  <Col key={`image-${index}`}>
                    <Image
                      wrapperClassName={"img-normal"}
                      width={100}
                      height={100}
                      src={item.original}
                      preview={false}
                      onClick={() => {
                        refGallery?.current?.slideToIndex(index);
                      }}
                    />
                    <div
                      className={activeIndex === index ? "active" : ""}
                    ></div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
export default ModalGallery;
