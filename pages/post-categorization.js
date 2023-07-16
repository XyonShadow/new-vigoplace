import { Postcategorization1 } from "../src/components/dashboard/Postcategorization1";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const PostCategorization = () => {
  return (
    
    <div>
      <ToastContainer position="top-center" />
   <Postcategorization1 />
    </div>
    
  )
}

PostCategorization.auth = true;
export default PostCategorization;