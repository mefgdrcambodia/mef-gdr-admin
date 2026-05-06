import React, { useState, useEffect } from "react";
import {
  FaServer,
  FaGlobe,
  FaCheckCircle,
  FaExclamationTriangle,
  FaNewspaper,
  FaFilePdf,
  FaMicrophoneAlt,
  FaChartBar,
  FaDatabase,
} from "react-icons/fa";
import Loading from "../../../../component/Loading/Loading.component.jsx";
import { getAllRequest } from "../../../../util/request_api";

function SummaryData({ auth }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const access_token = auth.getClientLogin().data?.access_token;
  const CACHE_KEY = "summary_dashboard_cache";

  useEffect(() => {
    // 1. Try to load from cache immediately
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if it's less than 1 hour old (or you can use any data)
      // Even if expired, we can show it anyway and refresh later
      setSummary(data);
      setLoading(false); // No loading spinner because we have data to show
    } else {
      setLoading(true);
    }

    // 2. Fetch fresh data from API (silent background update)
    fetchFreshData();
  }, []);

  const fetchFreshData = async () => {
    const frontendUrl =
      process.env.REACT_APP_PRODUCTION_URL || window.location.origin;
    const api = `${process.env.REACT_APP_API_HOST}/api/${process.env.REACT_APP_VERSION}/admin/summary/data?url=${encodeURIComponent(frontendUrl)}`;
    const result = await getAllRequest(api, access_token);

    if (result.success && result.data) {
      const newData = result.data.data;
      setSummary(newData);
      setLoading(false);

      // Save to cache with timestamp
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: newData,
          timestamp: Date.now(),
        }),
      );
    } else {
      // If fetch fails and we have no cache, we might want to show an error
      if (!summary) {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading is_loading={true} />;
  if (!summary) return <div className="m-4">No data available</div>;

  const {
    news = 0,
    legal = 0,
    speech = 0,
    report = 0,
    check_api_url,
    check_fronted_url,
  } = summary;

  const grandTotal = news + legal + speech + report;

  const modelCards = [
    {
      title: "ព័ត៌មាន / News",
      count: news,
      icon: <FaNewspaper />,
      color: "#4CAF50",
    },
    {
      title: "ឯកសារច្បាប់ / Legal",
      count: legal,
      icon: <FaFilePdf />,
      color: "#2196F3",
    },
    {
      title: "សុន្ទរកថា / Speech",
      count: speech,
      icon: <FaMicrophoneAlt />,
      color: "#FF9800",
    },
    {
      title: "របាយការណ៍ / Report",
      count: report,
      icon: <FaChartBar />,
      color: "#9C27B0",
    },
  ];

  // The rest of your JSX remains EXACTLY the same
  return (
    <div style={{ padding: "10px" }}>
      <div className="container-fluid px-4">
        <div className="row mt-3">
          <div className="col-md-12">
            <h4>ទិន្នន័យទូទៅ / Summary Dashboard</h4>
            <hr />
          </div>
        </div>

        <br />

        {/* Grand Total Card */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div
              className="card shadow-sm border-0"
              style={{
                borderRadius: "15px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <div className="card-body d-flex justify-content-between align-items-center p-4">
                <div>
                  <h5 className="mb-1">ចំនួនសរុប / Grand Total</h5>
                  <h2
                    className="mb-0"
                    style={{ fontSize: "3rem", fontWeight: "bold" }}
                  >
                    {grandTotal.toLocaleString()}
                  </h2>
                  <small>ឯកសារទាំងអស់</small>
                </div>
                <FaDatabase style={{ fontSize: "4rem", opacity: 0.8 }} />
              </div>
            </div>
          </div>
        </div>
        <br />

        {/* Model Cards */}
        <div className="row mt-3">
          {modelCards.map((card, idx) => (
            <div className="col-md-6 col-lg-3 mb-4" key={idx}>
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#fff",
                  transition: "transform 0.2s",
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-muted">{card.title}</h6>
                      <h2
                        className="mb-0"
                        style={{ fontSize: "2rem", fontWeight: "bold" }}
                      >
                        {card.count}
                      </h2>
                    </div>
                    <div style={{ fontSize: "2rem", color: card.color }}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br />

        {/* URL Health Check Section */}
        <div className="row">
          <div className="col-md-12">
            <h5>ពិនិត្យស្ថានភាព URL / URL Health Check</h5>
            <hr />
          </div>
        </div>

        <div className="row">
          {/* API (Backend) Card */}
          <div className="col-md-6 mb-4">
            <div
              className="card h-100 shadow-sm border-0"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <h6 className="text-muted mb-3">
                  <FaServer className="me-2" /> API (Backend)
                </h6>
                {check_api_url ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-secondary">ស្ថានភាព:</span>
                      {check_api_url.status === "up" ? (
                        <span
                          className="badge bg-success px-3 py-2"
                          style={{ borderRadius: "20px" }}
                        >
                          <FaCheckCircle className="me-1" /> ដំណើរការល្អ
                        </span>
                      ) : (
                        <span
                          className="badge bg-danger px-3 py-2"
                          style={{ borderRadius: "20px" }}
                        >
                          <FaExclamationTriangle className="me-1" /> បរាជ័យ
                        </span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">HTTP Status:</span>
                      <span className="fw-bold">
                        {check_api_url.httpStatus || "—"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">ពេលវេលាឆ្លើយតប:</span>
                      <span className="fw-bold">
                        {check_api_url.responseTime || "—"}
                      </span>
                    </div>
                    {check_api_url.error && (
                      <div className="alert alert-danger mt-2 small p-2">
                        {check_api_url.error}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted">មិនមានទិន្នន័យ</div>
                )}
              </div>
            </div>
          </div>

          {/* Frontend (Website) Card */}
          <div className="col-md-6 mb-4">
            <div
              className="card h-100 shadow-sm border-0"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body">
                <h6 className="text-muted mb-3">
                  <FaGlobe className="me-2" /> Frontend (Website)
                </h6>
                {check_fronted_url ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-secondary">ស្ថានភាព:</span>
                      {check_fronted_url.status === "up" ? (
                        <span
                          className="badge bg-success px-3 py-2"
                          style={{ borderRadius: "20px" }}
                        >
                          <FaCheckCircle className="me-1" /> ដំណើរការល្អ
                        </span>
                      ) : (
                        <span
                          className="badge bg-danger px-3 py-2"
                          style={{ borderRadius: "20px" }}
                        >
                          <FaExclamationTriangle className="me-1" /> បរាជ័យ
                        </span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">HTTP Status:</span>
                      <span className="fw-bold">
                        {check_fronted_url.httpStatus || "—"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">ពេលវេលាឆ្លើយតប:</span>
                      <span className="fw-bold">
                        {check_fronted_url.responseTime || "—"}
                      </span>
                    </div>
                    {check_fronted_url.error && (
                      <div className="alert alert-danger mt-2 small p-2">
                        {check_fronted_url.error}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted">មិនមានទិន្នន័យ</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryData;
