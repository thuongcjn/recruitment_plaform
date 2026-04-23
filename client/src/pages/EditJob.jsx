import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getJob, updateJob } from '@/api/jobApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Save } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    type: 'Full-time',
    category: 'IT & Software',
    salaryRange: '',
    status: 'open'
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJob(id);
        const job = data.data;
        setFormData({
          title: job.title || '',
          description: job.description || '',
          requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
          benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
          location: job.location || '',
          type: job.type || 'Full-time',
          category: job.category || 'IT & Software',
          salaryRange: job.salaryRange || '',
          status: job.status || 'open'
        });
      } catch (err) {
        setError('Không thể tải chi tiết công việc');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const processedData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(item => item.trim() !== ''),
        benefits: formData.benefits.split('\n').filter(item => item.trim() !== '')
      };

      await updateJob(id, processedData);
      navigate('/my-jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật tin tuyển dụng thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Đang tải chi tiết công việc...</p>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate('/my-jobs')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại tin tuyển dụng
      </Button>

      <Card className="shadow-lg border-none">
        <CardHeader className="bg-white border-b p-8">
          <CardTitle className="text-2xl font-bold">Chỉnh sửa tin tuyển dụng</CardTitle>
          <CardDescription>Cập nhật thông tin chi tiết cho vị trí tuyển dụng của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề công việc</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="v.d. Kỹ sư Frontend cao cấp" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Loại hình công việc</Label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                  <SelectTrigger><SelectValue placeholder="Chọn loại hình" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internship">Thực tập</SelectItem>
                    <SelectItem value="Part-time">Bán thời gian</SelectItem>
                    <SelectItem value="Full-time">Toàn thời gian</SelectItem>
                    <SelectItem value="Freelance">Làm việc tự do</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lĩnh vực</Label>
                <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Chọn lĩnh vực" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT & Software">CNTT & Phần mềm</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Thiết kế</SelectItem>
                    <SelectItem value="Finance">Tài chính</SelectItem>
                    <SelectItem value="Others">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="v.d. TP. Hồ Chí Minh" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryRange">Mức lương</Label>
                <Input id="salaryRange" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="v.d. 15tr - 20tr VNĐ" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái tin</Label>
              <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Đang mở (Hiển thị)</SelectItem>
                  <SelectItem value="closed">Đã đóng (Ẩn)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả công việc</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="min-h-[150px]" placeholder="Mô tả về vai trò và công ty của bạn..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Yêu cầu (mỗi dòng một ý)</Label>
              <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} required className="min-h-[120px]" placeholder="Kinh nghiệm React.js&#10;Giao tiếp tốt..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Quyền lợi (mỗi dòng một ý)</Label>
              <Textarea id="benefits" name="benefits" value={formData.benefits} onChange={handleChange} required className="min-h-[120px]" placeholder="Thời gian làm việc linh hoạt&#10;Bảo hiểm sức khỏe cao cấp..." />
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/my-jobs')} className="flex-1">Hủy</Button>
              <Button type="submit" className="flex-1 bg-black hover:bg-gray-800" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu thay đổi...</> : <><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditJob;
