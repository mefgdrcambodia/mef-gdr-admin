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
} from "react-icons/fa";
import { LiaLanguageSolid } from "react-icons/lia";
import RowBreaker from "../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../component/Title/Title.component.jsx";
import ButtonClearAndSave from "../../../component/Button/ButtonClearAndSave.component.jsx";
import Swal_Helper from "../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../component/SwalToast/SwalToast.js";
import Loading from "../../../component/Loading/Loading.component.jsx";
import { postRequest, getAllRequest } from "../../../util/request_api.js";

// ==================== Rich Text Editor (copied from FormNews) ====================
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

// ==================== Main Component ====================
// ... (all imports and helper components remain exactly the same until the main component)

function ManagementStructure({ auth, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const access_token = auth.getClientLogin().data?.access_token;
  const swalHelper = new Swal_Helper();
  const swalToast = new SwalToast();
  const formRef = useRef();

  // Article states
  const [articleKh, setArticleKh] = useState("");
  const [articleEn, setArticleEn] = useState("");

  // Image states for Khmer
  const [khPreview, setKhPreview] = useState(null);
  const [khFile, setKhFile] = useState(null);
  const [existingKhUrl, setExistingKhUrl] = useState("");
  const [removeKhImage, setRemoveKhImage] = useState(false);

  // Image states for English
  const [enPreview, setEnPreview] = useState(null);
  const [enFile, setEnFile] = useState(null);
  const [existingEnUrl, setExistingEnUrl] = useState("");
  const [removeEnImage, setRemoveEnImage] = useState(false);

  // Load existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/management-structure`;
    const result = await getAllRequest(api, access_token);
    if (result.success) {
      const data = result?.data?.data;
      if (data) {
        setArticleKh(data.article?.kh || "");
        setArticleEn(data.article?.en || "");
        if (data.url_image?.kh) {
          setExistingKhUrl(data.url_image.kh);
          setKhPreview(data.url_image.kh);
        }
        if (data.url_image?.en) {
          setExistingEnUrl(data.url_image.en);
          setEnPreview(data.url_image.en);
        }
      }
    }
    setIsLoading(false);
  };

  // Khmer image handlers
  const handleKhImageChange = (e) => {
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
      setKhFile(file);
      setRemoveKhImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setKhPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveKhImage = () => {
    setKhFile(null);
    setKhPreview(null);
    setExistingKhUrl("");
    setRemoveKhImage(true);
  };

  // English image handlers
  const handleEnImageChange = (e) => {
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
      setEnFile(file);
      setRemoveEnImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setEnPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEnImage = () => {
    setEnFile(null);
    setEnPreview(null);
    setExistingEnUrl("");
    setRemoveEnImage(true);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ REMOVED article validation – they are optional now

    // Validate images: at least one per language must exist after removal decisions
    if (!khFile && !existingKhUrl && !removeKhImage) {
      swalToast.toastError("សូមបញ្ចូលរូបភាពភាសាខ្មែរ!", 1500);
      return;
    }
    if (!enFile && !existingEnUrl && !removeEnImage) {
      swalToast.toastError("សូមបញ្ចូលរូបភាពភាសាអង់គ្លេស!", 1500);
      return;
    }

    const formData = new FormData();
    // Send article content only if not empty (optional)
    if (articleKh && articleKh.trim() !== "") {
      formData.append("article_kh", articleKh);
    }
    if (articleEn && articleEn.trim() !== "") {
      formData.append("article_en", articleEn);
    }

    // Khmer image
    if (removeKhImage) {
      formData.append("remove_image_kh", "true");
    } else if (khFile) {
      formData.append("image_kh", khFile);
    } else if (existingKhUrl && !removeKhImage) {
      formData.append("existing_image_kh", existingKhUrl);
    }

    // English image
    if (removeEnImage) {
      formData.append("remove_image_en", "true");
    } else if (enFile) {
      formData.append("image_en", enFile);
    } else if (existingEnUrl && !removeEnImage) {
      formData.append("existing_image_en", existingEnUrl);
    }

    swalHelper
      .alert_Ask_Confirm(
        "តើអ្នកចង់រក្សាទុកព័ត៌មានរចនាសម្ព័ន្ធគ្រប់គ្រង?",
        "green",
      )
      .then(async (res) => {
        if (res) {
          setIsLoading(true);
          const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/about-gs/management-structure/${process.env.REACT_APP_API_CREATE}`;
          const result = await postRequest(api, formData, access_token);
          if (result.success) {
            swalToast.toastSuccess("រក្សាទុកជោគជ័យ!", 1500);
            fetchData(); // refresh
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

  // Reusable Image Upload Component (as before)
  const ImageUploadCard = ({
    title,
    language,
    preview,
    onChange,
    onRemove,
    id,
  }) => (
    <div className="col-md-6 mb-4">
      <div
        style={{
          border: "2px dashed #4CAF50",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f1f8e9",
          height: "100%",
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
          {title} *
          <span style={{ fontSize: "12px", fontWeight: "normal" }}>
            ({language})
          </span>
        </label>
        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={onChange}
          style={{ marginBottom: "10px", width: "100%" }}
          className="form-control"
        />
        <small
          style={{ color: "#666", display: "block", marginBottom: "10px" }}
        >
          ជ្រើសរើសរូបភាព (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
        </small>
        {preview ? (
          <div
            style={{ marginTop: "15px", position: "relative", width: "100%" }}
          >
            <strong>រូបភាពបច្ចុប្បន្ន:</strong>
            <div
              style={{
                marginTop: "10px",
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src={preview}
                alt={title}
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "4px",
                  border: "2px solid #4CAF50",
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
                <FaTrash size={12} /> លុប
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: "#999",
              padding: "20px",
              border: "1px dashed #ccc",
              borderRadius: "8px",
            }}
          >
            <FaImage size={32} />
            <p>មិនទាន់មានរូបភាព</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef}>
        {/* Khmer Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode="custom"
                title="ភាសាខ្មែរ"
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>
          <RichTextEditor
            label="អត្ថបទ (ភាសាខ្មែរ)"
            value={articleKh}
            onChange={setArticleKh}
            required={false} // ✅ removed required asterisk
          />
          <RowBreaker />
        </div>

        {/* English Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode="custom"
                title="ភាសាអង់គ្លេស"
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>
          <RichTextEditor
            label="អត្ថបទ (ភាសាអង់គ្លេស)"
            value={articleEn}
            onChange={setArticleEn}
            required={false} // ✅ removed required asterisk
          />
          <RowBreaker />
        </div>

        {/* Images Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title mode="custom" title="រូបភាពបង្ហាញ" icons={<FaImage />} />
            </div>
          </div>
          <div className="row">
            <ImageUploadCard
              title="រូបភាពភាសាខ្មែរ"
              language="ខ្មែរ"
              preview={khPreview}
              onChange={handleKhImageChange}
              onRemove={handleRemoveKhImage}
              id="upload_kh"
            />
            <ImageUploadCard
              title="រូបភាពភាសាអង់គ្លេស"
              language="English"
              preview={enPreview}
              onChange={handleEnImageChange}
              onRemove={handleRemoveEnImage}
              id="upload_en"
            />
          </div>
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

export default ManagementStructure;
