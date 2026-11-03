import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../data';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Instagram, CheckCircle2, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <section id="contact" className="py-20 bg-[#2A2E34] relative z-10 border-t border-[#3B3F46]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2328] border border-[#3B3F46] text-xs font-semibold text-[#F5B301] uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Hubungi Saya</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sora text-white tracking-tight">
            Mari <span className="text-[#F5B301]">Berdiskusi</span>
          </h2>
          <div className="w-16 h-1 bg-[#F5B301] mx-auto mt-3 rounded-full" />
          <p className="text-gray-300 text-sm sm:text-base mt-4">
            Apakah Anda memiliki pertanyaan, tawaran proyek, atau ingin berkolaborasi? Jangan ragu untuk mengirimkan pesan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-[#1E2328] p-6 rounded-2xl border border-[#3B3F46] space-y-6">
              <h3 className="text-xl font-bold font-sora text-white border-b border-[#3B3F46] pb-3">
                Informasi Kontak
              </h3>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#2A2E34] border border-[#3B3F46] flex items-center justify-center text-[#F5B301] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-mono block uppercase">Email Kampus / Personal</span>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-white hover:text-[#F5B301] transition-colors font-medium break-all"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#2A2E34] border border-[#3B3F46] flex items-center justify-center text-[#F5B301] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-mono block uppercase">Telepon / WhatsApp</span>
                    <span className="text-white font-medium">{PERSONAL_INFO.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#2A2E34] border border-[#3B3F46] flex items-center justify-center text-[#F5B301] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-mono block uppercase">Lokasi / Kampus</span>
                    <span className="text-white font-medium">{PERSONAL_INFO.university}</span>
                    <span className="text-xs text-gray-400 block">{PERSONAL_INFO.location}</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-[#3B3F46]">
                <span className="text-xs font-mono uppercase text-gray-400 font-bold block mb-3">
                  Media Sosial & Repository
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Profil GitHub Catur Nurul Huda');
                    }}
                    className="p-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-gray-300 hover:text-[#F5B301] hover:border-[#F5B301] transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Profil LinkedIn Catur Nurul Huda');
                    }}
                    className="p-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-gray-300 hover:text-[#F5B301] hover:border-[#F5B301] transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={PERSONAL_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Profil Instagram Catur Nurul Huda');
                    }}
                    className="p-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-gray-300 hover:text-[#F5B301] hover:border-[#F5B301] transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="bg-[#1E2328] p-6 sm:p-8 rounded-2xl border border-[#3B3F46]">
              <h3 className="text-xl font-bold font-sora text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#F5B301]" />
                <span>Kirim Pesan Langsung</span>
              </h3>

              {submitted ? (
                <div className="bg-[#2A2E34] border-2 border-[#F5B301] p-6 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#F5B301] mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold font-sora text-white">Pesan Terkirim!</h4>
                  <p className="text-gray-300 text-sm">
                    Terima kasih telah menghubungi Catur Nurul Huda. Pesan simulasi Anda telah berhasil disimpan.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-4 py-2 bg-[#F5B301] text-[#1E2328] text-xs font-bold rounded-lg hover:bg-[#FCD053] transition-colors"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-medium">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-4 py-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-white text-sm focus:outline-none focus:border-[#F5B301] transition-colors placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-medium">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-white text-sm focus:outline-none focus:border-[#F5B301] transition-colors placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-medium">
                      Subjek Pesan
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Diskusi Proyek / Penawaran Kerjasama"
                      className="w-full px-4 py-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-white text-sm focus:outline-none focus:border-[#F5B301] transition-colors placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1.5 font-medium">
                      Isi Pesan *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pesan atau detail pertanyaan Anda di sini..."
                      className="w-full px-4 py-3 rounded-xl bg-[#2A2E34] border border-[#3B3F46] text-white text-sm focus:outline-none focus:border-[#F5B301] transition-colors placeholder:text-gray-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#F5B301] hover:bg-[#FCD053] text-[#1E2328] font-sora font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Mengirim Pesan...</span>
                    ) : (
                      <>
                        <span>Kirim Pesan</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
