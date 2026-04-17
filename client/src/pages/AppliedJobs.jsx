import { useState, useEffect } from 'react';
import { getMyApplications } from '@/api/applicationApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Calendar, MapPin, Building2, ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data.data);
    } catch (err) {
      setError('Failed to fetch your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">Loading applications...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F2F4] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-black tracking-tight">Your Applications</h1>
          <p className="text-gray-500 font-medium">Track the status of your job applications in one place.</p>
        </div>

        {applications.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-8 w-8 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-black">No applications yet</h2>
              <p className="text-gray-500 text-sm">You haven't applied for any jobs yet. Start your journey today!</p>
              <Button asChild className="bg-black hover:bg-gray-800 rounded-xl px-8">
                <Link to="/">Browse Jobs</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <Card key={app._id} className="border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-all group overflow-hidden">
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Status Indicator Bar */}
                  <div className={`w-2 ${getStatusColor(app.status).split(' ')[0]}`}></div>
                  
                  <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                          {app.job.company?.companyProfile?.logoUrl ? (
                            <img src={app.job.company.companyProfile.logoUrl} alt="logo" className="w-full h-full object-contain p-1 rounded-xl" />
                          ) : (
                            <Building2 className="h-7 w-7 text-gray-300" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <Link to={`/jobs/${app.job._id}`} className="text-xl font-bold text-black hover:text-blue-600 transition-colors flex items-center gap-2">
                            {app.job.title} <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                          </Link>
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-bold text-gray-500">
                            <span className="text-gray-900">{app.job.company?.companyProfile?.companyName || app.job.company?.fullName}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.job.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <Badge className={`${getStatusColor(app.status)} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border`}>
                          {app.status}
                        </Badge>
                        <a 
                          href={app.resume} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" /> View Submitted CV
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
