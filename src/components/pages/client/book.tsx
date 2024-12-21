import BookDetail from "@/components/client/book/book.detail";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const BookPage = () => {
  let { _id } = useParams();

  useEffect(() => {
    if (_id) {
      // do something
      console.log("paramID:", _id);
    }
  }, [_id]);
  return (
    <>
      <BookDetail />
    </>
  );
};
export default BookPage;
