"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Send, AlertCircle, MessageSquare, User, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

export default function MessagesPage() {
  const { currentUser, chats, replyToChatMessage } = useApp();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find active thread
  const activeThread = useMemo(() => {
    return chats.find((c) => c.id === activeThreadId) || null;
  }, [chats, activeThreadId]);

  // Set initial active thread if not set and chats exist
  useEffect(() => {
    if (chats.length > 0 && !activeThreadId) {
      setActiveThreadId(chats[0].id);
    }
  }, [chats, activeThreadId]);

  // Scroll to bottom of message logs
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages]);

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Denied</h2>
            <p className="text-ink/80 mb-6">Please sign in to read your correspondence.</p>
            <a href="/login">
              <Button variant="primary" className="border-2 border-vintage font-bold uppercase">Sign In</Button>
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeThreadId) return;

    // Send user message
    replyToChatMessage(activeThreadId, messageText);
    const sentText = messageText;
    setMessageText("");

    // Simulate mock seller reply
    setTimeout(() => {
      const sellerReplies = [
        "Sounds good! We can meet up tomorrow in the campus cafe around noon.",
        "Sure, the price is negotiable. What amount are you thinking?",
        "Yes, the book is still available! Where would you like to meet?",
        "Excellent. I will bring the book with me tomorrow. Let me know when you are free.",
        "Perfect. Send me your phone number so we can coordinate the trade."
      ];
      const randomReply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)];
      
      // Inject reply from the other participant
      const storedChats = localStorage.getItem("bb_chats");
      if (storedChats) {
        const chatsList = JSON.parse(storedChats);
        const updated = chatsList.map((c: any) => {
          if (c.id === activeThreadId) {
            const isBuyer = currentUser.id === c.buyerId;
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  senderId: isBuyer ? c.sellerId : c.buyerId,
                  senderName: isBuyer ? c.sellerName : c.buyerName,
                  text: randomReply,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              ]
            };
          }
          return c;
        });
        localStorage.setItem("bb_chats", JSON.stringify(updated));
        // Simple hack to update parent context state: dispatch event or window reload/re-render
        // For standard client states we just trigger a storage reload
        window.dispatchEvent(new Event("storage"));
      }
    }, 1500);
  };

  // Listen to local storage changes to trigger quick sync on auto reply
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-trigger states inside parent context
      // The context reads automatically but let's force re-mount of thread
      // by toggling activeThreadId or window trigger
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <MessageSquare className="h-7 w-7 text-vintage" /> Correspondence Desk
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              Dialogue logs between campus buyers and sellers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {chats.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-[280px_1fr] border-2 border-vintage bg-card h-[500px]">
              {/* Left Column: Chat Thread List */}
              <div className="border-r border-vintage flex flex-col overflow-y-auto bg-paper/50">
                <div className="border-b border-vintage p-3 bg-beige/35">
                  <h4 className="font-serif text-[10px] font-bold uppercase tracking-wider text-vintage">
                    Active Telegrams
                  </h4>
                </div>
                <div className="divide-y divide-vintage">
                  {chats.map((c) => {
                    const isBuyer = currentUser.id === c.buyerId;
                    const otherPartyName = isBuyer ? c.sellerName : c.buyerName;
                    const lastMsg = c.messages[c.messages.length - 1];

                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveThreadId(c.id)}
                        className={`w-full text-left p-4 font-serif block transition-colors hover:bg-beige/40 ${
                          activeThreadId === c.id ? "bg-beige/65 border-l-4 border-vintage" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs uppercase text-ink block">
                            {otherPartyName}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-vintage block uppercase truncate mt-0.5">
                          RE: {c.bookTitle}
                        </span>
                        {lastMsg && (
                          <p className="text-[11px] text-ink/70 truncate mt-1 leading-normal italic">
                            "{lastMsg.text}"
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Chat Thread logs */}
              {activeThread ? (
                <div className="flex flex-col justify-between h-full bg-card">
                  {/* Thread Header */}
                  <div className="border-b border-vintage p-3 bg-beige/10 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-[10px] uppercase text-ink/50 block">Subject Catalogue</span>
                      <a href={`/books/${activeThread.bookId}`} className="font-serif text-sm font-bold text-vintage uppercase hover:underline">
                        {activeThread.bookTitle}
                      </a>
                    </div>
                    <div className="text-right font-serif text-[10px] text-ink/70">
                      Chat with <strong>{currentUser.id === activeThread.buyerId ? activeThread.sellerName : activeThread.buyerName}</strong>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 font-serif text-xs">
                    {activeThread.messages.map((m, idx) => {
                      const isMe = m.senderId === currentUser.id;
                      return (
                        <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] border border-vintage p-3 rounded-none ${
                            isMe ? "bg-vintage text-paper shadow-sm" : "bg-paper text-ink"
                          }`}>
                            <div className="flex justify-between gap-4 font-serif text-[9px] uppercase tracking-wider mb-1 text-inherit/60 font-bold border-b border-current/25 pb-0.5">
                              <span>{m.senderName}</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p className="leading-relaxed font-serif text-[13px]">{m.text}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input bar */}
                  <form onSubmit={handleSend} className="border-t border-vintage p-3 bg-paper flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your telegram..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full rounded-none border border-vintage bg-card p-2.5 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                    />
                    <button
                      type="submit"
                      className="border border-vintage bg-vintage text-paper px-4 py-2 font-serif text-xs font-bold uppercase hover:bg-paper hover:text-vintage flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" /> Send
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center justify-center p-10 font-serif italic text-ink/50 text-sm">
                  Select a telegram thread from the column list.
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto border border-dashed border-vintage p-10 text-center font-serif bg-card mt-6">
              <h4 className="font-bold uppercase text-vintage mb-2">No Active Conversations</h4>
              <p className="text-xs text-ink/75 leading-relaxed mb-6">
                You haven't initiated correspondence with any sellers yet. Search books and use the "Contact Seller" button to start a thread.
              </p>
              <a href="/home">
                <Button variant="secondary" className="border-2 border-vintage font-bold uppercase">Browse Classifieds</Button>
              </a>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
