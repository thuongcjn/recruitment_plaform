import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCandidateProfile, uploadFile } from '@/api/profileApi';
import { getProfile } from '@/api/authApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Upload, User, GraduationCap, Briefcase, FileText, CheckCircle } from 'lucide-react';

const CandidateProfile = () => {
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
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateCandidateProfile(profile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
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
        setProfile({
          ...profile,
          resumeUrl: response.profile.resumeUrl
        });
      }
      
      setSuccess('Resume uploaded and saved successfully!');
    } catch (err) {
      setError('Failed to upload resume');
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Loading your profile...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert className="bg-green-50 border-green-200 text-green-800 mb-6"><CheckCircle className="h-4 w-4 mr-2" /><AlertDescription>{success}</AlertDescription></Alert>}

      <Tabs defaultValue="bio" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col h-auto bg-transparent p-0 space-y-0 md:space-y-2 md:w-64">
          <TabsTrigger value="bio" className="justify-start px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 w-full">
            <User className="h-4 w-4 mr-3" /> Basic Info
          </TabsTrigger>
          <TabsTrigger value="education" className="justify-start px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 w-full">
            <GraduationCap className="h-4 w-4 mr-3" /> Education
          </TabsTrigger>
          <TabsTrigger value="experience" className="justify-start px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 w-full">
            <Briefcase className="h-4 w-4 mr-3" /> Experience
          </TabsTrigger>
          <TabsTrigger value="resume" className="justify-start px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 w-full">
            <FileText className="h-4 w-4 mr-3" /> Resume / CV
          </TabsTrigger>
          
          <div className="pt-4 hidden md:block">
            <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-300">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="bio" className="m-0">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Professional Bio</CardTitle>
                <CardDescription>This will be the first thing recruiters read about you.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Example: I am a senior CS student looking for a full-stack internship. Expert in React and Node.js..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="min-h-[250px] text-lg leading-relaxed focus-visible:ring-blue-500"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="m-0">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education History</CardTitle>
                  <CardDescription>Add your degrees and certifications.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addEducation} className="hover:bg-blue-50 hover:text-blue-600 border-dashed">
                  <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.education.length === 0 && (
                  <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                    No education items added yet.
                  </div>
                )}
                {profile.education.map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50/50 rounded-xl relative border border-gray-100 group transition-all hover:bg-white hover:shadow-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-gray-500">School / University</Label>
                      <Input 
                        placeholder="Hanoi University"
                        value={edu.school} 
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].school = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-gray-500">Degree</Label>
                      <Input 
                        placeholder="B.S. in Computer Science"
                        value={edu.degree} 
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].degree = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-gray-500">Year</Label>
                      <Input 
                        placeholder="2020 - 2024"
                        value={edu.year} 
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].year = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="m-0">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Relevant work, internships, or personal projects.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addExperience} className="hover:bg-blue-50 hover:text-blue-600 border-dashed">
                  <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.experience.length === 0 && (
                  <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                    No experience items added yet.
                  </div>
                )}
                {profile.experience.map((exp, index) => (
                  <div key={index} className="space-y-6 p-6 bg-gray-50/50 rounded-xl relative border border-gray-100 group transition-all hover:bg-white hover:shadow-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-gray-500">Company</Label>
                        <Input 
                          placeholder="Tech Corp"
                          value={exp.company} 
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].company = e.target.value;
                            setProfile({ ...profile, experience: newExp });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-gray-500">Position</Label>
                        <Input 
                          placeholder="Frontend Intern"
                          value={exp.position} 
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].position = e.target.value;
                            setProfile({ ...profile, experience: newExp });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-gray-500">Duration</Label>
                        <Input 
                          placeholder="Jun 2023 - Aug 2023"
                          value={exp.duration} 
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].duration = e.target.value;
                            setProfile({ ...profile, experience: newExp });
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-gray-500">Key Achievements / Description</Label>
                      <Textarea 
                        placeholder="Briefly describe your role and impact..."
                        value={exp.description} 
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].description = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="m-0">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Resume / CV</CardTitle>
                <CardDescription>Upload a PDF version of your resume for recruiters to download.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-gray-50/50 hover:bg-white hover:border-blue-400 transition-all group">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {profile.resumeUrl ? 'Update your Resume' : 'No Resume Uploaded'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">PDF format only. Max 5MB.</p>
                  
                  <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                    <Button variant="default" className="relative cursor-pointer overflow-hidden bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      {profile.resumeUrl ? 'Change CV' : 'Upload CV'}
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleUploadResume}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    {profile.resumeUrl && (
                      <Button variant="outline" asChild>
                        <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                          View Current CV
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-8 md:hidden">
            <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CandidateProfile;
