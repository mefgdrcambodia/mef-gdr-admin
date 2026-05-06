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
import CustomSelectScript from "../../../../component/Select/CustomSelect.script";
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

// Font sizes (same as before)
const fontSizes = [
  { name: "តូច", value: "12px" },
  { name: "ធម្មតា", value: "14px" },
  { name: "មធ្យម", value: "16px" },
  { name: "ធំ", value: "18px" },
  { name: "ធំជាង", value: "20px" },
  { name: "ធំបំផុត", value: "24px" },
  { name: "យក្ស", value: "32px" },
];

// Font families (same as before)
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

// Rich Text Editor Component (same as before)
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

          {/* Undo/Redo */}
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

// Main FormNews Component
function FormNews({ auth, onSuccess, onCancel }) {
  const { id } = useParams(); // Fix: Get id from params
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

  // Image states
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]); // Track removed gallery images

  // Title image states
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [titleImageFile, setTitleImageFile] = useState(null);
  const [existingTitleImage, setExistingTitleImage] = useState(null);
  const [removeTitleImage, setRemoveTitleImage] = useState(false); // Track if title image should be removed

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
    is_correct: true,
    type: "html",
    icon: null,
    error: "សូមបំពេញអត្ថបទជាភាសាខ្មែរ",
    value: "",
  });

  const [inputArticleEn, setInputArticleEn] = useState({
    title: "អត្ថបទ (ភាសាអង់គ្លេស)",
    id: "article_en",
    required: true,
    is_correct: true,
    type: "html",
    icon: null,
    error: "សូមបំពេញអត្ថបទជាភាសាអង់គ្លេស",
    value: "",
  });

  const [inputCategory, setInputCategory] = useState({
    title: "ប្រភេទ",
    id: "category",
    required: true,
    is_correct: true,
    error: "សូមជ្រើសរើសប្រភេទ",
    data: [
      { value: "event", label: "ព្រឹត្តិការណ៍ - Event" },
      { value: "news", label: "ព័ត៌មាន - News" },
      { value: "announcement", label: "សេចក្តីជូនដំណឹង - Announcement" },
    ],
    value: "",
    defualtValue: "",
    defualtTitle: "",
    display: "flex",
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load news data if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadNewsData();
    }
  }, [id]);

  const loadCategories = async () => {
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/event/news`;
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

  const loadNewsData = async () => {
    setIsLoading(true);
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/event/news/${id}`;
    const result = await getByIdRequest(`${api}`, access_token);
    if (result.success) {
      const data = result.data;
      setInputTitleKh((prev) => ({ ...prev, value: data.title.kh || "" }));
      setInputTitleEn((prev) => ({ ...prev, value: data.title.en || "" }));
      setInputArticleKh((prev) => ({ ...prev, value: data.article.kh || "" }));
      setInputArticleEn((prev) => ({ ...prev, value: data.article.en || "" }));


      // Check Defualt Title
      var title = data.category
      inputCategory.data.map((row) => {
        if(data.category == row.value){
          title = row.label
        }
      })
      setInputCategory((prev) => ({
        ...prev,
        value: data.category,
        defualtValue: data.category,
        defualtTitle: title
      }));

      console.log(data.category);
      setExistingImages(data.images || []);
      setExistingTitleImage(data.title_image || null);
      setTitleImagePreview(data.title_image || null);
    }
    setIsLoading(false);
  };

  // Image handling for gallery images
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          swalToast.toastError(`${file.name} មិនមែនជារូបភាព`, 1500);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          swalToast.toastError(`${file.name} ទំហំធំជាង 5MB`, 1500);
          return false;
        }
        return true;
      });

      setImageFiles((prev) => [...prev, ...validFiles]);

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (
    index,
    isExisting = false,
    existingIndex = null,
  ) => {
    if (isExisting) {
      const removedImage = existingImages[existingIndex];
      setRemovedImages((prev) => [...prev, removedImage]);
      setExistingImages((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Title image handling
  const handleTitleImageChange = (e) => {
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

      setTitleImageFile(file);
      setRemoveTitleImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTitleImagePreview(reader.result);
      };
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
      return tmp.textContent || tmp.innerText || "";
    };

    const isArticleKhValid =
      inputArticleKh.value && stripHtml(inputArticleKh.value).trim() !== "";
    const isArticleEnValid =
      inputArticleEn.value && stripHtml(inputArticleEn.value).trim() !== "";

    if (!isArticleKhValid) {
      setInputArticleKh((prev) => ({
        ...prev,
        is_correct: false,
        error: "សូមបំពេញអត្ថបទជាភាសាខ្មែរ",
      }));
      swalToast.toastError("សូមបំពេញអត្ថបទជាភាសាខ្មែរ", 1500);
      return;
    }

    if (!isArticleEnValid) {
      setInputArticleEn((prev) => ({
        ...prev,
        is_correct: false,
        error: "សូមបំពេញអត្ថបទជាភាសាអង់គ្លេស",
      }));
      swalToast.toastError("សូមបំពេញអត្ថបទជាភាសាអង់គ្លេស", 1500);
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
      dataPrepare.append("article_kh", inputArticleKh.value);
      dataPrepare.append("article_en", inputArticleEn.value);
      dataPrepare.append("category", data.objectData.category);
      dataPrepare.append("status", "true");

      // Handle title image
      if (removeTitleImage) {
        dataPrepare.append("remove_title_image", "true");
      } else if (titleImageFile) {
        dataPrepare.append("title_image", titleImageFile);
      } else if (existingTitleImage && !removeTitleImage) {
        dataPrepare.append("existing_title_image", existingTitleImage);
      }

      // Handle gallery images - keep existing ones that weren't removed
      if (existingImages.length > 0) {
        dataPrepare.append("existing_images", JSON.stringify(existingImages));
      }

      // Track removed gallery images
      if (removedImages.length > 0) {
        dataPrepare.append("removed_images", JSON.stringify(removedImages));
      }

      // Add new gallery images
      imageFiles.forEach((file) => {
        dataPrepare.append("images", file);
      });

      if (isEditing && id) {
        dataPrepare.append("id", id);
      }

      swal_Helper
        .alert_Ask_Confirm(
          isEditing
            ? "តើអ្នកចង់កែប្រែព័ត៌មាននេះ?"
            : "តើអ្នកចង់រក្សាទុកព័ត៌មាន?",
          "green",
        )
        .then(async (res) => {
          if (res == true) {
            setIsLoading(true);

            const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/event/news/${process.env.REACT_APP_API_CREATE}`;
            const result = await postRequest(api, dataPrepare, access_token);

            if (result.success) {
              swalToast.toastSuccess(
                isEditing
                  ? "កែប្រែព័ត៌មានដោយជោគជ័យ!"
                  : "រក្សាទុកព័ត៌មានដោយជោគជ័យ!",
                1500,
              );
              if (onSuccess) {
                onSuccess();
              } else {
                navigate(-1); // Go back to previous page
              }
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
      setInputArticleKh((prev) => ({ ...prev, value: "" }));
      setInputArticleEn((prev) => ({ ...prev, value: "" }));
      setInputCategory((prev) => ({ ...prev, value: "" }));
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
      setExistingTitleImage(null);
      setTitleImageFile(null);
      setTitleImagePreview(null);
      setRemovedImages([]);
      setRemoveTitleImage(false);
    }
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  // Title Image Upload Component
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
            រូបភាពចំណងជើង (Title Image) *សូមជ្រើសរើសតែមួយ
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleTitleImageChange}
            style={{ marginBottom: "10px" }}
            className="form-control"
          />

          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសរូបភាពសម្រាប់ចំណងជើង (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
          </small>

          {(titleImagePreview || existingTitleImage) && (
            <div style={{ marginTop: "15px" }}>
              <strong>រូបភាពចំណងជើង:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ position: "relative", width: "200px" }}>
                  <img
                    src={titleImagePreview || existingTitleImage}
                    alt="Title Image"
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

  // Gallery Image Upload Component
  const GalleryImageUploadSection = () => (
    <div className="row mb-3">
      <div className="col-md-12">
        <div
          style={{
            border: "2px dashed #ddd",
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
            <FaImage style={{ marginRight: "8px" }} />
            រូបភាពវិចិត្រសាល (Gallery Images - អាចជ្រើសរើសបានច្រើន)
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            style={{ marginBottom: "10px" }}
            className="form-control"
          />

          <small
            style={{ color: "#666", display: "block", marginBottom: "10px" }}
          >
            ជ្រើសរើសរូបភាពច្រើន (JPG, PNG, JPEG, WEBP) - ទំហំមិនលើស 5MB
            ក្នុងមួយឯកសារ
          </small>

          {existingImages.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <strong>រូបភាពដែលមានស្រាប់:</strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {existingImages.map((img, idx) => (
                  <div
                    key={idx}
                    style={{ position: "relative", width: "150px" }}
                  >
                    <img
                      src={img}
                      alt={`Existing ${idx}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx, true, idx)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {imagePreviews.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <strong>រូបភាពថ្មី:</strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    style={{ position: "relative", width: "150px" }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${idx}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
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

          <RichTextEditor
            label="អត្ថបទ (ភាសាខ្មែរ)"
            value={inputArticleKh.value}
            onChange={(value) => {
              setInputArticleKh((prev) => ({
                ...prev,
                value: value,
                is_correct: true,
              }));
            }}
            error={inputArticleKh.error}
            required={true}
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

          <RichTextEditor
            label="អត្ថបទ (អង់គ្លេស)"
            value={inputArticleEn.value}
            onChange={(value) => {
              setInputArticleEn((prev) => ({
                ...prev,
                value: value,
                is_correct: true,
              }));
            }}
            error={inputArticleEn.error}
            required={true}
          />

          <RowBreaker />
        </div>

        {/* Additional Info Section */}
        <div className="container defualt_White_Shadow_Theme">
          <RowBreaker />
          <div className="row">
            <div className="col-md-12">
              <Title
                mode={mode}
                title={"រូបភាព​ និងប្រភេទ"}
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
          </div>

          <RowBreaker />
          <TitleImageUploadSection />
          <RowBreaker />
          <GalleryImageUploadSection />
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

export default FormNews;
