import BookDetail from "@/components/client/book/book.detail";
import { getBookByIdAPI } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const BookPage = () => {
  let { id } = useParams(); // đặt theo định nghĩa trong router main.tsx
  const [currentBook, setCurrentBook] = useState<IBookTable | null>(null); // data ,ko đặt tên kĩ sợ nhầm
  const { notification } = App.useApp();
  const [isLoadingBook, setIsLoadingBook] = useState<Boolean>(false);
  useEffect(() => {
    console.log(id);
    if (id) {
      const fetchBookById = async () => {
        setIsLoadingBook(true);
        const res = await getBookByIdAPI(id);

        if (res && res.data) {
          console.log("data:", res.data);
          setCurrentBook(res.data);
        } else {
          notification.error({
            message: "Da co loi xay ra",
            description: res.message,
          });
        }
        setIsLoadingBook(true);
      };
      fetchBookById();

      // console.log("paramID:", id);
    }
  }, [id]);
  return (
    <>
      <BookDetail currentBook={currentBook} />
    </>
  );
};
export default BookPage;
