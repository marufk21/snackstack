import React from "react";
import Home from "./(landing)/page";
import AuthCheck from "@/components/auth/auth-check";
import Navbar from "@/components/landing/navbar";

const page = () => {
  return (
    <>
      <AuthCheck />
      <Navbar />
      <Home />
    </>
  );
};

export default page;
