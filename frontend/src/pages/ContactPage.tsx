import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">Get in Touch with Orchard Care</h1>
        <p className="text-xs text-stone-500">
          Have a question about seasonal availability, corporate fruit gifts, or bulk crate dispatches? We are here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Direct Helpline</h4>
            <p className="text-xs text-stone-600">+91 98765 43210</p>
            <p className="text-[11px] text-stone-400">Mon - Sun: 8:00 AM - 8:00 PM</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Email Support</h4>
            <p className="text-xs text-stone-600">support@mangopapaya.store</p>
            <p className="text-[11px] text-stone-400">Response within 2 hours</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">Central Sorting Hub</h4>
            <p className="text-xs text-stone-600">Orchard Valley, Agro Farms, Ratnagiri & Karnataka, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-amber-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-stone-900">Send an Inquiry</h3>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Message Delivered to Orchard Desk!</h4>
              <p className="text-xs text-stone-600">Our customer care specialist will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Bulk order inquiry / Delivery question"
                  className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-xs bg-amber-50/30 border border-amber-200 rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
