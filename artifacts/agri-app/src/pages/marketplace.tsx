import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListMarketplaceListings, useCreateMarketplaceListing } from '@workspace/api-client-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { Search, MapPin, Phone, User, Package, Plus, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'sell' | 'buy'>('all');
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: listings, isLoading, refetch } = useListMarketplaceListings(
    { search: debouncedSearch, type: activeTab === 'all' ? undefined : activeTab as 'sell' | 'buy' },
    { query: { queryKey: ['marketplace', debouncedSearch, activeTab] } }
  );

  return (
    <AppLayout>
      <PageHeader 
        title="Krishi Marketplace" 
        description="Buy equipment, seeds, and sell your produce directly to verified buyers."
        actions={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm shadow-primary/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Post Listing
          </button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex bg-muted/50 p-1 rounded-xl w-full md:w-auto">
          <button 
            className={`flex-1 md:w-32 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('all')}
          >
            All Items
          </button>
          <button 
            className={`flex-1 md:w-32 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'sell' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('sell')}
          >
            For Sale
          </button>
          <button 
            className={`flex-1 md:w-32 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'buy' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('buy')}
          >
            Wanted
          </button>
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tractors, seeds, buyers..." 
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl h-80 animate-pulse flex flex-col overflow-hidden">
              <div className="h-40 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted w-1/2 rounded"></div>
                <div className="h-4 bg-muted w-1/3 rounded"></div>
                <div className="h-8 bg-muted w-full rounded mt-auto"></div>
              </div>
            </div>
          ))
        ) : listings && listings.length > 0 ? (
          listings.map((listing, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={listing.id} 
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col"
            >
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                {listing.imageUrl ? (
                  <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-muted-foreground/30" />
                )}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                  listing.type === 'sell' 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-blue-500/90 text-white'
                }`}>
                  {listing.type === 'sell' ? 'FOR SALE' : 'WANTED'}
                </div>
                {listing.isOrganic && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-md">
                    ORGANIC
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg line-clamp-1" title={listing.cropName}>{listing.cropName}</h3>
                  <div className="font-mono font-bold text-lg whitespace-nowrap text-primary">
                    {formatCurrency(listing.pricePerUnit)}<span className="text-xs text-muted-foreground font-sans font-normal">/{listing.unit}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {listing.description}
                </p>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4 bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="w-3.5 h-3.5" />
                    <span className="font-medium text-foreground">{listing.quantity} {listing.unit}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate" title={listing.location}>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">{listing.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    Quality: <span className="font-bold text-foreground">{listing.quality}</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-medium py-2.5 rounded-xl transition-colors border border-primary/20 hover:border-primary">
                  <Phone className="w-4 h-4" /> Contact Seller
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <Store className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold">No listings found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
