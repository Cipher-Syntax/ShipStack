import { useState, useEffect } from 'react';
import { getListings, approveListing, rejectListing } from '../../services/adminService';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { useToast } from '../../contexts/ToastContext';
import { Check, X, List, ExternalLink, Tag, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { Pagination } from '../../components/ui/pagination';

const AdminListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const data = await getListings(params);
      setListings(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10) || 1);
    } catch (error) {
      addToast('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentPage, statusFilter]);

  const handleApprove = async (id) => {
    try {
      await approveListing(id);
      addToast('Software listing approved and published', 'success');
      fetchListings();
    } catch (error) {
      addToast('Failed to approve listing', 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter a rejection reason to send to the developer:');
    if (reason === null) return;
    try {
      await rejectListing(id, reason);
      addToast('Listing rejected. Notification sent to developer.', 'success');
      fetchListings();
    } catch (error) {
      addToast('Failed to reject listing', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-primary">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-500 mb-2">
            <List size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Moderation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">Marketplace Review</h1>
          <p className="text-text-secondary mt-2 max-w-xl">
            Audit software submissions for quality, pricing, and policy compliance before publishing to the live marketplace.
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
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="PUBLISHED">Published</option>
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
                <TableHead className="font-bold text-text-secondary py-4">Software Identity</TableHead>
                <TableHead className="font-bold text-text-secondary py-4">Price / License</TableHead>
                <TableHead className="font-bold text-text-secondary py-4">Current Status</TableHead>
                <TableHead className="font-bold text-text-secondary py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-border-primary/50">
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-10 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-text-tertiary">
                      <List size={48} strokeWidth={1} className="mb-4 text-border-primary" />
                      <p className="font-medium text-text-secondary">All caught up!</p>
                      <p className="text-sm">There are no listings matching your filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listings.map(listing => (
                  <TableRow key={listing.id} className="border-border-primary/50 hover:bg-surface-hover/50 transition-colors">
                    <TableCell className="py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20 text-amber-600 shadow-sm shrink-0">
                          <Tag size={20} />
                        </div>
                        <div>
                          <Link to={`/listings/${listing.slug}`} className="font-bold text-text-primary text-base hover:text-accent-primary transition-colors flex items-center gap-1.5" target="_blank" rel="noopener noreferrer">
                            {listing.title} <ExternalLink size={14} className="opacity-50" />
                          </Link>
                          <p className="text-xs text-text-tertiary mt-1 font-mono">{listing.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="font-bold text-text-primary text-base tracking-tight">
                        ${listing.price}
                      </div>
                      <div className="text-xs text-text-secondary">One-time purchase</div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
                        listing.status === 'PUBLISHED' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        listing.status === 'REJECTED' ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' :
                        listing.status === 'PENDING_REVIEW' ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' :
                        'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20'
                      }`}>
                        {listing.status === 'PENDING_REVIEW' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                        {listing.status.replace('_', ' ')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <div className="flex justify-end space-x-2">
                        {listing.status === 'PENDING_REVIEW' ? (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-2.5 shadow-sm" 
                              onClick={() => handleApprove(listing.id)} 
                              title="Approve & Publish"
                            >
                              <Check strokeWidth={3} className="w-4 h-4 mr-1.5" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 rounded-lg px-2.5 shadow-sm" 
                              onClick={() => handleReject(listing.id)} 
                              title="Reject Listing"
                            >
                              <X strokeWidth={3} className="w-4 h-4 mr-1.5" /> Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-text-tertiary">No actions available</span>
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

export default AdminListingsPage;
