import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobApplications, updateApplicationStatus } from '@/api/applicationApi';
import { getJob } from '@/api/jobApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, User, Mail, FileText, CheckCircle, XCircle, Clock, ExternalLink, MoreVertical } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobData, appData] = await Promise.all([
        getJob(jobId),
        getJobApplications(jobId)
      ]);
      setJob(jobData.data);
      setApplications(appData.data);
    } catch (err) {
      setError('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
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
      <Loader2 className="animate-spin h-10 w-10 text-black" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading applicants...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F2F4] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <Link to="/my-jobs" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Jobs
            </Link>
            <h1 className="text-3xl font-black text-black tracking-tight">Applicants</h1>
            <p className="text-gray-500 font-medium">Reviewing candidates for <span className="text-black font-bold">{job?.title}</span></p>
          </div>
          <Badge className="bg-black text-white px-4 py-1.5 rounded-full">{applications.length} Applied</Badge>
        </div>

        {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}

        {applications.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <User className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-black">No applicants yet</h2>
              <p className="text-gray-500 text-sm">Applications for this position will appear here once candidates apply.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app._id} className="border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    {/* Left: Candidate Info */}
                    <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                      <div className="flex items-start gap-6">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-black font-black text-2xl border-4 border-white shadow-sm">
                          {app.candidate.fullName?.[0]}
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-black leading-tight">{app.candidate.fullName}</h2>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                              <Mail className="h-4 w-4" /> {app.candidate.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                              <Clock className="h-4 w-4" /> Applied {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Actions & Resume */}
                    <div className="lg:w-1/3 p-8 flex flex-col sm:flex-row lg:flex-col gap-4">
                      <Button asChild variant="outline" className="w-full border-gray-200 hover:bg-gray-50 rounded-xl font-bold">
                        <a href={app.resume} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                          <FileText className="h-4 w-4" /> View Full CV <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Select 
                            value={app.status} 
                            onValueChange={(val) => handleStatusUpdate(app._id, val)}
                            disabled={updatingId === app._id}
                          >
                            <SelectTrigger className={`h-11 rounded-xl font-black uppercase tracking-widest text-[10px] ${getStatusColor(app.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {updatingId === app._id && <Loader2 className="animate-spin h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className="bg-gray-50/50 p-6 px-8 border-t border-gray-100">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Cover Letter / Note</p>
                      <p className="text-sm text-gray-600 italic">"{app.coverLetter}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;
