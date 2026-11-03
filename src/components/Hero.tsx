import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Lenis from 'lenis';
import { usePortfolio } from '../context/PortfolioContext';
import { LanyardCard } from './LanyardCard';
import { ArrowRight, Download, MapPin, Building2, ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const heroRef = useRef<HTMLElement>(null);

  // 1. Inisialisasi Smooth Scroll Sinematik Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // 2. Hubungkan Progres Scroll ke Animasi Fisika
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Efek Parallax Sinematik: Kolom Teks bergeser pelan ke atas & memudar halus
  const textY = useTransform(smoothProgress, [0, 1], [0, -70]);
  const textOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0.2]);

  // Efek Parallax Kartu Lanyard: Mengikuti scroll dengan sedikit scale-up dan elevasi
  const cardY = useTransform(smoothProgress, [0, 1], [0, 45]);
  const cardScale = useTransform(smoothProgress, [0, 1], [1, 1.04]);

  // Efek Cahaya Latar Ambient
  const bgLightScale = useTransform(smoothProgress, [0, 1], [1, 1.5]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-[#171A1D] selection:bg-[#F5B301] selection:text-[#1E2328]"
    >
      {/* Background Ambient Lights Sinematik */}
      <motion.div
        style={{ scale: bgLightScale }}
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F5B301]/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ scale: bgLightScale }}
        className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#FCD053]/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* ======================================================== */}
          {/* KOLOM KIRI: TEKS HERO SESUAI POSISI ASLI                 */}
          {/* ======================================================== */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Badge Status */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20252B] border border-[#2B3038] text-xs font-semibold text-[#F5B301] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F5B301] animate-pulse" />
              <span>
                {personalInfo?.fullTitle || personalInfo?.major || 'S1 Teknik Informatika'} • {personalInfo?.degree || 'S.Kom'}
              </span>
            </div>

            {/* Nama & Gelar Besar */}
            <div>
              <h1 className="text-4xl sm:text-6xl font-black font-sora text-white tracking-tight leading-tight">
                {personalInfo?.name ? personalInfo.name.split(' ')[0] : 'Catur'}{' '}
                <span className="text-[#F5B301]">
                  {personalInfo?.name ? personalInfo.name.split(' ').slice(1).join(' ') : 'Nurul Huda'}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold font-sora text-gray-200 mt-2">
                {personalInfo?.role || 'Software, Web & IoT Developer'}
              </p>
            </div>

            {/* Universitas & Domisili */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-2 bg-[#20252B] border border-[#2B3038] px-3.5 py-2 rounded-xl shadow-sm">
                <Building2 className="w-4 h-4 text-[#F5B301]" />
                <span>{personalInfo?.university || 'Universitas Pahlawan Tuanku Tambusai'}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#20252B] border border-[#2B3038] px-3.5 py-2 rounded-xl shadow-sm">
                <MapPin className="w-4 h-4 text-[#F5B301]" />
                <span>{personalInfo?.location || 'Kampar, Riau, Indonesia'}</span>
              </div>
            </div>

            {/* Bio Deskripsi */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal max-w-2xl">
              {personalInfo?.bio ||
                'Halo, saya Catur Nurul Huda — Mahasiswa S1 Teknik Informatika, Fakultas Teknik, Universitas Pahlawan Tuanku Tambusai. Saya tertarik membangun aplikasi web, sistem IoT, dan software yang bermanfaat dengan antarmuka yang bersih, intuitif, dan responsif.'}
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo('#projects')}
                className="px-6 py-3.5 rounded-xl bg-[#F5B301] hover:bg-[#FCD053] text-[#1E2328] font-sora font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[#F5B301]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Lihat Proyek Saya</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('#contact')}
                className="px-6 py-3.5 rounded-xl bg-[#20252B] hover:bg-[#2A3038] text-white font-sora font-bold text-xs sm:text-sm border border-[#2B3038] hover:border-[#F5B301] transition-all duration-200 flex items-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Hubungi Saya</span>
              </button>

              <a
                href={personalInfo?.cvUrl || '#'}
                target={personalInfo?.cvUrl ? '_blank' : '_self'}
                rel="noreferrer"
                onClick={(e) => {
                  if (!personalInfo?.cvUrl) {
                    e.preventDefault();
                    alert(`CV ${personalInfo?.name || 'Catur Nurul Huda'} disimulasikan siap diunduh!`);
                  }
                }}
                className="p-3.5 rounded-xl bg-[#20252B] hover:bg-[#2A3038] text-gray-300 hover:text-[#F5B301] border border-[#2B3038] transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                title="Unduh CV"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>

            {/* Kotak Metrik 3 Angka */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-[#2B3038]">
              <div className="bg-[#20252B] p-4 rounded-2xl border border-[#2B3038] shadow-sm">
                <div className="text-xl sm:text-2xl font-black font-sora text-[#F5B301]">
                  {personalInfo?.gpa || '3.82'}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">IPK Kumulatif</div>
              </div>
              <div className="bg-[#20252B] p-4 rounded-2xl border border-[#2B3038] shadow-sm">
                <div className="text-xl sm:text-2xl font-black font-sora text-[#F5B301]">
                  {personalInfo?.projectCount || '5+'}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Proyek Terdaftar</div>
              </div>
              <div className="bg-[#20252B] p-4 rounded-2xl border border-[#2B3038] shadow-sm">
                <div className="text-xl sm:text-2xl font-black font-sora text-[#F5B301]">100%</div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Dedikasi Kode</div>
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* KOLOM KANAN: KARTU LANYARD DENGAN PARALLAX SINEMATIK    */}
          {/* ======================================================== */}
          <motion.div
            style={{ y: cardY, scale: cardScale }}
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative pt-6 lg:pt-0"
          >
            {/* Reticle / Lingkaran Sinematik Halus di Belakang Lanyard */}
            <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-white/5 pointer-events-none flex items-center justify-center -top-4">
              <div className="w-[85%] h-[85%] rounded-full border border-dashed border-[#F5B301]/20 animate-[spin_90s_linear_infinite]" />
            </div>

            <LanyardCard />
          </motion.div>

        </div>
      </div>
    </section>
  );
};