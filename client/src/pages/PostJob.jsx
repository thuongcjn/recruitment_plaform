import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createJob } from '@/api/jobApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Full-time',
    location: '',
    category: 'IT & Software',
    salaryRange: 'Thỏa thuận',
    requirements: '',
    benefits: ''
  });

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert comma-separated strings to arrays
      const processedData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
        benefits: formData.benefits.split('\n').filter(b => b.trim() !== '')
      };

      await createJob(processedData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng tin tuyển dụng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-600 mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Đăng tin tuyển dụng mới</h1>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Giới thiệu về vị trí công việc cho các ứng viên.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tiêu đề công việc</Label>
                  <Input
                    required
                    placeholder="v.d. Thực tập sinh Lập trình Frontend"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Địa điểm</Label>
                    <Input
                      required
                      placeholder="v.d. Hà Nội (Văn phòng / Từ xa)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mức lương</Label>
                    <Input
                      placeholder="v.d. 5tr - 10tr VNĐ"
                      value={formData.salaryRange}
                      onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mô tả công việc</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  required
                  placeholder="Mô tả chi tiết về vị trí, đội ngũ và một ngày làm việc điển hình tại công ty..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yêu cầu & Quyền lợi</CardTitle>
                <CardDescription>Nhập mỗi mục trên một dòng mới.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Yêu cầu ứng viên</Label>
                  <Textarea
                    placeholder="v.d. Thành thạo ReactJS&#10;Kỹ năng giao tiếp tốt"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quyền lợi</Label>
                  <Textarea
                    placeholder="v.d. Ăn trưa miễn phí&#10;Văn phòng hiện đại"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
              Đăng tin tuyển dụng
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
