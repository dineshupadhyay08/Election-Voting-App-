import { Outlet } from "react-router-dom";
import Header from "./Header";

const AuthLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
