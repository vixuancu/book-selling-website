import { updateBookAPI, getCategoryAPI, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  App,
  Col,
  Divider,
  Form,
  FormProps,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { error } from "console";
import { v4 as uuidv4 } from "uuid";
interface IProps {
  openModalUpdate: boolean;
  // truyền dữ liệu props
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IBookTable | null;
  setDataUpdate: (v: IBookTable | null) => void;
}
type FieldType = {
  // dùng để gợi ý code
  _id: string;
  mainText: string;
  author: string;
  price: number;
  category: string;
  quantity: number;
  thumbnail: any;
  slider: any;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type UserUploadType = "thumbnail" | "slider";
const UpdateBook = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    dataUpdate,
    setDataUpdate,
  } = props;
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item }; // trả ra kiểu dữ liệu phù hợp lớp thuộc tính select
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    if (dataUpdate) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataUpdate.thumbnail
          }`,
        },
      ];

      const arrSlider = dataUpdate?.slider?.map((item) => {
        console.log("item", item);
        return {
          uid: uuidv4(),
          name: item, // giá trị item là name ,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`, /// địa chỉ hình ảnh đến thư mục ở backend
        };
      });
      console.log("arrSlider:", arrSlider);
      form.setFieldsValue({
        _id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        category: dataUpdate.category,
        quantity: dataUpdate.quantity,
        thumbnail: arrThumbnail,
        slider: arrSlider,
      });
      setFileListThumbnail(arrThumbnail as any);
      setFileListSlider(arrSlider as any);
    }
  }, [dataUpdate]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    console.log("values form: ", values);
    console.log("values fileListThumbnail: ", fileListThumbnail);
    console.log("values fileListSlider: ", fileListSlider);

    const { _id, mainText, author, price, category, quantity } = values;
    const thumbnail = fileListThumbnail?.[0]?.name ?? "";
    const slider = fileListSlider.map((item) => item.name) ?? [];
    const res = await updateBookAPI(
      _id,
      thumbnail,
      slider,
      mainText,
      author,
      price,
      quantity,
      category
    );
    if (res && res.data) {
      message.success("update sách thành công!");
      form.resetFields();
      setFileListSlider([]);
      setFileListThumbnail([]);
      setOpenModalUpdate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE; // giới hạn dung lượng ảnh ,và khi upload sẽ không upload ảnh lỗi
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleRemove = async (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setFileListThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
      setFileListSlider(newSlider);
    }
  };
  const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };
  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: UserUploadType
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "book");
    if (res && res.data) {
      const uploadedFile: any = {
        uid: file.uid,
        name: res.data.fileUploaded,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          res.data.fileUploaded
        }`,
      };
      if (type === "thumbnail") {
        setFileListThumbnail([{ ...uploadedFile }]);
      } else {
        setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
      }
      if (onSuccess) onSuccess("ok");
    } else {
      message.error(res.message);
    }
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <>
      <Modal
        title="Add a book"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalUpdate(false);
          form.resetFields();
          setFileListSlider([]);
          setFileListThumbnail([]);
        }}
        okButtonProps={{ loading: isSubmit }}
        okText="Tạo mới"
        cancelText="Huỷ"
        destroyOnClose={true}
        confirmLoading={isSubmit}
        width={"50vw"}
        maskClosable={false}
      >
        <Divider />
        <Form
          form={form}
          name="form-create-book"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={15}>
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="_id"
              name="_id"
              rules={[{ required: true, message: "Vui lòng nhập ID!" }]}
              hidden={true}
            >
              <Input />
            </Form.Item>

            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[
                  { required: true, message: "Vui lòng nhập tên hiển thị!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(
                    value // format dấu , trong input giá tiền
                  ) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  addonAfter=" đ"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
              >
                <Select showSearch allowClear options={listCategory} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng  upload thumbnail!",
                  },
                ]}
                //convert value from Upload => form
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={(options) =>
                    handleUploadFile(options, "thumbnail")
                  }
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "thumbnail")}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemove(file, "thumbnail")}
                  fileList={fileListThumbnail}
                >
                  <div>
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
                rules={[
                  { required: true, message: "Vui lòng nhập upload slider!" },
                ]}
                //convert value from Upload => form
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  multiple
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={(options) =>
                    handleUploadFile(options, "slider")
                  }
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemove(file, "slider")}
                  fileList={fileListSlider}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
      </Modal>
    </>
  );
};
export default UpdateBook;
