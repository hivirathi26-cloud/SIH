import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";
export const AnalyticsCharts = () => {
    const domainData = [
        { name: "Water & Sanitation", problems: 142, resolved: 48 },
        { name: "Agriculture", problems: 118, resolved: 39 },
        { name: "Mining & Environment", problems: 96, resolved: 34 },
        { name: "Rural Transport", problems: 88, resolved: 28 },
        { name: "Healthcare / MedTech", problems: 78, resolved: 29 },
        { name: "Forest & Tribal", problems: 72, resolved: 24 },
        { name: "Renewable Energy", problems: 64, resolved: 22 }
    ];
    const universityParticipationData = [
        { name: "BIT Mesra", active: 14, completed: 28, patents: 12 },
        { name: "IIT ISM Dhanbad", active: 18, completed: 34, patents: 21 },
        { name: "NIT Jamshedpur", active: 11, completed: 19, patents: 8 },
        { name: "BAU Ranchi", active: 15, completed: 22, patents: 5 },
        { name: "Ranchi Univ", active: 8, completed: 14, patents: 3 }
    ];
    const csrTrendData = [
        { month: "Oct 25", funds: 12.5, deployed: 4 },
        { month: "Nov 25", funds: 18.2, deployed: 9 },
        { month: "Dec 25", funds: 26.0, deployed: 15 },
        { month: "Jan 26", funds: 38.5, deployed: 24 },
        { month: "Feb 26", funds: 52.8, deployed: 36 }
    ];
    const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
    return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Domain Thematic Distribution */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-heading font-bold text-sm text-slate-900">
          Domain-Wise Thematic Civic Challenges vs Resolutions
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} interval={0}/>
              <YAxis tick={{ fontSize: 10 }}/>
              <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }}/>
              <Legend wrapperStyle={{ fontSize: "11px" }}/>
              <Bar dataKey="problems" name="Submitted Challenges" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="resolved" name="Deployed Solutions" fill="#10b981" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* University Participation & Patent Outcomes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-heading font-bold text-sm text-slate-900">
          HEI Research Engagement, Projects & Patents Filed
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={universityParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
              <YAxis tick={{ fontSize: 10 }}/>
              <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }}/>
              <Legend wrapperStyle={{ fontSize: "11px" }}/>
              <Bar dataKey="active" name="Active Student Teams" fill="#f59e0b" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="completed" name="Completed Solutions" fill="#10b981" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="patents" name="IP/Patents Filed" fill="#8b5cf6" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CSR Funds Mobilization Trend */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 lg:col-span-2">
        <h4 className="font-heading font-bold text-sm text-slate-900">
          Industry CSR Grants Mobilized (₹ Lakhs) & Community Impact S-Curve
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={csrTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }}/>
              <Legend wrapperStyle={{ fontSize: "11px" }}/>
              <Line type="monotone" dataKey="funds" name="CSR Funds Disbursed (₹ Lakhs)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }}/>
              <Line type="monotone" dataKey="deployed" name="Cumulative Solutions Deployed" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
};
