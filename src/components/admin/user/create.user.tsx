import { createUserAPI } from "@/services/api";
import { App, Form, FormProps, Modal, Divider, Input } from "antd";
import { useState } from "react";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}
type FieldTpye = {
  // dùng để gợi ý code
  fullName: string;
  password: string;
  email: string;
  phone: string;
};
const CreateUser = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  const [form] = Form.useForm();
  const onFinish: FormProps<FieldTpye>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const { fullName, email, password, phone } = values;
    const res = await createUserAPI(fullName, email, password, phone);
    console.log(res);
    //scuccess
    if (res.data) {
      message.success("Tạo mới user thành công");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      //error
      notification.error({
        message: "Đã có lỗi xảy ra ",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
          form.resetFields();
        }}
        okText="Tạo mới"
        cancelText="Huỷ"
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldTpye>
            labelCol={{ span: 24 }}
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldTpye>
            labelCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldTpye>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldTpye>
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
