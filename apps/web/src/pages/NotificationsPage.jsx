import React from "react";
import { useApp } from "../context/AppContext";
import { MessageSquare, Mail, Smartphone } from "lucide-react";
export const NotificationsPage = () => {
    const { notifications, markNotificationAsRead } = useApp();
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
          Multi-Channel Notification Hub
        </h1>
        <p className="text-xs text-slate-500">
          Module G: Event-triggered SMS (Gupshup), WhatsApp Business, SendGrid Email & In-App push dispatches
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {notifications.map((n) => (<div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-4 sm:p-5 flex items-start space-x-4 hover:bg-slate-50 transition cursor-pointer ${n.status !== "read" ? "bg-emerald-50/40" : ""}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.channel === "whatsapp"
                ? "bg-emerald-100 text-emerald-700"
                : n.channel === "sms"
                    ? "bg-blue-100 text-blue-700"
                    : n.channel === "email"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-purple-100 text-purple-700"}`}>
              {n.channel === "whatsapp" ? (<Smartphone className="w-5 h-5"/>) : n.channel === "sms" ? (<MessageSquare className="w-5 h-5"/>) : (<Mail className="w-5 h-5"/>)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-slate-900">{n.title}</h4>
                <span className="uppercase text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {n.channel}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{new Date(n.sentAt).toLocaleString()}</span>
                <span className="text-emerald-700 font-semibold">{n.status.toUpperCase()}</span>
              </div>
            </div>
          </div>))}
      </div>
    </div>);
};
