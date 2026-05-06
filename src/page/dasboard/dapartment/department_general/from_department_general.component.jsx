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
  FaTrash,
  FaBuilding,
  FaPlusCircle,
  FaMinusCircle,
} from "react-icons/fa";
import { LiaLanguageSolid } from "react-icons/lia";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../../component/Title/Title.component.jsx";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component.jsx";
import Swal_Helper from "../../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import Loading from "../../../../component/Loading/Loading.component.jsx";
import { postRequest, getAllRequest } from "../../../../util/request_api.js";

// ==================== Rich Text Editor (same as old) ====================
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
      Placeholder.configure({
        placeholder: `សរសេរអត្ថបទ ${label}...`,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontFamily,
      Highlight,
      Underline,
      Link.configure({ openOnClick: false }),
      HorizontalRule,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
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
          {/* Text Formatting */}
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
              title="គូសបន្ទាត់ពីក្រោម"
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
          {/* Text Color */}
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
                  background: "#fff",
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
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(c.value).run();
                      setShowColorPicker(false);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: c.value,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Background Color */}
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
                  background: "#fff",
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
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .setHighlight({ color: c.value })
                        .run();
                      setShowBgColorPicker(false);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: c.value,
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Font Size */}
          <div style={{ position: "relative" }} ref={fontSizeRef}>
            <MenuButton
              onClick={() => setShowFontSize(!showFontSize)}
              title="ទំហំអក្សរ"
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
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {fontSizes.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setFontSize(s.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "5px 10px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: s.value,
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Font Family */}
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
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  minWidth: "200px",
                }}
              >
                {fontFamilies.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFontFamily(f.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "5px 10px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: f.value,
                    }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Alignment */}
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
          {/* Other */}
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
          </div>
          {/* Undo/Redo */}
          <div>
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
          <small style={{ color: "red", display: "block", marginTop: "5px" }}>
            {error}
          </small>
        )}
      </div>
    </div>
  );
};

// ==================== Helper component for response array ====================
const ResponseSection = ({ label, responses, onChange, language }) => {
  const handleAdd = () => {
    onChange([...responses, { kh: "", en: "" }]);
  };

  const handleRemove = (index) => {
    const newResponses = responses.filter((_, i) => i !== index);
    onChange(newResponses);
  };

  const handleChange = (index, field, value) => {
    const newResponses = [...responses];
    newResponses[index][field] = value;
    onChange(newResponses);
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <h6>{label}</h6>
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={handleAdd}
        >
          <FaPlusCircle /> បន្ថែមចម្លើយ
        </button>
      </div>
      {responses.map((resp, idx) => (
        <div
          key={idx}
          className="card mb-3 p-3"
          style={{ background: "#f9f9f9" }}
        >
          <div className="d-flex justify-content-between">
            <strong>ចម្លើយ #{idx + 1}</strong>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => handleRemove(idx)}
            >
              <FaMinusCircle /> លុប
            </button>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label>ខ្មែរ</label>
              <textarea
                className="form-control"
                rows="3"
                value={resp.kh}
                onChange={(e) => handleChange(idx, "kh", e.target.value)}
                placeholder="អត្ថបទចម្លើយភាសាខ្មែរ"
              />
            </div>
            <div className="col-md-6">
              <label>English</label>
              <textarea
                className="form-control"
                rows="3"
                value={resp.en}
                onChange={(e) => handleChange(idx, "en", e.target.value)}
                placeholder="Response text in English"
              />
            </div>
          </div>
        </div>
      ))}
      {responses.length === 0 && (
        <div className="text-muted text-center p-3 border rounded">
          មិនទាន់មានចម្លើយទេ។ ចុចប៊ូតុង "បន្ថែមចម្លើយ" ដើម្បីបង្កើត។
        </div>
      )}
    </div>
  );
};

// ==================== Main Component ====================
function FormDepartmentGeneral({ auth, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const access_token = auth.getClientLogin().data?.access_token;
  const swalHelper = new Swal_Helper();
  const swalToast = new SwalToast();
  const formRef = useRef();

  // Main fields
  const [titleKh, setTitleKh] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [articleKh, setArticleKh] = useState("");
  const [articleEn, setArticleEn] = useState("");
  const [responses, setResponses] = useState([]); // array of { kh, en }
  const [status, setStatus] = useState(true);

  // Office fields
  const [office1, setOffice1] = useState({
    title: { kh: "", en: "" },
    article: { kh: "", en: "" },
    responses: [],
  });
  const [office2, setOffice2] = useState({
    title: { kh: "", en: "" },
    article: { kh: "", en: "" },
    responses: [],
  });
  const [office3, setOffice3] = useState({
    title: { kh: "", en: "" },
    article: { kh: "", en: "" },
    responses: [],
  });

  // Load existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/role-and-responsibility/depament-general`;
    const result = await getAllRequest(api, access_token);
    if (result.success && result.data?.data) {
      const d = result.data.data;
      setTitleKh(d.title?.kh || "");
      setTitleEn(d.title?.en || "");
      setArticleKh(d.article?.kh || "");
      setArticleEn(d.article?.en || "");
      setResponses(Array.isArray(d.response) ? d.response : []);
      setStatus(d.status !== undefined ? d.status : true);

      if (d.office_one) {
        setOffice1({
          title: d.office_one.title || { kh: "", en: "" },
          article: d.office_one.article || { kh: "", en: "" },
          responses: Array.isArray(d.office_one.response)
            ? d.office_one.response
            : [],
        });
      }
      if (d.office_two) {
        setOffice2({
          title: d.office_two.title || { kh: "", en: "" },
          article: d.office_two.article || { kh: "", en: "" },
          responses: Array.isArray(d.office_two.response)
            ? d.office_two.response
            : [],
        });
      }
      if (d.office_three) {
        setOffice3({
          title: d.office_three.title || { kh: "", en: "" },
          article: d.office_three.article || { kh: "", en: "" },
          responses: Array.isArray(d.office_three.response)
            ? d.office_three.response
            : [],
        });
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (title required for both languages)
    if (!titleKh.trim() || !titleEn.trim()) {
      swalToast.toastError("សូមបញ្ចូលចំណងជើងទាំងពីរភាសា!", 1500);
      return;
    }
    if (!articleKh.trim() || !articleEn.trim()) {
      swalToast.toastError("សូមបញ្ចូលអត្ថបទមាត្រាទាំងពីរភាសា!", 1500);
      return;
    }

    const formData = new FormData();
    formData.append("title_kh", titleKh);
    formData.append("title_en", titleEn);
    formData.append("article_kh", articleKh);
    formData.append("article_en", articleEn);
    formData.append("response", JSON.stringify(responses));
    formData.append("status", status);

    // Helper to append office data if any non-empty field exists
    const appendOffice = (prefix, office) => {
      const hasData =
        office.title.kh ||
        office.title.en ||
        office.article.kh ||
        office.article.en ||
        office.responses.length;
      if (!hasData) return;
      formData.append(`${prefix}_title_kh`, office.title.kh);
      formData.append(`${prefix}_title_en`, office.title.en);
      formData.append(`${prefix}_article_kh`, office.article.kh);
      formData.append(`${prefix}_article_en`, office.article.en);
      formData.append(`${prefix}_response`, JSON.stringify(office.responses));
    };

    appendOffice("office_one", office1);
    appendOffice("office_two", office2);
    appendOffice("office_three", office3);

    swalHelper
      .alert_Ask_Confirm(
        "តើអ្នកចង់រក្សាទុកព័ត៌មានតួនាទី និងទំនួលខុសត្រូវរបស់នាយកដ្ឋាន?",
        "green",
      )
      .then(async (res) => {
        if (res) {
          setIsLoading(true);
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/role-and-responsibility/depament-general/${process.env.REACT_APP_API_CREATE}`;
          const result = await postRequest(api, formData, access_token);
          if (result.success) {
            swalToast.toastSuccess("រក្សាទុកជោគជ័យ!", 1500);
            fetchData();
            if (onSuccess) onSuccess();
          } else {
            swalToast.toastError(
              result.message || "មានបញ្ហា សូមព្យាយាមម្តងទៀត!",
              1500,
            );
          }
          setIsLoading(false);
        }
      });
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else window.history.back();
  };

  // Office section component (to avoid repetition)
  const OfficeSection = ({ number, data, onDataChange }) => {
    const updateTitle = (lang, value) => {
      onDataChange({
        ...data,
        title: { ...data.title, [lang]: value },
      });
    };
    const updateArticle = (lang, value) => {
      onDataChange({
        ...data,
        article: { ...data.article, [lang]: value },
      });
    };
    const updateResponses = (newResponses) => {
      onDataChange({ ...data, responses: newResponses });
    };

    return (
      <div className="container defualt_White_Shadow_Theme mt-4">
        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <Title
              mode="custom"
              title={`ការិយាល័យទី ${number}`}
              icons={<FaBuilding />}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>ចំណងជើង (ខ្មែរ)</label>
              <input
                type="text"
                className="form-control"
                value={data.title.kh}
                onChange={(e) => updateTitle("kh", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Title (English)</label>
              <input
                type="text"
                className="form-control"
                value={data.title.en}
                onChange={(e) => updateTitle("en", e.target.value)}
              />
            </div>
          </div>
        </div>
        <RichTextEditor
          label="មាត្រា (ភាសាខ្មែរ)"
          value={data.article.kh}
          onChange={(val) => updateArticle("kh", val)}
        />
        <RichTextEditor
          label="Article (English)"
          value={data.article.en}
          onChange={(val) => updateArticle("en", val)}
        />
        <ResponseSection
          label="បញ្ជីចម្លើយ (Responses)"
          responses={data.responses}
          onChange={updateResponses}
        />
        <RowBreaker />
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef}>
        {/* Main Department Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode="custom"
                title="នាយកដ្ឋានទូទៅ"
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>ចំណងជើង (ខ្មែរ) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={titleKh}
                  onChange={(e) => setTitleKh(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Title (English) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <RichTextEditor
            label="មាត្រា (ភាសាខ្មែរ) *"
            value={articleKh}
            onChange={setArticleKh}
            required
          />
          <RichTextEditor
            label="Article (English) *"
            value={articleEn}
            onChange={setArticleEn}
            required
          />
          <ResponseSection
            label="បញ្ជីចម្លើយ (Responses)"
            responses={responses}
            onChange={setResponses}
          />
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="statusCheck"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="statusCheck">
                  បោះពុម្ពផ្សាយ (Published)
                </label>
              </div>
            </div>
          </div>
          <RowBreaker />
        </div>

        {/* Three Office Sections */}
        <OfficeSection number="១" data={office1} onDataChange={setOffice1} />
        <OfficeSection number="២" data={office2} onDataChange={setOffice2} />
        <OfficeSection number="៣" data={office3} onDataChange={setOffice3} />

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
                onClear={handleCancel}
              />
            </div>
          </div>
        </div>
      </form>
      <Loading is_loading={isLoading} />
    </div>
  );
}

export default FormDepartmentGeneral;
