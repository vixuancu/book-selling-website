import { deleteBookAPI, getBookAPI } from "@/services/api";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";

type TSearch = {
  mainText: string;
  author: string;
  createdAt: string;
  createdAtRange: string;
  updatedAt: string;
  updatedAtRange: string;
  price: number;
};

const TableBook = () => {
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
  const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
  const { message, notification } = App.useApp();
  const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

  const handleDeleteBook = async (_id: string) => {
    setIsDeleteBook(true);
    const res = await deleteBookAPI(_id);
    if (res && res.data) {
      message.success("Xoá Book thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  const columns: ProColumns<IBookTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "_id",
      dataIndex: "_id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true), setDataViewDetail(entity);
            }}
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      hideInSearch: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      hideInSearch: true,
      sorter: true,
      // https://stackoverflow.com/questions/37985642/vnd-currency-formatting
      render(dom, entity, index, action, schema) {
        return (
          <>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(entity.price)}
          </>
        );
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      valueType: "date",
      hideInSearch: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{
                cursor: "pointer",
                paddingRight: "0 5px",
                marginRight: "5px",
              }}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(entity);
              }}
            />
            <Popconfirm
              placement="leftTop" // vị trí modal confirm
              title={"Xác nhận xóa book"}
              description={"Bạn có chắc chắn muốn xóa book này ?"}
              onConfirm={() => handleDeleteBook(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteBook }} // đọc lại mã nguồn để biết thêm thuộc tính
            >
              <span
                style={{
                  cursor: "pointer",
                  paddingLeft: "5px",
                }}
              >
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const refreshTable = () => {
    actionRef.current?.reload();
  };
  const actionRef = useRef<ActionType>(); // sử dụng useRef để gọi hành động reload table
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  return (
    <>
      <ProTable<IBookTable, TSearch> // có kiểu dữ liệu trong table là IBookTable và TSearch là kiểu dữ liệu của param
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: "max-content" }} // Kích hoạt scroll ngang nếu nội dung vượt quá kích thước
        request={async (params, sort, filter) => {
          console.log("params, sort, filter:", params, sort, filter);
          let query = "";
          // Xử lý các tham số lọc (params)
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;

            const paramFields = ["mainText", "author"];

            paramFields.forEach((field) => {
              const value = params[field as keyof TSearch];
              if (value) {
                query += `&${field}=/${value}/i`;
              }
            });
          }
          // Xử lý sắp xếp (sort)
          if (sort) {
            if (sort.mainText) {
              query += `&sort=${
                sort.mainText === "ascend" ? "mainText" : "-mainText"
              }`;
            } else if (sort.price) {
              query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
            } else if (sort.createdAt) {
              query += `&sort=${
                sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
              }`;
            } else {
              query += `&sort=-createdAt`; // Mặc định nếu không chọn sort nào
            }
          } else {
            query += `&sort=-createdAt`; // Mặc định nếu không có sort
          }

          const res = await getBookAPI(query);
          if (res.data) {
            setMeta(res.data?.meta); // meta quản lí table pages
            setCurrentDataTable(res.data?.result ?? []); // quản lí giá trị trong table hiện tại theo trang
          }
          return {
            // đọc ,
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          pageSize: meta.pageSize,
          current: meta.current,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} tren {total} rows
              </div>
            );
          },
        }}
        headerTitle="Table user"
        toolBarRender={() => [
          // để CSV link ra ngoài để tránh bị sự kiện nổi bọt giống phần làm import . để csvlink ra ngoài thì bấm trực tiếp vào nó thay vào Button
          <CSVLink data={currentDataTable} filename="export-book.csv">
            <Button icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => setOpenModalImport(true)}
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />

      <DetailBook
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateBook
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableBook;
