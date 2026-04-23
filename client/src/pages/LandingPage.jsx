import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Briefcase, Search, MessageSquare, Bell, Building2, ClipboardCheck,
  ArrowRight, ChevronRight, Star, Sparkles, Users, FileText, Zap,
  Shield, Globe, TrendingUp
} from 'lucide-react';
import '@/styles/landing.css';

// Animated counter hook
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return [count, setStarted];
};

// Intersection Observer hook
const useFadeIn = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const FEATURES = [
  {
    icon: Search,
    title: 'Gợi ý việc làm thông minh',
    desc: 'Thuật toán AI kết nối bạn với những cơ hội phù hợp nhất dựa trên kỹ năng và sở thích của bạn.'
  },
  {
    icon: MessageSquare,
    title: 'Trò chuyện trực tiếp',
    desc: 'Kết nối trực tiếp với nhà tuyển dụng qua hệ thống tin nhắn tích hợp. Không còn phải chờ đợi email.'
  },
  {
    icon: FileText,
    title: 'Quản lý hồ sơ (CV)',
    desc: 'Tải lên và quản lý CV chỉ với một cú nhấp chuột. Ứng tuyển tức thì không cần nhập lại thông tin.'
  },
  {
    icon: Bell,
    title: 'Thông báo tức thời',
    desc: 'Nhận thông báo email thời gian thực khi trạng thái ứng tuyển thay đổi hoặc có tin nhắn mới.'
  },
  {
    icon: Building2,
    title: 'Hồ sơ công ty',
    desc: 'Khám phá các trang công ty chi tiết với mô tả, danh sách việc làm và văn hóa nhóm trước khi ứng tuyển.'
  },
  {
    icon: ClipboardCheck,
    title: 'Theo dõi ứng tuyển',
    desc: 'Theo dõi mọi đơn ứng tuyển từ khi nộp đến khi có kết quả. Nắm bắt trạng thái mọi lúc.'
  }
];

const STEPS = [
  { num: '01', title: 'Tạo hồ sơ của bạn', desc: 'Đăng ký và xây dựng hồ sơ chuyên nghiệp với kỹ năng, kinh nghiệm và tải lên CV.' },
  { num: '02', title: 'Khám phá cơ hội', desc: 'Duyệt các tin tuyển dụng được chọn lọc, lọc theo lĩnh vực, địa điểm và mức lương.' },
  { num: '03', title: 'Được nhận việc', desc: 'Ứng tuyển chỉ với một cú nhấp chuột, trò chuyện với nhà tuyển dụng và nhận công việc mơ ước.' }
];

const TESTIMONIALS = [
  {
    name: 'Nguyễn Minh Anh',
    role: 'Thực tập sinh Kỹ sư Phần mềm',
    quote: 'Hiretify giúp mình tìm được công việc thực tập đầu tiên chỉ trong 2 tuần. Trò chuyện trực tiếp với nhà tuyển dụng giúp quy trình chuyên nghiệp hơn rất nhiều.',
    rating: 5
  },
  {
    name: 'Trần Đức Huy',
    role: 'Quản lý HR, TechCorp',
    quote: 'Với tư cách là nhà tuyển dụng, bảng điều khiển cung cấp mọi thứ tôi cần. Việc theo dõi ứng viên và quản lý hồ sơ vô cùng trực quan.',
    rating: 5
  },
  {
    name: 'Lê Thị Hồng',
    role: 'Cử nhân Marketing',
    quote: 'Tôi thích giao diện hiện đại và sạch sẽ của trang web. Ứng tuyển việc làm chưa bao giờ dễ dàng đến thế. Rất khuyên dùng cho các bạn sinh viên!',
    rating: 5
  }
];

const LOGOS = ['TechCorp', 'InnovateLab', 'FutureHQ', 'NexGen', 'CloudBase', 'DataFlow', 'CodeShift', 'PixelForge'];

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [jobCount, setJobCountStarted] = useCounter(1200);
  const [appCount, setAppCountStarted] = useCounter(5800);
  const [companyCount, setCompanyCountStarted] = useCounter(340);

  const featuresRef = useFadeIn();
  const stepsRef = useFadeIn();
  const previewRef = useFadeIn();
  const testimonialsRef = useFadeIn();

  // Start counters when hero is visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobCountStarted(true);
      setAppCountStarted(true);
      setCompanyCountStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter">
            Hiretify<span className="text-blue-400">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Quy trình</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Đánh giá</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/jobs"
                className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đến Bảng điều khiển
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 landing-grid-bg">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-gray-300 uppercase tracking-widest mb-8">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Nền tảng Tuyển dụng dành cho Sinh viên
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            Tìm Công Việc
            <br />
            <span className="landing-gradient-text">Mơ Ước.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Hiretify kết nối sinh viên tài năng với các công ty hàng đầu.
            Xây dựng hồ sơ, khám phá cơ hội và bắt đầu sự nghiệp của bạn — tất cả tại một nơi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="landing-glow-btn px-8 py-4 bg-white text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2"
            >
              Bắt đầu miễn phí <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2"
            >
              Khám phá việc làm <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="landing-stat text-center">
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{jobCount.toLocaleString()}+</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tin tuyển dụng</p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <div className="landing-stat text-center" style={{ animationDelay: '0.2s' }}>
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{appCount.toLocaleString()}+</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Đơn ứng tuyển</p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <div className="landing-stat text-center" style={{ animationDelay: '0.4s' }}>
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{companyCount.toLocaleString()}+</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Công ty</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-8">
          Được tin dùng bởi các công ty hàng đầu
        </p>
        <div className="relative landing-no-scrollbar">
          <div className="flex items-center gap-16 landing-logo-scroll" style={{ width: 'max-content' }}>
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <span
                key={i}
                className="text-lg font-black text-gray-700 tracking-tight whitespace-nowrap select-none"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES BENTO GRID ===== */}
      <section id="features" className="py-24 md:py-32 landing-fade-in" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              <Zap className="h-3 w-3 text-yellow-400" /> Tính năng
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Mọi thứ bạn cần.
            </h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Bộ công cụ hoàn chỉnh để tối ưu hóa quy trình tìm việc hoặc tuyển dụng của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div key={i} className="landing-feature-card rounded-2xl p-8 bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-5">
                  <feature.icon className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 md:py-32 border-y border-white/5 landing-fade-in" ref={stepsRef}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              <Globe className="h-3 w-3 text-blue-400" /> Quy trình
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Ba bước để thành công.
            </h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Từ lúc đăng ký đến khi được nhận việc, nền tảng của chúng tôi giúp mọi thứ trở nên liền mạch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative text-center md:text-left">
                <p className="text-6xl font-black text-white/5 mb-4 tracking-tighter">{step.num}</p>
                <h3 className="text-xl font-black text-white tracking-tight mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-px landing-step-line" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLATFORM PREVIEW ===== */}
      <section className="py-24 md:py-32 relative landing-fade-in" ref={previewRef}>
        <div className="absolute inset-0 landing-preview-glow pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Thiết kế cho sự hiệu quả.
            </h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Giao diện sạch sẽ, trực quan giúp bạn tập trung vào những điều quan trọng nhất.
            </p>
          </div>

          <div className="relative landing-float">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden p-1">
              <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black p-8 md:p-12">
                {/* Mock UI */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="ml-4 flex-1 h-6 bg-white/5 rounded-full max-w-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sidebar mock */}
                  <div className="space-y-3">
                    <div className="h-10 bg-white/5 rounded-lg" />
                    <div className="h-8 bg-white/[0.03] rounded-lg" />
                    <div className="h-8 bg-white/[0.03] rounded-lg" />
                    <div className="h-8 bg-white/[0.03] rounded-lg" />
                    <div className="h-24 bg-white/[0.02] rounded-lg mt-4" />
                  </div>
                  {/* Content mock */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="h-12 bg-white/5 rounded-lg w-3/4" />
                    <div className="space-y-2">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="p-4 bg-white/[0.03] rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="h-5 bg-white/10 rounded w-1/3" />
                            <div className="h-5 bg-blue-500/20 rounded-full w-16" />
                          </div>
                          <div className="h-3 bg-white/5 rounded w-full" />
                          <div className="h-3 bg-white/5 rounded w-2/3" />
                          <div className="flex gap-2 pt-1">
                            <div className="h-5 bg-white/5 rounded-full w-14" />
                            <div className="h-5 bg-white/5 rounded-full w-14" />
                            <div className="h-5 bg-white/5 rounded-full w-14" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 md:py-32 border-t border-white/5 landing-fade-in" ref={testimonialsRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              <Users className="h-3 w-3 text-green-400" /> Đánh giá
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Được người dùng tin yêu.
            </h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Lắng nghe những chia sẻ từ sinh viên và nhà tuyển dụng về Hiretify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="landing-testimonial rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 landing-star fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-black text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 md:py-32 relative landing-cta-glow">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Sẵn sàng để bắt đầu
            <br />
            <span className="landing-gradient-text">hành trình của bạn?</span>
          </h2>
          <p className="text-gray-400 font-medium max-w-lg mx-auto mb-10">
            Tham gia cùng hàng ngàn sinh viên và công ty đang sử dụng Hiretify 
            để xây dựng lực lượng lao động tương lai.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="landing-glow-btn px-8 py-4 bg-white text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2"
            >
              Đăng ký miễn phí <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Khám phá việc làm
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
