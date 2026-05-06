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

function GroupIndex({ auth }) {
  //===============================================
  // Declaration
  const routeScript = new RouteScript();
  const navigate = useNavigate();
  const swalToast = new SwalToast();

  // Backend
  const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/group-user-permission/`;
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
      name: "ឈ្មោះសិទ្ធប្រើប្រាស់",
      selector: (row) => row.name,
      sortable: true,
    },

    {
      defualt: false,
      omit: true,
      name: "កំណត់ចំណាំ",
      selector: (row) => (row.note == "" ? "(មិនមាន)" : row.note),
      sortable: true,
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
      q_key: JSON.stringify(["name"]),
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
      navigate(routeScript.route().user_group_create.url);
    } else if (e.action == "edit") {
      navigate(
        `${routeScript.route().user_group_edit.url.replace(":id", e.data._id)}`
      );
    } else if (e.action == "view") {
      navigate(
        `${routeScript.route().user_group_view.url.replace(":id", e.data._id)}`
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

  //===============================================
  // View
  return (
    <div>
      <div className="container defualt_White_Shadow_Theme">
        <RowBreaker />
        <div className="row">
          <div className="col-md-12">
            <Title mode={"list"} title={"កំណត់សិទ្ធប្រើប្រាស់"} />
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

export default GroupIndex;
