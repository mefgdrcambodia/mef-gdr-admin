import React, { useState, useRef, useEffect } from "react";
import { FaImage, FaTrash } from "react-icons/fa";
import RowBreaker from "../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../component/Title/Title.component.jsx";
import ButtonClearAndSave from "../../../component/Button/ButtonClearAndSave.component.jsx";
import Swal_Helper from "../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../component/SwalToast/SwalToast.js";
import Loading from "../../../component/Loading/Loading.component.jsx";
import { postRequest, getAllRequest } from "../../../util/request_api.js";
import { useNavigate } from "react-router-dom";

function BannerPage({ auth, onSuccess, onCancel }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const access_token = auth.getClientLogin().data?.access_token;
  const mode = "custom";
  const formRef = useRef();
  const swalHelper = new Swal_Helper();
  const swalToast = new SwalToast();

  // State for each banner image
  const [about, setAbout] = useState({
    preview: null,
    file: null,
    existing: null,
    remove: false,
  });
  const [news, setNews] = useState({
    preview: null,
    file: null,
    existing: null,
    remove: false,
  });
  const [document, setDocument] = useState({
    preview: null,
    file: null,
    existing: null,
    remove: false,
  });
  const [report, setReport] = useState({
    preview: null,
    file: null,
    existing: null,
    remove: false,
  });
  const [status, setStatus] = useState(true);

  // Load existing data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/banner`;
    const result = await getAllRequest(api, access_token);

    if (result.success && result.data) {
      // Ensure we take the first object if it's an array
      let data = result.data.data;
      if (Array.isArray(data) && data.length > 0) data = data[0];

      // About
      setAbout({
        preview: data.url_about_general_department || null,
        file: null,
        existing: data.url_about_general_department || null,
        remove: false,
      });
      // News & Event
      setNews({
        preview: data.url_new_and_event || null,
        file: null,
        existing: data.url_new_and_event || null,
        remove: false,
      });
      // Document Collection
      setDocument({
        preview: data.url_document_collection || null,
        file: null,
        existing: data.url_document_collection || null,
        remove: false,
      });
      // Report
      setReport({
        preview: data.url_report || null,
        file: null,
        existing: data.url_report || null,
        remove: false,
      });
      setStatus(data.status === true || data.status === "true");
    } else {
      console.warn("No banner data found, keeping default empty state");
    }
    setIsLoading(false);
  };

  // Generic image handler
  const handleImageChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        swalToast.toastError("សូមជ្រើសរើសឯកសាររូបភាព", 1500);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        swalToast.toastError("ទំហំមិនលើស 5MB", 1500);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setter((prev) => ({
          ...prev,
          preview: reader.result,
          file,
          remove: false,
        }));
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setter) => () => {
    setter((prev) => ({
      preview: null,
      file: null,
      existing: null,
      remove: true,
    }));
  };

  // Submit – no validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (about.remove) formData.append("remove_about", "true");
    else if (about.file) formData.append("image_about", about.file);
    else if (about.existing) formData.append("existing_about", about.existing);

    if (news.remove) formData.append("remove_news", "true");
    else if (news.file) formData.append("image_news", news.file);
    else if (news.existing) formData.append("existing_news", news.existing);

    if (document.remove) formData.append("remove_document", "true");
    else if (document.file) formData.append("image_document", document.file);
    else if (document.existing)
      formData.append("existing_document", document.existing);

    if (report.remove) formData.append("remove_report", "true");
    else if (report.file) formData.append("image_report", report.file);
    else if (report.existing)
      formData.append("existing_report", report.existing);

    formData.append("status", status);

    swalHelper
      .alert_Ask_Confirm("តើអ្នកចង់រក្សាទុករូបភាព Banner?", "green")
      .then(async (res) => {
        if (res) {
          setIsLoading(true);
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/banner/${process.env.REACT_APP_API_CREATE}`;
          const result = await postRequest(api, formData, access_token);
          if (result.success) {
            swalToast.toastSuccess("រក្សាទុកជោគជ័យ!", 1500);
            await loadData(); // Reload fresh data
            if (onSuccess) onSuccess();
          } else {
            swalToast.toastError(result.message || "មិនបានជោគជ័យ", 1500);
          }
          setIsLoading(false);
        }
      });
  };

  const resetForm = () => {
    loadData();
    if (onCancel) onCancel();
    else navigate(-1);
  };

  const ImageCard = ({ title, state, onChange, onRemove, id }) => (
    <div className="row mb-4">
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
            className="form-control mb-2"
          />
          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសរូបភាព (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
          </small>
          {state.preview && (
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "300px",
                marginTop: "10px",
              }}
            >
              <img
                src={state.preview}
                alt={title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
              <button
                type="button"
                onClick={onRemove}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                <FaTrash /> លុប
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title="រូបភាព Banner នៃគេហទំព័រ"
                icons={<FaImage />}
              />
            </div>
          </div>
          {/* Added unique keys based on preview URL to force re‑render when image changes */}
          <ImageCard
            key={about.preview || "about-empty"}
            title="ផ្នែក About General Department"
            state={about}
            onChange={handleImageChange(setAbout)}
            onRemove={handleRemoveImage(setAbout)}
            id="about_image"
          />
          <ImageCard
            key={news.preview || "news-empty"}
            title="ផ្នែក News & Event"
            state={news}
            onChange={handleImageChange(setNews)}
            onRemove={handleRemoveImage(setNews)}
            id="news_image"
          />
          <ImageCard
            key={document.preview || "document-empty"}
            title="ផ្នែក Document Collection"
            state={document}
            onChange={handleImageChange(setDocument)}
            onRemove={handleRemoveImage(setDocument)}
            id="document_image"
          />
          <ImageCard
            key={report.preview || "report-empty"}
            title="ផ្នែក Report"
            state={report}
            onChange={handleImageChange(setReport)}
            onRemove={handleRemoveImage(setReport)}
            id="report_image"
          />

          <RowBreaker />
        </div>
        <div className="container">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <ButtonClearAndSave
                isHideBackButton={false}
                formRef={formRef}
                isShowSaveButton={true}
                isShowClearButton={false}
                onClear={resetForm}
              />
            </div>
          </div>
        </div>
      </form>
      <Loading is_loading={isLoading} />
    </div>
  );
}

export default BannerPage;
