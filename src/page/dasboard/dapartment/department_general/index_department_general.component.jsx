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
  FaPlusCircle,
  FaMinusCircle,
  FaBuilding,
} from "react-icons/fa";
import { LiaLanguageSolid } from "react-icons/lia";
import axios from "axios"; // <-- add axios
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../../component/Title/Title.component.jsx";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component.jsx";
import Swal_Helper from "../../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import Loading from "../../../../component/Loading/Loading.component.jsx";
import { getAllRequest } from "../../../../util/request_api.js";

// ==================== Rich Text Editor (colors, fonts, etc.) ====================
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

// ==================== Helper component for job_to_do array ====================
const JobToDoSection = ({ label, items, onChange }) => {
  const handleAdd = () => {
    onChange([...items, { kh: "", en: "" }]);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onChange(newItems);
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
          <FaPlusCircle /> បន្ថែម
        </button>
      </div>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="card mb-3 p-3"
          style={{ background: "#f9f9f9" }}
        >
          <div className="d-flex justify-content-between">
            <strong>ធាតុ #{idx + 1}</strong>
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
                className="form-control no-radius"
                rows="3"
                value={item.kh}
                onChange={(e) => handleChange(idx, "kh", e.target.value)}
                placeholder="អត្ថបទភាសាខ្មែរ"
              />
            </div>
            <div className="col-md-6">
              <label>English</label>
              <textarea
                className="form-control no-radius"
                rows="3"
                value={item.en}
                onChange={(e) => handleChange(idx, "en", e.target.value)}
                placeholder="Text in English"
              />
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-muted text-center p-3 border rounded">
          មិនទាន់មានទិន្នន័យទេ។ ចុចប៊ូតុង "បន្ថែម" ដើម្បីបង្កើត។
        </div>
      )}
    </div>
  );
};

// ==================== Office Section Component ====================
const OfficeSection = ({ number, data, onDataChange }) => {
  const updateTitle = (lang, value) => {
    onDataChange({
      ...data,
      title: { ...data.title, [lang]: value },
    });
  };
  const updateJobToDo = (newItems) => {
    onDataChange({ ...data, job_to_do: newItems });
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
              className="form-control no-radius"
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
              className="form-control no-radius"
              value={data.title.en}
              onChange={(e) => updateTitle("en", e.target.value)}
            />
          </div>
        </div>
      </div>
      <JobToDoSection
        label="ភារកិច្ច (Job to do)"
        items={data.job_to_do}
        onChange={updateJobToDo}
      />
      <RowBreaker />
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
  const [descriptionKh, setDescriptionKh] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [articleKh, setArticleKh] = useState("");
  const [articleEn, setArticleEn] = useState("");
  const [jobToDo, setJobToDo] = useState([]);
  const [status, setStatus] = useState(true);

  // Office fields
  const [office1, setOffice1] = useState({
    title: { kh: "", en: "" },
    job_to_do: [],
  });
  const [office2, setOffice2] = useState({
    title: { kh: "", en: "" },
    job_to_do: [],
  });
  const [office3, setOffice3] = useState({
    title: { kh: "", en: "" },
    job_to_do: [],
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
      setDescriptionKh(d.description?.kh || "");
      setDescriptionEn(d.description?.en || "");

      setJobToDo(Array.isArray(d.job_to_do) ? d.job_to_do : []);
      setStatus(d.status !== undefined ? d.status : true);

      if (d.office_one) {
        setOffice1({
          title: d.office_one.title || { kh: "", en: "" },
          job_to_do: Array.isArray(d.office_one.job_to_do)
            ? d.office_one.job_to_do
            : [],
        });
      }
      if (d.office_two) {
        setOffice2({
          title: d.office_two.title || { kh: "", en: "" },
          job_to_do: Array.isArray(d.office_two.job_to_do)
            ? d.office_two.job_to_do
            : [],
        });
      }
      if (d.office_three) {
        setOffice3({
          title: d.office_three.title || { kh: "", en: "" },
          job_to_do: Array.isArray(d.office_three.job_to_do)
            ? d.office_three.job_to_do
            : [],
        });
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titleKh.trim() || !titleEn.trim()) {
      swalToast.toastError("សូមបញ្ចូលចំណងជើងទាំងពីរភាសា!", 1500);
      return;
    }
    if (!descriptionKh.trim() || !descriptionEn.trim()) {
      swalToast.toastError("សូមបញ្ចូលការពិពណ៌នាទាំងពីរភាសា!", 1500);
      return;
    }
   

    // Prepare JSON payload
    const payload = {
      title_kh: titleKh,
      title_en: titleEn,
      description_kh: descriptionKh,
      description_en: descriptionEn,

      job_to_do: jobToDo,
      status: status,
      office_one_title_kh: office1.title.kh,
      office_one_title_en: office1.title.en,
      office_one_job_to_do: office1.job_to_do,
      office_two_title_kh: office2.title.kh,
      office_two_title_en: office2.title.en,
      office_two_job_to_do: office2.job_to_do,
      office_three_title_kh: office3.title.kh,
      office_three_title_en: office3.title.en,
      office_three_job_to_do: office3.job_to_do,
    };

    swalHelper
      .alert_Ask_Confirm(
        "តើអ្នកចង់រក្សាទុកព័ត៌មានតួនាទី និងទំនួលខុសត្រូវរបស់នាយកដ្ឋាន?",
        "green",
      )
      .then(async (res) => {
        if (res) {
          setIsLoading(true);
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/role-and-responsibility/depament-general/${process.env.REACT_APP_API_CREATE}`;
          try {
            const response = await axios.post(api, payload, {
              headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
            });
            if (response.data.success) {
              swalToast.toastSuccess("រក្សាទុកជោគជ័យ!", 1500);
              fetchData();
              if (onSuccess) onSuccess();
            } else {
              swalToast.toastError(
                response.data.message || "មានបញ្ហា សូមព្យាយាមម្តងទៀត!",
                1500,
              );
            }
          } catch (error) {
            console.error("Submit error:", error);
            swalToast.toastError(
              error.response?.data?.message || "មានបញ្ហាបច្ចេកទេស!",
              1500,
            );
          } finally {
            setIsLoading(false);
          }
        }
      });
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else window.history.back();
  };

  return (
    <div>
      <style>
        {`
          /* Remove border-radius from all form-control inputs and textareas */
          .form-control.no-radius,
          input.form-control.no-radius,
          textarea.form-control.no-radius {
            border-radius: 0 !important;
          }
          /* Also target regular form-control without specific class if needed */
          input.form-control, 
          textarea.form-control {
            border-radius: 0 !important;
          }
        `}
      </style>
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
            label="ការពិពណ៌នា (ភាសាខ្មែរ) *"
            value={descriptionKh}
            onChange={setDescriptionKh}
            required
          />
          <RichTextEditor
            label="Description (English) *"
            value={descriptionEn}
            onChange={setDescriptionEn}
            required
          />

          <JobToDoSection
            label="ភារកិច្ច (Job to do)"
            items={jobToDo}
            onChange={setJobToDo}
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
