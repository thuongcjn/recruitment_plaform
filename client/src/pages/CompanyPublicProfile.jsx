import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPublicProfile } from '@/api/profileApi';
import { getJobs } from '@/api/jobApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, MapPin, Globe, Building2, Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const CompanyPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [profileData, jobsData] = await Promise.all([
        getPublicProfile(id),
        getJobs({ company: id }) // This requires the getJobs API to handle company filter
      ]);
      
      setCompany(profileData.data);
      // Filter jobs from this company if the backend didn't do it correctly
      // (My backend getJobs actually handles category/type but I should add company filter)
      setJobs(jobsData.data.filter(job => job.company._id === id));
    } catch (err) {
      setError('Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium">Loading company profile...</p>
    </div>
  );

  if (error || !company) return (
    <div className="container mx-auto p-10 text-center">
      <Alert variant="destructive" className="max-w-md mx-auto mb-6"><AlertDescription>{error || 'Company not found'}</AlertDescription></Alert>
      <Button onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Button>
    </div>
  );

  const profile = company.companyProfile;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-8 space-y-4 md:space-y-0 md:space-x-8">
            <div className="h-32 w-32 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
              {profile?.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="h-16 w-16 text-gray-200" />
              )}
            </div>
            <div className="pb-2 space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.companyName || company.fullName}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                {profile?.location && <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> {profile.location}</div>}
                {profile?.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                    <Globe className="h-4 w-4 mr-1.5" /> {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5" /> {jobs.length} Open Positions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: About */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>About {profile?.companyName || company.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                {profile?.description || 'No description provided by the company.'}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 px-1">Open Positions</h2>
            {jobs.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <p className="text-gray-500">No open positions at the moment.</p>
              </Card>
            ) : (
              jobs.map(job => (
                <Card key={job._id} className="hover:shadow-md transition-shadow">
                  <Link to={`/jobs/${job._id}`}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">{job.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">{job.type}</Badge>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.salaryRange}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Details <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div className="lg:col-span-4">
          <Card className="border-none shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Industry</span>
                <span className="font-medium text-sm">Tech & Software</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Active Jobs</span>
                <span className="font-medium text-sm">{jobs.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Member Since</span>
                <span className="font-medium text-sm">{new Date(company.createdAt).getFullYear()}</span>
              </div>
              <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                <a href={profile?.website} target="_blank" rel="noreferrer">
                  Official Website <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicProfile;
