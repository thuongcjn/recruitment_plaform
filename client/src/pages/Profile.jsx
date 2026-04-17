import { useAuthStore } from '../store/useAuthStore';
import CandidateProfile from '../components/profile/CandidateProfile';
import CompanyProfile from '../components/profile/CompanyProfile';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile information and preferences.</p>
        </div>
        
        {user?.role === 'candidate' ? (
          <CandidateProfile user={user} />
        ) : (
          <CompanyProfile user={user} />
        )}
      </div>
    </div>
  );
};

export default Profile;
