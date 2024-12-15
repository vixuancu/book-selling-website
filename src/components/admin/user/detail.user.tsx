import { FORMATE_DATE_VN } from "@/services/helper";
import { Drawer, Descriptions, Badge } from "antd";
import dayjs from "dayjs";
interface Iprops {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (v: IUserTable | null) => void;
}
const DetailUser = (props: Iprops) => {
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
  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="Thông tin user" bordered column={2}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataViewDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            {/* {dataViewDetail?.role} */}
            <Badge status="processing" text={dataViewDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item label="Update At">
            {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default DetailUser;
