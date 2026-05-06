import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import km from "date-fns/locale/km"; // Khmer locale
import { format } from "date-fns";
import { SlCalender } from "react-icons/sl";
import "./CustomReatDatePickerKhmer.style.css";

function CustomReatDatePickerKhmer(prop) {
  const propInput = prop.props.input;

  // Khmer digit converter
  const toKhmerNumber = (number) => {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return number
      .toString()
      .split("")
      .map((d) => khmerDigits[+d] || d)
      .join("");
  };

  // Custom input renderer with Khmer formatting
  const CustomInput = React.forwardRef(
    ({ value, onClick, date, className }, ref) => {
      let khmerDate = "";
      if (date && date instanceof Date && !isNaN(date)) {
        try {
          const day = toKhmerNumber(format(date, "dd"));
          const month = format(date, "MMMM", { locale: km });
          const year = toKhmerNumber(format(date, "yyyy"));
          khmerDate = `${day} - ${month} - ${year}`;
        } catch (err) {
          // console.error("Formatting error:", err);
        }
      }

      return (
        <input
          ref={ref}
          readOnly
          onClick={onClick}
          value={khmerDate}
          className={className} // ✅ now it's applied correctly!
          style={{
            color: propInput.readOnly ? "lightgray" : "black",
            width: "100%", // optional: reinforce width here
            display: "block", // critical if container is flex/grid
          }}
        />
      );
    }
  );

  registerLocale("km", km);

  return (
    <div>
      <div style={{ display: "block", width: "100%", marginTop: "5px" }}>
        <div>
          <label
            style={{
              color: "gray",
              marginBottom: "5px",

              width: "100%",
              textAlign: "left",
            }}
          >
            <SlCalender style={{ marginRight: "10px" }} />
            {propInput.title}
            {propInput.required && <span style={{ color: "red" }}>*</span>}
          </label>
        </div>

        <div style={{ width: "100%" }}>
          <DatePicker
            minDate={propInput.minDate} // Min Value :  Year/Month/Date : "2025-07-28"
            selected={propInput.value}
            readOnly={propInput.readOnly}
            locale="km"
            showTimeSelect={propInput.showTimeSelect}
            dateFormat="dd - MMMM - yyyy"
            onChange={(date) => {
              prop.event(null, date);
            }}
            customInput={
              <CustomInput
                className="date-input-selector"
                date={propInput.value}
              />
            }
            className="date-input-selector"
          />
        </div>

        <div
          hidden={propInput.is_correct}
          className="holder-error"
          style={{ width: "100%", textAlign: "left" }}
        >
          <label style={{ fontSize: "12px" }}>{propInput.error}</label>
        </div>
      </div>
    </div>
  );
}

export default CustomReatDatePickerKhmer;
