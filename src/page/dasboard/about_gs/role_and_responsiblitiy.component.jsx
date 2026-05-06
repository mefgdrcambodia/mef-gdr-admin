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
import { LiaLanguageSolid } from "react-icons/lia";
import RowBreaker from "../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../component/Title/Title.component.jsx";
import CustomInput from "../../../component/Input/CustomInput.component.jsx";
import ButtonClearAndSave from "../../../component/Button/ButtonClearAndSave.component.jsx";
import CustomInputHelper from "../../../component/Input/CustomInputHelper.script.js";
import Swal_Helper from "../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../component/SwalToast/SwalToast.js";
import Loading from "../../../component/Loading/Loading.component.jsx";
import { postRequest, getAllRequest } from "../../../util/request_api.js";
import { useNavigate } from "react-router-dom";

// ---------- Rich Text Editor Configuration ----------
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

const MenuButton = ({ onClick, active, children, title, color }) => (
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
      color: color || "#333",
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
          {/* Bold, Italic, Underline */}
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
              title="ដិត (Bold)"
            >
              <FaBold />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="ទ្រេត (Italic)"
            >
              <FaItalic />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="គូសបន្ទាត់ពីក្រោម (Underline)"
            >
              <FaUnderline />
            </MenuButton>
          </div>
          {/* Headings */}
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
              title="ចំណងជើងកម្រិត 1"
            >
              H1
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
              title="ចំណងជើងកម្រិត 2"
            >
              H2
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive("heading", { level: 3 })}
              title="ចំណងជើងកម្រិត 3"
            >
              H3
            </MenuButton>
          </div>
          {/* Text Color */}
          <div
            style={{ position: "relative", display: "inline-block" }}
            ref={colorPickerRef}
          >
            <MenuButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="ពណ៌អក្សរ (Text Color)"
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
                  gridTemplateColumns: "repeat(5, 1fr)",
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
          {/* Background Color */}
          <div
            style={{ position: "relative", display: "inline-block" }}
            ref={bgColorPickerRef}
          >
            <MenuButton
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              title="ពណ៌ផ្ទៃខាងក្រោយ (Background Color)"
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
                  gridTemplateColumns: "repeat(5, 1fr)",
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
          {/* Font Size */}
          <div
            style={{ position: "relative", display: "inline-block" }}
            ref={fontSizeRef}
          >
            <MenuButton
              onClick={() => setShowFontSize(!showFontSize)}
              title="ទំហំអក្សរ (Font Size)"
            >
              <FaFont /> <FaPlus size={10} />
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
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .setMark("textStyle", { fontSize: size.value })
                        .run();
                      setShowFontSize(false);
                    }}
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
          {/* Font Family */}
          <div
            style={{ position: "relative", display: "inline-block" }}
            ref={fontFamilyRef}
          >
            <MenuButton
              onClick={() => setShowFontFamily(!showFontFamily)}
              title="ប្រភេទពុម្ពអក្សរ (Font Family)"
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
                    onClick={() => {
                      editor.chain().focus().setFontFamily(font.value).run();
                      setShowFontFamily(false);
                    }}
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
          {/* Text Alignment */}
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
              title="តម្រឹមឆ្វេង (Align Left)"
            >
              <FaAlignLeft />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              active={editor.isActive({ textAlign: "center" })}
              title="តម្រឹមកណ្តាល (Align Center)"
            >
              <FaAlignCenter />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              active={editor.isActive({ textAlign: "right" })}
              title="តម្រឹមស្តាំ (Align Right)"
            >
              <FaAlignRight />
            </MenuButton>
            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              active={editor.isActive({ textAlign: "justify" })}
              title="តម្រឹមសងខាង (Justify)"
            >
              <FaAlignJustify />
            </MenuButton>
          </div>
          {/* Lists */}
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
              title="បញ្ជីគ្មានលេខ (Bullet List)"
            >
              <FaListUl />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="បញ្ជីមានលេខ (Numbered List)"
            >
              <FaListOl />
            </MenuButton>
          </div>
          {/* Quote, Link, HR */}
          <div
            style={{
              borderRight: "1px solid #ddd",
              paddingRight: "5px",
              marginRight: "5px",
            }}
          >
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="សម្រង់ (Quote)"
            >
              <FaQuoteLeft />
            </MenuButton>
            <MenuButton
              onClick={() => {
                const url = window.prompt("បញ្ចូល URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              active={editor.isActive("link")}
              title="បន្ថែមតំណ (Add Link)"
            >
              <FaLink />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="បន្ថែមបន្ទាត់ (Horizontal Rule)"
            >
              <FaMinus />
            </MenuButton>
          </div>
          {/* Undo / Redo */}
          <div>
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              title="ត្រឡប់ក្រោយ (Undo)"
            >
              <FaUndo />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              title="ធ្វើឡើងវិញ (Redo)"
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

// ---------- Singleton Component (no ID) ----------
function RoleAndResponsibilityIndex({ auth }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const access_token = auth.getClientLogin().data?.access_token;
  const mode = "custom";
  const formRef = useRef();
  const customInputHelper = new CustomInputHelper();
  const swal_Helper = new Swal_Helper();
  const swalToast = new SwalToast();

  // Form states
  const [inputTitleKh, setInputTitleKh] = useState({
    title: "ចំណងជើង (ភាសាខ្មែរ)",
    id: "title_kh",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញចំណងជើងជាភាសាខ្មែរ",
    value: "",
  });

  const [inputTitleEn, setInputTitleEn] = useState({
    title: "ចំណងជើង (ភាសាអង់គ្លេស)",
    id: "title_en",
    required: true,
    is_correct: true,
    type: "text",
    icon: null,
    error: "សូមបំពេញចំណងជើងជាភាសាអង់គ្លេស",
    value: "",
  });

  const [inputArticleKh, setInputArticleKh] = useState({
    title: "អត្ថបទ (ភាសាខ្មែរ)",
    id: "article_kh",
    required: true,
    value: "",
  });

  const [inputArticleEn, setInputArticleEn] = useState({
    title: "អត្ថបទ (ភាសាអង់គ្លេស)",
    id: "article_en",
    required: true,
    value: "",
  });

  // Load the single document on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/role-and-responsibility`;
    const result = await getAllRequest(api, access_token);
    if (result.success && result.data) {
      const data = result.data?.data;

      console.log(data)
      setInputTitleKh((prev) => ({ ...prev, value: data.title?.kh || "" }));
      setInputTitleEn((prev) => ({ ...prev, value: data.title?.en || "" }));
      setInputArticleKh((prev) => ({ ...prev, value: data.article?.kh || "" }));
      setInputArticleEn((prev) => ({ ...prev, value: data.article?.en || "" }));
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputTitleKh.value) {
      setInputTitleKh((prev) => ({ ...prev, is_correct: false }));
      swalToast.toastError("សូមបំពេញចំណងជើងជាភាសាខ្មែរ", 1500);
      return;
    }
    if (!inputTitleEn.value) {
      setInputTitleEn((prev) => ({ ...prev, is_correct: false }));
      swalToast.toastError("សូមបំពេញចំណងជើងជាភាសាអង់គ្លេស", 1500);
      return;
    }
    if (!inputArticleKh.value) {
      swalToast.toastError("សូមបំពេញអត្ថបទជាភាសាខ្មែរ", 1500);
      return;
    }
    if (!inputArticleEn.value) {
      swalToast.toastError("សូមបំពេញអត្ថបទជាភាសាអង់គ្លេស", 1500);
      return;
    }

    const validation = customInputHelper.formValidation([
      { i: inputTitleKh, s: setInputTitleKh },
      { i: inputTitleEn, s: setInputTitleEn },
    ]);

    if (validation.status) {
      const payload = {
        title_kh: validation.objectData.title_kh,
        title_en: validation.objectData.title_en,
        article_kh: inputArticleKh.value,
        article_en: inputArticleEn.value,
        status: "true",
      };
      // No 'id' field because it's a singleton

      swal_Helper
        .alert_Ask_Confirm("តើអ្នកចង់រក្សាទុកព័ត៌មាននេះ?", "green")
        .then(async (res) => {
          if (res === true) {
            setIsLoading(true);
            const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/role-and-responsibility/${process.env.REACT_APP_API_CREATE}`;
            const result = await postRequest(api, payload, access_token);
            if (result.success) {
              swalToast.toastSuccess("រក្សាទុកដោយជោគជ័យ!", 1500);
              
            } else {
              swalToast.toastError(result.message || "មិនបានជោគជ័យ!", 1500);
            }
            setIsLoading(false);
          }
        });
    }
  };

  const resetForm = () => {
    loadData(); // reload from server instead of clearing
  };

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
              <CustomInput
                event={(action, e) =>
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
          <div className="row">
            <div className="col-md-12">
              <RichTextEditor
                label="អត្ថបទ (ភាសាខ្មែរ)"
                value={inputArticleKh.value}
                onChange={(html) =>
                  setInputArticleKh((prev) => ({ ...prev, value: html }))
                }
                required={true}
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
                title="ភាសាអង់គ្លេស"
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <CustomInput
                event={(action, e) =>
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
          <div className="row">
            <div className="col-md-12">
              <RichTextEditor
                label="Article (English)"
                value={inputArticleEn.value}
                onChange={(html) =>
                  setInputArticleEn((prev) => ({ ...prev, value: html }))
                }
                required={true}
              />
            </div>
          </div>
          <RowBreaker />
        </div>

        {/* Buttons */}
        <div className="container">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <ButtonClearAndSave
                isHideBackButton={true} // hide back button because no list
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

export default RoleAndResponsibilityIndex;
