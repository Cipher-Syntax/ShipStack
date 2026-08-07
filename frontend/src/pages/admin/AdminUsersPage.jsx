import { useState, useEffect } from 'react';
import { getUsers, banUser, unbanUser } from '../../services/adminService';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../contexts/ToastContext';
import { Users, ShieldAlert, Shield, Search, Filter } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Pagination } from '../../components/ui/pagination';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchUsers = async (search = '') => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      if (search) params.search = search;
      if (roleFilter === 'STAFF') params.is_staff = true;
      if (roleFilter === 'DEVELOPER') params.is_verified_developer = true;
      if (roleFilter === 'SUSPENDED') params.is_active = false;
      const data = await getUsers(params);
      setUsers(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10) || 1);
    } catch (error) {
      addToast('Failed to load user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, roleFilter]);

  const handleToggleBan = async (user) => {
    try {
      if (user.is_active) {
        await banUser(user.id);
        addToast(`${user.username} has been suspended`, 'success');
      } else {
        await unbanUser(user.id);
        addToast(`${user.username}'s access has been restored`, 'success');
      }
      fetchUsers(searchTerm);
    } catch (error) {
      addToast('Account modification failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-primary">
        <div>
          <div className="inline-flex items-center gap-2 text-blue-500 mb-2">
            <Users size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Directory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">User Management</h1>
          <p className="text-text-secondary mt-2 max-w-xl">
            Control platform access, monitor user statuses, and enforce administrative actions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search username or email..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border-primary rounded-xl text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all shadow-sm"
            />
          </div>
          {/* Filter */}
          <div className="flex items-center gap-2 bg-background-secondary border border-border-primary rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
            <Filter size={16} className="text-text-tertiary" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer w-full"
            >
              <option value="ALL">All Roles</option>
              <option value="STAFF">Staff Admin</option>
              <option value="DEVELOPER">Verified Developer</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="border-border-primary shadow-sm overflow-hidden bg-background-secondary/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-surface-primary/80">
              <TableRow className="border-border-primary">
                <TableHead className="font-bold text-text-secondary py-4">Account</TableHead>
                <TableHead className="font-bold text-text-secondary py-4">Role Designation</TableHead>
                <TableHead className="font-bold text-text-secondary py-4">Status</TableHead>
                <TableHead className="font-bold text-text-secondary py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border-primary/50">
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-text-tertiary">
                      <Users size={48} strokeWidth={1} className="mb-4 text-border-primary" />
                      <p className="font-medium text-text-secondary">No users found.</p>
                      <p className="text-sm">Try adjusting your search filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id} className="border-border-primary/50 hover:bg-surface-hover/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${
                          user.is_superuser ? 'bg-gradient-to-tr from-slate-800 to-slate-600' : 
                          user.is_staff ? 'bg-gradient-to-tr from-blue-600 to-blue-400' :
                          'bg-gradient-to-tr from-accent-primary to-blue-400'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary">{user.username}</p>
                          <p className="text-xs text-text-secondary">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_superuser ? <Badge variant="primary" className="bg-slate-800 text-white border-slate-700">Superuser</Badge> : 
                       user.is_staff ? <Badge variant="info">Staff Admin</Badge> : 
                       user.is_verified_developer ? <Badge variant="success">Verified Developer</Badge> : 
                       <Badge variant="secondary" className="bg-background-primary">Standard Buyer</Badge>}
                    </TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span> Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span> Suspended
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!user.is_superuser && (
                        <Button
                          variant={user.is_active ? "outline" : "primary"}
                          size="sm"
                          className={`rounded-lg text-xs font-bold font-sans ${user.is_active ? 'text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300' : 'shadow-sm'}`}
                          onClick={() => handleToggleBan(user)}
                        >
                          {user.is_active ? <><ShieldAlert size={14} className="mr-1.5" /> Suspend</> : <><Shield size={14} className="mr-1.5" /> Restore Access</>}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-border-primary bg-surface-primary/50 flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
