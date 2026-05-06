import React, { useState, useRef, useEffect } from "react";

// Icon
import { FaNewspaper, FaImage } from "react-icons/fa";
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
import { postRequest, getAllRequest } from "../../../util/request_api.js";

function HeaderIndex({ modes, auth }) {
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
  // Image states - Logo (single)
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState("");

  // Banner states (multiple)
  const [bannerFiles, setBannerFiles] = useState([]); // array of new File objects
  const [bannerPreviews, setBannerPreviews] = useState([]); // array of preview URLs
  const [existingBanners, setExistingBanners] = useState([]); // array of existing banner objects { url: string }

  // ========================
  // Declaration Input
  const [inputNameFull, setinputNameFull] = useState({
    title: "ឈ្មោះ Logo ពេញ",
    id: "mef_name_full",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញឈ្មោះ Logo ពេញ​",
    value: "",
  });

  const [inputNameFullEn, setinputNameFullEn] = useState({
    title: "ឈ្មោះ Logo ពេញ",
    id: "mef_name_full_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញឈ្មោះ Logo ពេញ​",
    value: "",
  });

  const [inputNameShort, setinputNameShort] = useState({
    title: "ឈ្មោះ Logo អក្សរកាត់",
    id: "mef_name_short",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញឈ្មោះ Logo អក្សរកាត់",
    value: "",
  });

  const [inputNameShortEn, setinputNameShortEn] = useState({
    title: "ឈ្មោះ Logo អក្សរកាត់",
    id: "mef_name_short_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញឈ្មោះ Logo អក្សរកាត់",
    value: "",
  });

  const [inputRunningText, setinputRunningText] = useState({
    title: "អក្សររត់លើផ្ទាំង Banner",
    id: "running_text",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "អក្សររត់លើផ្ទាំង Banner",
    value: "",
  });

  const [inputRunningTextEn, setinputRunningTextEn] = useState({
    title: "អក្សររត់លើផ្ទាំង Banner",
    id: "running_text_en",
    required: false,
    is_correct: true,
    type: "text",
    icon: null,
    error: "អក្សររត់លើផ្ទាំង Banner",
    value: "",
  });

  // ========================
  // Helper functions for running text
  const convertArrayToText = (array) => {
    if (!array || !Array.isArray(array)) return "";
    return array.map((item) => item.text).join("\n");
  };

  const convertTextToArray = (text) => {
    if (!text || text.trim() === "") return [];
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => ({ text: line.trim() }));
  };

  // ========================
  // Loading data
  useEffect(() => {
    loadingData();
  }, []);

  async function loadingData() {
    setisLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/header`;
    const result = await getAllRequest(`${api}`, access_token);
    if (result.success) {
      const data = result?.data?.data;
      setinputNameFull({
        ...inputNameFull,
        value: data.mef_name_full || "",
      });
      setinputNameFullEn({
        ...inputNameFullEn,
        value: data.mef_name_full_en || "",
      });
      setinputNameShort({
        ...inputNameShort,
        value: data.mef_name_short || "",
      });
      setinputNameShortEn({
        ...inputNameShortEn,
        value: data.mef_name_short_en || "",
      });

      const runningTextValue = convertArrayToText(data.running_text);
      setinputRunningText({
        ...inputRunningText,
        value: runningTextValue,
      });

      const runningTextEnValue = convertArrayToText(data.running_text_en);
      setinputRunningTextEn({
        ...inputRunningTextEn,
        value: runningTextEnValue,
      });

      // Logo
      if (data.url_logo) {
        setExistingLogoUrl(data.url_logo);
        setLogoPreview(data.url_logo);
      }

      // Banners (array)
      if (data.banners && Array.isArray(data.banners)) {
        setExistingBanners(data.banners);
        // For preview, extract URLs
        setBannerPreviews(data.banners.map((b) => b.url));
      } else {
        setExistingBanners([]);
        setBannerPreviews([]);
      }

      setisLoading(false);
    } else {
      setisLoading(false);
    }
  }

  // ========================
  // Logo handling (single)
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        swalToast.toastError("សូមជ្រើសរើសឯកសាររូបភាពប៉ុណ្ណោះ!", 1500);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        swalToast.toastError("ទំហំឯកសារត្រូវតែតិចជាង 5MB!", 1500);
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setExistingLogoUrl("");
  };

  // ========================
  // Banner handling (multiple)
  const handleBannerChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate each file
    const validFiles = [];
    const validPreviews = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        swalToast.toastError(`ឯកសារ ${file.name} មិនមែនជារូបភាព!`, 1500);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        swalToast.toastError(`ទំហំឯកសារ ${file.name} លើស 5MB!`, 1500);
        continue;
      }
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result);
        // Update previews after all reads (simplified)
        if (validPreviews.length === validFiles.length) {
          setBannerPreviews([...bannerPreviews, ...validPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }
    setBannerFiles([...bannerFiles, ...validFiles]);
  };

  const handleRemoveBanner = (
    index,
    isExisting = false,
    existingIndex = null,
  ) => {
    if (isExisting) {
      // Remove existing banner (by index in existingBanners array)
      const updatedExisting = [...existingBanners];
      updatedExisting.splice(existingIndex, 1);
      setExistingBanners(updatedExisting);
      // Remove from previews accordingly (previews for existing are at the beginning? We need to sync)
      // Simpler: rebuild previews from existingBanners + bannerFiles
      const newPreviews = [
        ...updatedExisting.map((b) => b.url),
        ...bannerFiles.map((f) => URL.createObjectURL(f)),
      ];
      setBannerPreviews(newPreviews);
    } else {
      // Remove newly added file (by index in bannerFiles)
      const updatedFiles = [...bannerFiles];
      updatedFiles.splice(index, 1);
      setBannerFiles(updatedFiles);
      // Remove preview URL (revoke if needed)
      const updatedPreviews = [...bannerPreviews];
      // Previews for new files appear after existing banners
      const startIndex = existingBanners.length;
      updatedPreviews.splice(startIndex + index, 1);
      setBannerPreviews(updatedPreviews);
    }
  };

  // ========================
  // Submit event
  const handleSubmit = (e) => {
    e.preventDefault();

    var data = customInputHelper.formValidation([
      { i: inputNameFull, s: setinputNameFull },
      { i: inputNameFullEn, s: setinputNameFullEn },
      { i: inputNameShort, s: setinputNameShort },
      { i: inputNameShortEn, s: setinputNameShortEn },
      { i: inputRunningText, s: setinputRunningText },
      { i: inputRunningTextEn, s: setinputRunningTextEn },
    ]);

    if (data.status) {
      const runningTextArray = convertTextToArray(inputRunningText.value);
      const runningTextEnArray = convertTextToArray(inputRunningTextEn.value);

      const formData = new FormData();

      // Text fields
      formData.append("mef_name_full", data.objectData.mef_name_full);
      formData.append("mef_name_full_en", data.objectData.mef_name_full_en);
      formData.append("mef_name_short", data.objectData.mef_name_short);
      formData.append("mef_name_short_en", data.objectData.mef_name_short_en);
      formData.append("running_text", JSON.stringify(runningTextArray));
      formData.append("running_text_en", JSON.stringify(runningTextEnArray));

      // Logo handling
      if (existingLogoUrl && !logoFile) {
        formData.append("existing_logo_url", existingLogoUrl);
      }
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Banners handling
      // Send existing banners as JSON string (array of objects with url)
      if (existingBanners.length > 0) {
        formData.append("existing_banners", JSON.stringify(existingBanners));
      } else {
        formData.append("existing_banners", JSON.stringify([]));
      }
      // Append new banner files (field name "banner" multiple)
      for (let i = 0; i < bannerFiles.length; i++) {
        formData.append("banner", bannerFiles[i]);
      }

      successValidation(formData);
    }
  };

  async function successValidation(data) {
    swal_Helper
      .alert_Ask_Confirm("តើអ្នកចង់រក្សាទុក និងកែប្រែព័ត៌មាន Header?", "green")
      .then(async (res) => {
        if (res == true) {
          setisLoading(true);
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/header/${process.env.REACT_APP_API_CREATE}`;
          const result = await postRequest(`${api}`, data, access_token);
          if (result.success) {
            swalToast.toastSuccess("ព័ត៌មាន Header ត្រូវបានកែប្រែ!", 1500);
            setTimeout(() => loadingData(), 1500);
          } else {
            swalToast.toastError(
              result.message || "សូមព្យាយាមម្តងទៀតពេលក្រោយ!",
              1500,
            );
          }
          setisLoading(false);
        }
      });
  }

  // ============================
  // Image Upload Components
  const ImageUploadSection = ({ title, preview, onChange, onRemove, id }) => (
    <div className="row mb-3">
      <div className="col-md-12">
        <div
          style={{
            border: "1px dashed #ddd",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {title}
          </label>
          <input
            type="file"
            id={id}
            accept="image/*"
            onChange={onChange}
            style={{ marginBottom: "10px" }}
          />
          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសឯកសាររូបភាព (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
          </small>
          {preview && (
            <div style={{ marginTop: "10px", position: "relative" }}>
              <img
                src={preview}
                alt={`${title} preview`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "5px",
                }}
              />
              <button
                type="button"
                onClick={onRemove}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                លុបរូបភាព
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MultiImageUploadSection = ({
    title,
    previews,
    onChange,
    onRemove,
    id,
  }) => (
    <div className="row mb-3">
      <div className="col-md-12">
        <div
          style={{
            border: "1px dashed #ddd",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {title}
          </label>
          <input
            type="file"
            id={id}
            accept="image/*"
            multiple
            onChange={onChange}
            style={{ marginBottom: "10px" }}
          />
          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសរូបភាពច្រើន (អតិបរមា 10) - ទំហំមិនលើស 5MB ក្នុងមួយឯកសារ
          </small>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {previews.map((src, idx) => {
              // Determine if this preview is from existing or new
              const isExisting = idx < existingBanners.length;
              const actualIndex = isExisting
                ? idx
                : idx - existingBanners.length;
              return (
                <div key={idx} style={{ position: "relative", width: "150px" }}>
                  <img
                    src={src}
                    alt={`banner ${idx}`}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onRemove(
                        actualIndex,
                        isExisting,
                        isExisting ? actualIndex : null,
                      )
                    }
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // ========================
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
                title={"ព័ត៌មាន Header"}
                icons={<FaNewspaper />}
              />
            </div>
          </div>
        </div>

        {/* Khmer Section */}
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
            <div className="col-md-9">
              <CustomInput
                event={(action, e) =>
                  setinputNameFull((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputNameFull, mode: mode }}
              />
            </div>
            <div className="col-md-3">
              <CustomInput
                event={(action, e) =>
                  setinputNameShort((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputNameShort, mode: mode }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) =>
                  setinputRunningText((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputRunningText, mode: mode }}
              />
            </div>
          </div>
          <RowBreaker />
        </div>

        {/* English Section */}
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
            <div className="col-md-9">
              <CustomInput
                event={(action, e) =>
                  setinputNameFullEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputNameFullEn, mode: mode }}
              />
            </div>
            <div className="col-md-3">
              <CustomInput
                event={(action, e) =>
                  setinputNameShortEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputNameShortEn, mode: mode }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) =>
                  setinputRunningTextEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputRunningTextEn, mode: mode }}
              />
            </div>
          </div>
          <RowBreaker />
        </div>

        {/* Images Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title mode={mode} title={"រូបភាព"} icons={<FaImage />} />
            </div>
          </div>
          <ImageUploadSection
            title="ផ្ទាំង Logo"
            preview={logoPreview}
            onChange={handleLogoChange}
            onRemove={handleRemoveLogo}
            id="logo-upload"
          />
          <MultiImageUploadSection
            title="ផ្ទាំង Banner (ច្រើន)"
            previews={bannerPreviews}
            onChange={handleBannerChange}
            onRemove={handleRemoveBanner}
            id="banner-upload"
          />
          <RowBreaker />
        </div>

        {/* Button Section */}
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

export default HeaderIndex;
