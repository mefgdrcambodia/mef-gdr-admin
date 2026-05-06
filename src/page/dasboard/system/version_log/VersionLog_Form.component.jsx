// React
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RxActivityLog } from "react-icons/rx";

// Component
import Title from "../../../../component/Title/Title.component";
import CustomInput from "../../../../component/Input/CustomInput.component";
import CustomTextArea from "../../../../component/TextArea/CustomInput.component";
import CustomCheckBox from "../../../../component/CheckBox/CustomCheckBox.component";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component";
import ButtonEditTop from "../../../../component/Button/ButtonEditTop.component";
import CustomSelect from "../../../../component/Select/CustomSelect.component";
import Loading from "../../../../component/Loading/Loading.component.jsx";

// Script
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import CustomInputHelper from "../../../../component/Input/CustomInputHelper.script";
import CustomSelectScript from "../../../../component/Select/CustomSelect.script";
import RouteScript from "../../../../route/route.script";
import {
  getAllRequest,
  updateRequest,
  postRequest,
  getByIdRequest,
} from "../../../../util/request_api.js";

function AccountIncomeExpenseForm({ mode, auth }) {
  //==================================
  // Declaration
  const swalToast = new SwalToast();
  const access_token = auth.getClientLogin().data?.access_token;
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/system/version/log`;
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const customSelect_Script = new CustomSelectScript();
  const routeScript = new RouteScript();
  const customInputHelper = new CustomInputHelper();
  const formRef = useRef();
  const id = useParams().id; //. update

  // Input

  const [inputTitle, setinputinputTitle] = useState({
    title: "កម្មវត្ថុ",
    id: "title",
    required: mode == "create" ? true : false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបញ្ចូល កម្មវត្ថុ! ",
    value: "",
  });

  const [inputDescription, setinputDescription] = useState({
    title: "លំអិតនៃបច្ចុប្បន្នភាព",
    id: "description",
    required: mode == "create" ? true : false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបញ្ចូល លំអិតនៃបច្ចុប្បន្នភាព! ",
    value: "",
  });

  const [inputDate, setinputDate] = useState({
    title: "ថ្ងៃបច្ចុប្បន្នភាព",
    id: "date",
    required: mode == "create" ? true : false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបញ្ចូល ថ្ងៃបច្ចុប្បន្នភាព! ",
    value: "",
  });

  const [inputVersionBuild, setinputVersionBuild] = useState({
    title: "លេខកំណែ",
    id: "version_build",
    required: mode == "create" ? true : false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបញ្ចូល លេខកំណែ! ",
    value: "",
  });

  const [inputVersion, setinputVersion] = useState({
    title: "បច្ចុប្បន្នភាពប្រព័ន្ធ",
    id: "version_number",
    required: mode == "create" ? true : false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបញ្ចូល បច្ចុប្បន្នភាពប្រព័ន្ធ! ",
    value: "",
  });

  const convertToKhmerDate = (isoDate) => {
    const date = new Date(isoDate);

    // Khmer numbers
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

    // Khmer months
    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];

    // Get date components
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Convert numbers to Khmer
    const khmerDay = day
      .toString()
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");
    const khmerYear = year
      .toString()
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");
    const khmerHours = hours
      .toString()
      .padStart(2, "0")
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");
    const khmerMinutes = minutes
      .toString()
      .padStart(2, "0")
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");

    // Format: ថ្ងៃទី ២៧ កុម្ភៈ ២០២៦ ម៉ោង ១០:៣២:៣៤
    return `ថ្ងៃទី ${khmerDay} ${khmerMonths[month]} ${khmerYear}, ${khmerHours}:${khmerMinutes}នាទី`;
  };

  //==================================
  // Loading
  useEffect(() => {
    if (mode == "view") {
      fetchData();
    }
  }, []);

  async function fetchData() {
    if (id) {
      setisLoading(true);
      const result = await getByIdRequest(api + "/" + id, access_token);

      if (result.success) {
        const dataObj = result.data;

        setinputinputTitle({
          ...inputTitle,
          value: dataObj.title,
        });

        setinputDate({
          ...inputDate,
          value: dataObj.created_date,
        });

        setinputVersionBuild({
          ...inputVersionBuild,
          value: dataObj.version_build,
        });

        setinputVersion({
          ...inputVersion,
          value: dataObj.version_number,
        });

        setinputDescription({
          ...inputDescription,
          value: dataObj.description,
        });

        setisLoading(false);
      } else {
        swalToast.toastError("ការទាញយកមិនត្រឹមត្រូវ!", 2000);
        setTimeout(() => {
          navigate(routeScript.route().system_index.url);
        }, 2000);
      }
    } else {
      setTimeout(() => {
        navigate(routeScript.route().system_index.url);
      }, 2000);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    var data = customInputHelper.formValidation([
      { i: inputTitle, s: setinputinputTitle },
      { i: inputDescription, s: setinputDescription },
      { i: inputVersionBuild, s: setinputVersionBuild },
      { i: inputVersion, s: setinputVersion },
    ]);

    if (data.status) {
      successValidation(data);
    }
  };

  async function successValidation(data) {
    var preparedData = {
      title: data.objectData.title,
      description: data.objectData.description,
      version_build: data.objectData.version_build,
      version_number: data.objectData.version_number,
    };

    //----------------------------------
    // Update Data
    setisLoading(true);
    if (id && mode == "edit") {
      const result = await updateRequest(
        `${api}/${id}`,
        preparedData,
        access_token,
      );
      if (result.success) {
        swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 2000);
        setTimeout(() => {
          navigate(routeScript.route().system_index.url);
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
          navigate(routeScript.route().system_index.url);
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
        <RowBreaker />

        <div className="row">
          <div className="col-md-12">
            <label className="siemreap-bold">
              {mode === "create" ? (
                <>
                  <RxActivityLog style={{ marginRight: "10px" }} />
                  បង្កើតថ្មី
                </>
              ) : (
                <>
                  {mode === "edit"
                    ? "ប្រព័ន្ធបានធ្វើបច្ចុប្បន្នភាព"
                    : convertToKhmerDate(inputDate.value)}
                </>
              )}
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <hr />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <CustomInput
              event={(action, e) => {
                setinputinputTitle((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputTitle, mode: mode }}
            />
          </div>

          <div className="col-md-3">
            <CustomInput
              event={(action, e) => {
                setinputVersion((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputVersion, mode: mode }}
            />
          </div>

          <div className="col-md-3">
            <CustomInput
              event={(action, e) => {
                setinputVersionBuild((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputVersionBuild, mode: mode }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <CustomTextArea
              event={(action, e) => {
                setinputDescription((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }));
              }}
              props={{ input: inputDescription, mode: mode }}
            />
          </div>
        </div>

        <RowBreaker />
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

export default AccountIncomeExpenseForm;
