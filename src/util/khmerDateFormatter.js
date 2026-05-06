// utils/khmerDateFormatter.js

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

const khmerDays = [
  "អាទិត្យ",
  "ច័ន្ទ",
  "អង្គារ",
  "ពុធ",
  "ព្រហស្បតិ៍",
  "សុក្រ",
  "សៅរ៍",
];

const khmerNumbers = {
  0: "០",
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
  6: "៦",
  7: "៧",
  8: "៨",
  9: "៩",
};

// Convert English numbers to Khmer numbers
const toKhmerNumber = (num) => {
  return num.toString().replace(/[0-9]/g, (digit) => khmerNumbers[digit]);
};

// Main date formatter function - FIXED for local timezone
export const formatDateToKhmer = (dateString, format = "full") => {
  if (!dateString) return "";

  // Create date and convert to local timezone
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  // Get local timezone values
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const khmerYear = toKhmerNumber(year);
  const khmerDay = toKhmerNumber(day);
  const khmerHours = toKhmerNumber(hours.toString().padStart(2, "0"));
  const khmerMinutes = toKhmerNumber(minutes.toString().padStart(2, "0"));
  const khmerSeconds = toKhmerNumber(seconds.toString().padStart(2, "0"));

  switch (format) {
    case "date":
      return `ថ្ងៃទី​ ${khmerDay} ខែ${khmerMonths[month]} ឆ្នាំ${khmerYear}`;

    case "time":
      return `${khmerHours}:${khmerMinutes} នាទី`;

    case "datetime":
      return `ថ្ងៃទី​ ${khmerDay} ខែ${khmerMonths[month]} ឆ្នាំ${khmerYear} ម៉ោង ${khmerHours}:${khmerMinutes}`;

    case "full":
      return `ថ្ងៃទី​ ${khmerDay} ខែ${khmerMonths[month]} ឆ្នាំ${khmerYear} ម៉ោង ${khmerHours}:${khmerMinutes} ​នាទី`;

    case "short":
      return `ថ្ងៃទី​ ${khmerDay}/ខែ${toKhmerNumber(month + 1)}/ឆ្នាំ${khmerYear}`;

    default:
      return `ថ្ងៃទី​ ${khmerDay} ${khmerMonths[month]} ឆ្នាំ${khmerYear}`;
  }
};

// Format relative time in Khmer (e.g., "2 ថ្ងៃមុន")
export const formatRelativeTimeKhmer = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${toKhmerNumber(diffInYears)} ឆ្នាំមុន`;
  }
  if (diffInMonths > 0) {
    return `${toKhmerNumber(diffInMonths)} ខែមុន`;
  }
  if (diffInDays > 0) {
    return `${toKhmerNumber(diffInDays)} ថ្ងៃមុន`;
  }
  if (diffInHours > 0) {
    return `${toKhmerNumber(diffInHours)} ម៉ោងមុន`;
  }
  if (diffInMinutes > 0) {
    return `${toKhmerNumber(diffInMinutes)} នាទីមុន`;
  }
  return `ទើបតែប៉ុន្មានវិនាទីមុន`;
};

// Format date with day of week in Khmer
export const formatDateWithDayKhmer = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const dayOfWeek = date.getDay();
  const khmerDayOfWeek = khmerDays[dayOfWeek];
  const khmerDay = toKhmerNumber(date.getDate());
  const khmerMonth = khmerMonths[date.getMonth()];
  const khmerYear = toKhmerNumber(date.getFullYear());

  return `ថ្ងៃ${khmerDayOfWeek} ទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear}`;
};

// NEW: Format date from UTC string specifically
export const formatUTCToKhmer = (utcDateString, format = "full") => {
  if (!utcDateString) return "";

  // Parse UTC string and convert to local
  const date = new Date(utcDateString);

  // Add timezone offset to get local time
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  return formatDateToKhmer(localDate.toISOString(), format);
};
