import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCompanyProfile, uploadFile } from '@/api/profileApi';
import { getProfile } from '@/api/authApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Globe, MapPin, Building2, CheckCircle, Info } from 'lucide-react';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    description: '',
    website: '',
    location: '',
    logoUrl: ''
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
      if (data.companyProfile) {
        setProfile({
          companyName: data.companyProfile.companyName || '',
          description: data.companyProfile.description || '',
          website: data.companyProfile.website || '',
          location: data.companyProfile.location || '',
          logoUrl: data.companyProfile.logoUrl || ''
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
      await updateCompanyProfile(profile);
      setSuccess('Company profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const data = await uploadFile(file);
      const newProfile = { ...profile, logoUrl: data.url };
      setProfile(newProfile);
      // Auto save after upload
      await updateCompanyProfile(newProfile);
      setSuccess('Logo updated and saved!');
    } catch (err) {
      setError('Failed to upload logo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Loading company profile...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert className="bg-green-50 border-green-200 text-green-800 mb-6"><CheckCircle className="h-4 w-4 mr-2" /><AlertDescription>{success}</AlertDescription></Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Logo and CTA */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardContent className="flex flex-col items-center -mt-12">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden mb-4 group relative">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <Building2 className="h-12 w-12 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="h-6 w-6 text-white" />
                  </Label>
                </div>
              </div>
              <input 
                id="logo-upload"
                type="file" 
                accept="image/*" 
                onChange={handleUploadLogo}
                className="hidden"
              />
              <h2 className="text-xl font-bold text-gray-900">{profile.companyName || 'Company Name'}</h2>
              <p className="text-sm text-gray-500 mb-6">{profile.location || 'Location'}</p>
              
              <Button variant="outline" size="sm" className="w-full relative cursor-pointer overflow-hidden mb-2">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Logo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUploadLogo}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-lg">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Save Profile
          </Button>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Company Legal Name</Label>
                  <Input 
                    value={profile.companyName} 
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    placeholder="Enter your company name"
                    className="h-11 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" /> Website
                    </Label>
                    <Input 
                      value={profile.website} 
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://company.com"
                      className="h-11 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" /> Headquarters Location
                    </Label>
                    <Input 
                      value={profile.location} 
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="City, Country"
                      className="h-11 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>About Your Company</CardTitle>
              <CardDescription>Share your vision, missions, and what makes your company a great place to work.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe your company culture, technology stack, and values..."
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="min-h-[300px] text-lg leading-relaxed focus-visible:ring-blue-500"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
