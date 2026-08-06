import { useState, useEffect } from 'react';
import { getReports, getAuditLogs } from '../../services/adminService';
import { Users, ShieldCheck, List, DollarSign, Activity, FileClock, ArrowRight, UserCheck } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';

const StatCard = ({ title, value, icon: Icon, loading, colorClass, link }) => (
  <Link to={link || '#'} className={`group bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm hover:border-accent-primary/40 hover:shadow-md transition-all flex flex-col justify-between h-full ${!link && 'cursor-default pointer-events-none'}`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{title}</span>
      <div className={`p-2.5 rounded-xl transition-colors ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      {loading ? (
        <Skeleton className="h-10 w-24 mb-2" />
      ) : (
        <h3 className="text-3xl font-display font-bold text-text-primary tracking-tight">{value}</h3>
      )}
      {link && (
        <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
          View details <ArrowRight size={14} />
        </div>
      )}
    </div>
  </Link>
);

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, logsRes] = await Promise.all([
          getReports(),
          getAuditLogs({ limit: 5 })
        ]);
        setMetrics(reportsRes.data);
        setRecentLogs(logsRes.results?.slice(0, 5) || logsRes.slice(0, 5) || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-8 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <ShieldCheck size={14} /> System Administrator
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Monitor real-time marketplace analytics, review pending developer applications, and track system mutations across the ShipStack platform.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link to="/admin/audit" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-xl font-bold px-6 py-3 transition-colors shadow-sm border border-white/10">
            <FileClock size={18} /> System Audit Trail
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error/10 text-error rounded-radius-md border border-error/20 flex items-center gap-2 font-medium">
          <Activity size={18} /> {error}
        </div>
      )}

      {/* Main Metrics Grid */}
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={metrics ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(metrics.total_revenue) : ''}
            icon={DollarSign}
            loading={loading}
            colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
          />
          <StatCard
            title="Total Users"
            value={metrics?.total_users}
            icon={Users}
            loading={loading}
            link="/admin/users"
            colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white"
          />
          <StatCard
            title="Verified Devs"
            value={metrics?.verified_developers}
            icon={UserCheck}
            loading={loading}
            link="/admin/users"
            colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white"
          />
          <StatCard
            title="Active Listings"
            value={metrics?.total_listings}
            icon={List}
            loading={loading}
            link="/admin/listings"
            colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white"
          />
        </div>
      )}

      {/* Secondary Grid (Actionable Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Actions */}
        <div className="bg-background-secondary rounded-3xl border border-border-primary shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-primary flex items-center justify-between bg-surface-primary/50">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Requires Attention</h2>
              <p className="text-sm text-text-secondary mt-1">Items pending administrator review</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
              <Activity size={24} />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            <Link to="/admin/verifications" className="flex items-center justify-between p-5 rounded-2xl border border-border-primary hover:border-rose-400/50 hover:bg-rose-500/5 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background-primary flex items-center justify-center border border-border-primary shadow-sm text-text-secondary group-hover:text-rose-500 transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary group-hover:text-rose-500 transition-colors">Developer Verifications</h3>
                  <p className="text-sm text-text-secondary mt-0.5">Review portfolios and GitHub profiles</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {loading ? <Skeleton className="h-8 w-12 rounded-full" /> : (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${metrics?.pending_verifications > 0 ? 'bg-rose-500 text-white shadow-sm' : 'bg-background-primary text-text-tertiary border border-border-primary'}`}>
                    {metrics?.pending_verifications}
                  </span>
                )}
                <ArrowRight size={18} className="text-text-tertiary group-hover:text-rose-500 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/listings" className="flex items-center justify-between p-5 rounded-2xl border border-border-primary hover:border-amber-400/50 hover:bg-amber-500/5 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background-primary flex items-center justify-center border border-border-primary shadow-sm text-text-secondary group-hover:text-amber-500 transition-colors">
                  <List size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary group-hover:text-amber-500 transition-colors">Software Listings</h3>
                  <p className="text-sm text-text-secondary mt-0.5">Vet new marketplace submissions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {loading ? <Skeleton className="h-8 w-12 rounded-full" /> : (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${metrics?.pending_listings > 0 ? 'bg-amber-500 text-white shadow-sm' : 'bg-background-primary text-text-tertiary border border-border-primary'}`}>
                    {metrics?.pending_listings}
                  </span>
                )}
                <ArrowRight size={18} className="text-text-tertiary group-hover:text-amber-500 transition-colors" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Audit Logs snippet */}
        <div className="bg-background-secondary rounded-3xl border border-border-primary shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-primary flex items-center justify-between bg-surface-primary/50">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Recent Mutations</h2>
              <p className="text-sm text-text-secondary mt-1">Latest system automated audit trail</p>
            </div>
            <Link to="/admin/audit" className="text-sm font-semibold text-accent-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-0 flex-1 overflow-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : recentLogs.length === 0 ? (
              <div className="p-12 text-center text-text-tertiary flex flex-col items-center">
                <FileClock size={32} className="mb-3 opacity-50" />
                <p>No recent audit logs.</p>
              </div>
            ) : (
              <div className="divide-y divide-border-primary">
                {recentLogs.map(log => (
                  <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-surface-hover transition-colors">
                    <div className="shrink-0 mt-0.5">
                      {log.action === 'CREATE' ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      ) : log.action === 'UPDATE' ? (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        <span className="font-bold">{log.actor_email || 'System'}</span> performed <Badge variant={log.action === 'CREATE' ? 'success' : log.action === 'UPDATE' ? 'info' : 'error'} className="mx-1 text-[10px] uppercase py-0">{log.action}</Badge> on <span className="font-semibold text-text-secondary">{log.target_model}</span>
                      </p>
                      <p className="text-xs text-text-tertiary mt-1.5 flex items-center gap-2">
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                        <span className="w-1 h-1 rounded-full bg-border-primary" />
                        <span className="font-mono text-[10px]">{log.target_id.split('-')[0]}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
