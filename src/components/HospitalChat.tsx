"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Calendar, PhoneCall, Users } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "hospital";
  timestamp: Date;
}

const HOSPITAL_CONTEXT = `You are a helpful AI assistant for Vijay Hospital, a leading multi-specialty hospital in Narnaul, Haryana.

Hospital Information:
- Name: Vijay Hospital
- Location: Narnaul, Haryana, India
- Phone: +91 93067 10615 (Also available on WhatsApp)
- Hours: 24/7 Emergency Services
- Specialties: Cardiology, Neurology, Orthopedics, Maternity, Pediatrics, General Surgery, Urology, Emergency Medicine

Doctors Directory & Schedules:
1. Dr. Jyoti Yadav (Maternity)
   - Specialty: Consultant Obstetrician & Gynaecologist
   - Qualification: MS (Obstetrics & Gynaecology) from PGIMS Rohtak
   - Experience: 12+ years (formerly at Paras Hospital, Max Hospital Gurgaon, and Civil Hospital Narnaul)
   - Focus: High-risk pregnancies, minimal invasive surgeries, abdominal/obstetric/gynaecological ultrasound. Member of FOGSI.
   - Available Slots: Monday (10:00 AM - 1:00 PM), Wednesday (2:00 PM - 5:00 PM), Friday (10:00 AM - 1:00 PM), Saturday (2:00 PM - 4:00 PM)

2. Dr. Jeetesh Lamba (Orthopedics)
   - Specialty: Orthopaedic Surgeon
   - Qualification: DNB (Orthopaedics)
   - Experience: 10+ years (formerly at Soni Devi Hospital Neemrana, Span Hospital, and RPS Govt. Medical College)
   - Focus: Joint replacements, advanced arthroscopic surgery, complex trauma. Member of POS, IMA, IOS.
   - Available Slots: Tuesday (9:00 AM - 12:00 PM), Thursday (3:00 PM - 6:00 PM), Sunday (10:00 AM - 12:00 PM)

3. Dr. Vikram Rana (Gastroenterology)
   - Specialty: Gastroenterologist & Hepatologist
   - Qualification: DM (Gastroenterology), MD (Medicine) from PGIMER Chandigarh
   - Experience: 14+ years (formerly at Lal Bahadur Shastri Hospital Delhi and Mahatma Gandhi Hospital Jaipur)
   - Focus: Advanced ERCP and EUS, complex GI procedures, hepatology
   - Available Slots: Monday (2:00 PM - 5:00 PM), Wednesday (9:00 AM - 12:00 PM), Friday (3:00 PM - 6:00 PM)

4. Dr. Dip Yadav (General Surgery)
   - Specialty: General & Laparoscopic Surgeon
   - Qualification: M.S. (General Surgery) from Delhi University, FALS, FMAS
   - Experience: 11+ years
   - Focus: Laparoscopic surgery, minimal access surgery, LASER proctology, diabetic foot management
   - Available Slots: Tuesday (10:00 AM - 1:00 PM), Thursday (2:00 PM - 5:00 PM), Saturday (9:00 AM - 12:00 PM)

5. Dr. Babita Yadav (Dentistry)
   - Specialty: Dental Surgeon & Implantologist
   - Qualification: BDS, DHM (Diploma in Hospital Management), Certified Endodontist & Implantologist
   - Experience: 9+ years (former Fellow at PGIMS Rohtak)
   - Focus: Cosmetic dentistry, root canal treatments, implants, smile designing
   - Available Slots: Monday (9:00 AM - 1:00 PM), Wednesday (2:00 PM - 6:00 PM), Friday (9:00 AM - 1:00 PM), Saturday (10:00 AM - 3:00 PM)

Services:
- Outpatient Department (OPD)
- Inpatient Services
- Emergency & Trauma Care
- Diagnostic Services
- Surgical Procedures
- Pediatric Care
- Maternity Services

Guidelines:
- Be professional, empathetic, and helpful
- Provide accurate medical information (general guidance only)
- Always recommend consulting with doctors for specific medical issues
- If asked about appointments, guide users to book-appointment page
- If emergency, immediately suggest calling +91 93067 10615
- If the user prefers messaging/chatting directly with a person or asks about WhatsApp, guide them to click the WhatsApp button at the top of this chat or message us at +91 93067 10615
- Use the detailed Doctor Directory to answer specific queries about doctor specialties, credentials, experience, and their exact consultation timings/days
- Keep responses concise and friendly
- End with helpful next steps`;

export default function HospitalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Vijay Hospital. How can I help you today?",
      sender: "hospital",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/hospital-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: HOSPITAL_CONTEXT,
        }),
      });

      const data = await response.json();

      const hospitalMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Sorry, I couldn't process that. Please try again.",
        sender: "hospital",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, hospitalMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error. Please try again or call us at +91 93067 10615",
        sender: "hospital",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
        aria-label="Open hospital chat"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
        <span className="text-sm font-bold">Chat</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Vijay Hospital</h3>
          <p className="text-xs opacity-90">We typically reply in minutes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded transition-colors"
            aria-label="Minimize chat"
          >
            {isMinimized ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap gap-2">
            <Link href="/book-appointment">
              <button className="text-xs bg-emerald-500 text-white rounded-full px-3.5 py-2 hover:bg-emerald-600 whitespace-nowrap font-semibold transition-colors flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Book
              </button>
            </Link>
            <a href="tel:+919306710615">
              <button className="text-xs bg-red-500 text-white rounded-full px-3.5 py-2 hover:bg-red-600 whitespace-nowrap font-semibold transition-colors flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Emergency
              </button>
            </a>
            <a href="https://wa.me/919306710615" target="_blank" rel="noopener noreferrer">
              <button className="text-xs bg-[#25D366] text-white rounded-full px-3.5 py-2 hover:bg-[#20ba5a] whitespace-nowrap font-semibold transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.864-9.852.002-2.634-1.02-5.11-2.88-6.973a9.782 9.782 0 0 0-6.98-2.87C5.833 1.91 1.4 6.332 1.4 11.767c0 1.517.404 3.013 1.171 4.316l-.993 3.627 3.716-.975zm13.102-7.531c-.303-.151-1.793-.884-2.073-.985-.28-.102-.484-.151-.688.151-.204.303-.79.985-.969 1.187-.18.203-.359.227-.662.076-.303-.151-1.282-.472-2.443-1.508-.903-.805-1.512-1.8-1.689-2.102-.178-.303-.019-.467.132-.617.136-.135.303-.353.454-.529.151-.177.202-.303.303-.505.101-.202.051-.379-.025-.53-.076-.151-.688-1.66-.943-2.273-.248-.597-.501-.516-.688-.526-.178-.009-.382-.01-.586-.01-.204 0-.537.076-.817.379-.28.303-1.071 1.047-1.071 2.554 0 1.507 1.096 2.965 1.248 3.167.152.202 2.157 3.293 5.226 4.617.729.315 1.298.503 1.742.644.731.233 1.396.2 1.922.122.586-.088 1.793-.733 2.048-1.439.255-.706.255-1.314.179-1.439-.076-.126-.28-.203-.584-.354z" />
                </svg>
                WhatsApp
              </button>
            </a>
            <Link href="/doctors">
              <button className="text-xs bg-blue-500 text-white rounded-full px-3.5 py-2 hover:bg-blue-600 whitespace-nowrap font-semibold transition-colors flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Doctors
              </button>
            </Link>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-white rounded-br-none"
                      : "bg-white text-slate-900 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "user" ? "opacity-75" : "text-slate-500"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-900 border border-slate-200 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 px-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white p-2 rounded-full transition-colors"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151497 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99040226 L3.03521743,10.4313953 C3.03521743,10.5884926 3.34915502,10.5884926 3.50612381,10.5884926 L16.6915026,11.3739795 C16.6915026,11.3739795 17.1624089,11.3739795 17.1624089,11.9423689 L17.1624089,12.1994663 C17.1624089,12.6315722 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
