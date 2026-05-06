// React
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Style
import "./login.style.css";

// Script
import {
  postRequest,
  getByIdRequest,
  updateRequest,
} from "../../util/request_api";
import CustomInputHelper from "../../component/Input/CustomInputHelper.script";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Auth from "../../util/auth";
import SwalToast from "../../component/SwalToast/SwalToast";
import RouteScript from "../../route/route.script";

// Component
import CustomInput from "../../component/Input/CustomInput.component";
import RowBreaker from "../../component/Boostramp/RowBreaker.component";
import Loading from "../../component/Loading/Loading.component";
import Version from "../dasboard/version/version.script";
// Icon
import { FaUserTie } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";

// Image
import logo_cpp from "../../asset/logo/logo.png";
import Swal from "sweetalert2";

function Login() {
  const version = new Version();
  const routeScript = new RouteScript();
  const swalToast = new SwalToast();
  const customInputHelper = new CustomInputHelper();
  const auth = new Auth();
  const apiLogin = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/auth/login`;

  const [isLoading, setisLoading] = useState(false);

  const [inputEmail, setinputEmail] = useState({
    title: "សារអេឡិចត្រូនិច",
    id: "email",
    required: true,
    is_correct: true,
    type: "text",
    icon: <FaUserTie />,
    error: "សូមបំពេញសារអេឡិចត្រូនិច!",
    value: "",
  });

  const [inputPassword, setinputPassword] = useState({
    title: "ពាក្យសម្ងាត់",
    id: "password",
    required: true,
    is_correct: true,
    type: "password",
    icon: <RiLockPasswordFill />,
    error: "សូមបំពេញសារអេឡិចត្រូនិច!",
    value: "",
  });

  useEffect(() => {
    document.title = "ចូលគណនី";
    document.getElementById(inputEmail.id).focus();

    // Create animated bubbles
    createBubbles();

    // Cleanup function to remove bubbles on unmount
    return () => {
      const bubblesContainer = document.querySelector(".bubbles-container");
      if (bubblesContainer) {
        bubblesContainer.remove();
      }
    };
  }, []);

  // Function to create animated bubbles
  const createBubbles = () => {
    const loginBackground = document.querySelector(".login-background");
    if (!loginBackground) return;

    // Remove existing bubbles container if any
    const existingBubbles = document.querySelector(".bubbles-container");
    if (existingBubbles) {
      existingBubbles.remove();
    }

    // Create bubbles container
    const bubblesContainer = document.createElement("div");
    bubblesContainer.className = "bubbles-container";
    loginBackground.insertBefore(bubblesContainer, loginBackground.firstChild);

    // Create multiple bubbles
    const bubbleCount = 30;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.className = "bubble";

      // Random size between 20px and 100px
      const size = Math.random() * 80 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // Random position
      bubble.style.left = `${Math.random() * 100}%`;

      // Random animation duration between 8s and 20s
      const duration = Math.random() * 12 + 8;
      bubble.style.animationDuration = `${duration}s`;

      // Random animation delay
      bubble.style.animationDelay = `${Math.random() * 15}s`;

      // Random opacity
      bubble.style.opacity = Math.random() * 0.5 + 0.2;

      bubblesContainer.appendChild(bubble);
    }
  };

  useEffect(() => {
    // Recreate bubbles on window resize to maintain proper positioning
    const handleResize = () => {
      createBubbles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    var data = customInputHelper.formValidation([
      { i: inputEmail, s: setinputEmail },
      { i: inputPassword, s: setinputPassword },
    ]);

    if (data.status) {
      authValidation(data);
    }
  };

  function validateStrongPassword(data) {
    var userPassword = data.objectData.password;

    var strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    return strongPasswordPattern.test(userPassword);
  }

  async function authValidation(dataValidation) {
    currentValidationError();
    setisLoading(true);
    const data = {
      email: dataValidation.objectData.email,
      password: dataValidation.objectData.password,
    };
    try {
      const res = await axios.post(apiLogin, data);
      if (res.data?.success) {
        // console.log("✅ Login success:", res.data);
        const loggedData = res.data;
        if (loggedData.data?.status) {
          if (loggedData.data.is_first_login) {
            setisLoading(false);
            Swal.fire({
              title: "កែប្រែពាក្យសម្ងាត់ថ្មី",
              width: 450,
              html: `
              <div style="text-align: left;  max-width: 320px; margin: 0">
              <br />
              <label for="newPassword" style="display: block; margin-bottom: 6px; font-weight: 600; color: #333;">
                ពាក្យសម្ងាត់ថ្មី
              </label>
              <div style="position: relative; margin-bottom: 20px;">
                <input
                  type="password"
                  id="newPassword"
                  class="swal2-input"
                  placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី"
                  style="
                    width: 100%;
                    padding-right: 0px;
                    height: 50px;

                    border-radius: 6px;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                    transition: border-color 0.3s ease;
                  "
                  onfocus="this.style.borderColor='#3b82f6'"
                  onblur="this.style.borderColor='#ccc'"
                />
    <i
      id="toggleNewPass"
      class="fa fa-eye-slash"
      style="
        position: absolute;
        top: 60%;
        right: -30px;
        transform: translateY(-50%);
        cursor: pointer;
        color: #888;
        transition: color 0.3s ease;
      "
      onmouseover="this.style.color='#3b82f6'"
      onmouseout="this.style.color='#888'"
    ></i>
  </div>

  <label for="confirmPassword" style="display: block; margin-bottom: 6px; font-weight: 600; color: #333;">
    បញ្ជាក់ពាក្យសម្ងាត់
  </label>
  <div style="position: relative;">
    <input
      type="password"
      id="confirmPassword"
      class="swal2-input"
      placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
      style="
        width: 100%;
        padding-right: 0px;
        height: 50px;
        border-radius: 6px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
      "
      onfocus="this.style.borderColor='#3b82f6'"
      onblur="this.style.borderColor='#ccc'"
    />
    <i
      id="toggleConfirmPass"
      class="fa fa-eye-slash"
      style="
        position: absolute;
        top: 60%;
        right: -30px;
        transform: translateY(-50%);
        cursor: pointer;
        color: #888;
        transition: color 0.3s ease;
      "
      onmouseover="this.style.color='#3b82f6'"
      onmouseout="this.style.color='#888'"
    ></i>
  </div>
</div>

  `,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "រក្សារទុក",
              cancelButtonText: "បោះបង់",
              reverseButtons: true,
              preConfirm: () => {
                const newPass =
                  Swal.getPopup().querySelector("#newPassword").value;
                const confirmPass =
                  Swal.getPopup().querySelector("#confirmPassword").value;

                // Validate strong password (reuse your function)
                const data = { objectData: { password: newPass } };
                if (!validateStrongPassword(data)) {
                  Swal.showValidationMessage(
                    "ពាក្យសម្ងាត់របស់អ្នកមិនមានសុវត្ថិភាពគ្រប់គ្រាន់ទេ!",
                  );
                  return false;
                }

                // Validate password match
                if (newPass !== confirmPass) {
                  Swal.showValidationMessage("ពាក្យសម្ងាត់មិនត្រូវគ្នា!");
                  return false;
                }

                return newPass;
              },
              didOpen: () => {
                const toggleNew = document.getElementById("toggleNewPass");
                const toggleConfirm =
                  document.getElementById("toggleConfirmPass");
                const newInput = document.getElementById("newPassword");
                const confirmInput = document.getElementById("confirmPassword");

                function toggleVisibility(icon, input) {
                  icon.addEventListener("click", () => {
                    if (input.type === "password") {
                      input.type = "text";
                      icon.className = "fa fa-eye";
                    } else {
                      input.type = "password";
                      icon.className = "fa fa-eye-slash";
                    }
                  });
                }

                toggleVisibility(toggleNew, newInput);
                toggleVisibility(toggleConfirm, confirmInput);
              },
              allowOutsideClick: () => !Swal.isLoading(),
            }).then(async (result) => {
              if (result.isConfirmed) {
                // console.log("New password:", result.value);
                const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/users/`;
                setisLoading(true);
                await updateRequest(
                  `${api}update-password-no-token/${loggedData.data._id}`,
                  {
                    password: result.value,
                  },
                );

                auth.setClientLogin(loggedData);
                setTimeout(() => {
                  window.location.replace(routeScript.route().summary_index);
                }, 1000);
              }
            });
          } else {
            auth.setClientLogin(loggedData);
            setTimeout(() => {
              window.location.replace(routeScript.route().summary_index.url);
            }, 1000);
          }
        } else {
          error("គណនីរបស់អ្នកត្រូវបានផ្អាក!");
        }
      } else {
        error("គណនីនិងពាក្យសម្ងាត់មិនត្រឹមត្រូវ!");
        invalidInput();
      }
    } catch (err) {
      if (err.response) {
        error("គណនីនិងពាក្យសម្ងាត់មិនត្រឹមត្រូវ!");
        invalidInput();
      } else if (err.request) {
        error("គណនីនិងពាក្យសម្ងាត់មិនត្រឹមត្រូវ!");
        invalidInput();
      } else {
        error("ទិន្នន័យមេមានបញ្ហា! ព្យាយាមម្តងទៀតនៅពេលក្រោយ");
      }
    }
  }

  function error(title) {
    swalToast.toastError(title, 3000);
    setisLoading(false);
  }

  function invalidInput() {
    setinputEmail({
      ...inputEmail,
      error: "សូមពិនិត្យសារអេឡិចត្រូនិចម្តងទៀត!",
      is_correct: false,
    });
    setinputPassword({
      ...inputPassword,
      error: "សូមពិនិត្យពាក្យសម្ងាត់ម្តងទៀត!",
      is_correct: false,
    });
  }
  function currentValidationError() {
    setinputEmail({
      ...inputEmail,
      error: "សូមបំពេញសារអេឡិចត្រូនិច!",
      is_correct: true,
    });
    setinputPassword({
      ...inputPassword,
      error: "សូមបំពេញសារអេឡិចត្រូនិច!",
      is_correct: true,
    });
  }

  return (
    <div className="login-background">
      <div className="login-wrapper">
        <div className="login-content">
          <form onSubmit={handleLogin}>
            {/* Logo */}
            <div className="text-center">
              <img
                src={logo_cpp}
                alt="logo"
                className="img-fluid"
                style={{ height: "160px", objectFit: "contain" }}
              />
            </div>

            <RowBreaker />

            {/* Title */}
            <div className="text-center">
              <label className="moul-regular">
                អគ្គនាយកដ្ឋានដោះស្រាយ
                <br />
                ផលប៉ះពាល់ដោយសារគម្រោងអភិវឌ្ឍន៍
              </label>
            </div>

            <RowBreaker />

            {/* Subtitle */}
            <div className="text-center">
              <h6 style={{ color: "gray" }}>បំពេញព័ត៌មានដើម្បីចូលគណនី</h6>
            </div>

            <RowBreaker />

            {/* Email */}
            <CustomInput
              event={(action, e) => {
                setinputEmail((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));

                // setinputPassword((prev) => ({
                //   is_correct: true,
                // }));
              }}
              props={{ input: inputEmail }}
            />

            <RowBreaker />

            {/* Password */}
            <CustomInput
              event={(action, e) => {
                // setinputEmail((prev) => ({
                //   is_correct: true,
                // }));
                setinputPassword((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputPassword }}
            />

            <RowBreaker />

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 siemreap-regular"
            >
              <label style={{ cursor: "pointer" }}>ចូលគណនី</label>
            </button>
          </form>
        </div>

        {/* Version */}
        <div className="text-center text-muted mt-3">
          <label style={{ color: "gray" }}>{version.number()}</label>
        </div>
      </div>

      <ToastContainer />
      <Loading is_loading={isLoading} />
    </div>
  );
}

export default Login;
