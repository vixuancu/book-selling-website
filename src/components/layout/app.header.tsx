import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, Avatar, Popover, Empty, App } from "antd";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import "./app.header.scss";
import { Link } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import { logoutAPI } from "@/services/api";
import ManageAccount from "components/client/account";
import { isMobile } from "react-device-detect";
interface IProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}
const AppHeader = (props: any) => {
  const { message, notification } = App.useApp();
  const [openDrawer, setOpenDrawer] = useState(false);
  const {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    carts,
    setCarts,
  } = useCurrentApp();
  const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    //todo
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setCarts([]);
      setIsAuthenticated(false);
      localStorage.removeItem("carts");
      localStorage.removeItem("access_token");
      message.success("đăng xuất tài khoản thành công");
    }
  };

  let items = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  if (user?.role === "ADMIN") {
    //Hàm unshift() trong JavaScript được sử dụng để thêm một hoặc nhiều phần tử vào đầu mảng và trả về độ dài mới của mảng sau khi thêm phần tử.
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  const contentPopover = () => {
    return (
      <div className="pop-cart-body">
        <div className="pop-cart-content">
          {carts?.map((book, index) => {
            return (
              <div className="book" key={`book-${index}`}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div>{book?.detail?.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book?.detail?.price ?? 0)}
                </div>
              </div>
            );
          })}
        </div>
        {/* footer có nút xem chi giỏ hàng */}
        {carts.length > 0 ? (
          <div className="pop-cart-footer">
            <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
        {/* <Empty description="Không có sản phẩm trong giỏ hàng" /> */}
      </div>
    );
  };
  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo">
                <span onClick={() => navigate("/")}>
                  {" "}
                  <FaReact className="rotate icon-react" />
                  vixuancu
                </span>

                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                value={props.searchTerm}
                onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                {/* <Popover
                  className="popover-carts"
                  placement="topRight"
                  rootClassName="popover-carts" // chú ý phần này vì Modal, Popover... không render trong <div id="root">
                  title={"Sản phẩm mới thêm"}
                  content={contentPopover}
                  arrow={true}
                > */}
                {
                  !isMobile ? (
                    <Popover
                      className="popover-carts"
                      placement="topRight"
                      rootClassName="popover-carts"
                      title={"Sản phẩm mới thêm"}
                      content={contentPopover}
                      arrow={true}
                    >
                      <Badge count={carts?.length ?? 0} size={"small"} showZero>
                        <FiShoppingCart className="icon-cart" />
                      </Badge>
                    </Popover>
                  ) : (
                    <Badge
                      // count={carts?.length ?? 0}
                      count={carts.length ?? 0}
                      size={"small"}
                      showZero // show cả khi giỏ hàng ko có gì
                      onClick={() => navigate("/order")}
                    >
                      <FiShoppingCart className="icon-cart" />
                    </Badge>
                  )
                  // </Popover>
                }
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <ManageAccount
        isModalOpen={openManageAccount}
        setIsModalOpen={setOpenManageAccount}
      />
    </>
  );
};

export default AppHeader;
