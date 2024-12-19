import { deleteUserAPI, getUserAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
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
import DetailUser from "./detail.user";
import CreateUser from "./create.user";
import ImportUser from "./data/import.user";
import { CSVLink } from "react-csv";
import UpdateUser from "./update.user";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
  const { message, notification } = App.useApp();
  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

  const handleDeleteUser = async (_id: string) => {
    setIsDeleteUser(true);
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
  const columns: ProColumns<IUserTable>[] = [
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
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(entity);
              }}
              twoToneColor={"#f57800"}
              style={{ cursor: "pointer", marginRight: 15 }}
            />

            <Popconfirm
              placement="leftTop"
              title="Xác nhân xoá User"
              description="Bạn có chắc chắn muốn xoá user này không"
              onConfirm={() => handleDeleteUser(entity._id)}
              okText="Confirm"
              cancelText="Huỷ"
              okButtonProps={{ loading: isDeleteUser }}
            >
              <span style={{ paddingLeft: "20px" }}>
                <DeleteTwoTone
                  twoToneColor={"#ff4d4f"}
                  style={{ cursor: "pointer" }}
                />
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
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);
          let query = "";
          ////

          // Xử lý các tham số lọc (params)
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            const createDateRange = dateRangeValidate(params.createdAtRange);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }
            const paramFields = ["email", "fullName"];

            paramFields.forEach((field) => {
              const value = params[field as keyof TSearch];
              if (value) {
                query += `&${field}=/${value}/i`;
              }
            });
          }
          // Xử lý sắp xếp (sort)
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else query += `&sort=-createdAt`;

          const res = await getUserAPI(query);
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
            <CSVLink data={currentDataTable} filename="export-user.csv">
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
      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />
      <UpdateUser
        refreshTable={refreshTable}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableUser;
