import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutHandler } from "@/lib/redux/userSlice";

export function Header({ username }: { username: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onLogout =async () => {
    try {
      await dispatch(logoutHandler());
      router.push("/login");
    } catch (error: any) {
      throw new Error("Error in logging out: " + error.message);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Train Booking System</h1>
      <div className="flex items-center space-x-4">
        <span>Welcome, {username}</span>
        <Button variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
