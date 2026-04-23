import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { registerUser } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'candidate'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await registerUser(formData);
      setAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tạo tài khoản mới</CardTitle>
          <CardDescription>Gia nhập Hiretify để bắt đầu hành trình sự nghiệp của bạn</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Tôi là...</Label>
              <Select onValueChange={handleRoleChange} defaultValue="candidate">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò của bạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Ứng viên / Sinh viên</SelectItem>
                  <SelectItem value="recruiter">Nhà tuyển dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
