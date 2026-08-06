import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/adminService';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../contexts/ToastContext';
import { FileClock, MonitorSmartphone, Server, Search, Filter } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Pagination } from '../../components/ui/pagination';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchLogs = async (search = '') => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      if (search) params.search = search;
      if (actionFilter !== 'ALL') params.action = actionFilter;
      const data = await getAuditLogs(params);
      setLogs(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10) || 1);
    } catch (error) {
      addToast('Failed to load audit trail', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchLogs(searchTerm), 500);
    return () => clearTimeout(delay);
  }, [searchTerm, currentPage, actionFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-primary">
        <div>
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <FileClock size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Immutable Records</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">System Audit Trail</h1>
          <p className="text-text-secondary mt-2 max-w-xl">
            A chronological, read-only ledger of all database mutations (Creates, Updates, Deletes) across the ShipStack platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search actor or ID..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border-primary rounded-xl text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all shadow-sm"
            />
          </div>
          {/* Filter */}
          <div className="flex items-center gap-2 bg-background-secondary border border-border-primary rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
            <Filter size={16} className="text-text-tertiary" />
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer w-full"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">Creates</option>
              <option value="UPDATE">Updates</option>
              <option value="DELETE">Deletes</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="border-border-primary shadow-sm overflow-hidden bg-background-secondary/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-surface-primary/80">
                <TableRow className="border-border-primary">
                  <TableHead className="font-bold text-text-secondary py-4 whitespace-nowrap">Timestamp</TableHead>
                  <TableHead className="font-bold text-text-secondary py-4">Action</TableHead>
                  <TableHead className="font-bold text-text-secondary py-4">Target Model</TableHead>
                  <TableHead className="font-bold text-text-secondary py-4">Actor / System</TableHead>
                  <TableHead className="font-bold text-text-secondary py-4 text-right">IP Footprint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="border-border-primary/50">
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-text-tertiary">
                        <Server size={48} strokeWidth={1} className="mb-4 text-border-primary" />
                        <p className="font-medium text-text-secondary">No logs found.</p>
                        <p className="text-sm">The audit ledger is currently empty for this query.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map(log => (
                    <TableRow key={log.id} className="border-border-primary/50 hover:bg-surface-hover/50 transition-colors font-mono text-sm">
                      <TableCell className="py-4 text-text-secondary whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute:'2-digit', second:'2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border uppercase tracking-widest text-[10px] py-0.5 px-2 font-bold shadow-sm ${
                          log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30' :
                          log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30' : 
                          'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30'
                        }`}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-primary">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold font-sans">{log.target_model}</span>
                          <span className="text-text-tertiary bg-background-primary px-1.5 py-0.5 rounded border border-border-primary text-xs">
                            {log.target_id.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-text-primary flex items-center gap-2 font-sans">
                        {log.actor_email ? (
                          <>
                            <div className="w-6 h-6 rounded-md bg-accent-primary/10 text-accent-primary flex items-center justify-center text-xs border border-accent-primary/20">
                              {log.actor_email.charAt(0).toUpperCase()}
                            </div>
                            {log.actor_email}
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-md bg-slate-500/10 text-slate-500 flex items-center justify-center text-xs border border-slate-500/20">
                              <Server size={12} />
                            </div>
                            System Internal
                          </>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-text-tertiary">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <MonitorSmartphone size={14} className="opacity-50" />
                          {log.ip_address || '0.0.0.0'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
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

export default AdminAuditLogsPage;
