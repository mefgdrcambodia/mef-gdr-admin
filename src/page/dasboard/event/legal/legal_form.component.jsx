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
  FaFilePdf,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { LiaLanguageSolid } from "react-icons/lia";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component.jsx";
import Title from "../../../../component/Title/Title.component.jsx";
import CustomInput from "../../../../component/Input/CustomInput.component.jsx";
import CustomInputTextArea from "../../../../component/TextArea/CustomInput.component.jsx";
import CustomSelect from "../../../../component/Select/CustomSelect.component";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component.jsx";
import CustomSelect_Script from "../../../../component/Select/CustomSelect.script.js";
import Swal_Helper from "../../../../component/SwalToast/Swal_Helper.js";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import Loading from "../../../../component/Loading/Loading.component.jsx";
import CustomInputHelper from "../../../../component/Input/CustomInputHelper.script.js";
import {
  postRequest,
  getByIdRequest,
  getAllRequest,
} from "../../../../util/request_api.js";
import { CgDetailsMore } from "react-icons/cg";
import { useParams, useNavigate } from "react-router-dom";

// Color options (same as before)
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

// Font sizes
const fontSizes = [
  { name: "តូច", value: "12px" },
  { name: "ធម្មតា", value: "14px" },
  { name: "មធ្យម", value: "16px" },
  { name: "ធំ", value: "18px" },
  { name: "ធំជាង", value: "20px" },
  { name: "ធំបំផុត", value: "24px" },
  { name: "យក្ស", value: "32px" },
];

// Font families
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

// Toolbar button component
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

// Rich Text Editor Component
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
      Link.configure({
        openOnClick: false,
      }),
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
      ) {
        setShowColorPicker(false);
      }
      if (
        bgColorPickerRef.current &&
        !bgColorPickerRef.current.contains(event.target)
      ) {
        setShowBgColorPicker(false);
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) {
        setShowFontSize(false);
      }
      if (
        fontFamilyRef.current &&
        !fontFamilyRef.current.contains(event.target)
      ) {
        setShowFontFamily(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

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
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
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
          {/* Toolbar buttons - same as before */}
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
              onClick={addLink}
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

// Main FormLegal Component
function FormLegal({ auth, onSuccess, onCancel }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const access_token = auth.getClientLogin().data?.access_token;
  const mode = "custom";
  const formRef = useRef();
  const customInputHelper = new CustomInputHelper();
  const customSelect_Script = new CustomSelect_Script();
  const swal_Helper = new Swal_Helper();
  const swalToast = new SwalToast();

  // Cover image states
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState(null);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);

  // PDF file states for Khmer and English
  const [pdfFileKhName, setPdfFileKhName] = useState("");
  const [pdfFileKh, setPdfFileKh] = useState(null);
  const [existingPdfFileKh, setExistingPdfFileKh] = useState(null);
  const [removePdfFileKh, setRemovePdfFileKh] = useState(false);

  const [pdfFileEnName, setPdfFileEnName] = useState("");
  const [pdfFileEn, setPdfFileEn] = useState(null);
  const [existingPdfFileEn, setExistingPdfFileEn] = useState(null);
  const [removePdfFileEn, setRemovePdfFileEn] = useState(false);

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

  const [inputDescriptionKh, setInputDescriptionKh] = useState({
    title: "សេចក្តីពិពណ៌នា (ភាសាខ្មែរ)",
    id: "description_kh",
    required: false,
    is_correct: true,
    type: "html",
    icon: null,
    error: "",
    value: "",
  });

  const [inputDescriptionEn, setInputDescriptionEn] = useState({
    title: "សេចក្តីពិពណ៌នា (ភាសាអង់គ្លេស)",
    id: "description_en",
    required: false,
    is_correct: true,
    type: "html",
    icon: null,
    error: "",
    value: "",
  });

  const [inputCategory, setInputCategory] = useState({
    title: "ប្រភេទ",
    id: "category",
    required: true,
    is_correct: true,
    error: "សូមជ្រើសរើសប្រភេទ",
    data: [
      { value: "law", label: "ច្បាប់ - Law" },
      { value: "regulation", label: "បទប្បញ្ញត្តិ - Regulation" },
      { value: "decree", label: "អនុក្រឹត្យ - Decree" },
      { value: "proclamation", label: "សេចក្តីប្រកាស - Proclamation" },
      { value: "directive", label: "សេចក្តីណែនាំ - Directive" },
      { value: "circular", label: "សារាច - Circular" },

      { value: "other", label: "ផ្សេងៗ - Other" },
    ],
    value: "",
    defualtValue: "",
    defualtTitle: "",
    display: "flex",
  });

  const [inputDocumentNumber, setInputDocumentNumber] = useState({
    title: "លេខឯកសារ",
    id: "document_number",
    required: false,
    is_correct: true,
    type: "text",
    icon: <FaHashtag />,
    error: "",
    value: "",
  });

  const [inputPublishedDate, setInputPublishedDate] = useState({
    title: "កាលបរិច្ឆេទចេញផ្សាយ",
    id: "published_date",
    required: false,
    is_correct: true,
    type: "date",
    icon: <FaCalendarAlt />,
    error: "",
    value: "",
  });

  // Load categories and data if editing
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadLegalData();
    }
  }, [id]);

  const loadCategories = async () => {
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/legal`;
    const result = await getAllRequest(`${api}`, access_token);
    if (result.success && result.category) {
      const categoryOptions = result.category.map((cat) => {
        const key = Object.keys(cat)[0];
        return {
          value: key,
          label: cat[key].kh,
        };
      });
      setInputCategory((prev) => ({ ...prev, options: categoryOptions }));
    }
  };

  const loadLegalData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/legal/${id}`;
    const result = await getByIdRequest(`${api}`, access_token);
    if (result.success) {
      const data = result.data;
      setInputTitleKh((prev) => ({ ...prev, value: data.title?.kh || "" }));
      setInputTitleEn((prev) => ({ ...prev, value: data.title?.en || "" }));
      setInputDescriptionKh((prev) => ({
        ...prev,
        value: data.description?.kh || "",
      }));
      setInputDescriptionEn((prev) => ({
        ...prev,
        value: data.description?.en || "",
      }));

      var title = data.category;
      inputCategory.data.map((row) => {
        if (data.category == row.value) {
          title = row.label;
        }
      });
      setInputCategory((prev) => ({
        ...prev,
        value: data.category,
        defualtValue: data.category,
        defualtTitle: title,
      }));

      setInputDocumentNumber((prev) => ({
        ...prev,
        value: data.document_number || "",
      }));

      if (data.published_date) {
        const date = new Date(data.published_date);
        const formattedDate = date.toISOString().split("T")[0];
        setInputPublishedDate((prev) => ({ ...prev, value: formattedDate }));
      }

      setExistingCoverImage(data.cover_image || null);
      setCoverImagePreview(data.cover_image || null);

      // Load Khmer PDF
      setExistingPdfFileKh(data.pdf_file?.kh || null);
      if (data.pdf_file?.kh) {
        setPdfFileKhName(data.pdf_file.kh.split("/").pop());
      }

      // Load English PDF
      setExistingPdfFileEn(data.pdf_file?.en || null);
      if (data.pdf_file?.en) {
        setPdfFileEnName(data.pdf_file.en.split("/").pop());
      }
    }
    setIsLoading(false);
  };

  // Cover image handling
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        swalToast.toastError(`${file.name} មិនមែនជារូបភាព`, 1500);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        swalToast.toastError(`${file.name} ទំហំធំជាង 5MB`, 1500);
        return;
      }

      setCoverImageFile(file);
      setRemoveCoverImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setExistingCoverImage(null);
    setRemoveCoverImage(true);
  };

  // Khmer PDF file handling
  const handlePdfFileKhChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        swalToast.toastError(`${file.name} មិនមែនជា PDF`, 1500);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        swalToast.toastError(`${file.name} ទំហំធំជាង 10MB`, 1500);
        return;
      }

      setPdfFileKh(file);
      setRemovePdfFileKh(false);
      setPdfFileKhName(file.name);
    }
  };

  const handleRemovePdfFileKh = () => {
    setPdfFileKh(null);
    setExistingPdfFileKh(null);
    setPdfFileKhName("");
    setRemovePdfFileKh(true);
  };

  // English PDF file handling
  const handlePdfFileEnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        swalToast.toastError(`${file.name} មិនមែនជា PDF`, 1500);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        swalToast.toastError(`${file.name} ទំហំធំជាង 10MB`, 1500);
        return;
      }

      setPdfFileEn(file);
      setRemovePdfFileEn(false);
      setPdfFileEnName(file.name);
    }
  };

  const handleRemovePdfFileEn = () => {
    setPdfFileEn(null);
    setExistingPdfFileEn(null);
    setPdfFileEnName("");
    setRemovePdfFileEn(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
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

    if (!inputCategory.value) {
      setInputCategory((prev) => ({ ...prev, is_correct: false }));
      swalToast.toastError("សូមជ្រើសរើសប្រភេទ", 1500);
      return;
    }

    var data = customInputHelper.formValidation([
      { i: inputTitleKh, s: setInputTitleKh },
      { i: inputTitleEn, s: setInputTitleEn },
      { i: inputCategory, s: setInputCategory },
    ]);

    if (data.status) {
      const dataPrepare = new FormData();

      dataPrepare.append("title_kh", data.objectData.title_kh);
      dataPrepare.append("title_en", data.objectData.title_en);
      dataPrepare.append("category", data.objectData.category);

      if (inputDescriptionKh.value) {
        dataPrepare.append("description_kh", inputDescriptionKh.value);
      }
      if (inputDescriptionEn.value) {
        dataPrepare.append("description_en", inputDescriptionEn.value);
      }
      if (inputDocumentNumber.value) {
        dataPrepare.append("document_number", inputDocumentNumber.value);
      }
      if (inputPublishedDate.value) {
        dataPrepare.append("published_date", inputPublishedDate.value);
      }

      dataPrepare.append("status", "true");

      // Handle cover image
      if (removeCoverImage) {
        dataPrepare.append("remove_cover_image", "true");
      } else if (coverImageFile) {
        dataPrepare.append("cover_image", coverImageFile);
      } else if (existingCoverImage && !removeCoverImage) {
        dataPrepare.append("existing_cover_image", existingCoverImage);
      }

      // Handle Khmer PDF file
      if (removePdfFileKh) {
        dataPrepare.append("remove_pdf_file_kh", "true");
      } else if (pdfFileKh) {
        dataPrepare.append("pdf_file_kh", pdfFileKh);
      } else if (existingPdfFileKh && !removePdfFileKh) {
        dataPrepare.append("existing_pdf_file_kh", existingPdfFileKh);
      }

      // Handle English PDF file
      if (removePdfFileEn) {
        dataPrepare.append("remove_pdf_file_en", "true");
      } else if (pdfFileEn) {
        dataPrepare.append("pdf_file_en", pdfFileEn);
      } else if (existingPdfFileEn && !removePdfFileEn) {
        dataPrepare.append("existing_pdf_file_en", existingPdfFileEn);
      }

      if (isEditing && id) {
        dataPrepare.append("id", id);
      }

      swal_Helper
        .alert_Ask_Confirm(
          isEditing ? "តើអ្នកចង់កែប្រែឯកសារនេះ?" : "តើអ្នកចង់រក្សាទុកឯកសារ?",
          "green",
        )
        .then(async (res) => {
          if (res == true) {
            setIsLoading(true);

            const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/legal/${process.env.REACT_APP_API_CREATE}`;
            const result = await postRequest(api, dataPrepare, access_token);

            if (result.success) {
              swalToast.toastSuccess(
                isEditing ? "កែប្រែឯកសារដោយជោគជ័យ!" : "រក្សាទុកឯកសារដោយជោគជ័យ!",
                1500,
              );
              setTimeout(() => {
                navigate(-1);
              }, 1500);
              resetForm();
            } else {
              swalToast.toastError(result.message || "មិនបានជោគជ័យ!", 1500);
            }

            setIsLoading(false);
          }
        });
    }
  };

  const resetForm = () => {
    if (!isEditing) {
      setInputTitleKh((prev) => ({ ...prev, value: "" }));
      setInputTitleEn((prev) => ({ ...prev, value: "" }));
      setInputDescriptionKh((prev) => ({ ...prev, value: "" }));
      setInputDescriptionEn((prev) => ({ ...prev, value: "" }));
      setInputCategory((prev) => ({ ...prev, value: "" }));
      setInputDocumentNumber((prev) => ({ ...prev, value: "" }));
      setInputPublishedDate((prev) => ({ ...prev, value: "" }));

      setCoverImagePreview(null);
      setCoverImageFile(null);
      setExistingCoverImage(null);

      setPdfFileKhName("");
      setPdfFileKh(null);
      setExistingPdfFileKh(null);
      setPdfFileEnName("");
      setPdfFileEn(null);
      setExistingPdfFileEn(null);

      setRemoveCoverImage(false);
      setRemovePdfFileKh(false);
      setRemovePdfFileEn(false);
    }
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  // Cover Image Upload Component
  const CoverImageUploadSection = () => (
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
            រូបភាពគម្រប (Cover Image)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ marginBottom: "10px" }}
            className="form-control"
          />

          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសរូបភាពសម្រាប់គម្រប (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
          </small>

          {(coverImagePreview || existingCoverImage) && (
            <div style={{ marginTop: "15px" }}>
              <strong>រូបភាពគម្រប:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ position: "relative", width: "200px" }}>
                  <img
                    src={coverImagePreview || existingCoverImage}
                    alt="Cover Image"
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
                    onClick={handleRemoveCoverImage}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // PDF File Upload Component for Khmer
  const PdfFileKhUploadSection = () => (
    <div className="row mb-3">
      <div className="col-md-12">
        <div
          style={{
            border: "2px dashed #2196F3",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#e3f2fd",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
              color: "#1565C0",
            }}
          >
            <FaFilePdf style={{ marginRight: "8px" }} />
            ឯកសារ PDF (ភាសាខ្មែរ)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfFileKhChange}
            style={{ marginBottom: "10px" }}
            className="form-control"
          />

          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសឯកសារ PDF ជាភាសាខ្មែរ - ទំហំមិនលើស 10MB
          </small>

          {(pdfFileKhName || existingPdfFileKh) && (
            <div style={{ marginTop: "15px" }}>
              <strong>ឯកសារ PDF (ភាសាខ្មែរ):</strong>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <FaFilePdf size={30} color="#f44336" />
                <span style={{ flex: 1 }}>{pdfFileKhName || "ឯកសារ PDF"}</span>
                <a
                  href={existingPdfFileKh}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  មើល
                </a>
                <button
                  type="button"
                  onClick={handleRemovePdfFileKh}
                  style={{
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
          )}
        </div>
      </div>
    </div>
  );

  // PDF File Upload Component for English
  const PdfFileEnUploadSection = () => (
    <div className="row mb-3">
      <div className="col-md-12">
        <div
          style={{
            border: "2px dashed #FF9800",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff3e0",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "10px",
              color: "#e65100",
            }}
          >
            <FaFilePdf style={{ marginRight: "8px" }} />
            ឯកសារ PDF (ភាសាអង់គ្លេស)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfFileEnChange}
            style={{ marginBottom: "10px" }}
            className="form-control"
          />

          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសឯកសារ PDF ជាភាសាអង់គ្លេស - ទំហំមិនលើស 10MB
          </small>

          {(pdfFileEnName || existingPdfFileEn) && (
            <div style={{ marginTop: "15px" }}>
              <strong>ឯកសារ PDF (ភាសាអង់គ្លេស):</strong>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <FaFilePdf size={30} color="#f44336" />
                <span style={{ flex: 1 }}>{pdfFileEnName || "ឯកសារ PDF"}</span>
                <a
                  href={existingPdfFileEn}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  មើល
                </a>
                <button
                  type="button"
                  onClick={handleRemovePdfFileEn}
                  style={{
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
                title={"ភាសាខ្មែរ"}
                icons={<LiaLanguageSolid />}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) => {
                  setInputTitleKh((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputTitleKh, mode: mode }}
              />
            </div>
          </div>

          <RowBreaker break={2} />

          <div className="row">
            <div className="col-md-12">
              <RichTextEditor
                label="សេចក្តីពិពណ៌នា (ភាសាខ្មែរ)"
                value={inputDescriptionKh.value}
                onChange={(value) => {
                  setInputDescriptionKh((prev) => ({
                    ...prev,
                    value: value,
                    is_correct: true,
                  }));
                }}
                error={inputDescriptionKh.error}
                required={false}
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
            <div className="col-md-12">
              <CustomInputTextArea
                event={(action, e) => {
                  setInputTitleEn((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputTitleEn, mode: mode }}
              />
            </div>
          </div>

          <RowBreaker break={2} />

          <div className="row">
            <div className="col-md-12">
              <RichTextEditor
                label="សេចក្តីពិពណ៌នា (ភាសាអង់គ្លេស)"
                value={inputDescriptionEn.value}
                onChange={(value) => {
                  setInputDescriptionEn((prev) => ({
                    ...prev,
                    value: value,
                    is_correct: true,
                  }));
                }}
                error={inputDescriptionEn.error}
                required={false}
              />
            </div>
          </div>

          <RowBreaker />
        </div>

        {/* Additional Info Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title={"ព័ត៌មានបន្ថែម"}
                icons={<CgDetailsMore />}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <CustomSelect
                props={{ select: inputCategory, mode: mode }}
                event={(action, e) => {
                  customSelect_Script.OnchangeTriggerChangeToAutoCorrection(
                    e,
                    setInputCategory,
                    true,
                  );
                }}
              />
            </div>
            <div className="col-md-6">
              <CustomInput
                event={(action, e) => {
                  setInputDocumentNumber((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputDocumentNumber, mode: mode }}
              />
            </div>
          </div>

          <RowBreaker />

          <div className="row">
            <div className="col-md-6">
              <CustomInput
                event={(action, e) => {
                  setInputPublishedDate((prev) => ({
                    ...prev,
                    value: e,
                    is_correct: true,
                  }));
                }}
                props={{ input: inputPublishedDate, mode: mode }}
              />
            </div>
          </div>

          <RowBreaker />

          <CoverImageUploadSection />

          <RowBreaker />

          <PdfFileKhUploadSection />

          <RowBreaker />

          <PdfFileEnUploadSection />

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

export default FormLegal;
