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
        setError('Failed to fetch job details');
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
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Loading job details...</p>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate('/my-jobs')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Jobs
      </Button>

      <Card className="shadow-lg border-none">
        <CardHeader className="bg-white border-b p-8">
          <CardTitle className="text-2xl font-bold">Edit Job Posting</CardTitle>
          <CardDescription>Update the details for your job opening.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior Frontend Engineer" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT & Software">IT & Software</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Ho Chi Minh City, VN" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input id="salaryRange" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="e.g. $1000 - $2000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Job Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open (Active)</SelectItem>
                  <SelectItem value="closed">Closed (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="min-h-[150px]" placeholder="Describe the role and your company..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} required className="min-h-[120px]" placeholder="React.js experience&#10;Good communication..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea id="benefits" name="benefits" value={formData.benefits} onChange={handleChange} required className="min-h-[120px]" placeholder="Flexible working hours&#10;Private health insurance..." />
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/my-jobs')} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditJob;
