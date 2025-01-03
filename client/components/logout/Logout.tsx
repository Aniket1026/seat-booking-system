import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutHandler } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Button } from "../ui/button";

export const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutHandler());
      router.push("/");
    } catch (error: any) {
      throw new Error("Error in logging out: " + error.message);
    }
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
