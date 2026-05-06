import React, { useState } from "react";
import "./font/battambong.css";
import "./font/moul.css";
import "./font/siemreap.css";
import CustomCheckBox from "../CheckBox/CustomCheckBoxForTable.component";
import Version from "../../page/dasboard/version/version.script";
import DataTable from "react-data-table-component";
import "./datatable.style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit } from "react-icons/fa";
import { BiColumns } from "react-icons/bi";
import { GrTrash } from "react-icons/gr";
import { FaFilter } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { ClipLoader, RingLoader, SyncLoader, BeatLoader } from "react-spinners";
import { FaEye } from "react-icons/fa";
import { Switch, FormControlLabel } from "@mui/material";
import { IoMdCreate } from "react-icons/io";
import { GrSearchAdvanced } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
function DatatableCustom(propReceived) {
  // Declaration
  const version = new Version();
  const [advanceSearchIsOpen, setadvanceSearchIsOpen] = useState(false);
  const [advanceSearchIsShow_Status, setadvanceSearchIsShow_Status] =
    useState(true);
  const [advanceSearchIsShow_Action, setadvanceSearchIsShow_Action] =
    useState(true);
  const advanceSearch = propReceived.advanceSearch;
  const props = propReceived.props;
  const [currentPage, setCurrentPage] = useState(props.pagination.currentPage); // Start from page 1
  const [pageSize, setPageSize] = useState(props.pagination.rowsPerPage); // Default page size

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    propReceived.onChangePage(newPage, pageSize); // Pass to parent or handle in local component
    if (typeof propReceived.onChangePageOption === "function") {
      propReceived.onChangePageOption(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to the first page if the page size changes
    propReceived.onChangePage(1, newPageSize); // Pass to parent or handle in local component
  };
  const totalPages = Math.ceil(props.pagination.count / pageSize);

  function paginationCustomNumber() {
    const currentPage = props.pagination.currentPage;

    // Number of pages to show around the current page (5 buttons: 2 before and 2 after)
    const pageLimit = 5;
    const pagesToShow = [];

    // Always show the first page
    pagesToShow.push(1);

    // Show pages around the current page (2 before and 2 after)
    for (
      let i = Math.max(currentPage - 2, 2);
      i <= Math.min(currentPage + 2, totalPages - 1);
      i++
    ) {
      pagesToShow.push(i);
    }

    // Always show the last page if it's not already in the list of pages to show
    if (!pagesToShow.includes(totalPages) && totalPages > pageLimit) {
      pagesToShow.push(totalPages);
    } else {
      pagesToShow.push(totalPages);
    }

    if (totalPages > pageLimit && !pagesToShow.includes(totalPages)) {
      pagesToShow.push(totalPages);
    }

    if (pagesToShow.length == 2 && pagesToShow[0] == pagesToShow[1]) {
      pagesToShow.length = 0;
      pagesToShow.push(1);
    }

    // Pagination button elements with ellipses where needed
    const paginationButtons = [];
    let lastPage = null;

    pagesToShow.forEach((page, index) => {
      // Insert ellipsis if there's a gap between consecutive pages
      if (lastPage && page - lastPage > 1) {
        paginationButtons.push(
          <div key={`ellipsis-${index}`} style={{ marginTop: "10px" }}>
            <label
              style={{
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              ...
            </label>
          </div>,
        );
      }

      // Create page number button
      paginationButtons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          type="button"
          style={{ marginLeft: "2px", marginRight: "2px" }}
          className={`btn ${
            currentPage === page ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          {toKhmerNumber(page)}
        </button>,
      );
      lastPage = page;
    });

    return <div style={{ display: "flex" }}>{paginationButtons}</div>;
  }

  const toKhmerNumber = (number) => {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return number
      .toString()
      .padStart(2, "")
      .split("")
      .map((d) => khmerDigits[+d] || d)
      .join("");
  };

  function columnCheck() {
    const currentPage = props.pagination.currentPage;
    const pageSize = props.pagination.rowsPerPage;
    var col = [];

    // Add the serial number column
    if (!props.is_hide_number) {
      col.push({
        width: "120px",
        name: (
          <div style={{ width: "100px", textAlign: "center" }}>
            <label>ល.រ</label>
          </div>
        ),
        selector: (row, index) => (
          <div style={{ width: "100px", textAlign: "center" }}>
            <label>
              {toKhmerNumber((currentPage - 1) * pageSize + index + 1)}
            </label>
          </div>
        ),
      });
    }

    props.columns.map((row, i) => {
      if (
        row.hidden == undefined ||
        row.hidden == false ||
        row.hidden == null
      ) {
        col.push(row);
      }
    });

    // Add Status
    if (props.show_status) {
      if (advanceSearchIsShow_Status) {
        col.push({
          width: "130px",
          name: (
            <div style={{ width: "100%", textAlign: "center" }}>
              <label>ស្ថានភាព</label>
            </div>
          ),
          selector: (row) => (
            <div style={{ width: "130px", textAlign: "center" }}>
              <label>
                <FormControlLabel
                  control={
                    <Switch
                      checked={row.status}
                      // checked={isActive}
                      onChange={(e) => propReceived.onChangeStatus(row, e)}
                      color="success"
                    />
                  }
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "Siemreap, sans-serif",
                      fontSize: "0.9rem", // Optional: adjust size
                    },
                  }}
                  label={row.status == true ? "ប្រើប្រាស់" : "បានផ្អាក"}
                />
                {/* <FaCircleDot
                style={{ width: "15px", height: "15px", marginRight: "5px" }}
              />
              {row.status == true ? "កំពុងប្រើប្រាស់" : "ឈប់ប្រើប្រាស់"} */}
              </label>
            </div>
          ),
        });
      }
    }

    // Action Button
    var isShowAction = true;
    if (
      props.actionButton.show_view.show == false &&
      props.actionButton.show_edit.show == false &&
      props.actionButton.show_delete.show == false
    ) {
      isShowAction = false;
    }
    if (isShowAction) {
      if (advanceSearchIsShow_Action) {
        var widthChecker = 0;

        if (props.actionButton.show_view.show) {
          widthChecker += 65;
        }
        if (props.actionButton.show_edit.show) {
          widthChecker += 65;
        }
        if (props.actionButton.show_delete.show) {
          widthChecker += 65;
        }
        col.push({
          width: widthChecker + 15 + "px",
          name: (
            <div style={{ width: widthChecker + "px", textAlign: "center" }}>
              <label>សកម្មភាព</label>
            </div>
          ),
          selector: (row) => (
            <div
              className="data-table-button"
              style={{
                width: widthChecker + "px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <a
                hidden={!props.actionButton.show_view.show}
                href={props.actionButton.show_view.link}
                onClick={() =>
                  propReceived.onClick({
                    action: "view",
                    data: row,
                  })
                }
              >
                <label style={{ cursor: "pointer" }} className="text-secondary">
                  <FaEye className="icon" />
                  ពិនិត្យ
                </label>
                {/* <FaEye
              className="icon"
              style={{ color: "black", width: "21px", height: "21px" }}
            /> */}
              </a>
              <a
                hidden={!props.actionButton.show_edit.show}
                href={props.actionButton.show_edit.link}
                onClick={() =>
                  propReceived.onClick({
                    action: "edit",
                    data: row,
                  })
                }
              >
                <label style={{ cursor: "pointer" }} className="text-primary">
                  <FaEdit className="icon" />
                  កែប្រែ
                </label>
                {/* <FaEdit style={{ color: "blue" }} className="icon" /> */}
              </a>
              <a
                hidden={!props.actionButton.show_delete.show}
                href={props.actionButton.show_delete.link}
                onClick={() =>
                  propReceived.onClick({
                    action: "delete",
                    data: row,
                  })
                }
              >
                <label style={{ cursor: "pointer" }} className="text-danger">
                  <GrTrash className="icon" />
                  លុប
                </label>

                {/* <GrTrash
              className="icon"
              style={{
                color: "red",
                width: "18px",
                height: "18px",
                marginTop: "6px",
              }}
            /> */}
              </a>
            </div>
          ),
        });
      }
    }

    return col;
  }

  function loading() {
    return (
      <div style={{ height: "300px", marginTop: "150px" }}>
        <BeatLoader color="darkgreen" loading={true} size={20} />
      </div>
    );
  }

  function noData() {
    return (
      <div
        style={{
          height: "300px",
          marginTop: "130px",
          padding: "20px",
          fontSize: "16px",
          color: "gray",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {props.errorGetData.status == true ? errorGetData() : ""}
        <br />
        📁 មិនមានទ័ន្នន័យទាញយក!
      </div>
    );
  }

  function errorGetData() {
    return (
      <div style={{ color: "red" }}>
        <FaDatabase style={{ width: "70px", height: "70px" }} />
        <br />
        <label>Error: {props.errorGetData.message.message}</label>
      </div>
    );
  }

  const customStyles = {
    table: {
      style: {
        border: "solid #d1d1d1", // Main table border
        borderRadius: "2px", // Optional: rounded corners
        overflow: "hidden", // Optional: clip overflow
        borderWidth: props.show_loading == true ? "0px" : "0.5px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#e6e5e6", // Header background color (Light Blue)
        color: "black", // Text color
        fontWeight: "bold", // Make text bold
        fontFamily: "Siemreap",
        padding: "10px", // Add spacing
        fontSize: "0.9rem", // Optional: adjust size
        borderBottom: "1px solid darkblue", // Add bottom border to header
        borderLeft: "0px solid #d1d1d1", // Left border for header cells
        borderRight: "0.5px solid #d1d1d1", // Right border for header cells
      },
    },
    cells: {
      style: {
        padding: "8px",
        fontFamily: "Siemreap",
        borderBottom: "0.5px solid rgb(246, 246, 246)", // Add bottom border to cells
        borderLeft: "0.5px solid rgb(246, 246, 246)", // Left border for data cells
        borderRight: "0.5px solid #d1d1d1", // Right border for data cells
      },
    },
    rows: {
      style: {
        backgroundColor: "#f8f9fa", // Default row background (Light Gray)
        borderBottom: "0.5px solid #d1d1d1", // Add border at the bottom of each row
        borderLeft: "0.5px solid #d1d1d1", // Left border for rows
        borderRight: "0.5px solid #d1d1d1", // Right border for rows
        fontSize: "0.9rem", // Optional: adjust size
        "&:nth-child(odd)": {
          backgroundColor: "white", // Odd row background (White)
        },
        "&:nth-child(even)": {
          backgroundColor: "solidrgb(235, 235, 235)", // Even row background (Light Gray)
        },
        "&:hover": {
          backgroundColor: "#e6f3f8", // Hover effect for rows (Light Gray)
          cursor: "pointer", // Change cursor to pointer to indicate clickable
        },
      },
    },
  };

  //=================================================
  //View
  return (
    <div className="custom-table" style={{ fontFamily: "Siemreap" }}>
      <div className="container-fluid p-0">
        <div className="row holder-header align-items-center">
          {/* Right side: Page size select and create button */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-3 order-1 order-md-2">
            <label className="mb-0 mt-3" htmlFor="pageSizeSelect">
              បង្ហាញ
            </label>
            <select
              id="pageSizeSelect"
              className="form-select w-auto mt-3"
              disabled={props.header.readonly_select_row}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              value={pageSize}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {toKhmerNumber(size)}
                </option>
              ))}
            </select>

            <label className="mb-0 mt-3">ជួរ</label>

            {props.header.show_create && (
              <button
                type="button"
                className="btn btn-success p-1 mt-3"
                style={{ minWidth: "100px" }}
                onClick={() =>
                  propReceived.onClick({
                    action: "create",
                    data: null,
                  })
                }
              >
                <IoMdCreate /> បង្កើត
              </button>
            )}
          </div>

          {/* Left side: Search and filter toggle */}
          <div
            className="col-12 col-md-6  d-flex align-items-center gap-2 order-2 order-md-1 mb-3 mb-md-0"
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex" }}>
              <div
                hidden={props.hide_search}
                className="flex-grow-1"
                style={{
                  maxWidth: "300px",
                  width: "100%",
                  marginRight: "10px",
                }}
              >
                <input
                  type="search"
                  className="form-control"
                  onChange={(e) => propReceived.onSearch(e.target.value)}
                  placeholder="🔍 ស្វែងរក..."
                />
              </div>

              <button
                hidden={props.hide_advance_search}
                type="button"
                className="btn btn-link text-success p-1"
                onClick={() => setadvanceSearchIsOpen(!advanceSearchIsOpen)}
              >
                <FaFilter size={20} className="mt-2" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="row"
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "15px",
            display: advanceSearchIsOpen ? "block" : "none",
          }}
        >
          <div className="col-md-12">
            <AnimatePresence>
              {advanceSearchIsOpen && (
                <motion.div
                  className="row"
                  style={{
                    paddingLeft: "3px",
                    paddingRight: "3px",
                    overflow: "hidden",
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="col-md-12"
                    hidden={!advanceSearchIsOpen}
                    style={{
                      backgroundColor: "#FAFAFA",
                      borderRadius: "3px",
                      padding: "10px",
                    }}
                  >
                    <div hidden={!advanceSearch}>
                      <h5 className="battambang-bold pt-2">
                        <GrSearchAdvanced /> ស្វែងរកពិសេស (Advance Search)
                      </h5>
                      <hr />

                      <div style={{ marginTop: "-10px" }} className="p-0">
                        {propReceived.advanceComponent}
                      </div>
                    </div>

                    <div className="container-fluid p-0">
                      <div className="row">
                        <div className="col-md-12">
                          <h5 className="battambang-bold">
                            <BiColumns style={{ marginRight: "5px" }} />
                            បង្ហាញបន្ថែម
                          </h5>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12 d-flex flex-wrap">
                          {props.columns.map((row, i) => (
                            <div
                              hidden={row.advance_hidden == true ? true : false}
                              key={row.name + i}
                              className="me-2 mt-2"
                              style={{ minWidth: "200px" }}
                            >
                              <CustomCheckBox
                                onChange={(e) =>
                                  propReceived.advanceSearchChange("column", e)
                                }
                                blockChange={row.defualt}
                                check={!row.omit}
                                id={row.name}
                                title={
                                  row.defualt === true ? (
                                    <>
                                      {row.name}
                                      <span
                                        style={{
                                          color: "gray",
                                          marginLeft: "5px",
                                        }}
                                      >
                                        (ត្រូវបង្ហាញ)
                                      </span>
                                    </>
                                  ) : (
                                    row.name
                                  )
                                }
                                mode="create"
                              />
                            </div>
                          ))}

                          {props.show_status && (
                            <div
                              className="me-2 mt-2"
                              style={{ minWidth: "200px" }}
                            >
                              <CustomCheckBox
                                onChange={(e) => {
                                  if (e.id === "status") {
                                    setadvanceSearchIsShow_Status(
                                      !advanceSearchIsShow_Status,
                                    );
                                  }
                                }}
                                blockChange={false}
                                check={advanceSearchIsShow_Status}
                                id="status"
                                title="ស្ថានភាព"
                                mode="create"
                              />
                            </div>
                          )}

                          <div
                            className="me-2 mt-2"
                            style={{ minWidth: "200px" }}
                          >
                            <CustomCheckBox
                              onChange={(e) => {
                                if (e.id === "action") {
                                  setadvanceSearchIsShow_Action(
                                    !advanceSearchIsShow_Action,
                                  );
                                }
                              }}
                              blockChange={false}
                              check={advanceSearchIsShow_Action}
                              id="action"
                              title="សកម្មភាព"
                              mode="create"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <DataTable
              columns={columnCheck()}
              data={props.data}
              progressPending={props.show_loading}
              progressComponent={loading()}
              noDataComponent={noData()}
              customStyles={customStyles}
              fixedHeader
            />
          </div>
        </div>

        <div
          hidden={props.data.length > 0 ? false : true}
          className="row  table-data-pagination-holder"
        >
          <div className="col-md-6">
            <div style={{ paddingTop: "8px" }}>
              <label className="result">
                បង្ហាញ {toKhmerNumber(props.pagination.currentPage)} នៃ{" "}
                {toKhmerNumber(totalPages)} ទំព័រ ក្នុងលិទ្ធផលសរុប{" "}
                {toKhmerNumber(props.pagination.count)}
              </label>
            </div>
          </div>

          <div className="col-md-6 text-end" style={{ paddingTop: "0px" }}>
            <div className="btn-group ">
              <button
                onClick={() => handlePageChange(1)}
                disabled={props.pagination.currentPage === 1}
                type="button"
                className="btn btn-light"
                // hidden={props.pagination.currentPage === 1 ? true : false}
                hidden
              >
                ដំបូងគេ
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={props.pagination.currentPage === 1}
                type="button"
                className={
                  props.pagination.currentPage === 1
                    ? '"btn btn-primary"'
                    : "btn btn-outline-primary"
                }
                style={{
                  borderRadius: "50px",
                }}

                // hidden={props.pagination.currentPage === 1 ? true : false}
              >
                ក្រោយ
              </button>

              {paginationCustomNumber()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={props.pagination.currentPage === totalPages}
                type="button"
                className={
                  props.pagination.currentPage === totalPages
                    ? '"btn btn-primary"'
                    : "btn btn-outline-primary"
                }
                style={{
                  borderRadius: "50px",
                }}

                // hidden={
                //   props.pagination.currentPage === totalPages ? true : false
                // }
              >
                បន្ទាប់
              </button>

              <button
                style={{
                  borderRadius: "50px",
                }}
                onClick={() => handlePageChange(totalPages)}
                disabled={props.pagination.currentPage === totalPages}
                type="button"
                className="btn btn-light"
                hidden

                // hidden={
                //   props.pagination.currentPage === totalPages ? true : false
                // }
              >
                ចុងក្រោយ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatatableCustom;
