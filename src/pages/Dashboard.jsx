import React, { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationTable from "../components/ApplicationTable";
import { initialData } from "../data/mockData";

export default function Dashboard() {
  const [role, setRole] = useState("Sales");
  const [applications, setApplications] = useState(initialData);
  const [showForm, setShowForm] = useState(false);

  const [pendingData, setPendingData] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    id: null,
    title: "",
    message: "",
  });

  // --- LOGIKA AKSI UTAMA ---
  const handleApprove = (id) =>
    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, status: "Awaiting E-Signature" } : app,
      ),
    );
  const handleReject = (id) =>
    setApplications((apps) =>
      apps.map((app) => (app.id === id ? { ...app, status: "Rejected" } : app)),
    );
  const handleESign = (id) =>
    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, status: "Ready for Disbursement" } : app,
      ),
    );
  const handleDisburse = (id) =>
    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, status: "Completed (Disbursed)" } : app,
      ),
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      id: `REQ-00${applications.length + 1}`,
      name: e.target.name.value,
      vehicle: e.target.vehicle.value,
      amount: parseInt(e.target.amount.value),
      status: "Pending Approval",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setPendingData(newApp);
    requestAction("submit", null);
  };

  const requestAction = (action, id) => {
    let title = "";
    let message = "";

    if (action === "approve") {
      title = "Confirm Approval";
      message =
        "Are you sure you want to approve this application? The contract will be generated automatically.";
    } else if (action === "reject") {
      title = "Confirm Rejection";
      message =
        "Are you sure you want to reject this application? This action will terminate the process and notify the Sales Dealer.";
    } else if (action === "esign") {
      title = "Simulate E-Signature";
      message =
        "Are you sure you want to simulate the customer's E-Signature process?";
    } else if (action === "disburse") {
      title = "Confirm Disbursement";
      message =
        "Are you sure you want to disburse the funds to the dealer's account? This action cannot be undone.";
    } else if (action === "submit") {
      title = "Confirm Submission";
      message =
        "Please double-check the debtor data. Are you sure you want to submit this new application?";
    }

    setConfirmModal({ isOpen: true, action, id, title, message });
  };

  const executeAction = () => {
    const { action, id } = confirmModal;

    if (action === "approve") handleApprove(id);
    if (action === "reject") handleReject(id);
    if (action === "esign") handleESign(id);
    if (action === "disburse") handleDisburse(id);
    if (action === "submit" && pendingData) {
      setApplications([pendingData, ...applications]);
      setShowForm(false);
      setPendingData(null);
      const form = document.getElementById("application-form");
      if (form) form.reset();
    }

    setConfirmModal({
      isOpen: false,
      action: null,
      id: null,
      title: "",
      message: "",
    });
    setSelectedApp(null);
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "Pending Approval")
        .length,
      completed: applications.filter(
        (a) => a.status === "Completed (Disbursed)",
      ).length,
      totalAmount: applications
        .filter((a) => a.status === "Completed (Disbursed)")
        .reduce((sum, a) => sum + a.amount, 0),
    };
  }, [applications]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-12">
      <Navbar role={role} setRole={setRole} />

      <main className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Application Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor and manage credit origination in real-time.
            </p>
          </div>
          {role === "Sales" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#0033a0] hover:bg-[#002880] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {showForm ? "Close Form" : "+ New Application"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Applications", value: stats.total },
            { label: "Pending Approval", value: stats.pending },
            { label: "Completed", value: stats.completed },
            {
              label: "Total Disbursed",
              value:
                stats.totalAmount > 0
                  ? `IDR ${(stats.totalAmount / 1000000).toFixed(0)} M`
                  : "IDR 0",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
            >
              <p className="text-sm text-slate-500 font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {showForm && role === "Sales" && (
          <ApplicationForm onSubmit={handleSubmit} />
        )}

        <ApplicationTable
          applications={applications}
          role={role}
          onViewDetail={(app) => setSelectedApp(app)}
          onRequestAction={requestAction}
        />
      </main>
      <div className="jlk-watermark">
        <span>by</span> Nida Fitrianie
      </div>

      {/* MODAL 1: DETAIL APLIKASI (Dengan Tombol Reject) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">
                Application Details
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-slate-500 mb-1">
                    Reference ID
                  </span>
                  <span className="font-semibold text-[#0033a0]">
                    {selectedApp.id}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">
                    Submission Date
                  </span>
                  <span className="font-medium text-slate-800">
                    {selectedApp.date}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Debtor Name</span>
                  <span className="font-medium text-slate-800">
                    {selectedApp.name}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">
                    Current Status
                  </span>
                  <span className="font-medium text-amber-600">
                    {selectedApp.status}
                  </span>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-100">
                  <span className="block text-slate-500 mb-1">
                    Financing Object (Vehicle)
                  </span>
                  <span className="font-medium text-slate-800">
                    {selectedApp.vehicle}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 mb-1">
                    Credit Ceiling (IDR)
                  </span>
                  <span className="font-bold text-lg text-slate-800">
                    Rp {selectedApp.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => requestAction("reject", selectedApp.id)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              >
                Reject
              </button>

              <button
                onClick={() => requestAction("approve", selectedApp.id)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#0033a0] hover:bg-[#002880] transition-colors shadow-sm"
              >
                Approve Now
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl border border-slate-100">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.action === "reject" ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#0033a0]"}`}
            >
              {confirmModal.action === "reject" ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {confirmModal.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ ...confirmModal, isOpen: false })
                }
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors w-full"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full ${confirmModal.action === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-[#0033a0] hover:bg-[#002880]"}`}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
