'use client';
import SignIn from "@/components/signin/Signin";
import SignUp from "@/components/signup/Signup";
import { useState } from "react";

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
      <h1>Train Booking System</h1>
      {isSignIn ? (
        <SignIn setIsSignIn={setIsSignIn} />
      ) : (
        <SignUp setIsSignIn={setIsSignIn} />
      )}
    </div>
  );
}
