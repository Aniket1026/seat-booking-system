import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutHandler } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/redux/store";

export const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutHandler());
      router.push("/");
    } catch (error: any) {
      console.error("Error in logging out: " + error.message);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-black text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};
