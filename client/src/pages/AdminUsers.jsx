import { useState, useEffect } from 'react';
import { getUsers, toggleBlockUser } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, Search, Filter, Ban, CheckCircle, 
  Mail, Calendar, Briefcase, User as UserIcon,
  ShieldCheck, MoreVertical, ShieldAlert
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    setProcessingId(userId);
    try {
      const result = await toggleBlockUser(userId);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: result.user.isBlocked } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin h-10 w-10 text-black" />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading user directory...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2 border border-blue-100">
              <UserIcon className="h-3 w-3 mr-2" /> User Management
            </div>
            <h1 className="text-4xl font-black text-black tracking-tighter">Directory</h1>
            <p className="text-gray-500 font-medium">Manage accounts, roles, and access controls.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-12 h-12 rounded-2xl border-none shadow-sm shadow-gray-200/50 bg-white focus-visible:ring-black font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6 pl-8">User Info</TableHead>
                  <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6">Role</TableHead>
                  <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6">Status</TableHead>
                  <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-6 text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} className="border-gray-50 hover:bg-gray-50/30 transition-colors group">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm shadow-gray-100">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="bg-black text-white font-black">
                            {user.fullName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="font-black text-black group-hover:text-blue-600 transition-colors">{user.fullName}</p>
                          <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge 
                        variant="secondary" 
                        className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none
                          ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 
                            user.role === 'recruiter' ? 'bg-purple-50 text-purple-600' : 
                            'bg-blue-50 text-blue-600'}`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      {user.isBlocked ? (
                        <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest">
                          <Ban className="h-4 w-4" /> Blocked
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                          <CheckCircle className="h-4 w-4" /> Active
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-6 pr-8 text-right">
                      {user.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`rounded-xl h-10 w-10 ${user.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                            onClick={() => handleToggleBlock(user._id)}
                            disabled={processingId === user._id}
                          >
                            {processingId === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : user.isBlocked ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-gray-400">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48 shadow-2xl border-gray-100">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Quick Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs cursor-pointer">
                                <Mail className="mr-2 h-4 w-4" /> Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl py-2.5 font-bold text-xs cursor-pointer">
                                <Calendar className="mr-2 h-4 w-4" /> View Activity
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className={`rounded-xl py-2.5 font-black text-xs cursor-pointer ${user.isBlocked ? 'text-green-600' : 'text-red-600'}`}
                                onClick={() => handleToggleBlock(user._id)}
                              >
                                {user.isBlocked ? (
                                  <><CheckCircle className="mr-2 h-4 w-4" /> Restore Access</>
                                ) : (
                                  <><Ban className="mr-2 h-4 w-4" /> Restrict Access</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                      {user.role === 'admin' && (
                        <Badge variant="outline" className="rounded-full text-[10px] font-black text-gray-300 uppercase tracking-widest border-gray-100">System Protected</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-black">No users found</h3>
                  <p className="text-gray-400 font-medium">Try adjusting your search filters.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
