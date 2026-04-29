import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAuthStore } from '@/store/useAuthStore';
import { updateCandidateProfile, uploadFile } from '@/api/profileApi';
import { getProfile } from '@/api/authApi';
import CVTemplate1 from '@/components/cv/templates/CVTemplate1';
import SortableItem from '@/components/cv/SortableItem';
import { generatePDF } from '@/utils/cvUtils';
import {
  Loader2, Save, Download, Plus, Trash2,
  Layout, Type, Briefcase, GraduationCap,
  Wand2, ChevronLeft, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const CVBuilder = () => {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // CV State (Option B: Independent from Profile)
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
    bio: '',
    experience: [],
    education: [],
    skills: [],
    templateId: 'template1',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const data = await getProfile();
      const profile = data.candidateProfile;

      // If we have a saved state, use it. Otherwise, init from profile.
      if (profile?.cvBuilderState) {
        setCvData(profile.cvBuilderState);
      } else {
        setCvData({
          personalInfo: {
            fullName: data.fullName || '',
            email: data.email || '',
            phone: '',
            location: '',
          },
          bio: profile?.bio || '',
          experience: profile?.experience?.map((exp, i) => ({ ...exp, id: `exp-${i}-${Date.now()}` })) || [],
          education: profile?.education?.map((edu, i) => ({ ...edu, id: `edu-${i}-${Date.now()}` })) || [],
          skills: profile?.skills || [],
          templateId: 'template1',
        });
      }
    } catch (err) {
      setError('Không thể tải dữ liệu ban đầu');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result, type) => {
    if (!result.destination) return;

    const items = Array.from(cvData[type]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCvData({ ...cvData, [type]: items });
  };

  const addItem = (type) => {
    const newItem = type === 'experience'
      ? { id: `exp-${Date.now()}`, company: '', position: '', duration: '', description: '' }
      : { id: `edu-${Date.now()}`, school: '', degree: '', year: '' };

    setCvData({ ...cvData, [type]: [newItem, ...cvData[type]] });
  };

  const removeItem = (type, index) => {
    const items = [...cvData[type]];
    items.splice(index, 1);
    setCvData({ ...cvData, [type]: items });
  };

  const handleUpdateItem = (type, index, field, value) => {
    const items = [...cvData[type]];
    items[index][field] = value;
    setCvData({ ...cvData, [type]: items });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const response = await updateCandidateProfile({ cvBuilderState: cvData });
      if (response.success) {
        setAuth({ ...user, candidateProfile: response.profile });
        setSuccess('Đã lưu bản nháp CV!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Lưu bản nháp thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setSaving(true);
    try {
      const pdf = await generatePDF('cv-preview-content', `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`);
      if (pdf) {
        pdf.save(`${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`);
        setSuccess('Đang tải xuống CV...');
      }
    } catch (err) {
      setError('Xuất PDF thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveToProfile = async () => {
    setSaving(true);
    try {
      const pdf = await generatePDF('cv-preview-content');
      if (!pdf) throw new Error('PDF Generation failed');

      const blob = pdf.output('blob');
      const file = new File([blob], 'resume.pdf', { type: 'application/pdf' });

      const uploadRes = await uploadFile(file);
      const updateRes = await updateCandidateProfile({
        resumeUrl: uploadRes.url,
        cvBuilderState: cvData
      });

      if (updateRes.success) {
        setAuth({ ...user, candidateProfile: updateRes.profile });
        setSuccess('Đã cập nhật CV vào hồ sơ của bạn!');
      }
    } catch (err) {
      setError('Lưu CV vào hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      <p className="font-bold text-gray-500">Đang khởi tạo trình tạo CV...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header / Toolbar */}
      <div className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="rounded-full px-2 md:px-3">
            <ChevronLeft className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Quay lại</span>
          </Button>
          <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>
          <h1 className="font-black text-sm md:text-lg tracking-tight">Hiretify <span className="text-blue-600 hidden md:inline">CV Builder</span></h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="sm" onClick={handleSaveDraft} disabled={saving} className="font-bold px-2 md:px-3">
            <Save className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Lưu nháp</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={saving} className="font-bold border-2 px-2 md:px-3">
            <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Tải PDF</span>
          </Button>
          <Button size="sm" onClick={handleSaveToProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 md:px-6 shadow-lg shadow-blue-100">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 md:mr-2" />}
            <span className="hidden md:inline">Lưu vào hồ sơ</span>
            <span className="md:hidden">Lưu</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Controls */}
        <div className="w-full md:w-[400px] bg-white border-r border-b md:border-b-0 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 h-[50vh] md:h-full">
          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-bold">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-3 mb-6 md:mb-8 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="info" className="rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Type className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Thông tin
              </TabsTrigger>
              <TabsTrigger value="experience" className="rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Layout className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Bố cục
              </TabsTrigger>
              <TabsTrigger value="style" className="rounded-lg font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Kỹ năng
              </TabsTrigger>
            </TabsList>
            {/* ... rest of tabs content ... */}
            <TabsContent value="info" className="space-y-6">
              <section className="space-y-4">
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-600">Họ và tên</Label>
                    <Input
                      value={cvData.personalInfo.fullName}
                      onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, fullName: e.target.value } })}
                      className="bg-gray-50 border-none focus-visible:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-600">Email</Label>
                    <Input
                      value={cvData.personalInfo.email}
                      onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, email: e.target.value } })}
                      className="bg-gray-50 border-none focus-visible:ring-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-600">Điện thoại</Label>
                      <Input
                        value={cvData.personalInfo.phone}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, phone: e.target.value } })}
                        className="bg-gray-50 border-none focus-visible:ring-blue-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-600">Địa chỉ</Label>
                      <Input
                        value={cvData.personalInfo.location}
                        onChange={(e) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, location: e.target.value } })}
                        className="bg-gray-50 border-none focus-visible:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t">
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Giới thiệu bản thân</h3>
                <Textarea
                  className="min-h-[120px] bg-gray-50 border-none focus-visible:ring-blue-600 text-sm"
                  value={cvData.bio}
                  onChange={(e) => setCvData({ ...cvData, bio: e.target.value })}
                  placeholder="Viết đoạn giới thiệu ngắn về mục tiêu sự nghiệp..."
                />
              </section>
            </TabsContent>

            <TabsContent value="experience" className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Kinh nghiệm</h3>
                  <Button variant="ghost" size="sm" onClick={() => addItem('experience')} className="text-blue-600 font-bold hover:bg-blue-50 text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Thêm
                  </Button>
                </div>

                <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'experience')}>
                  <Droppable droppableId="experience">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {cvData.experience.map((exp, index) => (
                          <SortableItem
                            key={exp.id}
                            id={exp.id}
                            index={index}
                            onRemove={() => removeItem('experience', index)}
                            title={exp.company || 'Vị trí mới'}
                          >
                            <div className="space-y-3 p-1">
                              <Input
                                placeholder="Công ty"
                                value={exp.company}
                                onChange={(e) => handleUpdateItem('experience', index, 'company', e.target.value)}
                                className="font-bold border-none bg-gray-100 focus-visible:ring-0 text-sm"
                              />
                              <Input
                                placeholder="Vị trí"
                                value={exp.position}
                                onChange={(e) => handleUpdateItem('experience', index, 'position', e.target.value)}
                                className="text-xs border-none bg-gray-100 focus-visible:ring-0"
                              />
                              <Input
                                placeholder="Thời gian (v.d. 2020-2022)"
                                value={exp.duration}
                                onChange={(e) => handleUpdateItem('experience', index, 'duration', e.target.value)}
                                className="text-[10px] border-none bg-gray-100 focus-visible:ring-0"
                              />
                              <Textarea
                                placeholder="Mô tả công việc"
                                value={exp.description}
                                onChange={(e) => handleUpdateItem('experience', index, 'description', e.target.value)}
                                className="text-xs min-h-[80px] border-none bg-gray-100 focus-visible:ring-0 leading-relaxed"
                              />
                            </div>
                          </SortableItem>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </section>

              <section className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Học vấn</h3>
                  <Button variant="ghost" size="sm" onClick={() => addItem('education')} className="text-blue-600 font-bold hover:bg-blue-50 text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Thêm
                  </Button>
                </div>

                <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'education')}>
                  <Droppable droppableId="education">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {cvData.education.map((edu, index) => (
                          <SortableItem
                            key={edu.id}
                            id={edu.id}
                            index={index}
                            onRemove={() => removeItem('education', index)}
                            title={edu.school || 'Trường mới'}
                          >
                            <div className="space-y-3 p-1">
                              <Input
                                placeholder="Trường"
                                value={edu.school}
                                onChange={(e) => handleUpdateItem('education', index, 'school', e.target.value)}
                                className="font-bold border-none bg-gray-100 focus-visible:ring-0 text-sm"
                              />
                              <Input
                                placeholder="Bằng cấp"
                                value={edu.degree}
                                onChange={(e) => handleUpdateItem('education', index, 'degree', e.target.value)}
                                className="text-xs border-none bg-gray-100 focus-visible:ring-0"
                              />
                              <Input
                                placeholder="Năm (v.d. 2016-2020)"
                                value={edu.year}
                                onChange={(e) => handleUpdateItem('education', index, 'year', e.target.value)}
                                className="text-[10px] border-none bg-gray-100 focus-visible:ring-0"
                              />
                            </div>
                          </SortableItem>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </section>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <section className="space-y-4">
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Kỹ năng</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cvData.skills.map((skill, i) => (
                    <div key={i} className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2 group">
                      <span className="text-xs font-bold">{skill}</span>
                      <button
                        onClick={() => {
                          const newSkills = [...cvData.skills];
                          newSkills.splice(i, 1);
                          setCvData({ ...cvData, skills: newSkills });
                        }}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  placeholder="Nhập kỹ năng và nhấn Enter..."
                  className="bg-gray-50 border-none focus-visible:ring-blue-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      if (!cvData.skills.includes(e.target.value)) {
                        setCvData({ ...cvData, skills: [...cvData.skills, e.target.value] });
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </section>

              <section className="space-y-4 pt-6 border-t">
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Mẫu thiết kế (Template)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setCvData({ ...cvData, templateId: 'template1' })}
                    className={`aspect-[1/1.4] rounded-xl border-2 cursor-pointer transition-all overflow-hidden relative group ${cvData.templateId === 'template1' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center font-black text-[10px] uppercase tracking-tighter text-gray-300 group-hover:scale-110 transition-transform">Minimalist</div>
                    {cvData.templateId === 'template1' && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div
                    className="aspect-[1/1.4] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-300 text-center p-4"
                  >
                    Mẫu mới sắp ra mắt...
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-4 md:p-12 flex items-start justify-center">
          <div className="w-full max-w-[210mm] shadow-[0_20px_50px_rgba(0,0,0,0.15)] origin-top transform scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-300">
            <CVTemplate1 data={cvData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
