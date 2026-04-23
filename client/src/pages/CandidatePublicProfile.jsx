import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPublicProfile } from '@/api/profileApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, GraduationCap, Briefcase, User, Mail, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const CandidatePublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await getPublicProfile(id);
      setCandidate(response.data);
    } catch (err) {
      setError('Failed to fetch candidate details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Đang tải hồ sơ ứng viên...</p>
    </div>
  );
  
  if (error || !candidate) return (
    <div className="container mx-auto p-10 text-center">
      <Alert variant="destructive" className="max-w-md mx-auto mb-6"><AlertDescription>{error || 'Không tìm thấy ứng viên'}</AlertDescription></Alert>
      <Button onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" /> Quay lại</Button>
    </div>
  );

  const profile = candidate.candidateProfile || {};

  return (
    <div className="min-h-screen bg-[#F1F2F4] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-black font-bold flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="mb-10 border-none shadow-xl overflow-hidden bg-white rounded-[2rem]">
          <div className="h-40 bg-gradient-to-r from-[#000000] via-[#0b1219] to-[#152331] relative">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
          </div>
          <div className="px-6 md:px-10 pb-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group -mt-20">
                <Avatar className="h-40 w-40 border-[6px] border-white shadow-2xl rounded-[2.5rem]">
                  <AvatarImage src={profile.profilePicture} className="object-cover" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-4xl font-black">
                    {candidate.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">{candidate.fullName}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    {candidate.role}
                  </span>
                  <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <Mail className="h-3 w-3 mr-1" /> {candidate.email}
                  </div>
                </div>
              </div>

              {profile.resumeUrl && (
                <div className="w-full md:w-auto mt-6 md:mt-0">
                  <Button asChild className="w-full md:w-auto bg-black hover:bg-gray-800 text-white rounded-2xl px-8 py-6 font-black shadow-xl">
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                      <FileText className="mr-2 h-5 w-5" /> Tải xuống CV
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Bio */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-2xl text-black">
                    <User className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Giới thiệu bản thân</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                  {profile.bio || "Chưa có thông tin giới thiệu."}
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-2xl text-black">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">Kinh nghiệm làm việc</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {(!profile.experience || profile.experience.length === 0) ? (
                  <p className="text-gray-400 italic">Chưa có kinh nghiệm làm việc.</p>
                ) : (
                  profile.experience.map((exp, index) => (
                    <div key={index} className="flex gap-6 pb-8 border-b last:border-0 border-gray-50">
                      <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Briefcase className="h-6 w-6 text-gray-300" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900">{exp.position}</h3>
                        <div className="flex items-center gap-3 text-sm font-bold">
                          <span className="text-blue-600">{exp.company}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-gray-600 mt-4 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Skills */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-2xl text-black">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight">Kỹ năng</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Badge key={index} className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">Chưa có kỹ năng.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-2xl text-black">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-black tracking-tight">Học vấn</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                {(!profile.education || profile.education.length === 0) ? (
                  <p className="text-gray-400 italic">Chưa có thông tin học vấn.</p>
                ) : (
                  profile.education.map((edu, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-black text-gray-900">{edu.school}</h4>
                      <p className="text-sm font-bold text-gray-500">{edu.degree}</p>
                      <p className="text-xs font-black text-amber-600 uppercase tracking-widest">{edu.year}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePublicProfile;
