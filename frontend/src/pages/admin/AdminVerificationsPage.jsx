import { useState, useEffect } from 'react';
import { getVerifications, approveVerification, rejectVerification } from '../../services/adminService';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { useToast } from '../../contexts/ToastContext';
import { Check, X, ShieldCheck, Code, Globe, ExternalLink, Filter } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Pagination } from '../../components/ui/pagination';

const AdminVerificationsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const data = await getVerifications(params);
      setApps(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10) || 1);
    } catch (error) {
      addToast('Failed to load verifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [currentPage, statusFilter]);

  const handleApprove = async (id) => {
    try {
      await approveVerification(id);
      addToast('Verification approved successfully! They are now a Creator.', 'success');
      fetchApps();
    } catch (error) {
      addToast('Failed to approve verification', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectVerification(id);
      addToast('Verification application rejected.', 'success');
      fetchApps();
    } catch (error) {
      addToast('Failed to reject verification', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-primary">
        <div>
          <div className="inline-flex items-center gap-2 text-rose-500 mb-2">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Queue</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">Creator Verification</h1>
          <p className="text-text-secondary mt-2 max-w-xl">
            Review pending applications for developer privileges to maintain marketplace quality and trust.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background-secondary border border-border-primary rounded-xl px-3 py-2 shadow-sm">
            <Filter size={16} className="text-text-tertiary" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="border-border-primary shadow-sm overflow-hidden bg-background-secondary/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-surface-primary/80">
              <TableRow className="border-border-primary">
                <TableHead className="font-bold text-text-secondary py-4 w-[20%]">Applicant</TableHead>
                <TableHead className="font-bold text-text-secondary py-4 w-[25%]">External Links</TableHead>
                <TableHead className="font-bold text-text-secondary py-4 w-[40%]">Statement of Intent</TableHead>
                <TableHead className="font-bold text-text-secondary py-4 text-right w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-border-primary/50">
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-10 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : apps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-text-tertiary">
                      <ShieldCheck size={48} strokeWidth={1} className="mb-4 text-border-primary" />
                      <p className="font-medium text-text-secondary">Inbox zero!</p>
                      <p className="text-sm">There are no verification requests matching your filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                apps.map(app => (
                  <TableRow key={app.id} className="border-border-primary/50 hover:bg-surface-hover/50 transition-colors group">
                    <TableCell className="py-5 align-top">
                      <p className="font-bold text-text-primary text-base">{app.username}</p>
                      <p className="text-xs text-text-tertiary font-medium">{app.email}</p>
                      <p className="text-[10px] text-text-tertiary mt-2">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                      {app.status !== 'PENDING' && (
                        <p className={`text-[10px] font-bold mt-1 ${app.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'}`}>{app.status}</p>
                      )}
                    </TableCell>
                    <TableCell className="align-top space-y-2">
                      <a href={app.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary bg-background-primary border border-border-primary px-3 py-1.5 rounded-lg w-max transition-colors shadow-sm">
                        <Code size={14} /> GitHub Profile <ExternalLink size={12} className="opacity-50" />
                      </a>
                      {app.portfolio_url && (
                        <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-accent-primary bg-background-primary border border-border-primary px-3 py-1.5 rounded-lg w-max transition-colors shadow-sm">
                          <Globe size={14} /> Portfolio Site <ExternalLink size={12} className="opacity-50" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="bg-background-primary border border-border-primary rounded-xl p-3 text-sm text-text-secondary leading-relaxed max-h-32 overflow-y-auto">
                        "{app.statement}"
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex justify-end space-x-2">
                        {app.status === 'PENDING' ? (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 shadow-sm" 
                              onClick={() => handleApprove(app.id)} 
                              title="Approve Application"
                            >
                              <Check strokeWidth={3} className="w-4 h-4 mr-1.5" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 rounded-lg px-3 shadow-sm" 
                              onClick={() => handleReject(app.id)} 
                              title="Reject Application"
                            >
                              <X strokeWidth={3} className="w-4 h-4 mr-1.5" /> Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-text-tertiary">Action completed</span>
                        )}
                      </div>
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

export default AdminVerificationsPage;
