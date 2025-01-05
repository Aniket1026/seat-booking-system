import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutHandler } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await dispatch(logoutHandler());
      router.push("/");
      toast({ description: "Logged out" });
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
