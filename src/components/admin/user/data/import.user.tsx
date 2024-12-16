import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Modal, Table, Upload } from "antd";
const { Dragger } = Upload;
interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
}
const ImportUser = (props: IProps) => {
  const { openModalImport, setOpenModalImport } = props;
  const propsUpload: UploadProps = {
    name: "file",
    multiple: false,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', lay tu backend nen custom lai
    maxCount: 1,
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    customRequest({ file, onSuccess }) {
      // funtion này nói với antd đã upload thành công =>đang custom Upload (ghi đè lại thư viện)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess("ok");
        }
      }, 1000);
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal
        title="Import data user"
        width={"50vw"}
        open={openModalImport}
        onOk={() => setOpenModalImport(false)}
        onCancel={() => {
          setOpenModalImport(false);
        }}
        okText="Import data"
        okButtonProps={{ disabled: true }}
        //do not close when click outside
        maskClosable={false}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
        <div style={{ paddingTop: "20px" }}>
          <Table
            title={() => {
              return <span>Dữ liệu upload</span>;
            }}
            columns={[
              { dataIndex: "fullName", title: "Tên hiển thị" },
              { dataIndex: "email", title: "Email" },
              { dataIndex: "phone", title: "Số điện thoại" },
            ]}
          />
        </div>
      </Modal>
    </>
  );
};

export default ImportUser;
