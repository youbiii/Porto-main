import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { usePortfolioData } from '../context/PortfolioContext';
import { ShieldCheck, Award } from 'lucide-react';

export const LanyardCard: React.FC = () => {
  const { profile, personalInfo } = usePortfolioData();
  const data = personalInfo || profile || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Koordinat tarikan kartu
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Pegas lembut & responsif (ultra-smooth)
  const x = useSpring(rawX, { stiffness: 280, damping: 32 });
  const y = useSpring(rawY, { stiffness: 280, damping: 32 });
  const dragRotateZ = useTransform(x, [-260, 260], [-16, 16]);

  // Lebar standar acuan viewBox tengah adalah 320, jadi sumbu X tengah tepat 160
  const CENTER_X = 160;
  const ANCHOR_Y = 0;

  // Jalur tali SVG yang dijamin 100% tepat simetris di tengah
  const ropePath = useTransform([x, y], ([curX, curY]) => {
    const cardTopX = CENTER_X + Number(curX);
    const cardTopY = 82 + Number(curY); // menancap presisi di lubang kartu
    const controlX = CENTER_X + Number(curX) * 0.15;
    const controlY = Math.max(cardTopY * 0.45, 20);
    return `M ${CENTER_X} ${ANCHOR_Y} Q ${controlX} ${controlY} ${cardTopX} ${cardTopY}`;
  });

  // Animasi putar perlahan 360 berkala
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && !isOpen) {
        setIsFlipping(true);
        setTimeout(() => setIsFlipping(false), 1800);
      }
    }, 8500);

    return () => clearInterval(interval);
  }, [isDragging, isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center select-none pt-0 pb-12 w-[320px] mx-auto overflow-visible [perspective:1400px]"
    >
      {/* Tali Lanyard SVG Dinamis - Koordinat Simetris Berbasis ViewBox */}
      <svg
        viewBox="0 0 320 600"
        className="absolute -top-16 left-0 w-full h-[650px] pointer-events-none z-10 overflow-visible"
      >
        <defs>
          <linearGradient id="lanyardStrap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E2328" />
            <stop offset="50%" stopColor="#2F353E" />
            <stop offset="100%" stopColor="#1E2328" />
          </linearGradient>
        </defs>

        {/* Bayangan tali */}
        <motion.path
          d={ropePath}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Tali utama */}
        <motion.path
          d={ropePath}
          fill="none"
          stroke="url(#lanyardStrap)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Garis jahitan emas tepat di tengah tali */}
        <motion.path
          d={ropePath}
          fill="none"
          stroke="#F5B301"
          strokeWidth="2.2"
          strokeDasharray="5 5"
        />
      </svg>

      {/* Gantungan Pin Logam Atas (Tepat di Center Sumbu X: left-1/2 -translate-x-1/2) */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-10 h-7 rounded-md bg-[#252A30] border border-[#3E454F] shadow-lg flex items-center justify-center z-20 pointer-events-none">
        <div className="w-4 h-2 bg-[#141619] rounded-full border border-[#3E454F]" />
      </div>

      {/* Kartu Lanyard Draggable */}
      <motion.div
        drag
        dragSnapToOrigin={true}
        dragElastic={0.45}
        style={{ x, y, rotateZ: dragRotateZ }}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_e, info) => {
          rawX.set(info.offset.x);
          rawY.set(info.offset.y);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          rawX.set(0);
          rawY.set(0);
        }}
        whileTap={{ cursor: 'grabbing' }}
        onClick={() => {
          if (Math.abs(rawX.get()) < 6 && Math.abs(rawY.get()) < 6) {
            setIsOpen(!isOpen);
          }
        }}
        className="relative cursor-grab z-20 mt-4 [transform-style:preserve-3d]"
      >
        <motion.div
          animate={
            !isDragging && !isOpen
              ? {
                  y: [0, -6, 0, 6, 0],
                  rotateZ: [0, 1.2, 0, -1.2, 0],
                  rotateY: isFlipping ? [0, 360] : 0,
                }
              : { y: 0, rotateZ: 0, rotateY: 0 }
          }
          transition={{
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            rotateZ: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            rotateY: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
          }}
          className="w-[310px] h-[450px] rounded-2xl bg-[#1B1F24] border-2 border-[#2F353E] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative text-white overflow-hidden [transform-style:preserve-3d]"
        >
          {/* Lubang Klip Kartu Atas Presisi di Tengah */}
          <div className="w-12 h-2.5 mx-auto mt-3 rounded-full bg-[#121417] border border-[#2F353E] z-40 relative shadow-inner" />

          {/* ======================================================== */}
          {/* TAMPILAN DALAM: KARTU AKADEMIK PERSIS GAMBAR             */}
          {/* ======================================================== */}
          <div className="p-4 pt-2 flex flex-col justify-between h-[410px] bg-gradient-to-b from-[#1C2026] via-[#171A1E] to-[#121417]">
            {/* Header Mini Kartu */}
            <div className="flex items-center justify-between text-[9px] font-mono font-bold text-gray-400 tracking-wider uppercase px-1">
              <span>KARTU AKADEMIK</span>
              <span>UPTT</span>
            </div>

            {/* Banner Kuning Universitas */}
            <div className="mt-2 bg-[#F5B301] text-[#1E2328] py-2 px-3 rounded-lg text-center shadow-md">
              <h4 className="text-[11px] font-black font-sora leading-tight uppercase tracking-tight">
                {data?.university || 'UNIVERSITAS PAHLAWAN TUANKU TAMBUSAI'}
              </h4>
            </div>

            {/* Sub-header Jurusan & Fakultas */}
            <div className="text-center text-[9px] font-mono text-gray-400 uppercase tracking-wider mt-1">
              {data?.faculty || 'FAKULTAS TEKNIK'} • {data?.fullTitle || data?.major || 'S1 TEKNIK INFORMATIKA'}
            </div>

            {/* Foto Profil Berbingkai Emas dengan Badge Verified */}
            <div className="my-auto flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl border-2 border-[#F5B301] overflow-hidden bg-[#242930] shadow-lg flex items-center justify-center">
                  {data?.avatar || data?.avatarUrl ? (
                    <img
                      src={data.avatar || data.avatarUrl}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-[#F5B301]">CN</span>
                  )}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-[#1B1F24] p-1 rounded-full border border-[#2F353E] shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#F5B301]" />
                </div>
              </div>

              {/* Nama & Gelar di Bawah Foto */}
              <h3 className="text-base font-bold font-sora text-white mt-2.5 leading-tight">
                {data?.name || 'Catur Nurul Huda'}
              </h3>

              <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#242930] border border-[#2F353E] text-[10px] text-[#F5B301] font-mono">
                <Award className="w-3 h-3 text-[#F5B301]" />
                <span>Teknik Informatika, {data?.degree || 'S.Kom'}</span>
              </div>
            </div>

            {/* Rincian Bawah (NIM & Status) */}
            <div className="grid grid-cols-2 gap-2 text-left pt-2 px-1">
              <div>
                <span className="text-[9px] text-gray-500 font-mono block">NIM</span>
                <span className="text-xs font-mono font-bold text-gray-200">
                  {data?.nim || data?.studentId || '210401088'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono block">STATUS</span>
                <span className="text-xs font-semibold text-gray-200 leading-tight block">
                  {data?.status || 'Tugas Akhir / Alumni S.Kom'}
                </span>
              </div>
            </div>

            {/* Garis Aksen Gradien Bawah */}
            <div className="mt-2 h-1 w-full rounded-full bg-gradient-to-r from-transparent via-[#F5B301] to-transparent opacity-80" />
          </div>

          {/* ======================================================== */}
          {/* GERBANG LEGO DEPAN KIRI (FOTO UTUH TANPA GARIS PEMISAH)  */}
          {/* ======================================================== */}
          <motion.div
            initial={false}
            animate={{ x: isOpen ? '-102%' : '0%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="absolute inset-y-0 left-0 w-[50.5%] z-30 overflow-hidden"
          >
            <div className="absolute inset-0 w-[310px] h-full">
              {data?.avatar || data?.avatarUrl ? (
                <img
                  src={data?.avatar || data?.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-[#20252B] flex items-center justify-center">
                  <span className="text-5xl font-black text-[#F5B301]">CN</span>
                </div>
              )}
            </div>

            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10">
              <div className="grid grid-cols-2 gap-2 opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-white/20 border border-white/30 shadow-md backdrop-blur-[0.5px]"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* GERBANG LEGO DEPAN KANAN (FOTO UTUH TANPA GARIS PEMISAH) */}
          {/* ======================================================== */}
          <motion.div
            initial={false}
            animate={{ x: isOpen ? '102%' : '0%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="absolute inset-y-0 right-0 w-[50.5%] z-30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[310px] h-full">
              {data?.avatar || data?.avatarUrl ? (
                <img
                  src={data?.avatar || data?.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-[#20252B] flex items-center justify-center">
                  <span className="text-5xl font-black text-[#F5B301]">CN</span>
                </div>
              )}
            </div>

            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10">
              <div className="grid grid-cols-2 gap-2 opacity-40 justify-end ml-auto">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-white/20 border border-white/30 shadow-md backdrop-blur-[0.5px]"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Label Panduan Bawah */}
          <div className="absolute bottom-2.5 inset-x-0 text-center z-40 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-gray-300 font-mono border border-white/10 shadow-sm">
              {isOpen ? 'Klik untuk Tutup' : 'Klik untuk Buka Biodata'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};