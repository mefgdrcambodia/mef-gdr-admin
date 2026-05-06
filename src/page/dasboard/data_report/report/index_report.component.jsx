// React
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatDateToKhmer,
  formatUTCToKhmer,
} from "../../../../util/khmerDateFormatter";
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

function IndexReport({ auth }) {
  //===============================================
  // Declaration
  const routeScript = new RouteScript();
  const navigate = useNavigate();
  const swalToast = new SwalToast();

  // Backend
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/report`;
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
      name: (
        <label style={{ textAlign: "center", width: "170px" }}>
          រូបភាពគម្រប
        </label>
      ),
      width: "170px",
      selector: (row) => row.cover_image, // Simple selector
      sortable: false,
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          {row.cover_image ? (
            <img
              src={row.cover_image}
              alt="Title"
              style={{
                width: "150px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onError={(e) => {
                e.target.src = "/placeholder-image.png"; // Fallback image
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "120px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                color: "#999",
                fontSize: "12px",
              }}
            >
              គ្មានរូបភាព
            </div>
          )}
        </div>
      ),
    },

    {
      defualt: true,
      omit: false,
      name: "ចំណងជើង",
      selector: (row) => row.title.kh,
      sortable: true,
      grow: 2, // Allow this column to grow
      minWidth: "250px",
      style: {
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      },
      cell: (row) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            lineHeight: "1.5",
            padding: "8px 0",
          }}
          title={row.title.kh} // Show full text on hover
        >
          <label
            style={{
              borderStyle: "solid",
              marginBottom: "10px",
              borderRadius: "12px",
              borderColor: "gray",
              borderWidth: "1px",
              paddingLeft: "15px",
              paddingRight: "15px",
              color: "gray",
            }}
          >
            {categoryCheck(row)}
          </label>
          <br />
          {row.title.kh}
        </div>
      ),
    },
  ]);

  function categoryCheck(row) {

    var text = "ផ្សេងៗ";

    if (row.category == "drp") {
      text = "គ.រ.ស - DRP";
    } else if (row.category == "ssmr") {
      text = "ស.ស.ម.ស - SSMR";
    } 

    return text;
  }
  

  function columnClicked(setcolumns, e) {
    setcolumns((prev) =>
      prev.map(
        (col) =>
          col.name === e.title
            ? { ...col, omit: !e.value } // update omit
            : col, // keep others unchanged
      ),
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
    setsearchValue,
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
      q_key: JSON.stringify(["title.kh", "title.en"]),
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
      navigate(routeScript.route().report_create.url);
    } else if (e.action == "edit") {
      navigate(
        `${routeScript.route().report_edit.url.replace(":id", e.data._id)}`,
      );
    } else if (e.action == "view") {
      navigate(
        `${routeScript.route().report_view.url.replace(":id", e.data._id)}`,
      );
    } else if (e.action == "delete") {
      confirmDelete(
        {
          title: `លុបព័ត៌មាន: ${e.data.title?.kh || e.data.title?.en || "ព័ត៌មាន"}`,
          message:
            "តើអ្នកពិតជាចង់លុបព័ត៌មាននេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។",
          confirmText: "លុប",
          cancelText: "បោះបង់",
          type: "warning",
        },
        async () => {
          setisLoading(true);
          try {
            // API URL with ID in the path
            const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/report/${process.env.REACT_APP_API_CREATE_NO_SLASH}/delete/${e.data._id}`;

            const result = await deleteRequest(api, access_token);

            if (result.success) {
              swalToast.toastSuccess("លុបព័ត៌មានដោយជោគជ័យ!", 3000);
              await getData(); // Refresh the data
            } else {
              swalToast.toastError(
                "បរាជ័យ: " + (result.message || "មិនអាចលុបព័ត៌មានបានទេ"),
                3000,
              );
            }
          } catch (error) {
            console.error("Delete error:", error);
            swalToast.toastError(
              "បរាជ័យ: " + (error.message || "កំហុសប្រព័ន្ធ"),
              3000,
            );
          } finally {
            setisLoading(false);
          }
        },
      );
    }
  }

  async function actionChangeDataTable(row, e) {
    // Update Status
    setData(
      data.map((item) => {
        if (item._id === row._id) item.status = e.target.checked;
        return item;
      }),
    );
    updateRequest(
      `${api}${row._id}`,
      {
        status: e.target.checked,
      },
      access_token,
    );
  }

  //===============================================
  // View
  return (
    <div>
      <div className="container defualt_White_Shadow_Theme">
        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <Title mode={"list"} title={"របាយការណ៍"} />
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
                show_status: false,
                actionButton: {
                  show_view: { show: false, link: null },
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

export default IndexReport;









