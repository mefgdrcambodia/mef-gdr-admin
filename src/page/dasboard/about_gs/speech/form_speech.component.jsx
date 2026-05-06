import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  FaImage,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaHeading,
  FaLink,
  FaUnderline,
  FaPaintBrush,
  FaHighlighter,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaFont,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { LiaLanguageSolid } from "react-icons/lia";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../../component/Title/Title.component.jsx";
import CustomInputTextArea from "../../../../component/TextArea/CustomInput.component.jsx";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component.jsx";
import Swal_Helper from "../../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import Loading from "../../../../component/Loading/Loading.component.jsx";
import CustomInputHelper from "../../../../component/Input/CustomInputHelper.script.js";
import { postRequest, getByIdRequest } from "../../../../util/request_api.js";
import { useParams, useNavigate } from "react-router-dom";

// ---------- Rich Text Editor (same as before) ----------
const colors = [
  { name: "ខ្មៅ", value: "#000000" },
  { name: "ក្រហម", value: "#FF0000" },
  { name: "បៃតង", value: "#00FF00" },
  { name: "ខៀវ", value: "#0000FF" },
  { name: "លឿង", value: "#FFFF00" },
  { name: "ស្វាយ", value: "#800080" },
  { name: "ទឹកក្រូច", value: "#FFA500" },
  { name: "ផ្កាឈូក", value: "#FFC0CB" },
  { name: "ប្រផេះ", value: "#808080" },
  { name: "ស", value: "#FFFFFF" },
];

const fontSizes = [
  { name: "តូច", value: "12px" },
  { name: "ធម្មតា", value: "14px" },
  { name: "មធ្យម", value: "16px" },
  { name: "ធំ", value: "18px" },
  { name: "ធំជាង", value: "20px" },
  { name: "ធំបំផុត", value: "24px" },
  { name: "យក្ស", value: "32px" },
];

const fontFamilies = [
  {
    name: "ខ្មែរ (Default)",
    value: "'Khmer OS', 'Noto Sans Khmer', sans-serif",
  },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
];

const MenuButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`ql-button ${active ? "active" : ""}`}
    title={title}
    style={{
      padding: "8px 12px",
      margin: "0 2px",
      border: "1px solid #ddd",
      background: active ? "#e6e6e6" : "#fff",
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: "14px",
    }}
  >
    {children}
  </button>
);

const RichTextEditor = ({ label, value, onChange, error, required }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const colorPickerRef = useRef();
  const bgColorPickerRef = useRef();
  const fontSizeRef = useRef();
  const fontFamilyRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: `សរសេរអត្ថបទ ${label}...` }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontFamily,
      Highlight,
      Underline,
      Link.configure({ openOnClick: false }),
      HorizontalRule,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      )
        setShowColorPicker(false);
      if (
        bgColorPickerRef.current &&
        !bgColorPickerRef.current.contains(event.target)
      )
        setShowBgColorPicker(false);
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target))
        setShowFontSize(false);
      if (
        fontFamilyRef.current &&
        !fontFamilyRef.current.contains(event.target)
      )
        setShowFontFamily(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const setFontSize = (size) => {
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    setShowFontSize(false);
  };
  const setFontFamily = (font) => {
    editor.chain().focus().setFontFamily(font).run();
    setShowFontFamily(false);
  };
  const addLink = () => {
    const url = window.prompt("បញ្ចូល URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="row mb-3">
      <div className="col-md-12">
        <label
          style={{ fontWeight: "bold", marginBottom: "10px", display: "block" }}
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
        <div
          style={{
            border: "1px solid #ddd",
            borderBottom: "none",
            padding: "8px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px 4px 0 0",
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            position: "relative",
          }}
        >
          <div
            style={{
              borderRight: "1px solid #ddd",
              paddingRight: "5px",
              marginRight: "5px",
            }}
          >
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="ដិត"
            >
              <FaBold />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="ទ្រេត"
            >
              <FaItalic />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="គូសបន្ទាត់ក្រោម"
            >
              <FaUnderline />
            </MenuButton>
          </div>
          <div
            style={{
              borderRight: "1px solid #ddd",
              paddingRight: "5px",
              marginRight: "5px",
            }}
          >
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", { level: 1 })}
              title="H1"
            >
              H1
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
              title="H2"
            >
              H2
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive("heading", { level: 3 })}
              title="H3"
            >
              H3
            </MenuButton>
          </div>
          <div style={{ position: "relative" }} ref={colorPickerRef}>
            <MenuButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="ពណ៌អក្សរ"
            >
              <FaPaintBrush style={{ color: "#FF0000" }} />
            </MenuButton>
            {showColorPicker && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  width: "200px",
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: "5px",
                  marginTop: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(color.value).run();
                      setShowColorPicker(false);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: color.value,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }} ref={bgColorPickerRef}>
            <MenuButton
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              title="ពណ៌ផ្ទៃខាងក្រោយ"
            >
              <FaHighlighter style={{ color: "#FFFF00" }} />
            </MenuButton>
            {showBgColorPicker && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  width: "200px",
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: "5px",
                  marginTop: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .setHighlight({ color: color.value })
                        .run();
                      setShowBgColorPicker(false);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: color.value,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }} ref={fontSizeRef}>
            <MenuButton
              onClick={() => setShowFontSize(!showFontSize)}
              title="ទំហំអក្សរ"
            >
              <FaFont />
              <FaPlus size={10} />
            </MenuButton>
            {showFontSize && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setFontSize(size.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "5px 10px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: size.value,
                    }}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }} ref={fontFamilyRef}>
            <MenuButton
              onClick={() => setShowFontFamily(!showFontFamily)}
              title="ប្រភេទពុម្ពអក្សរ"
            >
              <FaFont />
            </MenuButton>
            {showFontFamily && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  minWidth: "200px",
                }}
              >
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => setFontFamily(font.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "5px 10px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: font.value,
                    }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              borderRight: "1px solid #ddd",
              paddingRight: "5px",
              marginRight: "5px",
            }}
          >
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              active={editor.isActive({ textAlign: "left" })}
              title="តម្រឹមឆ្វេង"
            >
              <FaAlignLeft />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              active={editor.isActive({ textAlign: "center" })}
              title="តម្រឹមកណ្តាល"
            >
              <FaAlignCenter />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              active={editor.isActive({ textAlign: "right" })}
              title="តម្រឹមស្តាំ"
            >
              <FaAlignRight />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              active={editor.isActive({ textAlign: "justify" })}
              title="តម្រឹមសងខាង"
            >
              <FaAlignJustify />
            </MenuButton>
          </div>
          <div
            style={{
              borderRight: "1px solid #ddd",
              paddingRight: "5px",
              marginRight: "5px",
            }}
          >
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="បញ្ជីគ្មានលេខ"
            >
              <FaListUl />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="បញ្ជីមានលេខ"
            >
              <FaListOl />
            </MenuButton>
          </div>
          <div>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="សម្រង់"
            >
              <FaQuoteLeft />
            </MenuButton>
            <MenuButton
              onClick={addLink}
              active={editor.isActive("link")}
              title="បន្ថែមតំណ"
            >
              <FaLink />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="បន្ថែមបន្ទាត់"
            >
              <FaMinus />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              title="ត្រឡប់ក្រោយ"
            >
              <FaUndo />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              title="ធ្វើឡើងវិញ"
            >
              <FaRedo />
            </MenuButton>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "0 0 4px 4px",
            backgroundColor: "#fff",
            minHeight: "300px",
          }}
        >
          <EditorContent
            editor={editor}
            style={{ padding: "12px", minHeight: "300px" }}
          />
        </div>
        {error && !value && (
          <small style={{ color: "red", marginTop: "5px", display: "block" }}>
            {error}
          </small>
        )}
      </div>
    </div>
  );
};

// ---------- Main FormSpeech Component ----------
function FormSpeech({ auth, onSuccess, onCancel }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const access_token = auth.getClientLogin().data?.access_token;
  const mode = "custom";
  const formRef = useRef();
  const customInputHelper = new CustomInputHelper();
  const swalHelper = new Swal_Helper();
  const swalToast = new SwalToast();

  // Title image states
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [titleImageFile, setTitleImageFile] = useState(null);
  const [existingTitleImage, setExistingTitleImage] = useState(null);
  const [removeTitleImage, setRemoveTitleImage] = useState(false);

  const [status, setStatus] = useState(true);

  // Form fields
  const [inputTitleKh, setInputTitleKh] = useState({
    title: "ចំណងជើង (ភាសាខ្មែរ)",
    id: "title_kh",
    required: true,
    is_correct: true,
    type: "text",
    error: "សូមបំពេញចំណងជើងជាភាសាខ្មែរ",
    value: "",
  });
  const [inputTitleEn, setInputTitleEn] = useState({
    title: "ចំណងជើង (ភាសាអង់គ្លេស)",
    id: "title_en",
    required: true,
    is_correct: true,
    type: "text",
    error: "សូមបំពេញចំណងជើងជាភាសាអង់គ្លេស",
    value: "",
  });
  const [inputArticleKh, setInputArticleKh] = useState({
    title: "អត្ថបទ (ភាសាខ្មែរ)",
    id: "article_kh",
    required: true,
    is_correct: true,
    type: "html",
    error: "សូមបំពេញអត្ថបទជាភាសាខ្មែរ",
    value: "",
  });
  const [inputArticleEn, setInputArticleEn] = useState({
    title: "អត្ថបទ (ភាសាអង់គ្លេស)",
    id: "article_en",
    required: true,
    is_correct: true,
    type: "html",
    error: "សូមបំពេញអត្ថបទជាភាសាអង់គ្លេស",
    value: "",
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadSpeechData();
    }
  }, [id]);

  const loadSpeechData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/speech/${id}`;
    const result = await getByIdRequest(api, access_token);
    if (result.success) {
      const data = result.data;
      setInputTitleKh((prev) => ({ ...prev, value: data.title?.kh || "" }));
      setInputTitleEn((prev) => ({ ...prev, value: data.title?.en || "" }));
      setInputArticleKh((prev) => ({ ...prev, value: data.article?.kh || "" }));
      setInputArticleEn((prev) => ({ ...prev, value: data.article?.en || "" }));
      setExistingTitleImage(data.title_image || null);
      setTitleImagePreview(data.title_image || null);
      setStatus(data.status === true || data.status === "true");
    }
    setIsLoading(false);
  };

  // Title image handlers
  const handleTitleImageChange = (e) => {
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
      setTitleImageFile(file);
      setRemoveTitleImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setTitleImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTitleImage = () => {
    setTitleImageFile(null);
    setTitleImagePreview(null);
    setExistingTitleImage(null);
    setRemoveTitleImage(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripHtml = (html) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent?.trim() || "";
    };

    if (!stripHtml(inputArticleKh.value)) {
      setInputArticleKh((prev) => ({ ...prev, is_correct: false }));
      swalToast.toastError("សូមបំពេញអត្ថបទភាសាខ្មែរ", 1500);
      return;
    }
    if (!stripHtml(inputArticleEn.value)) {
      setInputArticleEn((prev) => ({ ...prev, is_correct: false }));
      swalToast.toastError("សូមបំពេញអត្ថបទភាសាអង់គ្លេស", 1500);
      return;
    }

    const validation = customInputHelper.formValidation([
      { i: inputTitleKh, s: setInputTitleKh },
      { i: inputTitleEn, s: setInputTitleEn },
    ]);
    if (!validation.status) return;

    const formData = new FormData();
    formData.append("title_kh", validation.objectData.title_kh);
    formData.append("title_en", validation.objectData.title_en);
    formData.append("article_kh", inputArticleKh.value);
    formData.append("article_en", inputArticleEn.value);
    formData.append("status", status);

    if (removeTitleImage) formData.append("remove_title_image", "true");
    else if (titleImageFile) formData.append("title_image", titleImageFile);
    else if (existingTitleImage)
      formData.append("existing_title_image", existingTitleImage);

    if (isEditing && id) formData.append("id", id);

    swalHelper
      .alert_Ask_Confirm(
        isEditing
          ? "តើអ្នកចង់កែប្រែសុន្ទរកថានេះ?"
          : "តើអ្នកចង់រក្សាទុកសុន្ទរកថា?",
        "green",
      )
      .then(async (res) => {
        if (res) {
          setIsLoading(true);
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/speech/${process.env.REACT_APP_API_CREATE}`;
          const result = await postRequest(api, formData, access_token);
          if (result.success) {
            swalToast.toastSuccess(
              isEditing
                ? "កែប្រែសុន្ទរកថាដោយជោគជ័យ!"
                : "រក្សាទុកសុន្ទរកថាដោយជោគជ័យ!",
              1500,
            );
            if (onSuccess) onSuccess();
            else navigate(-1);
          } else {
            swalToast.toastError(result.message || "មិនបានជោគជ័យ!", 1500);
          }
          setIsLoading(false);
        }
      });
  };

  const resetForm = () => {
    if (!isEditing) {
      setInputTitleKh((prev) => ({ ...prev, value: "" }));
      setInputTitleEn((prev) => ({ ...prev, value: "" }));
      setInputArticleKh((prev) => ({ ...prev, value: "" }));
      setInputArticleEn((prev) => ({ ...prev, value: "" }));
      setTitleImagePreview(null);
      setTitleImageFile(null);
      setExistingTitleImage(null);
      setRemoveTitleImage(false);
      setStatus(true);
    }
    if (onCancel) onCancel();
    else navigate(-1);
  };

  const TitleImageUploadSection = () => (
    <div className="row mb-3">
      <div className="col-md-12">
        <div
          style={{
            border: "2px dashed #4CAF50",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f1f8e9",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
              color: "#2e7d32",
            }}
          >
            <FaImage style={{ marginRight: "8px" }} />
            រូបភាពចំណងជើង (Title Image)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleTitleImageChange}
            className="form-control mb-2"
          />

          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសរូបភាព (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
          </small>

          {(titleImagePreview || existingTitleImage) && (
            <div className="mt-3">
              <strong>រូបភាពបច្ចុប្បន្ន:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ position: "relative", width: "200px" }}>
                  <img
                    src={titleImagePreview || existingTitleImage}
                    alt="Title"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "2px solid #4CAF50",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveTitleImage}
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Khmer Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title="ភាសាខ្មែរ"
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(a, e) =>
                  setInputTitleKh((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputTitleKh, mode }}
              />
            </div>
          </div>
          <RowBreaker break={2} />
          <RichTextEditor
            label="អត្ថបទ (ភាសាខ្មែរ)"
            value={inputArticleKh.value}
            onChange={(val) =>
              setInputArticleKh((prev) => ({
                ...prev,
                value: val,
                is_correct: true,
              }))
            }
            error={inputArticleKh.error}
            required
          />
          <RowBreaker />
        </div>

        {/* English Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title="ភាសាអង់គ្លេស"
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(a, e) =>
                  setInputTitleEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }))
                }
                props={{ input: inputTitleEn, mode }}
              />
            </div>
          </div>
          <RowBreaker break={2} />
          <RichTextEditor
            label="អត្ថបទ (ភាសាអង់គ្លេស)"
            value={inputArticleEn.value}
            onChange={(val) =>
              setInputArticleEn((prev) => ({
                ...prev,
                value: val,
                is_correct: true,
              }))
            }
            error={inputArticleEn.error}
            required
          />
          <RowBreaker />
        </div>

        {/* Title Image & Status */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title="រូបភាព និងស្ថានភាព"
                icons={<FaImage />}
              />
            </div>
          </div>
          <TitleImageUploadSection />

          <RowBreaker />
        </div>

        {/* Buttons */}
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

export default FormSpeech;
