import React, { useState, useRef, useEffect } from "react";

// // Icon
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { LiaLanguageSolid } from "react-icons/lia";
// Component
import RowBreaker from "../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../component/Title/Title.component.jsx";
import CustomInput from "../../../component/Input/CustomInput.component.jsx";
import CustomInputTextArea from "../../../component/TextArea/CustomInput.component.jsx";
import ButtonClearAndSave from "../../../component/Button/ButtonClearAndSave.component.jsx";
import Swal_Helper from "../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../component/SwalToast/SwalToast.js";
import Loading from "../../../component/Loading/Loading.component.jsx";
//script
import CustomInputHelper from "../../../component/Input/CustomInputHelper.script.js";
import {
  postRequest,
  getByIdRequest,
  updateRequest,
  getAllRequest,
} from "../../../util/request_api.js";

function FooterIndex({ modes, auth }) {
  //========================
  // Declaration;
  const [isLoading, setisLoading] = useState(true);
  const access_token = auth.getClientLogin().data?.access_token;
  const mode = "custom";
  const formRef = useRef();
  const customInputHelper = new CustomInputHelper();
  const swal_Helper = new Swal_Helper();
  const swalToast = new SwalToast();
  // ========================
  // Declaration Input
  const [inputTitle, setinputTitle] = useState({
    title: "ចំណងជើង",
    id: "title",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញចំណងជើង​",
    value: "",
  });

  const [inputTitleEn, setinputTitleEn] = useState({
    title: "ចំណងជើង",
    id: "title_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញចំណងជើង​",
    value: "",
  });

  const [inputFullAddress, setinputFullAddress] = useState({
    title: "អាសយដ្ឋាន",
    id: "full_address",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញអាសយដ្ឋាន​",
    value: "",
  });

  const [inputFullAddressEn, setinputFullAddressEn] = useState({
    title: "អាសយដ្ឋាន",
    id: "full_address_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញអាសយដ្ឋាន​",
    value: "",
  });

  const [inputContact, setinputContact] = useState({
    title: "លេខទំនាក់ទំនង",
    id: "contact",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញលេខទំនាក់ទំនង​",
    value: "",
  });

  const [inputEmail, setinputEmail] = useState({
    title: "អុីមែល",
    id: "email",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញអុីមែល​",
    value: "",
  });

  const [inputCopyRight1, setinputCopyRight1] = useState({
    title: "រក្សាសិទ្ធ",
    id: "copy_right",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញរក្សាសិទ្ធ​",
    value: "",
  });

  const [inputCopyRight1En, setinputCopyRight1En] = useState({
    title: "រក្សាសិទ្ធ",
    id: "copy_right_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញរក្សាសិទ្ធ​",
    value: "",
  });

  const [inputCopyRight2, setinputCopyRight2] = useState({
    title: "រក្សាសិទ្ធ(ក្រោម)",
    id: "copy_right_below",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញរក្សាសិទ្ធ(ក្រោម)",
    value: "",
  });

  const [inputCopyRight2En, setinputCopyRight2En] = useState({
    title: "រក្សាសិទ្ធ(ក្រោម)",
    id: "copy_right_below_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញរក្សាសិទ្ធ(ក្រោម)",
    value: "",
  });

  const [inputURLLoacation, setinputURLLoacation] = useState({
    title: "ទីតាំងលើ Google Map (URL)",
    id: "url_mef",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញរក្សាសិទ្ធ(ក្រោម)",
    value: "",
  });
  // ========================
  // Loading
  useEffect(() => {
    loadingData();
  }, []);

  async function loadingData() {
    setisLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/footer`;
    const result = await getAllRequest(`${api}`, access_token);
    if (result.success) {
      const data = result?.data?.data;
      setinputTitle({
        ...inputTitle,
        value: data.title,
      });
      setinputTitleEn({
        ...inputTitleEn,
        value: data.title_en,
      });

      setinputFullAddress({
        ...inputFullAddress,
        value: data.full_address,
      });

      setinputFullAddressEn({
        ...inputFullAddressEn,
        value: data.full_address_en,
      });

      setinputContact({
        ...inputContact,
        value: data.contact,
      });

      setinputEmail({
        ...inputEmail,
        value: data.email,
      });

      setinputCopyRight1({
        ...inputCopyRight1,
        value: data.copy_right,
      });

      setinputCopyRight1En({
        ...inputCopyRight1En,
        value: data.copy_right_en,
      });

      setinputCopyRight2({
        ...inputCopyRight2,
        value: data.copy_right_below,
      });

      setinputCopyRight2En({
        ...inputCopyRight2En,
        value: data.copy_right_below_en,
      });

      setinputURLLoacation({
        ...inputURLLoacation,
        value: data.url_mef,
      });

      setisLoading(false);
    } else {
      setisLoading(false);
    }
  }

  //   ========================
  //   event

  const handleSubmit = (e) => {
    e.preventDefault();

    var data = customInputHelper.formValidation([
      { i: inputTitle, s: setinputTitle },
      { i: inputTitleEn, s: setinputTitleEn },
      { i: inputFullAddress, s: setinputFullAddress },
      { i: inputFullAddressEn, s: setinputFullAddressEn },
      { i: inputContact, s: setinputContact },
      { i: inputEmail, s: setinputEmail },
      { i: inputCopyRight1, s: setinputCopyRight1 },
      { i: inputCopyRight1En, s: setinputCopyRight1En },
      { i: inputCopyRight2, s: setinputCopyRight2 },
      { i: inputCopyRight2En, s: setinputCopyRight2En },
      { i: inputURLLoacation, s: setinputURLLoacation },
    ]);

    if (data.status) {
      successValidation(data);
    }
  };

  async function successValidation(data) {
    swal_Helper
      .alert_Ask_Confirm("តើអ្នកចង់រក្សាទុក និងកែប្រែព័ត៌មាន Footer?", "green")
      .then(async (res) => {
        if (res == true) {
          setisLoading(true);
          const dataSaved = data.objectData;
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/footer/${process.env.REACT_APP_API_CREATE}`;
          const result = await postRequest(`${api}`, dataSaved, access_token);
          if (result.success) {
            swalToast.toastSuccess("ព័ត៌មាន Footer ត្រូវបានកែប្រែ!", 1500);
          } else {
            swalToast.toastError("សូមព្យាយាមម្តងទៀតពេលក្រោយ!", 1500);
          }

          setisLoading(false);
        }
      });
  }

  // ============================
  // View
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title={"ព័ត៌មាន Footer"}
                icons={<FaNewspaper />}
              />
            </div>
          </div>
        </div>
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title={"ភាសាខ្មែរ"}
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) => {
                  setinputTitle((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputTitle, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) => {
                  setinputFullAddress((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputFullAddress, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) => {
                  setinputCopyRight1((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputCopyRight1, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) => {
                  setinputCopyRight2((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputCopyRight2, mode: mode }}
              />
            </div>
          </div>
          <RowBreaker />
        </div>

        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title={"ភាសាអង់គ្លេស"}
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) => {
                  setinputTitleEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputTitleEn, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) => {
                  setinputFullAddressEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputFullAddressEn, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) => {
                  setinputCopyRight1En((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputCopyRight1En, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) => {
                  setinputCopyRight2En((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputCopyRight2En, mode: mode }}
              />
            </div>
          </div>
          <RowBreaker />
        </div>

        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title={"ផ្សេងៗ"}
                icons={<MdOutlineMoreHoriz />}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <CustomInput
                event={(action, e) => {
                  setinputContact((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputContact, mode: mode }}
              />
            </div>

            <div className="col-md-6">
              <CustomInput
                event={(action, e) => {
                  setinputEmail((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputEmail, mode: mode }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) => {
                  setinputURLLoacation((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputURLLoacation, mode: mode }}
              />
            </div>
          </div>
        </div>

        <div className="container">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <ButtonClearAndSave
                isHideBackButton={true}
                formRef={formRef}
                isShowSaveButton={true}
                isShowClearButton={false}
              />
            </div>
          </div>
        </div>
      </form>
      <Loading is_loading={isLoading} />
    </div>
  );
}

export default FooterIndex;
