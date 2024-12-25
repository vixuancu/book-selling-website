import { getOrderAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";

type TSearch = {
  name: string;
  createdAt: string;
  createdAtRange: string;
  address: string;
};
const TableOrder = () => {
  const columns: ProColumns<IOrderTable>[] = [
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
        return <a href="#">{entity._id}</a>;
      },
    },
    {
      title: "Full Name",
      dataIndex: "name",
    },
    {
      title: "Adress",
      dataIndex: "address",
    },

    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      hideInSearch: true,
      sorter: true,
      // https://stackoverflow.com/questions/37985642/vnd-currency-formatting
      render(dom, entity, index, action, schema) {
        return (
          <>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(entity.totalPrice)}
          </>
        );
      },
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      sorter: true,
      valueType: "date",
      hideInSearch: true,
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
      <ProTable<IOrderTable, TSearch> // có kiểu dữ liệu trong table là IBookTable và TSearch là kiểu dữ liệu của param
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log("params, sort, filter:", params, sort, filter);
          let query = "";
          // Xử lý các tham số lọc (params)
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;

            if (params.name) {
              query += `&name=/${params.name}/i`;
            }
            if (params.address) {
              query += `&address=/${params.address}/i`;
            }

            const createDateRange = dateRangeValidate(params.createdAtRange);
            if (createDateRange) {
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }
          }
          if (sort) {
            if (sort.totalPrice) {
              query += `&sort=${
                sort.totalPrice === "ascend" ? "totalPrice" : "-totalPrice"
              }`;
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

          const res = await getOrderAPI(query);
          if (res.data) {
            setMeta(res.data?.meta); // meta quản lí table pages
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
        headerTitle="Table Order"
      />
    </>
  );
};
export default TableOrder;
