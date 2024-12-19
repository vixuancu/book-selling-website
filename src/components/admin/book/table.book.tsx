import { deleteUserAPI, getBookAPI } from "@/services/api";
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
    const res = await deleteUserAPI(_id);
    if (res && res.data) {
      message.success("Xoá user thành công");
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
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
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
              style={{ cursor: "pointer", margin: "0 7px" }}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(entity);
              }}
            />
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa book"}
              description={"Bạn có chắc chắn muốn xóa book này ?"}
              onConfirm={() => handleDeleteBook(entity._id)}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ loading: isDeleteBook }}
            >
              <span style={{ cursor: "pointer" }}>
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
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  return (
    <>
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
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
          //
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else query += `&sort=-createdAt`;
          if (sort && sort.mainText) {
            query += `&sort=${
              sort.mainText === "ascend" ? "mainText" : "-mainText"
            }`;
          }
          if (sort && sort.author) {
            query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`;
          }
          if (sort && sort.price) {
            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
          }

          const res = await getBookAPI(query);
          if (res.data) {
            setMeta(res.data.meta);
            setCurrentDataTable(res.data?.result ?? []);
          }
          return {
            // data: data.data,
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
          <Button icon={<ExportOutlined />} type="primary">
            <CSVLink data={currentDataTable} filename="export-book.csv">
              Export
            </CSVLink>
          </Button>,
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
