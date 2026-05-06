// React
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Component
import CustomSelect from "../../../../component/Select/CustomSelect.component";
import Title from "../../../../component/Title/Title.component";
import CustomInput from "../../../../component/Input/CustomInput.component";
import CustomCheckBox from "../../../../component/CheckBox/CustomCheckBox.component";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component";
import ButtonEditTop from "../../../../component/Button/ButtonEditTop.component";
import Loading from "../../../../component/Loading/Loading.component";

// Script
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import CustomSelectScript from "../../../../component/Select/CustomSelect.script";
import CustomInputHelper from "../../../../component/Input/CustomInputHelper.script";
import RouteScript from "../../../../route/route.script";
import {
  postRequest,
  getByIdRequest,
  updateRequest,
  getAllRequest,
} from "../../../../util/request_api.js";

function AccountForm({ mode, auth }) {
  //==================================
  // Declaration
  const swalToast = new SwalToast();
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const customSelect_Script = new CustomSelectScript();
  const routeScript = new RouteScript();
  const customInputHelper = new CustomInputHelper();
  const formRef = useRef();
  const id = useParams().id; //. update

  // Backend
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/users`;
  const apiGroup = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/group-user-permission-all`;
  const access_token = auth.getClientLogin().data?.access_token;

  // Input
  const [inputFirstName, setinputFirstName] = useState({
    title: "គោត្តនាម​",
    id: "firstname",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញគោត្តនាម​",
    value: "",
  });

  const [inputLastName, setinputLastName] = useState({
    title: "នាម​",
    id: "lastname",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញនាម​",
    value: "",
  });

  const [inputTel, setinputTel] = useState({
    title: "លេខទំនាក់ទំនង",
    id: "contact",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញលេខទំនាក់ទំនង",
    value: "",
  });

  const [inputDepartment, setinputDepartment] = useState({
    title: "អង្គភាព",
    id: "organization",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញអង្គភាព",
    value: "",
  });

  const [inputJob, setinputJob] = useState({
    title: "តួនាទី/មុខតំណែង",
    id: "job_title",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: null,
    value: "",
  });

  const [inputEmail, setinputEmail] = useState({
    title: "សារអេឡិត្រូនិច",
    id: "email",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញសារអេឡិត្រូនិច",
    value: "",
  });

  const [inputPassword, setinputPassword] = useState({
    title: "ពាក្យសម្ងាត់",
    id: "password",
    required: mode == "create" ? true : false,
    is_correct: true,
    type: "password",
    icon: null,
    error: "សូមបំពេញពាក្យសម្ងាត់",
    value: "",
  });

  const [inputGroupUser, setinputGroupUser] = useState({
    title: "តួនាទីក្នុងប្រព័ន្ធ",
    id: "group_user_id",
    required: true,
    is_correct: true,
    error: "សូមជ្រើសរើសតួនាទីក្នុងប្រព័ន្ធ",
    data: [],
    value: "",
    defualtValue: "",
    defualtTitle: "",
    display: "flex",
  });

  const [inputNote, setinputNote] = useState({
    title: "កំណត់ចំណាំ",
    id: "note",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "",
    value: "",
  });

  //==================================
  // Loading
  useEffect(() => {
    updateData();
    if (mode == "create") {
      loadingUserGroup_IfCreate();
    }
  }, []);

  async function loadingUserGroup_IfCreate() {
    const result = await getAllRequest(`${apiGroup}`, access_token);

    if (result.success) {
      var list = [];

      result.data.data.map((item) => {
        list.push({
          value: item._id,
          label: item.name,
        });
      });

      setinputGroupUser({
        ...inputGroupUser,
        data: list,
      });

      setisLoading(false);
    }
  }

  async function loadingGroupUser(dataObj) {
    const result = await getAllRequest(`${apiGroup}`, access_token);

    if (result.success) {
      var list = [];
      var title = "";
      result.data.data.map((item) => {
        list.push({
          value: item._id,
          label: item.name,
        });

        if (item._id == dataObj.group_user_id) {
          title = item.name;
        }
      });

      if (mode == "create") {
        setinputGroupUser({
          ...inputGroupUser,
          data: list,
        });
      } else {
        setinputGroupUser({
          ...inputGroupUser,
          data: list,
          value: dataObj.group_user_id,
          defualtValue: dataObj.group_user_id,
          defualtTitle: title,
        });
      }

      setisLoading(false);
    }
  }

  async function updateData() {
    //----------------------------------
    // Loading Update Data if Edit
    if ((id && mode == "edit") || mode == "view") {
      setisLoading(true);
      const result = await getByIdRequest(api + "/" + id, access_token);

      if (result.success) {
        const dataObj = result.data;
        setinputEmail({ ...inputEmail, value: dataObj.email });
        setinputFirstName({ ...inputFirstName, value: dataObj.firstname });
        setinputLastName({ ...inputLastName, value: dataObj.lastname });
        setinputDepartment({ ...inputDepartment, value: dataObj.organization });
        setinputJob({ ...inputJob, value: dataObj.job_title });
        setinputTel({ ...inputTel, value: dataObj.contact });
        setinputEmail({ ...inputEmail, value: dataObj.email });
        setinputNote({ ...inputNote, value: dataObj.note });
        document.getElementById("status").checked = !dataObj.status;
        loadingGroupUser(dataObj);
      } else {
        swalToast.toastError("ការទាញយកមិនត្រឹមត្រូវ!", 2000);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } else {
      var newPasssrd = generateStrongPassword();
      setinputPassword({ ...inputPassword, value: newPasssrd });
    }
  }

  //==================================
  // Event
  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setinputEmail((prev) => ({
        ...prev,
        error: "សូមបំពេញសារអេឡិចត្រូនិច!",
      }));
      setinputPassword((prev) => ({
        ...prev,
        error: "សូមបំពេញពាក្យសម្ងាត់!",
      }));
    }, 50);

    var data = customInputHelper.formValidation([
      { i: inputFirstName, s: setinputFirstName },
      { i: inputLastName, s: setinputLastName },
      { i: inputDepartment, s: setinputDepartment },
      { i: inputJob, s: setinputJob },
      { i: inputTel, s: setinputTel },
      { i: inputGroupUser, s: setinputGroupUser },
      { i: inputEmail, s: setinputEmail },
      { i: inputPassword, s: setinputPassword },
      { i: inputNote, s: setinputNote },
    ]);

    if (data.status) {
      if (validateEmailMEF(data)) {
        if (validateStrongPassword(data) || mode == "edit") {
          successValidation(data, !document.getElementById("status").checked);
        }
      }
    }
  };

  function validateEmailMEF(data) {
    // Regex to check if email ends with @gov.mef.kh
    // var emailPattern = /^[^\s@]+@mef\.gov\.kh$/;

    // if (!emailPattern.test(data.objectData.email)) {
    //   setTimeout(() => {
    //     setinputEmail((prev) => ({
    //       ...prev,
    //       error: "សារអេឡិចត្រូនិចត្រូវតែបញ្ចប់ដោយ @mef.gov.kh ប៉ុណ្ណោះ!",
    //       is_correct: false,
    //     }));
    //   }, 100);
    // }

    // return emailPattern.test(data.objectData.email);
    return true;
  }

  function validateStrongPassword(data) {
    var userPassword = data.objectData.password;

    var strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordPattern.test(userPassword)) {
      setTimeout(() => {
        setinputPassword((prev) => ({
          ...prev,
          error: "ពាក្យសម្ងាត់របស់អ្នកមិនមានសុវត្ថិភាពគ្រប់គ្រាន់ទេ!",
          is_correct: false,
        }));
      }, 100);
    }
    return strongPasswordPattern.test(userPassword);
  }

  function generateStrongPassword(length = 12) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
    const all = upper + lower + numbers + symbols;

    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split("") // shuffle
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  async function successValidation(data, isActive) {
    var preparedData = {
      firstname: data.objectData.firstname,
      lastname: data.objectData.lastname,
      contact: data.objectData.contact,
      email: data.objectData.email,
      organization: data.objectData.organization,
      job_title: data.objectData.job_title,
      password: data.objectData.password,
      group_user_id: data.objectData.group_user_id,
      note: data.objectData.note,
      status: isActive,
    };

    //----------------------------------
    // Update Data
    setisLoading(true);
    if (id && mode == "edit") {
      delete preparedData.password;
      const result = await updateRequest(
        `${api}/${id}`,
        preparedData,
        access_token
      );
      if (result.success) {
        swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 2000);
        setTimeout(() => {
          navigate(routeScript.route().user_account_index.url);
        }, 2000);
      } else {
        swalToast.toastError("បរាជ័យ: " + result.message, 3000);
      }
    } else {
      //----------------------------------
      // Create New Data
      const result = await postRequest(api, preparedData, access_token);
      if (result.success) {
        swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 2000);
        setTimeout(() => {
          navigate(routeScript.route().user_account_index.url);
        }, 2000);
      } else {
        swalToast.toastError("បរាជ័យ: " + result.message, 3000);
        setisLoading(false);
      }
    }
  }

  //==================================
  // View
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="container defualt_White_Shadow_Theme">
        <RowBreaker isShow={mode == "view" ? true : false} />
        <ButtonEditTop
          isShow={mode == "view" ? true : false}
          url={`${routeScript
            .route()
            .user_account_edit.url.replace(":id", id)}`}
        />
        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <Title mode={mode} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <CustomInput
              event={(action, e) => {
                setinputFirstName((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputFirstName, mode: mode }}
            />
          </div>

          <div className="col-md-4">
            <CustomInput
              event={(action, e) => {
                setinputLastName((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputLastName, mode: mode }}
            />
          </div>

          <div className="col-md-4">
            <CustomInput
              event={(action, e) => {
                setinputDepartment((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputDepartment, mode: mode }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <CustomInput
              event={(action, e) => {
                setinputJob((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputJob, mode: mode }}
            />
          </div>

          <div className="col-md-4">
            <CustomInput
              event={(action, e) => {
                setinputTel((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputTel, mode: mode }}
            />
          </div>

          <div className="col-md-4">
            <CustomSelect
              props={{ select: inputGroupUser, mode: mode }}
              event={(action, e) => {
                customSelect_Script.OnchangeTriggerChangeToAutoCorrection(
                  e,
                  setinputGroupUser,
                  true
                );
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <CustomInput
              event={(action, e) => {
                setinputEmail((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{
                input: inputEmail,
                mode: mode == "create" ? mode : "view",
              }}
            />
          </div>

          <div
            className="col-md-4"
            hidden={mode == "view" || mode == "edit" ? true : false}
          >
            <CustomInput
              event={(action, e) => {
                setinputPassword((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputPassword, mode: mode }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <CustomInput
              event={(action, e) => {
                setinputNote((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputNote, mode: mode }}
            />
          </div>
        </div>

        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <CustomCheckBox title={"ឈប់ប្រើប្រាស់"} id={"status"} mode={mode} />
          </div>
        </div>
        <RowBreaker break={2} />

        <div className="row">
          <div className="col-md-12">
            <ButtonClearAndSave
              formRef={formRef}
              isShowSaveButton={mode == "view" ? false : true}
              isShowClearButton={mode == "create" ? true : false}
            />
          </div>
        </div>
      </div>
      <Loading is_loading={isLoading} />
    </form>
  );
}

export default AccountForm;
