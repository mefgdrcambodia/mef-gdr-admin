// ប្តូរពាក្យសម្ងាត់

// react
import React, { useRef, useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// react-icons
import { MdSaveAlt } from "react-icons/md";
import Loading from "../../../../component/Loading/Loading.component";
// custom
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import CustomInputhelper from "../../../../component/Input/CustomInputHelper.script.js";
import CustomInput from "../../../../component/Input/CustomInput.component";

import {
  getAllRequest,
  updateRequest,
  deleteRequest,
  postRequest,
  getByIdRequest,
} from "../../../../util/request_api";
//==========================================================================//

function Change_password({ mode, auth }) {
  const formref = useRef();
  const [isLoading, setisLoading] = useState(false);
  const access_token = auth.getClientLogin()?.data?.access_token;
  const access_id = auth.getClientLogin()?.data?._id;
  // old password
  const swalToast = new SwalToast();
  const [inputOldPassword, setInputOldPassword] = useState({
    title: "ពាក្យសម្ងាត់ចាស់",
    id: "current_password",
    required: true,
    is_correct: true,
    type: "password",
    icon: null,
    error: "សូមបំពេញ ពាក្យសម្ងាត់ចាស់",
    value: "",
    readonly: false,
  });

  // new password

  const [inputNewPassword, setInputNewPassword] = useState({
    title: "ពាក្យសម្ងាត់ថ្មី",
    id: "new_password",
    required: true,
    is_correct: true,
    type: "password",
    icon: null,
    error: "សូមបំពេញ ពាក្យសម្ងាត់ថ្មី ",
    value: "",
    readonly: false,
  });

  //confirm password

  const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState({
    title: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    id: "confirm_new_password",
    required: true,
    is_correct: true,
    type: "password",
    icon: null,
    error: "សូមបំពេញដេីម្បី បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    value: "",
    readonly: false,
  });

  // validation

  const customInputHelper = new CustomInputhelper();
  function validateStrongPassword(data) {
    var userPassword = data;

    var strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    return strongPasswordPattern.test(userPassword);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    var data = customInputHelper.formValidation([
      { i: inputOldPassword, s: setInputOldPassword },
      { i: inputNewPassword, s: setInputNewPassword },
      { i: inputConfirmNewPassword, s: setInputConfirmNewPassword },
    ]);

    if (data.status) {
      if (inputConfirmNewPassword.value == inputNewPassword.value) {
        // Check Strong Password
        if (!validateStrongPassword(inputNewPassword.value)) {
          swalToast.toastError(
            "ពាក្យសម្ងាត់របស់អ្នកមិនមានសុវត្ថិភាពគ្រប់គ្រាន់ទេ!",
            3000
          );
        } else {
          successValidation(data, inputNewPassword.value);
        }
      } else {
        setInputNewPassword((prev) => ({
          ...prev,
          is_correct: false,
        }));
        setInputConfirmNewPassword((prev) => ({
          ...prev,
          is_correct: false,
        }));

        swalToast.toastError(
          "ពាក្យសម្ងាត់ថ្មី និងបញ្ជាក់ពាក្យសម្ងាត់ថ្មី ខុសគ្នា",
          3000
        );
      }
    }
  };

  async function successValidation(data, password) {
    // Update password
    setisLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/users/`;
    await updateRequest(`${api}update-password-no-token/${access_id}`, {
      password: password,
    });

    setisLoading(false);
    swalToast.toastSuccess("ពាក្យសម្ងាត់បានកែប្រែដោយជោគជ័យ", 3000);
  }

  return (
    <form ref={formref} onSubmit={handleSubmit}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <RiLockPasswordFill
              style={{ width: "100%", height: "210px", marginTop: "20px" }}
            />
          </div>

          <div className="col-md-8 mt-3">
            <CustomInput
              event={(a, e) =>
                setInputOldPassword((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputOldPassword, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setInputNewPassword((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputNewPassword, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setInputConfirmNewPassword((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputConfirmNewPassword, mode }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="btn btn-success">
                <label style={{ cursor: "pointer" }}>
                  រក្សាទុក <MdSaveAlt className="ms-2" />
                </label>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Loading is_loading={isLoading} />
    </form>
  );
}

export default Change_password;
