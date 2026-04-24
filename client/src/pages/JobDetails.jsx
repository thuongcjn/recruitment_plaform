import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getJob } from '@/api/jobApi';
import { applyToJob, getMyApplications } from '@/api/applicationApi';
import { sendMessage } from '@/api/chatApi';
import { createReport } from '@/api/reportApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2, ArrowLeft, MapPin, Briefcase, Clock, Building2,
  Globe, DollarSign, CheckCircle2, Flag, MessageCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reporting state
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'candidate') {
      checkIfApplied();
    }
  }, [id, isAuthenticated, user?.role]);

  useEffect(() => {
    if (job) {
      setChatMessage(`Xin chào, tôi quan tâm đến vị trí ${job.title}.`);
    }
  }, [job]);

  const fetchJobDetails = async () => {
    try {
      const data = await getJob(id);
      setJob(data.data);
    } catch (err) {
      setError('Không thể tải chi tiết công việc');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const data = await getMyApplications();
      const applied = data.data.some(app => app.job._id === id);
      setHasApplied(applied);
    } catch (err) {
      console.error('Error checking application status', err);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'candidate') {
      setError('Chỉ ứng viên mới có thể ứng tuyển việc làm');
      return;
    }

    if (!user.candidateProfile?.resumeUrl) {
      setError('Vui lòng tải lên CV trong hồ sơ cá nhân trước khi ứng tuyển');
      return;
    }

    setApplying(true);
    setError('');
    try {
      await applyToJob(id);
      setSuccess('Đã gửi đơn ứng tuyển thành công!');
      setHasApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi đơn ứng tuyển thất bại');
    } finally {
      setApplying(false);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!chatMessage.trim()) return;

    setStartingChat(true);
    try {
      const res = await sendMessage({
        receiverId: job.company._id,
        text: chatMessage
      });
      navigate(`/chat/${res.conversationId}`);
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Không thể bắt đầu cuộc hội thoại');
    } finally {
      setStartingChat(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;

    setReporting(true);
    try {
      await createReport({
        jobId: id,
        reason: reportReason
      });
      setSuccess('Đã báo cáo công việc thành công. Chúng tôi sẽ xem xét sớm nhất.');
      setReportReason('');
    } catch (err) {
      setError('Gửi báo cáo thất bại');
    } finally {
      setReporting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Đang tải chi tiết công việc...</p>
    </div>
  );

  if (error && !job) return (
    <div className="container mx-auto p-10">
      <Alert variant="destructive"><AlertDescription>{error || 'Không tìm thấy công việc'}</AlertDescription></Alert>
      <Button onClick={() => navigate('/')} className="mt-4"><ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-600 px-2 sm:px-4">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="outline" size="sm" className="hidden lg:flex">Chia sẻ</Button>

            {isAuthenticated && user?.role === 'candidate' && (
              <AlertDialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black text-black hover:bg-black hover:text-white px-2 sm:px-4"
                  >
                    <MessageCircle className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Nhắn tin với nhà tuyển dụng</span>
                    <span className="inline sm:hidden text-xs">Nhắn tin</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl p-8 border-none max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black tracking-tighter">Bắt đầu hội thoại</AlertDialogTitle>
                    <AlertDialogDescription className="font-medium text-gray-500">
                      Gửi tin nhắn đến nhà tuyển dụng của {job.company?.fullName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Nhập tin nhắn đầu tiên của bạn..."
                      className="rounded-2xl border-gray-100 bg-gray-50 min-h-[120px]"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="rounded-xl font-bold">Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleStartChat}
                      disabled={!chatMessage.trim() || startingChat}
                      className="rounded-xl bg-black hover:bg-gray-800 font-bold"
                    >
                      {startingChat ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {user?.role === 'candidate' && (
              <Button
                size="sm"
                className={`px-3 sm:px-4 ${hasApplied ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-800"}`}
                disabled={hasApplied || applying}
                onClick={handleApply}
              >
                {applying ? <Loader2 className="animate-spin h-4 w-4 sm:mr-2" /> : null}
                <span className="text-xs sm:text-sm">
                  {hasApplied ? 'Đã ứng tuyển' : (
                    <>
                      <span className="hidden sm:inline">Ứng tuyển ngay</span>
                      <span className="inline sm:hidden">Ứng tuyển</span>
                    </>
                  )}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Content */}
        <div className="lg:col-span-8 space-y-8">
          {success && <Alert className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-4 w-4" /><AlertDescription>{success}</AlertDescription></Alert>}
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-32 bg-black"></div>
            <CardContent className="pt-0 p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 space-y-6 md:space-y-0 pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                  <div className="h-28 w-28 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden -mt-20 shrink-0">
                    {job.company?.companyProfile?.logoUrl ? (
                      <img src={job.company.companyProfile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Building2 className="h-14 w-14 text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter leading-tight max-w-2xl">
                      {job.title}
                    </h1>
                    <p className="text-xl font-bold text-gray-500">{job.company?.fullName}</p>
                  </div>
                </div>
                <Badge className="w-fit h-fit px-4 py-1.5 text-xs font-black bg-gray-100 text-black border-none uppercase tracking-widest shrink-0">{job.type}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> Địa điểm
                  </p>
                  <p className="font-bold text-black">{job.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" /> Mức lương
                  </p>
                  <p className="font-bold text-black">{job.salaryRange}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" /> Lĩnh vực
                  </p>
                  <p className="font-bold text-black">{job.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Ngày đăng
                  </p>
                  <p className="font-bold text-black">{new Date(job.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-black text-black tracking-tight mb-4">Mô tả công việc</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8 font-medium">
                  {job.description}
                </div>

                {job.requirements?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-black tracking-tight mb-4">Yêu cầu ứng viên</h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-black mr-3 mt-0.5 shrink-0" />
                          <span className="text-gray-600 font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-black tracking-tight mb-4">Quyền lợi</h3>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-black mr-3 mt-2 shrink-0" />
                          <span className="text-gray-600 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Flag className="h-3 w-3" />
                  Bạn thấy có điều gì bất thường về công việc này?
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50">
                      Báo cáo vi phạm
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl p-8 border-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black tracking-tighter">Báo cáo tin tuyển dụng</AlertDialogTitle>
                      <AlertDialogDescription className="font-medium text-gray-500">
                        Vui lòng nêu rõ lý do báo cáo. Chúng tôi sẽ xem xét trong vòng 24 giờ.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Lý do báo cáo (ví dụ: Tin giả, thông tin sai lệch, nội dung không phù hợp...)"
                        className="rounded-2xl border-gray-100 bg-gray-50 min-h-[120px]"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel className="rounded-xl font-bold">Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReport}
                        disabled={!reportReason.trim() || reporting}
                        className="rounded-xl bg-red-600 hover:bg-red-700 font-bold"
                      >
                        {reporting ? 'Đang gửi...' : 'Gửi báo cáo'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Company Info & Action */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-black tracking-tight">Về công ty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-6 font-medium">
                {job.company?.companyProfile?.description || 'Không có mô tả cho công ty này.'}
              </p>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                {job.company?.companyProfile?.website && (
                  <a
                    href={job.company.companyProfile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-sm text-black font-bold hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-2" /> Ghé thăm website
                  </a>
                )}
                <div className="flex items-center text-sm text-gray-400 font-bold">
                  <Building2 className="h-4 w-4 mr-2" /> {job.company?.companyProfile?.location || 'Địa điểm không công khai'}
                </div>
              </div>

              <Button asChild variant="outline" className="w-full rounded-xl font-bold border-gray-200">
                <Link to={`/company/${job.company?._id}`}>Xem hồ sơ công ty</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black text-white border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-6">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tighter">Quan tâm đến vị trí này?</h3>
                <p className="text-gray-400 text-sm font-medium">
                  Gia nhập {job.company?.fullName} với vị trí {job.title}.
                </p>
              </div>
              <Button
                onClick={handleApply}
                disabled={hasApplied || applying || user?.role === 'recruiter'}
                className="w-full bg-white text-black hover:bg-gray-100 h-14 rounded-2xl text-lg font-black tracking-tight transition-transform active:scale-95 shadow-xl"
              >
                {applying ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                {hasApplied ? 'Ứng tuyển thành công' : 'Ứng tuyển công việc này'}
              </Button>
              {user?.role === 'recruiter' && (
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Nhà tuyển dụng không thể ứng tuyển việc làm.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
