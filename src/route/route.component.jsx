// React
import React, { useState, useEffect } from "react";

// Style
import "./route.style.css";

//Image
import logo from "../asset/logo/logo_white_stroke.png";
import avatar from "../asset/image/avatar.png";

// Script
import { Link } from "react-router-dom";

import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Auth from "../util/auth";
import Session from "../util/Session";
import RouteScript from "./route.script";
import { useNavigate } from "react-router-dom";
import SampleDB from "../util/sample_database/sampleDB";

// Component
import Login from "../page/login/login.component";
import Loading from "../component/Loading/Loading.component";
import { ToastContainer } from "react-toastify";
import CustomToast from "../component/Toast/CustomToast";
import MenuLeftBar from "./menu_left_bar/menu_left_bar.component";
import Version from "../page/dasboard/version/version.script";

// Icon
import { IoLocation } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { RiMenuFold4Fill } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import { IoMdArrowDropright } from "react-icons/io";
import Swal from "sweetalert2";
import axios from "axios";

function AppRoutes() {
  //================================================================
  // Declaration
  const version = new Version();
  const sampleDB = new SampleDB();
  const apiSessionToken = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/auth/session-token`;
  const apiLogout = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/auth/logout`;
  const auth = new Auth();
  const customToast = new CustomToast();
  const session = new Session();
  const [openMyAccount, setOpenMyAccount] = useState(false);
  const [menuCollaped, setmenuCollaped] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const prop = {
    auth: auth.getClientLogin(),
    session: session.get("ACC"),
  };
  const routeScript = new RouteScript(prop);
  const routeURL = routeScript.route();
  const width_sidebar = 92;
  const width_content = 260;

  const isMobile = window.innerWidth <= 767;

  //================================================================
  // Loading
  useEffect(() => {
    authRefreshLogined();
  }, []);

  function authRefreshLogined() {
    document.addEventListener("click", (e) => {
      if (auth.getClientLogin()) {
        auth.setClientLogin(auth.getClientLogin()); // Need to change JWT Session Too
      }
    });
  }

  //================================================================
  // Function
  const routeAuth = () => {
    if (auth.getClientLogin()) {
      return RouteLogin();
    } else {
      return RouteLogOut();
    }
  };

  function RouteLogOut() {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  function checkPermission(isSuperAdmin, loginGroupId, userRole) {
    if (isSuperAdmin) {
      return true;
    } else {
      if (loginGroupId == userRole?.id_admin) {
        return true;
      } else {
        return false;
      }
    }
  }
  function RouteLogin() {
    var listRoute = [];

    //************ Redirect ************
    // Check Permision Here
    const user = auth.getClientLogin()?.data;
    const userRole = {
      id_admin: "687dc2df144731e0efc41a35",
      id_noter: "68882da272f7b68ef2056dd2",
      is_super_admin: auth.getClientLogin()?.data?.is_super_admin,
    };

    // super admin
    if (
      checkPermission(userRole?.is_super_admin, user?.group_user_id, userRole)
    ) {
      listRoute.push(
        <Route
          path="/login"
          element={<Navigate to={routeURL.summary_index.url} />}
        />,
      );
      listRoute.push(
        <Route
          path="/"
          element={<Navigate to={routeURL.summary_index.url} />}
        />,
      );
    } else {
      listRoute.push(
        <Route
          path="/login"
          element={<Navigate to={routeURL.note_income_expense_index.url} />}
        />,
      );
      listRoute.push(
        <Route
          path="/"
          element={<Navigate to={routeURL.note_income_expense_index.url} />}
        />,
      );
    }

    listRoute.push(<Route path="*" element={<Navigate to="/" />} />);

    //************ Dasboard ************
    Object.values(routeURL).map((row, i) => {
      if (row.status) {
        listRoute.push(
          <Route
            key={i}
            path={row.url}
            element={componentDashboard(row.component, row.breadcurmb)}
          />,
        );
      }
    });

    return <Routes>{listRoute}</Routes>;
  }

  //================================================================
  //================================================================
  //================================================================
  // System Component | Header | Footer | Content | Menu Left Bar
  function componentDashboard(page, breadcrumb) {
    function clickCloseMenuAccount() {
      return () => {
        if (openMyAccount) {
          setOpenMyAccount(!openMyAccount);
        }
      };
    }

    function logout() {
      Swal.fire({
        icon: "warning",
        title: "ចាកចេញ?",
        text: "តើអ្នកចង់ចាកចេញគណនី?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        reverseButtons: true,
        width: "350px",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setisLoading(true);

          try {
            // If you have a logout API endpoint, call it here
            // Example:
            // await axios.post(apiLogout, {
            //   token: auth.getClientLogin()?.token
            // });

            // Remove client login data

            // Optional: Clear any other session data
            // session.remove("ACC");
            // session.clear(); // If you want to clear all session data

            // Redirect to login page
            setTimeout(() => {
              auth.removeClientLogin();
              window.location.replace("/");
              // Or if you want to go directly to login:
              // window.location.replace("/login");
            }, 1500);
          } catch (error) {
            // console.error("Logout error:", error);
            // Still remove client data even if API call fails

            setTimeout(() => {
              auth.removeClientLogin();
              window.location.replace("/");
            }, 1500);
          }
        }
      });
    }

    return (
      <div className="dashboard-container">
        {/* Header */}
        <header
          onClick={clickCloseMenuAccount()}
          className="dashboard-header"
          style={{
            "--sidebar-width-left":
              menuCollaped == false ? width_content + 1 + "px" : "0px",
          }}
        >
          <div>
            <div style={{ display: "flex" }}>
              {menuCollaped == true ? (
                <RiMenuFold4Fill
                  onClick={() => setmenuCollaped(!menuCollaped)}
                  style={{
                    height: "25px",
                    width: "30px",
                    marginLeft: "15px",
                    cursor: "pointer",
                    color: "darkgreen",
                  }}
                />
              ) : (
                <AiOutlineMenuFold
                  onClick={() => setmenuCollaped(!menuCollaped)}
                  style={{
                    color: "darkgreen",
                    height: "25px",
                    width: "30px",

                    cursor: "pointer",
                  }}
                />
              )}

              <div hidden={!menuCollaped} className="text-center header-title">
                <h6
                  className="moul-regular"
                  style={{ marginLeft: "35px", paddingTop: "5px" }}
                >
                  អគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍{" "}
                  {auth?.getClientLogin()?.data?.unit?.unit_name}
                </h6>
              </div>
            </div>
          </div>

          <div className="account-dropdown">
            <div
              className="account-info"
              onClick={() => setOpenMyAccount(!openMyAccount)}
            >
              <img src={avatar} alt="profile" className="profile-img" />
              <div className="account-labels">
                <div className="account-name siemreap-bold">
                  {auth?.getClientLogin()?.data?.firstname +
                    " " +
                    auth?.getClientLogin()?.data?.lastname}
                  
                </div>
              </div>
              <div className="dropdown-icon">
                <IoMdMore
                  size={22}
                  style={{ cursor: "pointer", color: "darkblue" }}
                />
              </div>
            </div>

            {openMyAccount && (
              <div className="dropdown-menus">
                <a href={routeURL.my_account_index.url}>
                  <IoSettingsOutline className="icon" />
                  <label style={{ cursor: "pointer" }}> កែប្រែ</label>
                </a>
                <button onClick={() => logout()}>
                  <AiOutlineLogout className="icon" />
                  <label style={{ cursor: "pointer" }}>ចាកចេញ</label>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Left Sidebar  and  Right Content*/}
        <div
          onClick={clickCloseMenuAccount()}
          className="dashboard-main"
          style={{
            "--sidebar-width-content":
              menuCollaped == false
                ? width_content + 1 + "px"
                : width_sidebar + 1 + "px",
          }}
        >
          {/* Left Sidebar */}
          <aside
            className={
              isMobile == true
                ? menuCollaped == true
                  ? "dashboard-sidebar active"
                  : "dashboard-sidebar deactive"
                : "dashboard-sidebar"
            }
            style={{
              "--width_content": width_content + 10 + "px",
              "--sidebar-width": menuCollaped
                ? width_sidebar + "px"
                : width_content + "px",
            }}
          >
            {/* Fixed top content */}
            <div
              className="sidebar-header"
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 10,
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.04)",
              }}
            >
              <img
                src={logo}
                style={{
                  width: "100%",
                  height: menuCollaped ? "60px" : "100px",
                  objectFit: "contain",
                  padding: menuCollaped ? "15px" : undefined,
                  marginTop: !menuCollaped ? "40px" : "53px",
                  marginBottom: "-8px",
                }}
              />
              <label
                style={{
                  color: "gray",
                  fontSize: "11px",
                  paddingTop: "8px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {version.number()}
              </label>
              {!menuCollaped && (
                <div
                  className="text-center mt-3"
                  style={{ marginBottom: "40px" }}
                >
                  <label className="moul-regular">
                    អគ្គនាយកដ្ឋានដោះស្រាយ
                    <br />
                    ផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍
                  </label>
                  <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                    <hr />
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable menu */}
            <div
              className="sidebar-scroll-content"
              style={{
                overflowY: "auto",
                height: "calc(100vh - 140px)", // adjust based on your logo + title height
                paddingLeft: menuCollaped ? "5px" : undefined,
                paddingBottom: "50px",
              }}
            >
              <MenuLeftBar
                event={(e) => {
                  if (isMobile) {
                    setmenuCollaped(!menuCollaped);
                  }
                }}
                prop={{
                  route: routeURL,
                  menuCollaped: menuCollaped,
                  isMobile: isMobile,
                }}
              />
            </div>
          </aside>

          {/* Right Content */}
          <main className="dashboard-content">
            <div className="content-inner">
              <div
                style={{
                  paddingTop: "100px",
                  paddingBottom: "100px",
                }}
              >
                {page}
              </div>
            </div>
          </main>
        </div>

        {/* Breadcrumb */}
        <div
          onClick={clickCloseMenuAccount()}
          className="dashboard-breadcrumb"
          style={{
            zIndex: 10,
            "--sidebar-width":
              menuCollaped == true
                ? width_sidebar + 1 + "px"
                : width_content + 1 + "px",
          }}
        >
          <div className="mt-1" style={{ display: "flex" }}>
            {breadcrumb.map((item, i) => (
              <div key={i} className="breadcrumb-items">
                <Link
                  to={item.path}
                  className="siemreap-regular"
                  style={{
                    color: i === breadcrumb.length - 1 ? "gray" : "darkgreen",
                    cursor: "pointer",
                  }}
                >
                  {item.name}
                </Link>
                {i !== breadcrumb.length - 1 && (
                  <span
                    className="siemreap-regular"
                    style={{ margin: "0px 10px" }}
                  >
                    <IoMdArrowDropright />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            "--sidebar-width":
              menuCollaped == true
                ? width_sidebar + 1 + "px"
                : width_content + 1 + "px",
          }}
          onClick={clickCloseMenuAccount()}
          className="dashboard-footer"
        >
          <label style={{ fontSize: "0.7rem", color: "gray" }}>
            @២០២៦ រក្សាសិទ្ធិដោយប្រព័ន្ធអគ្គនាយកដ្ឋានដោះស្រាយផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍
          </label>
        </footer>

        {/* Loading */}
        <ToastContainer />
        <Loading is_loading={isLoading} />
      </div>
    );
  }

  //================================================================
  // View
  return <BrowserRouter>{routeAuth()}</BrowserRouter>;
}
export default AppRoutes;
