// import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./components/menu/Menu";
import ErrorPage from "./pages/Error";
import ToasterProvider from "./components/ToasterProvider";

function App() {
  const Layout = () => {
    return (
      <div
        id="rootContainer"
        className="p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
      >
        <ScrollRestoration />
        <div>
          <Navbar />
          <div className="w-full flex gap-0 pt-20 xl:pt-[96px] 2xl:pt-[112px] mb-auto">
            <div className="hidden xl:block xl:w-[250px] 2xl:w-[280px] 3xl:w-[350px] border-r-2 border-base-300 dark:border-slate-700 px-3 xl:px-4 xl:py-1">
              <Menu />
            </div>
            <div className="w-full px-4 xl:px-4 2xl:px-5 xl:py-2 overflow-hidden">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          // All Roles
          children: [
            {
              path: "/",
              element: <Home />,
            },
          ],
        },
      ],
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <>
      <ToasterProvider />
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
