import { useState, useEffect } from 'react';
import { getReports, deleteReport, deleteJobByAdmin } from '@/api/reportApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2, Flag, Trash2, CheckCircle, ExternalLink,
  AlertTriangle, User, Calendar, Briefcase, Eye,
  MapPin, DollarSign, Clock, Building2, ListChecks, Gift,
  FileText, ShieldAlert
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError('Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    setProcessingId(id);
    try {
      await deleteReport(id);
      setSuccess('Đã hủy bỏ báo cáo thành công');
      setReports(reports.filter(r => r._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Không thể hủy bỏ báo cáo');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteJob = async (jobId, reportId) => {
    setProcessingId(reportId);
    try {
      await deleteJobByAdmin(jobId);
      setSuccess('Đã xóa tin tuyển dụng và tất cả báo cáo liên quan');
      setReports(reports.filter(r => r.jobId?._id !== jobId));
      setIsDetailOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Không thể xóa tin tuyển dụng');
    } finally {
      setProcessingId(null);
    }
  };

  const openJobDetail = (job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-black" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang tải danh sách báo cáo...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-2 border border-red-100">
              <Flag className="h-3 w-3 mr-2" /> Xem xét quản trị
            </div>
            <h1 className="text-4xl font-black text-black tracking-tighter">Báo cáo tuyển dụng</h1>
            <p className="text-gray-500 font-medium">Xem xét các bài đăng bị gắn cờ và duy trì tính minh bạch của nền tảng.</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="px-4 py-2 text-center border-r border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Báo cáo</p>
              <p className="text-xl font-black text-black">{reports.length}</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tin đang mở</p>
              <p className="text-xl font-black text-green-600">{Array.from(new Set(reports.map(r => r.jobId?._id).filter(id => id))).length}</p>
            </div>
          </div>
        </div>

        {success && <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 rounded-2xl animate-in fade-in slide-in-from-top-2"><CheckCircle className="h-4 w-4" /><AlertDescription className="font-bold">{success}</AlertDescription></Alert>}
        {error && <Alert variant="destructive" className="mb-6 rounded-2xl"><AlertDescription className="font-bold">{error}</AlertDescription></Alert>}

        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto text-green-500">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black tracking-tight">Đã xử lý hết!</h3>
                  <p className="text-gray-500 font-medium">Hiện không có báo cáo nào đang chờ xử lý.</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="border-gray-100 hover:bg-transparent">
                    <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6 pl-8">Tin tuyển dụng</TableHead>
                    <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6">Người báo cáo</TableHead>
                    <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6">Lý do</TableHead>
                    <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6 pr-8 text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id} className="border-gray-50 hover:bg-gray-50/30 transition-colors group">
                      <TableCell className="py-6 pl-8">
                        {report.jobId ? (
                          <div className="space-y-1">
                            <div className="font-black text-black flex items-center gap-2">
                              {report.jobId.title}
                            </div>
                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {report.jobId.company?.fullName || 'Công ty không xác định'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-bold italic text-sm flex items-center gap-2">
                            <Trash2 className="h-3 w-3" /> Tin đã bị xóa
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-gray-100">
                            <AvatarFallback className="bg-gray-100 text-gray-500 text-[10px] font-black">
                              {report.reporterId?.fullName?.[0] || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs text-black">{report.reporterId?.fullName || 'Không xác định'}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{report.reporterId?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 max-w-xs">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                          <p className="text-xs font-medium text-gray-600 leading-relaxed">{report.reason}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {report.jobId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openJobDetail(report.jobId)}
                              className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 border-gray-200 hover:bg-black hover:text-white transition-all"
                            >
                              <Eye className="h-3 w-3 mr-2" /> Chi tiết
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(report._id)}
                            disabled={processingId === report._id}
                            className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 text-gray-400"
                          >
                            {processingId === report._id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Hủy bỏ'}
                          </Button>

                          {report.jobId && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100"
                                >
                                  Xóa tin
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-3xl p-8">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-2xl font-black tracking-tighter">Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription className="font-medium text-gray-500">
                                    Bạn có chắc chắn muốn xóa **"{report.jobId.title}"**? Hành động này sẽ xóa vĩnh viễn tin tuyển dụng và tất cả báo cáo liên quan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3 mt-6">
                                  <AlertDialogCancel className="rounded-xl font-bold">Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteJob(report.jobId._id, report._id)}
                                    className="rounded-xl bg-red-600 hover:bg-red-700 font-bold"
                                  >
                                    Xóa tin
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogTitle className="sr-only">Chi tiết công việc</DialogTitle>
        <DialogDescription className="sr-only">Mô tả chi tiết công việc</DialogDescription>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-3xl overflow-hidden border-none shadow-2xl bg-white">
          {selectedJob && (
            <div className="flex flex-col h-full">
              <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <Badge className="bg-black text-white rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">{selectedJob.type}</Badge>
                    <h2 className="text-3xl font-black text-black tracking-tighter">{selectedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> {selectedJob.company?.fullName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-green-600">
                        <DollarSign className="h-3.5 w-3.5" /> {selectedJob.salaryRange}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="destructive"
                      className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6"
                      onClick={() => handleDeleteJob(selectedJob._id, null)}
                    >
                      Xóa tin
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-10">
                    <section>
                      <h3 className="text-lg font-black text-black uppercase tracking-tight mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" /> Mô tả công việc
                      </h3>
                      <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">{selectedJob.description}</p>
                    </section>

                    {selectedJob.requirements?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-black text-black uppercase tracking-tight mb-4 flex items-center gap-2">
                          <ListChecks className="h-5 w-5 text-gray-400" /> Yêu cầu
                        </h3>
                        <ul className="grid grid-cols-1 gap-3">
                          {selectedJob.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 font-medium">
                              <div className="h-1.5 w-1.5 rounded-full bg-black mt-2 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {selectedJob.benefits?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-black text-black uppercase tracking-tight mb-4 flex items-center gap-2">
                          <Gift className="h-5 w-5 text-gray-400" /> Quyền lợi
                        </h3>
                        <ul className="grid grid-cols-1 gap-3">
                          {selectedJob.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 font-medium">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                      <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">Thông tin thêm</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Ngày đăng</span>
                          <span className="text-xs font-black text-black">{new Date(selectedJob.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Số ứng viên</span>
                          <span className="text-xs font-black text-black">{selectedJob.applicantsCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Danh mục</span>
                          <Badge variant="secondary" className="text-[9px] font-black uppercase bg-white border border-gray-200">{selectedJob.category}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-5 w-5 text-blue-600" />
                        <h4 className="font-black text-sm text-blue-600 tracking-tight">Hành động quản trị</h4>
                      </div>
                      <p className="text-[10px] font-medium text-blue-800/70 leading-relaxed uppercase tracking-widest">
                        Xem xét nội dung trên cẩn thận. Nếu vi phạm điều khoản nền tảng (lừa đảo, xúc phạm, bất hợp pháp), hãy xóa tin tuyển dụng. Nếu không, hãy hủy bỏ báo cáo.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;
