import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCandidateProfile, uploadFile } from '@/api/profileApi';
import { getProfile } from '@/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Trash2, Upload, User, GraduationCap, Briefcase, FileText, CheckCircle, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const CandidateProfile = () => {
  const { user, setAuth } = useAuthStore();
  const [profile, setProfile] = useState({
    bio: '',
    skills: [],
    education: [],
    experience: [],
    resumeUrl: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      if (data.candidateProfile) {
        setProfile({
          bio: data.candidateProfile.bio || '',
          skills: data.candidateProfile.skills || [],
          education: data.candidateProfile.education || [],
          experience: data.candidateProfile.experience || [],
          resumeUrl: data.candidateProfile.resumeUrl || '',
          profilePicture: data.candidateProfile.profilePicture || ''
        });
      }
    } catch (err) {
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await updateCandidateProfile(profile);

      // Update global auth store to keep state in sync
      if (response.success) {
        setAuth({
          ...user,
          candidateProfile: response.profile || profile
        });
      }

      setSuccess('Cập nhật hồ sơ thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const data = await uploadFile(file);
      const newProfile = { ...profile, resumeUrl: data.url };

      // Save to database and get the updated profile from server
      const response = await updateCandidateProfile(newProfile);

      if (response.success && response.profile) {
        const updatedProfile = {
          ...profile,
          resumeUrl: response.profile.resumeUrl
        };
        setProfile(updatedProfile);

        // Update global auth store to keep state in sync
        setAuth({
          ...user,
          candidateProfile: response.profile
        });
      }

      setSuccess('Đã tải lên và lưu CV thành công!');
    } catch (err) {
      setError('Tải lên CV thất bại');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { school: '', degree: '', year: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEdu = [...profile.education];
    newEdu.splice(index, 1);
    setProfile({ ...profile, education: newEdu });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = [...profile.experience];
    newExp.splice(index, 1);
    setProfile({ ...profile, experience: newExp });
  };

  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skill]
      });
    }
  };

  const removeSkill = (index) => {
    const newSkills = [...profile.skills];
    newSkills.splice(index, 1);
    setProfile({ ...profile, skills: newSkills });
  };

  const handleUploadProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const data = await uploadFile(file);
      const newProfile = { ...profile, profilePicture: data.url };

      const response = await updateCandidateProfile(newProfile);

      if (response.success && response.profile) {
        setProfile({
          ...profile,
          profilePicture: response.profile.profilePicture
        });
        setAuth({
          ...user,
          candidateProfile: response.profile
        });
      }
      setSuccess('Đã cập nhật ảnh đại diện!');
    } catch (err) {
      setError('Tải lên ảnh đại diện thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Đang tải hồ sơ của bạn...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12 pt-6">
      {/* Notifications - Using a fixed toast-like alert */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {error && (
          <Alert variant="destructive" className="shadow-2xl animate-in slide-in-from-right-4 pointer-events-auto border-none bg-red-600 text-white">
            <AlertDescription className="font-bold">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-600 text-white border-none shadow-2xl animate-in slide-in-from-right-4 pointer-events-auto">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription className="font-bold">{success}</AlertDescription>
            </div>
          </Alert>
        )}
      </div>

      {/* Profile Header - Upwork Style */}
      <Card className="mb-8 border-none shadow-xl overflow-hidden bg-white rounded-[2rem]">
        <div className="h-40 bg-gradient-to-r from-[#000000] via-[#0b1219] to-[#152331] relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        </div>
        <div className="px-6 md:px-10 pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="relative group -mt-20">
              <Avatar className="h-40 w-40 border-[6px] border-white shadow-2xl rounded-[2.5rem]">
                <AvatarImage src={profile.profilePicture} className="object-cover" />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-4xl font-black">
                  {user?.fullName?.[0]}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <Upload className="text-white h-8 w-8 animate-bounce" />
                <input type="file" className="hidden" accept="image/*" onChange={handleUploadProfilePic} />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">{user?.fullName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className="bg-blue-50 text-black-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {user?.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}
                </span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Tham gia từ {new Date().getFullYear()}
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto mt-6 md:mt-0">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white rounded-2xl px-10 py-7 font-black text-lg shadow-2xl shadow-gray-200 transition-all active:scale-95 group"
              >
                {saving ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : (
                  <CheckCircle className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-8 space-y-10">

          {/* Bio Section */}
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 pb-0">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-2xl text-black">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Tổng quan nghề nghiệp</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">Giới thiệu bản thân với các nhà tuyển dụng tiềm năng.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <Textarea
                placeholder="Viết một đoạn giới thiệu ngắn gọn và ấn tượng về kỹ năng, kinh nghiệm và mục tiêu nghề nghiệp của bạn..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="min-h-[350px] text-xl leading-relaxed focus-visible:ring-blue-500 border-none bg-gray-50/50 p-8 rounded-[1.5rem] resize-none"
              />
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-2xl text-black">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Kinh nghiệm làm việc</CardTitle>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience} className="w-full sm:w-auto rounded-full px-6 border-2 font-bold hover:bg-gray-50 hover:text-black hover:border-gray-200">
                <Plus className="h-4 w-4 mr-2" /> Thêm kinh nghiệm
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {profile.experience.length === 0 && (
                <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-[1.5rem] bg-gray-50/30">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold text-lg">Chưa có kinh nghiệm làm việc.</p>
                </div>
              )}
              {profile.experience.map((exp, index) => (
                <div key={index} className="p-8 bg-gray-50/30 rounded-[1.5rem] relative border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:border-blue-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-6 text-gray-300 hover:text-red-500 bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Công ty</Label>
                      <Input
                        placeholder="v.d. Công ty ABC"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].company = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                        className="rounded-xl border-gray-200 h-12 font-bold focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Vị trí</Label>
                      <Input
                        placeholder="v.d. Nhân viên Marketing"
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].position = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                        className="rounded-xl border-gray-200 h-12 font-bold focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Thời gian</Label>
                    <Input
                      placeholder="v.d. Tháng 1/2022 - Hiện tại"
                      value={exp.duration}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[index].duration = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                      className="rounded-xl border-gray-200 h-12 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Mô tả công việc / Thành tựu</Label>
                    <Textarea
                      placeholder="Bạn đã đạt được những gì ở vị trí này?"
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[index].description = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                      className="min-h-[120px] rounded-xl border-gray-200 bg-white font-medium"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content (Right) */}
        <div className="lg:col-span-4 space-y-10">

          {/* Resume Section */}
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-2xl text-black">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Hồ sơ ứng tuyển (CV)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[1.5rem] bg-gray-50/50 hover:bg-white hover:border-[#1f1f1f] transition-all group">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-4 group-hover:rotate-6 transition-transform">
                  <FileText className="h-10 w-10 text-[#1f1f1f]" />
                </div>
                <h3 className="font-black text-gray-900 mb-1">
                  {profile.resumeUrl ? 'Đã tải lên CV' : 'Chưa có CV'}
                </h3>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 text-center">CHỈ PDF • TỐI ĐA 5MB</p>

                <div className="flex flex-col w-full gap-3">
                  <Button variant="default" className="w-full relative cursor-pointer overflow-hidden bg-[#0a0a0a] hover:bg-[#1f1f1f] rounded-xl h-12 font-bold">
                    <Upload className="h-4 w-4 mr-2" />
                    {profile.resumeUrl ? 'Thay đổi tệp' : 'Tải lên CV'}
                    <input type="file" accept=".pdf" onChange={handleUploadResume} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </Button>
                  {profile.resumeUrl && (
                    <Button variant="outline" asChild className="w-full rounded-xl h-12 font-bold border-2">
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Tải xuống CV hiện tại</a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-2xl text-black">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Học vấn</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={addEducation} className="w-full rounded-full px-6 border-2 font-bold hover:bg-gray-50 text-black border-gray-100">
                <Plus className="h-4 w-4 mr-2" /> Thêm học vấn
              </Button>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              {profile.education.length === 0 && (
                <div className="text-center py-10 text-gray-400 border border-dashed rounded-2xl text-sm italic">
                  Vui lòng thêm thông tin học vấn của bạn.
                </div>
              )}
              {profile.education.map((edu, index) => (
                <div key={index} className="p-6 bg-gray-50/50 rounded-2xl relative border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Trường học</Label>
                      <Input
                        placeholder="Tên trường đại học / cao đẳng"
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].school = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                        className="text-sm font-black border-none bg-transparent p-0 h-auto focus-visible:ring-0 placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Bằng cấp</Label>
                      <Input
                        placeholder="v.d. Cử nhân Công nghệ thông tin"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].degree = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                        className="text-xs font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-gray-500 placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Năm tốt nghiệp</Label>
                      <Input
                        placeholder="v.d. 2020 - 2024"
                        value={edu.year}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].year = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                        className="text-[10px] font-black border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-amber-600 placeholder:text-amber-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-2xl text-black">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-black tracking-tight">Kỹ năng</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center group">
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-2 opacity-40 hover:opacity-100 hover:text-red-400 transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {profile.skills.length === 0 && <p className="text-sm text-gray-400 italic">Chưa thêm kỹ năng nào.</p>}
              </div>
              <div className="relative group">
                <Input
                  placeholder="Nhấn Enter để thêm kỹ năng..."
                  className="rounded-xl h-12 font-bold border-gray-200 pl-10 focus:ring-orange-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
