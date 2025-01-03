import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { loginHandler } from "@/lib/redux/userSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignIn({ setIsSignIn }: { setIsSignIn: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const { error } = useSelector((state: any) => state.user);
  const handleSignIn = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const response = await dispatch(
        loginHandler({ email, password })
      ).unwrap();

      if (response.status === 400) {
        toast({ description: "No user found" });
        return;
      }

      if (response.user) {
        toast({ description: "Login successful" });
        router.replace("/seat-booking");
      }
    } catch (error: any) {
      throw new Error("Error in signin" + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your train booking account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            {error && (
              <div className="text-red-500">
                {error.message || "Error in sign-in"}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Dont have an account?
            <span
              className="text-blue-600 hover:underline"
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
