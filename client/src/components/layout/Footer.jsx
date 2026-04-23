import React from 'react';
import { Link } from 'react-router-dom';
//import { Twitter, Linkedin, Globe, MessageSquare } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000000] text-[#888888] py-12 border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          {/* Logo & Status */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <span className="text-white font-black text-xl tracking-tighter">Hiretify</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_8px_#00ff00]"></div>
              <span className="text-[#888888]">Hệ thống hoạt động ổn định</span>
            </div>
          </div>

          {/* Links Grid */}
          <div>
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Nền tảng</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Tìm việc làm</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Khám phá công ty</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Bảng giá</Link></li>
              <li><Link to="/post-job" className="hover:text-white transition-colors">Đăng tin tuyển dụng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Tài nguyên</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/docs" className="hover:text-white transition-colors">Tài liệu hướng dẫn</Link></li>
              <li><Link to="/api" className="hover:text-white transition-colors">Tham chiếu API</Link></li>
              <li><Link to="/guides" className="hover:text-white transition-colors">Cẩm nang sự nghiệp</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Trung tâm hỗ trợ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Công ty</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog công ty</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Pháp lý</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Chính sách Cookie</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#333333] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-xs">
            <span className="text-[#666666]">© {currentYear} Hiretify Inc.</span>
            <div className="flex items-center gap-2">
              <span className="text-[#888888]">Tiếng Việt</span>
            </div>
          </div>

          {/* <div className="flex items-center gap-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="/chat" className="hover:text-white transition-colors">
              <MessageSquare className="h-5 w-5" />
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
