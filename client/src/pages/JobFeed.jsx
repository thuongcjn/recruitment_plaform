import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getJobs } from '@/api/jobApi';
import {
  Loader2,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const getTypeLabel = (type) => {
  switch (type) {
    case 'Internship': return 'Thực tập';
    case 'Part-time': return 'Bán thời gian';
    case 'Full-time': return 'Toàn thời gian';
    case 'Freelance': return 'Tự do';
    default: return type;
  }
};

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: 'All',
    category: 'All'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(filters);
      setJobs(data.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-[#F1F2F4]">
      {/* Top Banner Area */}
      <div className="bg-white border-b py-6 px-4 md:px-8 mb-6">
        <div className="container mx-auto max-w-7xl">
          <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
              <Input
                placeholder="Tìm kiếm công việc tiếp theo của bạn..."
                className="pl-12 h-14 bg-white border-gray-200 rounded-xl text-lg focus-visible:ring-black"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-10 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all">
              Tìm kiếm
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 pb-20">

          {/* LEFT Sidebar: Filters */}
          <aside className="lg:w-1/4 space-y-6 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-black tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" /> Bộ lọc theo
                </h2>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-500 hover:text-black uppercase" onClick={() => setFilters({ keyword: '', location: '', type: 'All', category: 'All' })}>
                  Xóa tất cả
                </Button>
              </div>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-black uppercase tracking-widest">Hình thức làm việc</Label>
                    <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                      <SelectTrigger className="h-11 border-gray-200 focus:ring-black rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Tất cả</SelectItem>
                        <SelectItem value="Internship">Thực tập</SelectItem>
                        <SelectItem value="Part-time">Bán thời gian</SelectItem>
                        <SelectItem value="Full-time">Toàn thời gian</SelectItem>
                        <SelectItem value="Freelance">Tự do</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-black text-black uppercase tracking-widest">Lĩnh vực</Label>
                    <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
                      <SelectTrigger className="h-11 border-gray-200 focus:ring-black rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Tất cả lĩnh vực</SelectItem>
                        <SelectItem value="IT & Software">CNTT & Phần mềm</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Design">Thiết kế</SelectItem>
                        <SelectItem value="Finance">Tài chính</SelectItem>
                        <SelectItem value="Others">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full h-11 bg-black hover:bg-gray-800 text-white font-bold rounded-xl mt-4" onClick={fetchJobs}>
                    Áp dụng bộ lọc
                  </Button>
                </CardContent>
              </Card>

              {/* Promo Card */}
              <Card className="bg-black text-white border-none rounded-2xl p-6 overflow-hidden relative">
                <div className="relative z-10 space-y-4">
                  <h3 className="font-black text-lg">Tăng khả năng hiển thị</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Tăng cơ hội tiếp cận công việc phù hợp.</p>
                  <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-200 text-xs font-bold text-black">Nâng cấp hồ sơ</Button>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl"></div>
              </Card>
            </div>
          </aside>

          {/* RIGHT Content: Job List */}
          <section className="lg:w-3/4 space-y-4 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <h1 className="text-2xl font-black text-black tracking-tight">Việc làm gợi ý</h1>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-white rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin h-10 w-10 text-black" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Đang tìm việc làm...</p>
              </div>
            ) : jobs.length === 0 ? (
              <Card className="p-20 text-center border-dashed border-gray-200 rounded-2xl bg-white">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Không tìm thấy việc làm phù hợp.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card key={job._id} className="group hover:border-black transition-all cursor-pointer border-gray-200 shadow-none rounded-2xl bg-white relative">
                    <Link to={`/jobs/${job._id}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-bold text-black group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-tight">
                              <span className="text-black">{getTypeLabel(job.type)}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span>Mức lương: <span className="text-black">{job.salaryRange || 'Thỏa thuận'}</span></span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-black border border-gray-100">
                            {job.company?.companyProfile?.logoUrl ? (
                              <img src={job.company.companyProfile.logoUrl} alt="logo" className="w-full h-full object-contain p-1 rounded-xl" />
                            ) : (
                              <Building2 className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-[15px] text-gray-700 line-clamp-2 leading-relaxed font-medium">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {(job.requirements || ['React', 'TypeScript', 'Node.js']).slice(0, 5).map(skill => (
                            <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-bold text-[10px] uppercase rounded-full border-none">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="font-bold text-black group-hover:translate-x-1 transition-transform">
                            Chi tiết <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default JobFeed;
