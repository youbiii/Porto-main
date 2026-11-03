import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, GraduationCap, X, Save, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../../context/PortfolioContext';

export const ProfileTab: React.FC = () => {
  const { personalInfo, updatePersonalInfo, uploadImageFile, isSaving } = usePortfolio();
  const [form, setForm] = useState({
    name: personalInfo?.name || 'Catur Nurul Huda',
    degree: personalInfo?.degree || 'S.Kom',
    fullTitle: personalInfo?.fullTitle || personalInfo?.major || 'S1 Teknik Informatika',
    faculty: personalInfo?.faculty || 'Fakultas Teknik',
    university: personalInfo?.university || 'Universitas Pahlawan Tuanku Tambusai',
    nim: personalInfo?.nim || personalInfo?.studentId || '210401088',
    status: personalInfo?.status || 'Tugas Akhir / Alumni S.Kom',
    location: personalInfo?.location || 'Kampar, Riau, Indonesia',
    bio:
      personalInfo?.bio ||
      'Halo, saya Catur Nurul Huda — Mahasiswa S1 Teknik Informatika, Fakultas Teknik, Universitas Pahlawan Tuanku Tambusai. Saya tertarik membangun aplikasi web, sistem IoT, dan software yang bermanfaat dengan antarmuka yang bersih, intuitif, dan responsif.',
      bgArt: personalInfo?.bgArt || 'atom',
      avatar: personalInfo?.avatar || personalInfo?.avatarUrl || '',
  
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      setForm((prev) => ({ ...prev, avatar: uploadedUrl }));
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePersonalInfo({
      ...form,
      avatarUrl: form.avatar,
      studentId: form.nim,
      major: form.fullTitle,
    });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-200">
      
      {/* 1. SEKSI FOTO PROFIL KARTU LANYARD ID & AVATAR */}
      <div className="bg-[#171A1E] border border-[#2B3038] rounded-2xl p-5 shadow-sm">
        <h4 className="text-xs font-bold font-sora text-white mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#F5B301]" />
          <span>Foto Profil Kartu Lanyard ID & Avatar</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Kotak Preview Avatar dengan Tombol Hapus Merah */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl border-2 border-[#F5B301] overflow-hidden bg-[#20252B] flex items-center justify-center shadow-lg">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ImageIcon className="w-7 h-7 text-[#F5B301]/60 mb-1" />
                  <span className="text-[10px] font-mono">No Image</span>
                </div>
              )}
            </div>

            {form.avatar && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, avatar: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
                title="Hapus Foto"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Opsi Upload & URL Foto */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#20252B] hover:bg-[#2A3038] border border-[#F5B301] text-xs font-semibold text-[#F5B301] rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-[#F5B301]" />
                <span>{uploadingImage ? 'Mengunggah...' : 'Upload Foto dari Laptop'}</span>
              </button>
              <span className="text-xs text-gray-400">
                atau masukkan URL foto langsung di bawah:
              </span>
            </div>

            <input
              type="text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="data:image/jpeg;base64,... atau https://example.com/foto.jpg"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#F5B301] font-mono transition-colors"
            />
            <p className="text-[11px] text-gray-400 leading-tight">
              *Foto ini akan otomatis terpajang di kartu Lanyard ID interaktif dan seluruh halaman portofolio.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SEKSI INFORMASI AKADEMIK & PROFIL LANYARD */}
      <div className="bg-[#171A1E] border border-[#2B3038] rounded-2xl p-5 space-y-4 shadow-sm">
        <h4 className="text-xs font-bold font-sora text-white flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#F5B301]" />
          <span>Informasi Akademik & Profil Lanyard</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Gelar / Singkatan
            </label>
            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="S.Kom"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Program Studi / Title Lengkap
            </label>
            <input
              type="text"
              name="fullTitle"
              value={form.fullTitle}
              onChange={handleChange}
              placeholder="S1 Teknik Informatika"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Fakultas
            </label>
            <input
              type="text"
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              placeholder="Fakultas Teknik"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Universitas / Kampus
            </label>
            <input
              type="text"
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="Universitas Pahlawan Tuanku Tambusai"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              NIM (Nomor Induk Mahasiswa)
            </label>
            <input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="210401088"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Status Lanyard Card
            </label>
            <input
              type="text"
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="Tugas Akhir / Alumni S.Kom"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Domisili / Lokasi
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Kampar, Riau, Indonesia"
              className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
            Bio Ringkasan Portofolio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            placeholder="Deskripsi ringkas profil Anda..."
            className="w-full px-4 py-2.5 bg-[#20252B] border border-[#2B3038] rounded-xl text-xs text-white focus:outline-none focus:border-[#F5B301] transition-colors leading-relaxed"
          />
        </div>
      </div>

{/* PILIHAN ART LATAR BELAKANG HERO FULL SECTION */}
<div className="bg-[#171A1E] border border-[#2B3038] rounded-2xl p-5 shadow-sm space-y-3">
  <label className="block text-xs font-bold font-sora text-white flex items-center justify-between">
    <span>Latar Belakang Efek (Hero Full Section Background Art)</span>
    <span className="text-[10px] text-[#F5B301] font-mono font-normal">Memenuhi 1 Layar Penuh Hero</span>
  </label>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
    {[
      { id: 'solarsystem', label: '🪐 Tata Surya Multi-Planet (HUD Orbit)' },
      { id: 'doodle_astronaut', label: '👨‍🚀 Doodle Astronot & Rover (Putih)' },
      { id: 'doodle_galaxy', label: '🚀 Doodle Roket & Armada UFO (Putih)' },
      { id: 'doodle_deepspace', label: '☄️ Doodle Kosmik & Hujan Komet (Putih)' },
      { id: 'atom', label: '⚛️ Atom Orbit (React Universe)' },
      { id: 'grid', label: '🌐 Cyber Grid & Radar' },
      { id: 'nodes', label: '📡 IoT Constellation Nodes' },
      { id: 'none', label: '⬛ Gelap Bersih (Polos)' },
    ].map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => setForm((prev: any) => ({ ...prev, bgArt: item.id }))}
        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
          (form.bgArt || 'solarsystem') === item.id
            ? 'bg-[#F5B301]/10 border-[#F5B301] text-[#F5B301] shadow-sm'
            : 'bg-[#20252B] border-[#2B3038] text-gray-400 hover:text-white hover:bg-[#262B32]'
        }`}
      >
        <span>{item.label}</span>
        {(form.bgArt || 'solarsystem') === item.id && (
          <span className="w-2 h-2 rounded-full bg-[#F5B301] ml-2 shrink-0 animate-pulse" />
        )}
      </button>
    ))}
  </div>
</div>
      {/* TOMBOL SIMPAN */}
      <div className="flex items-center justify-between pt-2">
        {isSuccess ? (
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Perubahan profil berhasil disimpan!
          </span>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#F5B301] hover:bg-[#FCD053] text-[#1E2328] font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
        </button>
      </div>
    </form>
  );
};