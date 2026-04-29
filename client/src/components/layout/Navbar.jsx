import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  Briefcase, User, LogOut, ChevronDown,
  Settings, Bell, Menu, X, PlusCircle, Search as SearchIcon,
  MessageSquare, ShieldCheck, LayoutDashboard, Users, Flag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, isAuthenticated, handleLogout: storeLogout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await storeLogout();
      setMobileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to local logout if API fails
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b' : 'bg-transparent border-b border-transparent'
      }`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-8">

          {/* Logo & Main Nav */}
          <div className="flex items-center gap-10">
            <Link to={isAdmin ? "/admin/dashboard" : (isAuthenticated ? "/jobs" : "/")} className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tighter text-black uppercase">Hiretify {isAdmin && <span className="text-red-600">Admin</span>}</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {!isAdmin && (
                <>
                  <Link
                    to="/jobs"
                    className={`text-sm font-bold transition-all hover:text-black ${isActive('/jobs') || isActive('/') ? 'text-black' : 'text-gray-500'}`}
                  >
                    Tìm việc làm
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to="/chat"
                      className={`text-sm font-bold transition-all hover:text-black ${isActive('/chat') ? 'text-black' : 'text-gray-500'}`}
                    >
                      Tin nhắn
                    </Link>
                  )}
                </>
              )}

              {isAuthenticated && user?.role === 'candidate' && (
                <>
                  <Link
                    to="/applied-jobs"
                    className={`text-sm font-bold transition-all hover:text-black ${isActive('/applied-jobs') ? 'text-black' : 'text-gray-500'}`}
                  >
                    Việc đã ứng tuyển
                  </Link>
                  <Link
                    to="/cv-builder"
                    className={`text-sm font-bold transition-all hover:text-black ${isActive('/cv-builder') ? 'text-black' : 'text-gray-500'}`}
                  >
                    Tạo CV
                  </Link>
                </>
              )}

              {isAuthenticated && user?.role === 'recruiter' && (
                <>
                  <Link
                    to="/my-jobs"
                    className={`text-sm font-bold transition-all hover:text-black ${isActive('/my-jobs') ? 'text-black' : 'text-gray-500'}`}
                  >
                    Bảng điều khiển
                  </Link>
                  <Link
                    to="/post-job"
                    className={`text-sm font-bold transition-all hover:text-black ${isActive('/post-job') ? 'text-black' : 'text-gray-500'}`}
                  >
                    Đăng tin tuyển dụng
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`text-sm font-black flex items-center gap-2 transition-all ${isActive('/admin/dashboard') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    <LayoutDashboard className="h-4 w-4" /> Tổng quan
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`text-sm font-black flex items-center gap-2 transition-all ${isActive('/admin/users') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    <Users className="h-4 w-4" /> Người dùng
                  </Link>
                  <Link
                    to="/admin/reports"
                    className={`text-sm font-black flex items-center gap-2 transition-all ${isActive('/admin/reports') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    <Flag className="h-4 w-4" /> Báo cáo vi phạm
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {!isAdmin && (
                  <Button variant="ghost" size="icon" className="text-gray-500 rounded-full hover:bg-gray-100 hidden sm:flex">
                    <Bell className="h-5 w-5" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-2 pl-1 pr-2 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all">
                      <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="bg-black text-white text-xs font-black">
                          {user?.fullName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start leading-none">
                        <span className="text-xs font-black text-black">{user?.fullName}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {user?.role === 'candidate' ? 'Ứng viên' : 
                           user?.role === 'recruiter' ? 'Nhà tuyển dụng' : 'Quản trị viên'}
                        </span>
                      </div>
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 mt-2">
                    <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-gray-400 p-2">Cài đặt tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link to="/profile" className="flex items-center font-bold">
                        <User className="mr-3 h-4 w-4" /> Hồ sơ cá nhân
                      </Link>
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                        <Link to="/chat" className="flex items-center font-bold">
                          <MessageSquare className="mr-3 h-4 w-4" /> Tin nhắn
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50">
                        <Link to="/admin/dashboard" className="flex items-center font-bold">
                          <ShieldCheck className="mr-3 h-4 w-4" /> Quản trị viên
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link to="/settings" className="flex items-center font-bold">
                        <Settings className="mr-3 h-4 w-4" /> Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 font-bold"
                    >
                      <LogOut className="mr-3 h-4 w-4" /> Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-black rounded-full"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-black px-4">Đăng nhập</Link>
                <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-full px-6 font-bold text-sm shadow-md transition-all active:scale-95">
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b absolute w-full left-0 p-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4">
            {!isAdmin && (
              <>
                <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Tìm việc làm</Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Tin nhắn</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Tổng quan</Link>
                <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Người dùng</Link>
                <Link to="/admin/reports" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-red-600">Báo cáo</Link>
              </>
            )}
            {isAuthenticated && user?.role === 'candidate' && (
              <>
                <Link to="/applied-jobs" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Việc đã ứng tuyển</Link>
                <Link to="/cv-builder" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Tạo CV</Link>
              </>
            )}
            {isAuthenticated && user?.role === 'recruiter' && (
              <>
                <Link to="/my-jobs" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Bảng điều khiển</Link>
                <Link to="/post-job" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Đăng tin tuyển dụng</Link>
              </>
            )}
            <DropdownMenuSeparator />
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-black">Hồ sơ cá nhân</Link>
            <button onClick={handleLogout} className="text-lg font-black text-red-600 text-left">Đăng xuất</button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
