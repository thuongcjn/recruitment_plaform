import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getJob } from '@/api/jobApi';
import { applyToJob, getMyApplications } from '@/api/applicationApi';
import { sendMessage } from '@/api/chatApi';
import { createReport } from '@/api/reportApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, ArrowLeft, MapPin, Briefcase, Clock, Building2, 
  Globe, DollarSign, CheckCircle2, Flag, MessageCircle 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

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
  
  // Reporting state
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'candidate') {
      checkIfApplied();
    }
  }, [id, isAuthenticated, user?.role]);

  useEffect(() => {
    if (job) {
      setChatMessage(`Hi, I'm interested in the ${job.title} position.`);
    }
  }, [job]);

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

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!chatMessage.trim()) return;

    setStartingChat(true);
    try {
      const res = await sendMessage({
        receiverId: job.company._id,
        text: chatMessage
      });
      navigate(`/chat/${res.conversationId}`);
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Failed to start chat session');
    } finally {
      setStartingChat(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    
    setReporting(true);
    try {
      await createReport({
        jobId: id,
        reason: reportReason
      });
      setSuccess('Job reported successfully. Our team will review it.');
      setReportReason('');
    } catch (err) {
      setError('Failed to submit report');
    } finally {
      setReporting(false);
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
            
            {isAuthenticated && user?.role === 'candidate' && (
              <AlertDialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with Recruiter
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl p-8 border-none max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black tracking-tighter">Start Conversation</AlertDialogTitle>
                    <AlertDialogDescription className="font-medium text-gray-500">
                      Send a message to the recruiter of {job.company?.fullName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Textarea 
                      placeholder="Type your first message..." 
                      className="rounded-2xl border-gray-100 bg-gray-50 min-h-[120px]"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleStartChat}
                      disabled={!chatMessage.trim() || startingChat}
                      className="rounded-xl bg-black hover:bg-gray-800 font-bold"
                    >
                      {startingChat ? 'Sending...' : 'Send Message'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {user?.role === 'candidate' && (
              <Button 
                size="sm" 
                className={hasApplied ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-800"}
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
            <div className="h-32 bg-black"></div>
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
                    <h1 className="text-3xl font-black text-black tracking-tighter">{job.title}</h1>
                    <p className="text-lg font-bold text-gray-500">{job.company?.fullName}</p>
                  </div>
                </div>
                <Badge className="w-fit h-fit px-4 py-1 text-xs font-black bg-gray-100 text-black border-none uppercase tracking-widest">{job.type}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> Location
                  </p>
                  <p className="font-bold text-black">{job.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" /> Salary
                  </p>
                  <p className="font-bold text-black">{job.salaryRange}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" /> Category
                  </p>
                  <p className="font-bold text-black">{job.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-black flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Posted
                  </p>
                  <p className="font-bold text-black">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-black text-black tracking-tight mb-4">Job Description</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8 font-medium">
                  {job.description}
                </div>

                {job.requirements?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-black tracking-tight mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-black mr-3 mt-0.5 shrink-0" />
                          <span className="text-gray-600 font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-black tracking-tight mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-black mr-3 mt-2 shrink-0" />
                          <span className="text-gray-600 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Flag className="h-3 w-3" />
                  Is there something wrong with this job?
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50">
                      Report Job
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl p-8 border-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black tracking-tighter">Report Job Posting</AlertDialogTitle>
                      <AlertDialogDescription className="font-medium text-gray-500">
                        Please specify the reason for reporting this job. Our team will review it within 24 hours.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Textarea 
                        placeholder="Reason for report (e.g. Fake job, Misleading info, Inappropriate content...)" 
                        className="rounded-2xl border-gray-100 bg-gray-50 min-h-[120px]"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleReport}
                        disabled={!reportReason.trim() || reporting}
                        className="rounded-xl bg-red-600 hover:bg-red-700 font-bold"
                      >
                        {reporting ? 'Reporting...' : 'Submit Report'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Company Info & Action */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-black tracking-tight">About Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-6 font-medium">
                {job.company?.companyProfile?.description || 'No description available for this company.'}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {job.company?.companyProfile?.website && (
                  <a 
                    href={job.company.companyProfile.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-sm text-black font-bold hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-2" /> Visit Website
                  </a>
                )}
                <div className="flex items-center text-sm text-gray-400 font-bold">
                  <Building2 className="h-4 w-4 mr-2" /> {job.company?.companyProfile?.location || 'Location hidden'}
                </div>
              </div>

              <Button asChild variant="outline" className="w-full rounded-xl font-bold border-gray-200">
                <Link to={`/company/${job.company?._id}`}>View Company Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black text-white border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-6">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tighter">Interested in this role?</h3>
                <p className="text-gray-400 text-sm font-medium">
                  Join {job.company?.fullName} as their next {job.title}.
                </p>
              </div>
              <Button 
                onClick={handleApply}
                disabled={hasApplied || applying || user?.role === 'recruiter'}
                className="w-full bg-white text-black hover:bg-gray-100 h-14 rounded-2xl text-lg font-black tracking-tight transition-transform active:scale-95 shadow-xl"
              >
                {applying ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                {hasApplied ? 'Successfully Applied' : 'Apply for this Job'}
              </Button>
              {user?.role === 'recruiter' && (
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Recruiters cannot apply for jobs.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
