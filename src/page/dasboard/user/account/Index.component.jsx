// React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Component
import Title from "../../../../component/Title/Title.component";
import DataTableCustom from "../../../../component/DataTable/datatable.component";
import RowBreaker from "../../../../component/Boostramp/RowBreaker.component";

// Script
import DatatableScript from "../../../../component/DataTable/datatable.script";
import RouteScript from "../../../../route/route.script";
import {
  getAllRequest,
  updateRequest,
  deleteRequest,
} from "../../../../util/request_api";
import SwalToast from "../../../../component/SwalToast/SwalToast.js";
import { confirmDelete } from "../../../../component/SwalToast/SwalAlert.js";
import Swal from "sweetalert2";

function AccountIndex({ auth }) {
  //===============================================
  // Declaration
  const routeScript = new RouteScript();
  const navigate = useNavigate();
  const swalToast = new SwalToast();

  // Backend
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/users/`;
  const access_token = auth.getClientLogin().data?.access_token;

  //**************************************/
  // Table Steup
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataCount, setdataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setsearchValue] = useState("");
  const [query, setquery] = useState("");
  const [errorGetData, seterrorGetData] = useState({
    status: false,
    message: "",
  });
  const [isSwitchPageFilter, setisSwitchPageFilter] = useState(false);
  const [columns, setcolumns] = useState([
    {
      defualt: true,
      omit: false,
      name: "គោត្តនាម​ និងនាម",
      selector: (row) => row.firstname + " " + row.lastname,
      sortable: true,
    },

    {
      defualt: false,
      omit: false,
      name: "សារអេឡិចត្រូនិច",
      selector: (row) => row?.email,
      sortable: true,
    },

    {
      defualt: false,
      omit: false,
      name: "សិទ្ធក្នុងប្រព័ន្ធ",
      selector: (row) => row?.group_user_id?.name,
      sortable: true,
    },
    {
      defualt: false,
      omit: true,
      name: "តួនាទី/មុខតំណែង",
      selector: (row) => (row.job_title == "" ? "(មិនមាន)" : row.job_title),
      sortable: true,
    },

    {
      defualt: false,
      omit: true,
      name: "អង្គភាព",
      selector: (row) =>
        row.organization == "" ? "(មិនមាន)" : row.organization,
      sortable: true,
    },

    {
      defualt: false,
      omit: true,
      name: "លេខទំនាក់ទំនង",
      selector: (row) => (row.contact == "" ? "(មិនមាន)" : row.contact),
      sortable: true,
    },

    {
      defualt: false,
      omit: true,
      name: "កំណត់ចំណាំ",
      selector: (row) => (row.note == "" ? "(មិនមាន)" : row.note),
      sortable: true,
    },

    {
      defualt: false,
      omit: false,
      width: "170px",
      name: (
        <div style={{ width: "170px", textAlign: "center" }}>
          ប្តូរពាក្យសម្ងាត់
        </div>
      ),
      selector: (row) => {
        return (
          <div
            style={{ width: "100%", textAlign: "center", paddingLeft: "10px" }}
          >
            <button
              onClick={() => {
                Swal.fire({
                  title: "តើអ្នកចង់កំណត់ឡើងវិញពាក្យសម្ងាត់ឡើងវិញ?",
                  text:
                    "គណនីអ្នកប្រើប្រាស់: " + row.firstname + " " + row.lastname,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "យល់ព្រម",
                  cancelButtonText: "បោះបង់",
                  reverseButtons: true,
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    const newPassword = generateStrongPassword();
                    navigator.clipboard.writeText(newPassword);
                    setisLoading(true);
                    await updateRequest(
                      `${api}reset-password/${row._id}`,
                      {
                        password: newPassword,
                      },
                      access_token
                    );
                    swalToast.toastSuccess(
                      "គណនីអ្នកប្រើប្រាស់: " +
                        row.firstname +
                        " " +
                        row.lastname +
                        " ត្រូវបានកំណត់ពាក្យសម្ងាត់ឡើងវិញ!",
                      2000
                    );
                    setTimeout(() => {
                      Swal.fire({
                        title: "ពាក្យសម្ងាត់ថ្មី",
                        html: `<div>
                           <p style="font-size:18px;"><b> គណនីអ្នកប្រើប្រាស់: ${row.firstname} ${row.lastname}</b></p>
                        <p style="font-size:18px;"><b>ពាក្យសម្ងាត់ថ្មី: ${newPassword}</b></p>
                        </div>`,
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonText: "ចម្លង",
                        cancelButtonText: "បិទ",
                        reverseButtons: true,
                        preConfirm: () => {
                          navigator.clipboard.writeText(newPassword);
                          Swal.fire({
                            icon: "success",
                            title: "បានចម្លង!",
                            text: "ពាក្យសម្ងាត់ត្រូវបានចម្លងទៅ clipboard។",
                            timer: 1500,
                            showConfirmButton: false,
                          });
                        },
                      }).then((result) => {
                        setisLoading(false);
                      });
                    }, 2000);
                  }
                });
              }}
              className="btn btn-primary"
            >
              កំណត់ថ្មីឡើងវិញ
            </button>
          </div>
        );
      },
      sortable: false,
    },
  ]);
  function columnClicked(setcolumns, e) {
    setcolumns((prev) =>
      prev.map(
        (col) =>
          col.name === e.title
            ? { ...col, omit: !e.value } // update omit
            : col // keep others unchanged
      )
    );
  }
  const script = new DatatableScript(
    columns,
    dataCount,
    setdataCount,
    data,
    setData,
    isLoading,
    setisLoading,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isSwitchPageFilter,
    setisSwitchPageFilter,
    searchValue,
    setsearchValue
  );

  //===============================================
  // Loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      getData(); // or fetch API
    }, 400); // adjust as needed

    return () => clearTimeout(timeout);
  }, [pageSize, currentPage, searchValue, query]);

  async function getData() {
    const result = await getAllRequest(`${api}`, access_token, {
      page: currentPage,
      limit: pageSize,
      q: searchValue,
      q_key: JSON.stringify([
        "firstname",
        "lastname",
        "contact",
        "job",
        "organization",
      ]),
      sort: "created_date",
      order: "desc",
    });
    if (result.success) {
      setData(result.data.data);
      setdataCount(result.data.pagination.total);
    }
    setisLoading(false);
  }

  //===============================================
  // Action
  function actionButtonDataTable(e) {
    if (e.action == "create") {
      navigate(routeScript.route().user_account_create.url);
    } else if (e.action == "edit") {
      navigate(
        `${routeScript
          .route()
          .user_account_edit.url.replace(":id", e.data._id)}`
      );
    } else if (e.action == "view") {
      navigate(
        `${routeScript
          .route()
          .user_account_view.url.replace(":id", e.data._id)}`
      );
    } else if (e.action == "delete") {
      // Remove
      confirmDelete(
        {
          title:
            "គណនីអ្នកប្រើប្រាស់ : " + e.data.firstname + " " + e.data.lastname,
        },
        async () => {
          setisLoading(true);
          const result = await deleteRequest(
            `${api}${e.data._id}`,
            access_token
          );
          if (result.success) {
            swalToast.toastSuccess("ជោគជ័យ: " + result.data?.message, 3000);
            getData();
          } else {
            swalToast.toastError("បរាជ័យ: " + result.message, 3000);
            setisLoading(false);
          }
        }
      );
    }
  }

  async function actionChangeDataTable(row, e) {
    // Update Status
    setData(
      data.map((item) => {
        if (item._id === row._id) item.status = e.target.checked;
        return item;
      })
    );
    updateRequest(
      `${api}${row._id}`,
      {
        status: e.target.checked,
      },
      access_token
    );
  }

  // Strong random password generator
  function generateStrongPassword(length = 12) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
    const all = upper + lower + numbers + symbols;

    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split("") // shuffle
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  //===============================================
  // View
  return (
    <div>
      <div className="container defualt_White_Shadow_Theme">
        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <Title mode={"list"} title={"គណនីអ្នកប្រើប្រាស់"} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <DataTableCustom
              advanceSearchChange={(action, e) => {
                columnClicked(setcolumns, e);
              }}
              advanceSearch={false}
              advanceComponent={null}
              onChangeStatus={(row, e) => {
                actionChangeDataTable(row, e);
              }}
              onChangePage={script.handlePageChange}
              onSearch={script.handleSearchChange}
              onClick={(e, data) => {
                actionButtonDataTable(e);
              }}
              props={{
                errorGetData: errorGetData,
                show_loading: isLoading,
                header: {
                  show_create: true,
                },
                columns: columns,
                data: data,
                pagination: {
                  currentPage: currentPage,
                  rowsPerPage: pageSize,
                  count: dataCount,
                },
                show_status: true,
                actionButton: {
                  show_view: { show: true, link: null },
                  show_edit: { show: true, link: "#" },
                  show_delete: { show: true, link: "#" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountIndex;
