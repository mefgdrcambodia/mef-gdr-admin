// គណនី

// react
import React, { useEffect, useRef, useState } from "react";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// react-icons
import { FaUser } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";

// custom
import CustomInputhelper from "../../../../component/Input/CustomInputHelper.script.js";
import CustomInput from "../../../../component/Input/CustomInput.component";
import KhmerDate from "../../../../util/KhmerDate.js";
import Loading from "../../../../component/Loading/Loading.component";
import {
  getAllRequest,
  updateRequest,
  deleteRequest,
  postRequest,
  getByIdRequest,
} from "../../../../util/request_api";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";

function Account({ mode, auth }) {
  const swalToast = new SwalToast();
  const [isLoading, setisLoading] = useState(true);
  const khmerDate = new KhmerDate();
  const formref = useRef();
  const access_token = auth.getClientLogin()?.data?.access_token;
  const access_id = auth.getClientLogin()?.data?._id;
  const apiMyAccount = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/users/${access_id}`;

  // name

  const [inputFirstname, setInputFirstname] = useState({
    title: "គោត្តនាម",
    id: "firstname",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញ គោត្តនាម",
    value: "",
    readonly: false,
  });

  const [inputLastname, setInputLastname] = useState({
    title: "នាម",
    id: "lastname",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញ នាម",
    value: "",
    readonly: false,
  });

  //organization

  const [inputOrg, setInputOrg] = useState({
    title: "អង្គភាព",
    id: "organization",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញ អង្គភាព",
    value: "",
    readonly: false,
  });

  //Job title

  const [inputJob, setInputJob] = useState({
    title: "តួនាទី/មុខតំណែង",
    id: "job_title",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញ តួនាទី/មុខតំណែង",
    value: "",
    readonly: false,
  });

  //group-user-id

  const [input_Role_inSystem, setinput_Role_inSystem] = useState({
    title: "តួនាទីក្នុងប្រព័ន្ធ",
    id: "group_user_id",
    required: false,
    is_correct: true,
    type: "email",
    icon: null,
    error: "សូមបំពេញ តួនាទីក្នុងប្រព័ន្ធ",
    value: "",
    readonly: true,
  });

  //email

  const [inputEmail, setInputEmail] = useState({
    title: "សារអេឡិចត្រូនិច",
    id: "email",
    required: false,
    is_correct: true,
    type: "email",
    icon: null,
    error: "សូមបំពេញ សារអេឡិចត្រូនិច",
    value: "",
    readonly: true,
  });

  const [inputContact, setInputContact] = useState({
    title: "លេខទំនាក់ទំនង",
    id: "contact",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញ លេខទំនាក់ទំនង",
    value: "",
    readonly: false,
  });

  const [inputCreateOn, setinputCreateOn] = useState({
    title: "ការបរិច្ឆេទបង្កើត",
    id: "date",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញ ការបរិច្ឆេទបង្កើត",
    value: "",
    readonly: true,
  });

  // =================================================
  // validation

  const customInputHelper = new CustomInputhelper();

  // =================================================
  // Loading
  useEffect(() => {
    loadingAccount();
  }, []);

  async function loadingAccount() {
    if (access_id) {
      const result = await getByIdRequest(apiMyAccount, access_token);

      if (result?.success) {
        var data = result?.data;

        setInputFirstname((prev) => ({
          ...prev,
          value: data?.firstname,
        }));
        setInputLastname((prev) => ({
          ...prev,
          value: data?.lastname,
        }));
        setInputOrg((prev) => ({
          ...prev,
          value: data?.organization,
        }));
        setInputJob((prev) => ({
          ...prev,
          value: data?.job_title,
        }));
        setInputEmail((prev) => ({
          ...prev,
          value: data?.email,
        }));
        setInputContact((prev) => ({
          ...prev,
          value: data?.contact,
        }));

        setinput_Role_inSystem((prev) => ({
          ...prev,
          value: data?.role?.name == null ? "" : data?.role?.name,
        }));

        // date
        var date = new Date(data?.created_date);
        const dateCustom = {
          day: date?.getUTCDate(), // 11
          month: date?.getUTCMonth() + 1, // 0-indexed, so add 1 → 7 (July)
          year: date?.getUTCFullYear(), // 2025
          hour: date?.getHours(),
          minute: date?.getMinutes(),
          second: date?.getSeconds(),
        };

        setinputCreateOn((prev) => ({
          ...prev,
          value: khmerDate.convert_ToDate(dateCustom),
        }));

        setisLoading(false);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    var data = customInputHelper.formValidation([
      { i: inputFirstname, s: setInputFirstname },
      { i: inputLastname, s: setInputLastname },
      { i: inputOrg, s: setInputOrg },
      { i: inputJob, s: setInputJob },
      { i: inputContact, s: setInputContact },
    ]);

    if (data.status) {
      successValidation(data);
    }
  };

  async function successValidation(data) {
    setisLoading(true);
    var result = await updateRequest(
      apiMyAccount,
      data.objectData,
      access_token
    );

    if (result.success) {
      swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 2000);
    } else {
      swalToast.toastError("បរាជ័យ: " + result.message, 3000);
    }

    setisLoading(false);
  }

  //=========================================================//

  return (
    <form ref={formref} onSubmit={handleSubmit}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <FaUser
              style={{ width: "100%", height: "260px", marginTop: "20px" }}
            />
          </div>

          <div className="col-md-4">
            <CustomInput
              event={(a, e) =>
                setInputFirstname((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputFirstname, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setInputOrg((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputOrg, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setInputContact((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputContact, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setInputEmail((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputEmail, mode }}
            />
          </div>

          <div className="col-md-4">
            <CustomInput
              event={(a, e) =>
                setInputLastname((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputLastname, mode }}
            />

            <CustomInput
              event={(action, e) =>
                setInputJob((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputJob, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setinput_Role_inSystem((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: input_Role_inSystem, mode }}
            />

            <CustomInput
              event={(a, e) =>
                setinputCreateOn((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputCreateOn, mode }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="d-flex justify-content-end mt-5">
              <button type="submit" className="btn btn-success">
                <label style={{ cursor: "pointer" }}>
                  ​រក្សាទុក <MdSaveAlt className="ms-2" />
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

export default Account;
