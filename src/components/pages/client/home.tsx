import { getBookAPI, getCategoryAPI } from "@/services/api";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
  Spin,
} from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import "styles/home.scss";
type FieldType = {
  range: {
    from: number;
    to: number;
  };
  category: string[];
};

// phần này xử dụng state react nhiều
const HomePage = () => {
  const [listCategory, setListCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [listBook, setListBook] = useState<IBookTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
  //
  const [form] = Form.useForm();
  const handleChangeFilter = (changedValues: any, values: any) => {
    console.log(">>> check handleChangeFilter:", changedValues, values);
    //only fire if category changed
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(","); // sử dụng toán tử in api parram
        setFilter(`category=${f}`);
      } else {
        // reset data => fetch all
        setFilter("");
      }
    }
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length > 0) {
        const cate = values.category.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const items = [
    {
      key: "sort=-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "sort=price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "sort=-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];
  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };
  // fetch category
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item }; // trả ra kiểu dữ liệu phù hợp lớp thuộc tính checkbox
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);

  //component did update
  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]); // khi thay đổi bất kì giá trị nào trong mảng thì gọi lại hàm fetchBook

  // hàm fetch books
  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await getBookAPI(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="homepage-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          {/* xử lí body left filter */}
          <Col md={4} sm={0} xs={0}>
            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "5px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  {" "}
                  <FilterTwoTone style={{ fontWeight: 500 }} /> Bộ lọc tìm kiếm
                </span>
                {/* nhấn nút reload thì xoá hết dữ liệu trong form, khi thêm thuộc tính onclick thì tự hiện cursor , có thể bấm dc */}
                <ReloadOutlined
                  title="Reset"
                  onClick={() => {
                    form.resetFields();
                    setFilter("");
                  }}
                />
              </div>

              <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={
                  (changedValues, values) =>
                    handleChangeFilter(changedValues, values) // giá trị đầu tiên là name của FormItem
                }
              >
                <Form.Item
                  name="category"
                  label="Danh mục sản phẩm"
                  labelCol={{ span: 24 }}
                >
                  {/* xử lí check box */}
                  <Checkbox.Group>
                    <Row>
                      {listCategory?.map((item, index) => {
                        return (
                          <Col
                            span={24}
                            key={`index-${index}`}
                            style={{ padding: "7px 0" }}
                          >
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                          </Col>
                        );
                      })}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                {/* xử lí khoảng giá query */}
                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <Row gutter={[10, 10]} style={{ width: "100%" }}>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "from"]}>
                        {/* name kiêu mảnh range là cha,from là con */}
                        <InputNumber
                          name="from"
                          min={0}
                          placeholder="đ TỪ"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={2} md={0}>
                      <div> - </div>
                    </Col>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "to"]}>
                        <InputNumber
                          name="to"
                          min={0}
                          placeholder="đ ĐẾN"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div>
                    <Button
                      onClick={() => form.submit()}
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </Form.Item>
                <Divider />
                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                  <div>
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"></span>
                  </div>
                  <div>
                    <Rate
                      value={4}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"> trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={3}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"> trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={2}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"> trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={1}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"> trở lên</span>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
          {/*  xử lí body  */}
          <Col md={20} xs={24}>
            {/* xử dụng spin khi load dữ liệu thì cần bọc bên ngoiaf nội dung */}
            <Spin spinning={isLoading} tip="Loading...">
              <div
                style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
              >
                <Row>
                  {/* overflowX: Thuộc tính này quyết định cách xử lý khi nội dung bên trong một phần tử vượt quá chiều rộng của phần tử đó (theo trục X).
                      auto: Khi nội dung vượt quá giới hạn kích thước theo chiều ngang, trình duyệt sẽ tự động thêm thanh cuộn ngang để người dùng cuộn và xem toàn bộ nội dung. Nếu nội dung không vượt quá giới hạn, thanh cuộn sẽ không xuất hiện. */}
                  <Tabs
                    defaultActiveKey="sort=-sold"
                    items={items}
                    onChange={(value) => {
                      setSortQuery(value); // value chính là giá trị của item:key
                    }}
                    style={{ overflowX: "auto" }}
                  />
                </Row>
                <Row className="customize-row">
                  {listBook?.map((item, index) => {
                    return (
                      <div className="column" key={`book-${index}`}>
                        <div className="wrapper">
                          <div className="thumbnail">
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${item.thumbnail}`}
                              alt="thumbnail book"
                            />
                          </div>
                          <div className="text" title={item.mainText}>
                            {item.mainText}
                          </div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item?.price ?? 0)}
                          </div>
                          <div className="rating">
                            <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 10 }}
                            />
                            <span>Đã bán {item?.sold ?? 0}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Row>
                <div style={{ marginTop: 30 }}></div>
                <Row style={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    responsive
                    onChange={(p, s) =>
                      handleOnchangePage({ current: p, pageSize: s })
                    }
                  />
                </Row>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default HomePage;
