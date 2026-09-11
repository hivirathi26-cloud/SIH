import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Sparkles, Send, X, Bot, User as UserIcon, MessageCircle } from "lucide-react";
import { api } from "../../services/api";
export const JharkhandSahayakChatbot = () => {
    const { chatbotOpen, setChatbotOpen, currentUser } = useApp();
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: `Namaskar ${currentUser.fullName}! I am Jharkhand Sahayak AI, your 24/7 societal innovation assistant. How can I help you today? You can ask about submitting a problem, tracking a ticket, university proposals, or CSR funding.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
    ]);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, chatbotOpen]);
    if (!chatbotOpen)
        return (<button onClick={() => setChatbotOpen(true)} className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:scale-105 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300" aria-label="Open Jharkhand Sahayak AI chatbot" title="Ask Jharkhand Sahayak AI">
          <MessageCircle className="h-5 w-5"/>
          <span>Ask AI</span>
        </button>);
    const handleSend = async (textToSend) => {
        const query = textToSend || inputMessage;
        if (!query.trim() || isSending)
            return;
        const userMsg = {
            sender: "user",
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        const history = messages.slice(-8).map((message) => ({ sender: message.sender, text: message.text }));
        setMessages((prev) => [...prev, userMsg]);
        setInputMessage("");
        setIsSending(true);
        try {
            const result = await api.ai.chat(query.trim(), `chat-${currentUser.id}`, currentUser.role, history);
            if (result.success && result.reply) {
                setMessages((prev) => [...prev, {
                    sender: "bot",
                    text: result.reply,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }]);
                return;
            }

            setMessages((prev) => [...prev, {
                sender: "bot",
                text: result.error || "I’m unable to reach the assistant right now. Please try again in a moment.",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }]);
        } finally {
            setIsSending(false);
        }
    };
    return (<div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4"/>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm">Jharkhand Sahayak AI</h3>
            <span className="text-[10px] text-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Civic Assistant • Multilingual</span>
            </span>
          </div>
        </div>

        <button onClick={() => setChatbotOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
          <X className="w-5 h-5"/>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m, idx) => (<div key={idx} className={`flex items-start space-x-2 ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${m.sender === "user"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-white"}`}>
              {m.sender === "user" ? <UserIcon className="w-3.5 h-3.5"/> : <Bot className="w-3.5 h-3.5"/>}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${m.sender === "user"
                ? "bg-emerald-600 text-white rounded-tr-none shadow-sm"
                : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"}`}>
              <p className="whitespace-pre-line break-words">{m.text}</p>
              <span className={`text-[9px] block mt-1 ${m.sender === "user" ? "text-emerald-200 text-right" : "text-slate-400"}`}>
                {m.timestamp}
              </span>
            </div>
          </div>))}
        <div ref={messagesEndRef}/>
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <button onClick={() => handleSend("Track ticket JSICP-2026-0841")} className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition">
          Track #0841
        </button>
        <button onClick={() => handleSend("How to submit a civic problem?")} className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition">
          How to submit?
        </button>
        <button onClick={() => handleSend("Tell me about CSR funding")} className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition">
          CSR Funding
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => {
            e.preventDefault();
            handleSend();
        }} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask a question or enter Ticket ID..." className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
        <button type="submit" disabled={isSending} className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl transition shadow-sm">
          <Send className="w-4 h-4"/>
        </button>
      </form>
    </div>);
};
