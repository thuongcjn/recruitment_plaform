import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getJob } from '@/api/jobApi';
import { applyToJob, getMyApplications } from '@/api/applicationApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, MapPin, Briefcase, Clock, Building2, Globe, DollarSign, CheckCircle2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'candidate') {
      checkIfApplied();
    }
  }, [id, isAuthenticated, user?.role]);

  const fetchJobDetails = async () => {
    try {
      const data = await getJob(id);
      setJob(data.data);
    } catch (err) {
      setError('Failed to fetch job details');
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
      setError('Only candidates can apply for jobs');
      return;
    }

    if (!user.candidateProfile?.resumeUrl) {
      setError('Please upload your resume in your profile before applying');
      return;
    }

    setApplying(true);
    setError('');
    try {
      await applyToJob(id);
      setSuccess('Application submitted successfully!');
      setHasApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Loading job details...</p>
    </div>
  );

  if (error && !job) return (
    <div className="container mx-auto p-10">
      <Alert variant="destructive"><AlertDescription>{error || 'Job not found'}</AlertDescription></Alert>
      <Button onClick={() => navigate('/')} className="mt-4"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Feed</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex">Share Job</Button>
            {user?.role === 'candidate' && (
              <Button 
                size="sm" 
                className={hasApplied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                disabled={hasApplied || applying}
                onClick={handleApply}
              >
                {applying ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                {hasApplied ? 'Applied' : 'Apply Now'}
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
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <CardContent className="pt-0 p-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between -mt-10 mb-8 space-y-4 md:space-y-0">
                <div className="flex items-end space-x-6">
                  <div className="h-24 w-24 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center overflow-hidden">
                    {job.company?.companyProfile?.logoUrl ? (
                      <img src={job.company.companyProfile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-300" />
                    )}
                  </div>
                  <div className="pb-1">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg font-medium text-gray-600">{job.company?.fullName}</p>
                  </div>
                </div>
                <Badge className="w-fit h-fit px-4 py-1 text-base bg-blue-50 text-blue-700 border-none">{job.type}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-8">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> Location
                  </p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" /> Salary
                  </p>
                  <p className="font-semibold text-gray-900">{job.salaryRange}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" /> Category
                  </p>
                  <p className="font-semibold text-gray-900">{job.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Posted
                  </p>
                  <p className="font-semibold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="prose prose-blue max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
                  {job.description}
                </div>

                {job.requirements?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                          <span className="text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-3 mt-2 shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Company Info & Action */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>About Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-6">
                {job.company?.companyProfile?.description || 'No description available for this company.'}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {job.company?.companyProfile?.website && (
                  <a 
                    href={job.company.companyProfile.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-2" /> Visit Website
                  </a>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="h-4 w-4 mr-2" /> {job.company?.companyProfile?.location || 'Location hidden'}
                </div>
              </div>

              <Button asChild variant="secondary" className="w-full">
                <Link to={`/company/${job.company?._id}`}>View Company Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-200">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-xl font-bold">Interested in this role?</h3>
              <p className="text-blue-100 text-sm">
                Apply now and the recruiter will be notified of your interest.
              </p>
              <Button 
                onClick={handleApply}
                disabled={hasApplied || applying || user?.role === 'recruiter'}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 h-12 text-lg font-bold"
              >
                {applying ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                {hasApplied ? 'Successfully Applied' : 'Apply for this Job'}
              </Button>
              {user?.role === 'recruiter' && (
                <p className="text-xs text-blue-200 mt-2">Recruiters cannot apply for jobs.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
