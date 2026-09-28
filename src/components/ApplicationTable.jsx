import React from "react";

export default function ApplicationTable({
  applications,
  role,
  onViewDetail,
  onRequestAction,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending Approval":
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
      case "Rejected": 
        return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20";
      case "Awaiting E-Signature":
        return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";
      case "Ready for Disbursement":
        return "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20";
      case "Completed (Disbursed)":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
      default:
        return "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 border-b border-slate-200">Ref ID</th>
              <th className="px-6 py-4 border-b border-slate-200">Debtor</th>
              <th className="px-6 py-4 border-b border-slate-200">Vehicle</th>
              <th className="px-6 py-4 border-b border-slate-200">
                Amount (IDR)
              </th>
              <th className="px-6 py-4  border-b border-slate-200">Status</th>
              <th className="px-6 py-4 border-b border-slate-200 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {app.id}
                </td>
                <td className="px-6 py-4 text-slate-600">{app.name}</td>
                <td className="px-6 py-4 text-slate-600">{app.vehicle}</td>
                <td className="px-6 py-4 text-slate-600">
                  {app.amount.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {role === "Manager" && app.status === "Pending Approval" ? (
                    <button
                      onClick={() => onViewDetail(app)}
                      className="text-[#0033a0] hover:text-[#002880] font-medium text-sm transition-colors"
                    >
                      Review
                    </button>
                  ) : role === "Sales" &&
                    app.status === "Awaiting E-Signature" ? (
                    <button
                      onClick={() => onRequestAction("esign", app.id)}
                      className="text-sky-600 hover:text-sky-700 font-medium text-sm transition-colors"
                    >
                      Simulate E-Sign
                    </button>
                  ) : role === "Admin" &&
                    app.status === "Ready for Disbursement" ? (
                    <button
                      onClick={() => onRequestAction("disburse", app.id)}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                    >
                      Disburse
                    </button>
                  ) : (
                    <span
                      className={`text-sm ${app.status === "Rejected" ? "text-red-500 font-medium" : "text-slate-400"}`}
                    >
                      {app.status === "Completed (Disbursed)"
                        ? "Done"
                        : app.status === "Rejected"
                          ? "Rejected"
                          : "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-slate-500 text-sm"
                >
                  No application data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
