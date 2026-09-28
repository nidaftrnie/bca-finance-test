import React from "react";

export default function ApplicationForm({ onSubmit }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 animate-fade-in">
      <h3 className="text-base font-semibold text-slate-900 mb-5">
        Customer Application Form
      </h3>

      <form
        id="application-form"
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Debtor Name (As per ID)
          </label>
          <input
            type="text"
            name="name"
            required
            minLength="3"
            className="w-full bg-transparent border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0033a0] focus:border-[#0033a0] outline-none transition-colors"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            National ID Number (NIK)
          </label>
          <input
            type="text"
            name="nik"
            required
            pattern="\d{16}"
            maxLength="16"
            title="NIK must be exactly 16 digits of numbers."
            className="w-full bg-transparent border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0033a0] focus:border-[#0033a0] outline-none transition-colors"
            placeholder="16-Digit ID Number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Financing Object
          </label>
          <input
            type="text"
            name="vehicle"
            required
            className="w-full bg-transparent border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0033a0] focus:border-[#0033a0] outline-none transition-colors"
            placeholder="Vehicle Brand & Model"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Credit Ceiling (IDR)
          </label>
          <input
            type="number"
            name="amount"
            required
            min="1000000"
            title="Minimum credit amount is IDR 1,000,000"
            className="w-full bg-transparent border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0033a0] focus:border-[#0033a0] outline-none transition-colors"
            placeholder="e.g., 25000000"
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-2 pt-5 border-t border-slate-100">
          <button
            type="submit"
            className="bg-[#0033a0] hover:bg-[#002880] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
