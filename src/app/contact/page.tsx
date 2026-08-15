"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare, PhoneCall, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Custom 3D Printing");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 bg-paper-100 text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="max-w-2xl space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-terracotta block">
            CONTACT DIMENSION
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
            Have questions about a print, need multicolour 3D printing, or want a custom model made? Reach us directly through any channel below.
          </p>
        </div>

        {/* Quick Contact Action Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <a
            href="mailto:real.kiktro@gmail.com?subject=Dimension%203D%20Printing%20Inquiry"
            className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
          >
            <div className="w-9 h-9 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink">Email Us</span>
            <span className="text-[10px] text-ink-muted font-sans truncate max-w-full">real.kiktro@gmail.com</span>
          </a>

          <a
            href="https://wa.me/918336800598?text=Hi%20Dimension,%20I'm%20inquiring%20about%203D%20printing."
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
          >
            <div className="w-9 h-9 bg-paper-300 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-ink transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink">WhatsApp</span>
            <span className="text-[10px] text-ink-muted font-sans">+91 83368 00598</span>
          </a>

          <a
            href="sms:+918336800598?body=Hi%20Dimension,%20I%20have%20an%20inquiry%20about%203D%20printing."
            className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
          >
            <div className="w-9 h-9 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink">SMS Message</span>
            <span className="text-[10px] text-ink-muted font-sans">+91 83368 00598</span>
          </a>

          <a
            href="tel:+918336800598"
            className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
          >
            <div className="w-9 h-9 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="font-semibold text-ink">Direct Call</span>
            <span className="text-[10px] text-ink-muted font-sans">+91 83368 00598</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Official Contact Info Card */}
          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="p-6 bg-paper-200 hairline space-y-6">
              <h3 className="font-bold text-ink uppercase text-[11px] hairline-b pb-3">
                OFFICIAL DETAILS
              </h3>

              <div className="space-y-4 text-ink-muted font-sans text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-ink-subtle block">OFFICIAL EMAIL</span>
                    <a href="mailto:real.kiktro@gmail.com" className="text-ink font-semibold hover:text-terracotta">
                      real.kiktro@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-ink-subtle block">DIRECT PHONE</span>
                    <a href="tel:+918336800598" className="text-ink font-semibold hover:text-terracotta">
                      +91 83368 00598
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-ink-subtle block">OFFICE & WORKSHOP ADDRESS</span>
                    <span className="text-ink leading-relaxed block font-sans">
                      44, Talbagan, Noapara, Baranagar, Kolkata 700090<br />
                      West Bengal, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-paper-200 hairline space-y-2">
              <span className="text-[11px] font-bold text-ink block">PRINTING CAPACITY</span>
              <p className="text-xs text-ink-muted font-sans leading-relaxed">
                Max print dimensions: <strong>325 × 320 × 325 mm</strong>. Standard single-part orders ship in 48–72 hours; rush priority orders ship within 24 hours.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-8 bg-paper-200 hairline space-y-6">
              {submitted ? (
                <div className="p-8 text-center space-y-4 font-mono">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink">Inquiry Sent</h3>
                  <p className="text-xs text-ink-muted font-sans max-w-sm mx-auto">
                    Thank you, {name}. We will review your message and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-ink text-paper-100 text-xs font-mono"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold hairline-b pb-3">
                    SEND A MESSAGE
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-ink">YOUR NAME *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 bg-paper-100 hairline text-ink focus:outline-none focus:border-ink font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-ink">EMAIL ADDRESS *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul@example.com"
                          className="w-full px-3 py-2 bg-paper-100 hairline text-ink focus:outline-none focus:border-ink font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-ink">PHONE NUMBER</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 bg-paper-100 hairline text-ink focus:outline-none focus:border-ink font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-ink">INQUIRY TYPE</label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-3 py-2 bg-paper-100 hairline text-ink focus:outline-none focus:border-ink"
                      >
                        <option value="Custom 3D Printing">Custom 3D Printing (Upload/STL)</option>
                        <option value="Multicolour 3D Printing">Multicolour 3D Printing</option>
                        <option value="Custom 3D Model Design">Want a Custom 3D Model Made</option>
                        <option value="Batch / Production Run">Batch / Production Run</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-ink">MESSAGE / SPECIFICATIONS *</label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you'd like printed or designed..."
                        className="w-full px-3 py-2 bg-paper-100 hairline text-ink focus:outline-none focus:border-ink font-sans"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-ink hover:bg-charcoal text-paper-100 font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-subtle"
                      >
                        <Send className="w-4 h-4" />
                        <span>SEND INQUIRY</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
