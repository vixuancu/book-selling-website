import {
  Avatar,
  Badge,
  Descriptions,
  Divider,
  Drawer,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { FORMATE_DATE_DEFAULT } from "@/services/helper";
import dayjs from "dayjs";
import { GetProp } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
interface Iprops {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IBookTable | null;
  setDataViewDetail: (v: IBookTable | null) => void;
}
const DetailBook = (props: Iprops) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;
  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (dataViewDetail) {
      let imgThumbnail: any = {},
        imgSlider: UploadFile[] = [];
      if (dataViewDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataViewDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`,
        };
      }
      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        dataViewDetail.slider.map((item) => {
          // console.log("item:", item);
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataViewDetail]);
  // const [fileList, setFileList] = useState<UploadFile[]>([
  //   {
  //     uid: "-1",
  //     name: "image.png",
  //     status: "done",
  //     url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //   },

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"70vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="Thông tin user" bordered column={2}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {dataViewDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {dataViewDetail?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Gia tiền">
            {dataViewDetail?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            {/* {dataViewDetail?.role} */}
            <Badge status="processing" text={dataViewDetail?.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_DEFAULT)}
          </Descriptions.Item>
          <Descriptions.Item label="Update At">
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_DEFAULT)}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left"> Ảnh Books </Divider>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          showUploadList={{ showRemoveIcon: false }}
          onPreview={handlePreview}
          onChange={handleChange}
        ></Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Drawer>
    </>
  );
};
export default DetailBook;
