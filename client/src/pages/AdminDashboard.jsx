import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, Users, Briefcase, Flag, CheckCircle, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  ShieldCheck, FileText, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue, color }) => (
  <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
    <CardContent className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:rotate-12`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <Badge variant="outline" className={`rounded-full px-2 py-0 border-none font-black text-[10px] uppercase flex items-center gap-1 ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trendValue}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
        <p className="text-4xl font-black text-black tracking-tighter">{value}</p>
        <p className="text-xs font-medium text-gray-500">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getDashboardStats();
        setData(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-black" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu quản trị...</p>
    </div>
  );

  const { stats, latestReports } = data;

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest mb-2 shadow-lg shadow-gray-200">
              <ShieldCheck className="h-3 w-3 mr-2" /> Quản trị viên hệ thống
            </div>
            <h1 className="text-5xl font-black text-black tracking-tighter">Bảng điều khiển</h1>
            <p className="text-gray-500 font-medium">Tổng quan thời gian thực về hệ sinh thái tuyển dụng của bạn.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6 border-gray-200 hover:bg-gray-50 transition-all">
              <Link to="/admin/users">Quản lý người dùng</Link>
            </Button>
            <Button asChild className="rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6 bg-black hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all active:scale-95">
              <Link to="/admin/reports">Xem báo cáo</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard 
            title="Tổng người dùng" 
            value={stats.totalUsers} 
            icon={Users} 
            description={`${stats.candidatesCount} Ứng viên, ${stats.recruitersCount} Nhà tuyển dụng`}
            trend="up"
            trendValue="+12%"
            color="bg-blue-600"
          />
          <StatCard 
            title="Việc làm đang mở" 
            value={stats.totalJobs} 
            icon={Briefcase} 
            description="Trên tất cả các danh mục"
            trend="up"
            trendValue="+5%"
            color="bg-purple-600"
          />
          <StatCard 
            title="Đơn ứng tuyển" 
            value={stats.totalApplications} 
            icon={FileText} 
            description="Đã nộp trong tháng này"
            trend="up"
            trendValue="+24%"
            color="bg-green-600"
          />
          <StatCard 
            title="Báo cáo chờ xử lý" 
            value={stats.totalReports} 
            icon={Flag} 
            description="Yêu cầu bạn xem xét"
            trend={stats.totalReports > 10 ? 'up' : 'down'}
            trendValue={stats.totalReports > 10 ? 'Khẩn cấp' : 'Thấp'}
            color="bg-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Reports Section */}
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between bg-white">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight">Báo cáo tuyển dụng gần đây</CardTitle>
                <CardDescription className="font-medium">Nội dung bị báo cáo cần xem xét mới nhất.</CardDescription>
              </div>
              <Button asChild variant="ghost" className="rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-50 px-4">
                <Link to="/admin/reports">Xem tất cả báo cáo</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {latestReports.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-500 mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <p className="font-black text-black">Không có báo cáo nào đang chờ!</p>
                  <p className="text-gray-400 text-sm font-medium">Hệ sinh thái của bạn hiện đang ổn định.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {latestReports.map((report) => (
                    <div key={report._id} className="p-8 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                          <Flag className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-black group-hover:text-red-600 transition-colors">
                            {report.jobId?.title || 'Job Deleted'}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0 border-gray-200 text-gray-400">
                              Báo cáo bởi {report.reporterId?.fullName || 'Người dùng'}
                            </Badge>
                            <span className="text-[10px] text-gray-400 font-bold">•</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild size="sm" className="rounded-xl bg-black hover:bg-gray-800 font-bold text-xs px-4 h-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to="/admin/reports">Xem xét</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Distribution / Mini Info */}
          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-black tracking-tight">Phân bổ người dùng</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ứng viên</p>
                  <p className="text-xl font-black text-black">{stats.candidatesCount}</p>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full shadow-lg shadow-blue-100" 
                    style={{ width: `${(stats.candidatesCount / stats.totalUsers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhà tuyển dụng</p>
                  <p className="text-xl font-black text-black">{stats.recruitersCount}</p>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full shadow-lg shadow-purple-100" 
                    style={{ width: `${(stats.recruitersCount / stats.totalUsers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-black uppercase tracking-tight">Tăng trưởng tích cực</p>
                    <p className="text-[10px] text-gray-400 font-bold">Hoạt động trên nền tảng ổn định</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-black uppercase tracking-tight">Trạng thái hệ thống</p>
                    <p className="text-[10px] text-gray-400 font-bold">Tất cả dịch vụ đang hoạt động</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
