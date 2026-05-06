// React
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Components
import Title from "../../../../component/Title/Title.component.jsx";
import CustomInput from "../../../../component/Input/CustomInput.component.jsx";
import CustomCheckBox from "../../../../component/CheckBox/CustomCheckBox.component.jsx";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component.jsx";
import ButtonClearAndSave from "../../../../component/Button/ButtonClearAndSave.component.jsx";
import ButtonEditTop from "../../../../component/Button/ButtonEditTop.component.jsx";
import Loading from "../../../../component/Loading/Loading.component.jsx";

// Scripts
import CustomSelectScript from "../../../../component/Select/CustomSelect.script.js";
import CustomInputHelper from "../../../../component/Input/CustomInputHelper.script.js";
import RouteScript from "../../../../route/route.script.js";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import {
  postRequest,
  getByIdRequest,
  updateRequest,
} from "../../../../util/request_api.js";

function GroupForm({ mode, auth }) {
  //==============================
  // Declaration

  const [isLoading, setisLoading] = useState(false);
  const swalToast = new SwalToast();
  const navigate = useNavigate();
  const formRef = useRef();
  const id = useParams().id;
  const [firstUpdateClicks, setFirstUpdateClick] = useState(false);

  const customInputHelper = new CustomInputHelper();
  const routeScript = new RouteScript();
  const rawRoutes = routeScript.route();
  const [updatePermissions, setupdatePermissions] = useState({}); //permissionUpdate

  // Backend
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/group-user-permission`;
  const access_token = auth.getClientLogin().data?.access_token;

  //==============================
  // Convert List Route
  const convertPermissionsToArray = (raw) => {
    const grouped = {};
    var isUpdate = mode == "create" ? false : true;
    for (const [key, value] of Object.entries(raw)) {
      const match = key.match(/^(.*)_(create|edit|index|delete)$/);
      if (!match) continue;
      const [_, baseKey, action] = match;
      if (!grouped[baseKey]) {
        grouped[baseKey] = {
          document: value.document,
          moduleKey: baseKey,
          title: value.title,
          permissions: {},
          permissions_getUpdate: {},
          isUpdate: isUpdate,
        };
      }

      grouped[baseKey].permissions[action] = key;

      // Check Update Data
      if (updatePermissions) {
        for (const [keyRow, valueRow] of Object.entries(updatePermissions)) {
          if (key == keyRow) {
            grouped[baseKey].permissions_getUpdate[action] = key;
          }
        }
      }
    }

    //  console.log(Object.values(grouped));
    return Object.values(grouped);
  };
  const convertPermissionsToArrayParent = (raw) => {
    const grouped = {};
    var isUpdate = mode == "create" ? false : true;
    for (const [key, value] of Object.entries(raw)) {
      const match = key.match(/^(.*)_(parent)$/);
      if (!match) continue;
      const [_, baseKey, action] = match;
      if (!grouped[baseKey]) {
        grouped[baseKey] = {
          icon: value.icon,
          document: value.document,
          moduleKey: baseKey,
          title: value.title,
          permissions: {},
          isUpdate: isUpdate,
        };
      }
      grouped[baseKey].permissions[action] = key;
    }

    return Object.values(grouped);
  };

  const initialPermissionsArray = convertPermissionsToArray(rawRoutes);
  const initialPermissionsArray_Parent =
    convertPermissionsToArrayParent(rawRoutes);

  const PERM_TYPES = ["index", "create", "edit", "delete"];
  const PERM_TYPES_TITLES = ["ពិនិត្យ", "បង្កើត", "កែប្រែ", "លុប"];

  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [columnToggles, setColumnToggles] = useState({
    index: false,
    create: false,
    edit: false,
    delete: false,
  });

  const togglePermission = (permKey) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permKey]: !prev[permKey],
    }));
  };

  const toggleColumn = (type) => {
    const isChecked = !columnToggles[type];
    setColumnToggles((prev) => ({ ...prev, [type]: isChecked }));

    const updatedPermissions = { ...selectedPermissions };
    initialPermissionsArray.forEach((module) => {
      const permKey = module.permissions[type];
      if (permKey) {
        updatedPermissions[permKey] = isChecked;
      }
    });
    setSelectedPermissions(updatedPermissions);
  };

  const [inputName, setinputName] = useState({
    title: "ឈ្មោះសិទ្ធប្រើប្រាស់",
    id: "name",
    required: true,
    is_correct: true,
    type: "text",
    error: "សូមបំពេញឈ្មោះសិទ្ធប្រើប្រាស់",
    value: "",
  });

  const [inputNote, setinputNote] = useState({
    title: "កំណត់ចំណាំ",
    id: "note",
    required: false,
    is_correct: true,
    type: "text",
    error: "",
    value: "",
  });

  //==================================
  // Loading
  useEffect(() => {
    updateData();
  }, []);
  async function updateData() {
    //----------------------------------
    // Loading Update Data if Edit
    if ((id && mode == "edit") || mode == "view") {
      setisLoading(true);
      const result = await getByIdRequest(api + "/" + id, access_token);

      if (result.success) {
        const dataObj = result.data;
        setinputName({ ...inputName, value: dataObj.name });
        setinputNote({ ...inputNote, value: dataObj.note });
        document.getElementById("status").checked = !dataObj.status;
        setisLoading(false);
        setupdatePermissions(dataObj.permission);

        const updatedPermissions = { ...selectedPermissions };
        initialPermissionsArray.forEach((module) => {
          PERM_TYPES.map((type) => {
            const permKey = module.permissions[type];
            if (permKey) {
              var check = module.permissions[type];
              var isChecked = false;
              for (const [keyRow, valueRow] of Object.entries(
                dataObj.permission
              )) {
                if (check == keyRow) {
                  isChecked = valueRow;
                }
              }

              updatedPermissions[permKey] = isChecked;
            }
          });
        });
        setSelectedPermissions(updatedPermissions);
      } else {
        swalToast.toastError("ការទាញយកមិនត្រឹមត្រូវ!", 2000);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    var data = customInputHelper.formValidation([
      { i: inputName, s: setinputName },
      { i: inputNote, s: setinputNote },
    ]);

    var isApp = Object.values(selectedPermissions).some((v) => v === true);
    if (data.status) {
      if (isApp) {
        // ✅ Get only keys with true
        const onlyTrueObject = Object.entries(selectedPermissions).reduce(
          (acc, [key, value]) => {
            if (value === true) {
              acc[key] = true;
            }
            return acc;
          },
          {}
        );

        validationSuccess(
          data,
          onlyTrueObject,
          !document.getElementById("status").checked
        );
      } else {
        swalToast.toastError("សូមជ្រើសរើសមុខងារសម្មភាពយ៉ាងតិចឲ្យបានមួយ!", 2000);
      }
    }
  };

  async function validationSuccess(data, selectedPermissions, isActive) {
    var preparedData = {
      name: data.objectData.name,
      permission: selectedPermissions,
      note: data.objectData.note,
      status: isActive,
    };

    //----------------------------------
    // Update Data
    setisLoading(true);
    if (id && mode == "edit") {
      const result = await updateRequest(
        `${api}/${id}`,
        preparedData,
        access_token
      );
      if (result.success) {
        swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 2000);
        setTimeout(() => {
          navigate(routeScript.route().user_group_index.url);
        }, 2000);
      } else {
        swalToast.toastError("បរាជ័យ: " + result.message, 3000);
      }
    } else {
      //----------------------------------
      // Create New Data
      const result = await postRequest(api, preparedData, access_token);
      if (result.success) {
        swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 2000);
        setTimeout(() => {
          navigate(routeScript.route().user_group_index.url);
        }, 2000);
      } else {
        swalToast.toastError("បរាជ័យ: " + result.message, 3000);
        setisLoading(false);
      }
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="container defualt_White_Shadow_Theme">
        <RowBreaker isShow={mode === "view"} />
        <ButtonEditTop
          isShow={mode === "view"}
          url={routeScript.route().user_group_edit.url.replace(":id", id)}
        />
        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <Title mode={mode} />
          </div>
        </div>

        <RowBreaker />
        <div className="row">
          <div className="col-md-6">
            <CustomInput
              event={(action, e) =>
                setinputName((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputName, mode }}
            />
          </div>
        </div>

        <RowBreaker />
        <div className="row">
          <div className="col-md-12" style={{ overflowX: "auto" }}>
            <table
              border="1"
              cellPadding="8"
              style={{
                width: "100%",
                minWidth: "700px",
                borderColor: "darkgreen",
              }}
            >
              <thead
                style={{
                  backgroundColor: "darkgreen",
                  color: "#ffffff",
                  fontFamily: "Khmer OS Siemreap",
                  fontSize: "16px",
                  textAlign: "center",
                }}
                className="siemreap-bold"
              >
                <tr>
                  <th>មុខងារ</th>
                  {PERM_TYPES_TITLES.map((type, index) => (
                    <th key={index}>{type}</th>
                  ))}
                </tr>
              </thead>

              <thead
                style={{
                  fontFamily: "Khmer OS Siemreap",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                <tr>
                  <th></th>
                  {PERM_TYPES.map((type) => (
                    <th key={type}>
                      <input
                        type="checkbox"
                        checked={columnToggles[type]}
                        onChange={() => toggleColumn(type)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {initialPermissionsArray_Parent.map((info) => {
                  const relatedModules = initialPermissionsArray.filter(
                    (mod) => mod.document === info.document
                  );

                  return (
                    <React.Fragment key={info.document}>
                      <tr>
                        <td
                          className="battambang-thin"
                          colSpan={PERM_TYPES.length + 1}
                          style={{
                            color: "gray",
                            fontWeight: "bold",
                            background: "#f0f0f0",
                            fontWeight: "bolder",
                          }}
                        >
                          <label style={{ marginRight: "10px" }}>
                            {info.icon}
                          </label>
                          {info.title}
                        </td>
                      </tr>

                      {relatedModules.map((module) => (
                        <tr key={module.moduleKey}>
                          <td
                            className="siemreap-regular"
                            style={{ paddingLeft: "50px" }}
                          >
                            {module.title}
                          </td>
                          {PERM_TYPES.map((type) => {
                            const permKey = module.permissions[type];
                            // const isClickable =
                            //   module.permissions_getUpdate[type] ||
                            //   selectedPermissions[permKey];
                            const isClickable = !!selectedPermissions[permKey];
                            return (
                              <td key={type} style={{ textAlign: "center" }}>
                                {permKey ? (
                                  <input
                                    type="checkbox"
                                    checked={isClickable}
                                    onChange={() => togglePermission(permKey)}
                                    disabled={mode === "view" ? true : false}
                                  />
                                ) : (
                                  "-"
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <CustomInput
              event={(action, e) =>
                setinputNote((prev) => ({
                  ...prev,
                  value: e,
                  is_correct: true,
                }))
              }
              props={{ input: inputNote, mode }}
            />
          </div>
        </div>

        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <CustomCheckBox title={"ឈប់ប្រើប្រាស់"} id={"status"} mode={mode} />
          </div>
        </div>

        <RowBreaker break={2} />
        <div className="row">
          <div className="col-md-12">
            <ButtonClearAndSave
              formRef={formRef}
              isShowSaveButton={mode !== "view"}
              isShowClearButton={mode === "create"}
            />
          </div>
        </div>
      </div>
      <Loading is_loading={isLoading} />
    </form>
  );
}

export default GroupForm;
