import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPublicProfile } from '@/api/profileApi';
import { getJobs } from '@/api/jobApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, MapPin, Globe, Building2, Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const CompanyPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [profileData, jobsData] = await Promise.all([
        getPublicProfile(id),
        getJobs({ company: id }) // This requires the getJobs API to handle company filter
      ]);

      setCompany(profileData.data);
      // Filter jobs from this company if the backend didn't do it correctly
      // (My backend getJobs actually handles category/type but I should add company filter)
      setJobs(jobsData.data.filter(job => job.company._id === id));
    } catch (err) {
      setError('Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Đang tải hồ sơ công ty...</p>
    </div>
  );

  if (error || !company) return (
    <div className="container mx-auto p-10 text-center">
      <Alert variant="destructive" className="max-w-md mx-auto mb-6"><AlertDescription>{error || 'Không tìm thấy công ty'}</AlertDescription></Alert>
      <Button onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Trang chủ</Button>
    </div>
  );

  const profile = company.companyProfile;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b relative">
        <div className="h-48 bg-gradient-to-r from-[#000000] via-[#0b1219] to-[#152331]"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-8 space-y-4 md:space-y-0 md:space-x-8">
            <div className="h-32 w-32 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
              {profile?.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="h-16 w-16 text-gray-200" />
              )}
            </div>
            <div className="pb-2 space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.companyName || company.fullName}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                {profile?.location && <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {profile.location}</div>}
                {profile?.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                    <Globe className="h-4 w-4 mr-1.5" /> {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" /> {jobs.length} Vị trí đang tuyển</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: About */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Về {profile?.companyName || company.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                {profile?.description || 'Công ty chưa cập nhật mô tả.'}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 px-1">Vị trí đang tuyển</h2>
            {jobs.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <p className="text-gray-500">Hiện chưa có vị trí nào đang tuyển.</p>
              </Card>
            ) : (
              jobs.map(job => (
                <Card key={job._id} className="hover:shadow-md transition-shadow group">
                  <Link to={`/jobs/${job._id}`}>
                    <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <h3 className="text-lg font-black text-black group-hover:text-blue-600 transition-colors leading-tight truncate">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 font-bold">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none px-2 py-0 h-5 text-[10px] uppercase font-black">
                            {job.type === 'Internship' ? 'Thực tập' : job.type}
                          </Badge>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </div>
                          <span className="hidden sm:inline text-gray-300">•</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {job.salaryRange}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-fit text-blue-600 font-bold hover:bg-blue-50 -ml-2 sm:ml-0">
                        Chi tiết <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div className="lg:col-span-4">
          <Card className="border-none shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle>Thông tin nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Lĩnh vực</span>
                <span className="font-medium text-sm">Công nghệ & Phần mềm</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Công việc đang tuyển</span>
                <span className="font-medium text-sm">{jobs.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Thành viên từ</span>
                <span className="font-medium text-sm">{new Date(company.createdAt).getFullYear()}</span>
              </div>
              <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                <a href={profile?.website} target="_blank" rel="noreferrer">
                  Trang web chính thức <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicProfile;
