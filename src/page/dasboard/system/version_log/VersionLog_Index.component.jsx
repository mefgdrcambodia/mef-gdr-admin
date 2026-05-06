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

function VersionLog_Index({ auth }) {
  //===============================================
  // Declaration
  const routeScript = new RouteScript();
  const navigate = useNavigate();
  const swalToast = new SwalToast();

  // Backend
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/system/version/log/`;
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

  const convertToKhmerDate = (isoDate) => {
    const date = new Date(isoDate);

    // Khmer numbers
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

    // Khmer months
    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];

    // Get date components
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Convert numbers to Khmer
    const khmerDay = day
      .toString()
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");
    const khmerYear = year
      .toString()
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");
    const khmerHours = hours
      .toString()
      .padStart(2, "0")
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");
    const khmerMinutes = minutes
      .toString()
      .padStart(2, "0")
      .split("")
      .map((d) => khmerNumbers[parseInt(d)])
      .join("");

    // Format: ថ្ងៃទី ២៧ កុម្ភៈ ២០២៦ ម៉ោង ១០:៣២:៣៤
    return `ថ្ងៃទី ${khmerDay} ${khmerMonths[month]} ${khmerYear}, ${khmerHours}:${khmerMinutes}នាទី`;
  };

  const [columns, setcolumns] = useState([
    {
      defualt: false,
      omit: false,
      name: "ថ្ងៃបច្ចុប្បន្នភាព",
      selector: (row) => convertToKhmerDate(row.created_date),
      sortable: true,
    },
    {
      defualt: false,
      omit: false,
      name: "លេខកំណែ",
      selector: (row) => row.version_build,
      sortable: true,
    },
    {
      defualt: false,
      omit: false,
      name: "បច្ចុប្បន្នភាពប្រព័ន្ធ",
      selector: (row) => row.version_number,
      sortable: true,
    },

    {
      defualt: true,
      omit: false,
      name: "កម្មវត្ថុ",
      selector: (row) => row.title,
      sortable: true,
    },
  ]);
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
      q_key: JSON.stringify(["version_build", "version_number", "title"]),
      sort: "created_date",
      order: "desc",
    });
    if (result.success) {
      setData(result.data.data);
      setdataCount(result.data.pagination.total);
    }
    setisLoading(false);
  }

  function isShowButtonCreateForDeveloperAndEmailSuperAdmin() {
    var isShow = false;

    if (
      auth.getClientLogin()?.data?.is_super_admin_and_developer ||
      auth.getClientLogin()?.data?.email == "super_admin_technical@mef.gov.kh"
    ) {
      isShow = true;
    } else {
      isShow = false;
    }

    return isShow;
  }

  //===============================================
  // Action
  function actionButtonDataTable(e) {
    if (e.action == "view") {
      navigate(
        `${routeScript.route().system_view.url.replace(":id", e.data._id)}`,
      );
    } else if (e.action == "create") {
      navigate(`${routeScript.route().system_create.url}`);
    } else if (e.action == "delete") {
      // Remove
      confirmDelete(
        { title: "បច្នុបន្បន្នភាព : " + e.data.title },
        async () => {
          setisLoading(true);
          const result = await deleteRequest(
            `${api}${e.data._id}`,
            access_token,
          );
          if (result.success) {
            swalToast.toastSuccess("ជោគជ័យ: " + e.data.title, 3000);
            getData();
          } else {
            swalToast.toastError("បរាជ័យ: " + result.message, 3000);
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
            <Title mode={"list"} title={"កំណត់ហេតុកំណែ"} />
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
                  show_create:
                    isShowButtonCreateForDeveloperAndEmailSuperAdmin(),
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
                  show_view: { show: true, link: null },
                  show_edit: { show: false, link: "#" },
                  show_delete: {
                    show: isShowButtonCreateForDeveloperAndEmailSuperAdmin(),
                    link: "#",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VersionLog_Index;
