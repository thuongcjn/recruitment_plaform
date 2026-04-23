import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMyJobs, deleteJob, getRecruiterStats, updateJob } from '@/api/jobApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, Plus, Edit, Trash2, Eye, Calendar, 
  MapPin, Users, Activity, CreditCard, 
  DollarSign, ArrowUpRight, Search,
  MoreHorizontal, Briefcase, CheckCircle2, XCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const getTypeLabel = (type) => {
  switch (type) {
    case 'Internship': return 'Thực tập';
    case 'Part-time': return 'Bán thời gian';
    case 'Full-time': return 'Toàn thời gian';
    case 'Freelance': return 'Tự do';
    default: return type;
  }
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplicants: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [jobsData, statsData] = await Promise.all([
        getMyJobs(),
        getRecruiterStats()
      ]);
      setJobs(jobsData.data);
      setStats(statsData.data);
    } catch (err) {
      setError('Không thể tải dữ liệu bảng điều khiển');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này không?')) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
      // Refresh stats
      const statsData = await getRecruiterStats();
      setStats(statsData.data);
      setSuccess('Đã xóa tin tuyển dụng thành công');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Xóa tin tuyển dụng thất bại');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await updateJob(id, { status: newStatus });
      setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));
      // Refresh stats
      const statsData = await getRecruiterStats();
      setStats(statsData.data);
    } catch (err) {
      setError('Cập nhật trạng thái thất bại');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-black" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang tải bảng điều khiển...</p>
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-[#F1F2F4] min-h-screen">
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Tổng tin đăng</CardTitle>
            <Briefcase className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">{stats.totalJobs}</div>
            <p className="text-xs text-gray-400 font-bold mt-1">TẤT CẢ THỜI GIAN</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Đang hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">{stats.activeJobs}</div>
            <p className="text-xs text-green-600 font-bold mt-1">ĐANG HIỂN THỊ</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Tổng ứng viên</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">{stats.totalApplicants}</div>
            <p className="text-xs text-blue-600 font-bold mt-1">LƯỢT QUAN TÂM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center bg-white border-b p-6">
            <div className="grid gap-1">
              <CardTitle className="text-xl font-black text-black">Quản lý tin tuyển dụng</CardTitle>
              <CardDescription className="font-medium">Theo dõi và cập nhật các tin tuyển dụng của bạn.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-2 bg-black hover:bg-gray-800 text-white rounded-xl px-6 font-bold">
              <Link to="/post-job">
                <Plus className="h-4 w-4" />
                Đăng tin mới
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {jobs.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-sm">Bạn chưa đăng tin tuyển dụng nào.</div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="border-none">
                    <TableHead className="font-black text-black uppercase tracking-tighter text-xs p-6">Chi tiết công việc</TableHead>
                    <TableHead className="hidden sm:table-cell font-black text-black uppercase tracking-tighter text-xs">Ứng viên</TableHead>
                    <TableHead className="hidden sm:table-cell font-black text-black uppercase tracking-tighter text-xs text-center">Trạng thái</TableHead>
                    <TableHead className="hidden md:table-cell font-black text-black uppercase tracking-tighter text-xs">Ngày đăng</TableHead>
                    <TableHead className="text-right font-black text-black uppercase tracking-tighter text-xs p-6">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                      <TableCell className="p-6">
                        <div className="font-black text-black text-base">{job.title}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-tight flex items-center gap-2 mt-1">
                          {getTypeLabel(job.type)} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {job.location}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-black text-black">{job.applicantsCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-3">
                          <Switch 
                            checked={job.status === 'open'} 
                            onCheckedChange={() => handleToggleStatus(job._id, job.status)}
                          />
                          <Badge className={job.status === 'open' ? 'bg-green-50 text-green-700 hover:bg-green-50 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}>
                            {job.status === 'open' ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm font-bold text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right p-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-2xl border-gray-100">
                            <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-gray-400 p-2">Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-3">
                              <Link to={`/applicants/${job._id}`} className="flex items-center font-bold text-blue-600">
                                <Users className="mr-3 h-4 w-4" /> Xem ứng viên
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-3">
                              <Link to={`/jobs/${job._id}`} className="flex items-center font-bold">
                                <Eye className="mr-3 h-4 w-4" /> Xem trước
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-3">
                              <Link to={`/edit-job/${job._id}`} className="flex items-center font-bold">
                                <Edit className="mr-3 h-4 w-4" /> Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="rounded-lg cursor-pointer py-3 text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => handleDelete(job._id)}
                            >
                              <Trash2 className="mr-3 h-4 w-4" /> Xóa vĩnh viễn
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default MyJobs;
