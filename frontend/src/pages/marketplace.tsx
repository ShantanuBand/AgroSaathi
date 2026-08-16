import React from 'react';
import { useLocationContext } from '@/context/location-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListMarketplaceListings, useCreateMarketplaceListing, type MarketplaceListing } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/format';
import { Search, MapPin, Phone, User, Package, Plus, Store, X, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/context/language-context';
import { translateName } from '@/lib/translations';

export default function MarketplacePage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const { selectedDistrict, selectedCity } = useLocationContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<'all' | 'sell' | 'buy'>('all');
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [selectedSellerListing, setSelectedSellerListing] = React.useState<MarketplaceListing | null>(null);
  const [copiedPhone, setCopiedPhone] = React.useState(false);

  const [formData, setFormData] = React.useState({
    type: 'sell' as 'sell' | 'buy',
    cropName: '',
    category: 'Cereals',
    quantity: 10,
    unit: 'Quintal',
    pricePerUnit: 2200,
    location: '',
    state: 'Maharashtra',
    description: '',
    quality: 'A' as 'A' | 'B' | 'C',
    isOrganic: false,
    isNegotiable: true
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: listings, isLoading } = useListMarketplaceListings(
    { search: debouncedSearch, type: activeTab === 'all' ? undefined : activeTab as 'sell' | 'buy' },
    { query: { queryKey: ['marketplace', debouncedSearch, activeTab], refetchInterval: 10000, refetchOnMount: 'always' } }
  );

  const filteredListings = React.useMemo(() => {
    if (!Array.isArray(listings)) return [];
    return listings.filter(item => {
      if (selectedDistrict !== 'All') {
        const dKey = selectedDistrict.toLowerCase().split(' ')[0];
        const matchLoc = (item.location || '').toLowerCase().includes(dKey);
        const matchState = (item.state || '').toLowerCase().includes(dKey);
        if (!matchLoc && !matchState) return false;
      }
      if (selectedCity !== 'All') {
        const cKey = selectedCity.toLowerCase();
        if (!(item.location || '').toLowerCase().includes(cKey)) return false;
      }
      return true;
    });
  }, [listings, selectedDistrict, selectedCity]);

  const createListing = useCreateMarketplaceListing({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['marketplace'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        setShowCreateModal(false);
        setFormData({
          type: 'sell',
          cropName: '',
          category: 'Cereals',
          quantity: 10,
          unit: 'Quintal',
          pricePerUnit: 2200,
          location: '',
          state: 'Maharashtra',
          description: '',
          quality: 'A',
          isOrganic: false,
          isNegotiable: true
        });
      }
    }
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createListing.mutate({
      data: {
        ...formData,
        quantity: Number(formData.quantity),
        pricePerUnit: Number(formData.pricePerUnit)
      }
    });
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <AppLayout>
      <PageHeader 
        title={isMarathi ? 'शेतकरी खरेदी-विक्री दालन' : 'Agri Marketplace'} 
        description={isMarathi ? 'शेतकरी आणि खरेदीदारांशी थेट शेतमालाची खरेदी-विक्री करा.' : 'Buy and sell agricultural produce directly with farmers and buyers.'}
        accentColor="border-teal-500"
        actions={
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm shadow-primary/20 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" /> {isMarathi ? 'शेतमाल जाहीर करा' : 'Post Listing'}
          </button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex bg-muted/50 p-1 rounded-xl w-full md:w-auto">
          <button 
            className={`flex-1 md:w-32 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('all')}
          >
            {isMarathi ? 'सर्व शेतमाल' : 'All Items'}
          </button>
          <button 
            className={`flex-1 md:w-32 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === 'sell' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('sell')}
          >
            {isMarathi ? 'विक्रीसाठी' : 'For Sale'}
          </button>
          <button 
            className={`flex-1 md:w-32 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === 'buy' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('buy')}
          >
            {isMarathi ? 'खरेदी मागणी' : 'Wanted'}
          </button>
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={isMarathi ? 'ट्रॅक्टर, बियाणे, पिके, खरेदीदार शोधा...' : 'Search tractors, seeds, crops, buyers...'} 
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
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={listing.id} 
              className={`rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col shadow-sm ${
                listing.type === 'sell'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400'
                  : 'bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 hover:border-blue-400'
              }`}
            >
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                {listing.imageUrl ? (
                  <img src={listing.imageUrl} alt={listing.cropName} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-muted-foreground/30" />
                )}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                  listing.type === 'sell' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {listing.type === 'sell' ? (isMarathi ? 'विक्रीसाठी' : 'FOR SALE') : (isMarathi ? 'खरेदी मागणी' : 'WANTED BUY')}
                </div>
                {listing.isOrganic && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                    {isMarathi ? 'सेंद्रिय' : 'ORGANIC'}
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg line-clamp-1" title={translateName(listing.cropName, language)}>{translateName(listing.cropName, language)}</h3>
                  <div className={`font-mono font-bold text-lg whitespace-nowrap ${listing.type === 'sell' ? 'text-emerald-700 dark:text-emerald-300' : 'text-blue-700 dark:text-blue-300'}`}>
                    {formatCurrency(listing.pricePerUnit)}<span className="text-xs text-muted-foreground font-sans font-normal">/{translateName(listing.unit, language)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {listing.description}
                </p>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4 bg-background/50 p-3 rounded-xl border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="w-3.5 h-3.5" />
                    <span className="font-medium text-foreground">{listing.quantity} {translateName(listing.unit, language)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate font-medium text-foreground" title={translateName(listing.location, language)}>{translateName(listing.location, language)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">{listing.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {isMarathi ? 'दर्जा:' : 'Grade:'} <span className="font-bold text-foreground">{listing.quality}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedSellerListing(listing)}
                  className={`w-full flex items-center justify-center gap-2 font-medium py-2.5 rounded-xl transition-all shadow-sm cursor-pointer ${
                    listing.type === 'sell'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" /> {isMarathi ? (listing.type === 'sell' ? 'विक्रेत्याशी संपर्क साधा' : 'खरेदीदाराशी संपर्क साधा') : `Contact ${listing.type === 'sell' ? 'Seller' : 'Buyer'}`}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
            <Store className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold">{isMarathi ? 'कोणताही शेतमाल आढळला नाही' : 'No listings found'}</h3>
            <p className="text-muted-foreground">{isMarathi ? 'कृपया तुमचा शोध किंवा फिल्टर्स बदलून पहा.' : 'Try adjusting your search or filters.'}</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-teal-200 dark:border-teal-800 text-foreground w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-teal-50/80 dark:bg-teal-950/40">
              <h2 className="text-xl font-bold flex items-center gap-2 text-teal-900 dark:text-teal-100">
                <Plus className="w-5 h-5 text-teal-600" /> {isMarathi ? 'नवीन शेतमाल विक्री/खरेदी जाहीर करा' : 'Create Marketplace Listing'}
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'जाहीरातीचा प्रकार' : 'Listing Type'}</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({ ...formData, type: e.target.value as 'sell' | 'buy' })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="sell">{isMarathi ? 'विक्रीसाठी (माझा माल विकायचा आहे)' : 'For Sale (Selling Crop/Item)'}</option>
                    <option value="buy">{isMarathi ? 'खरेदीसाठी (मला माल हवा आहे)' : 'Wanted (Looking to Buy)'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'प्रवर्ग (Category)' : 'Category'}</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Cereals">{isMarathi ? 'तृणधान्ये (Cereals)' : 'Cereals'}</option>
                    <option value="Pulses">{isMarathi ? 'कडधान्ये (Pulses)' : 'Pulses'}</option>
                    <option value="Vegetables">{isMarathi ? 'भाज्या (Vegetables)' : 'Vegetables'}</option>
                    <option value="Fruits">{isMarathi ? 'फळे (Fruits)' : 'Fruits'}</option>
                    <option value="Spices">{isMarathi ? 'मसाले (Spices)' : 'Spices'}</option>
                    <option value="Seeds">{isMarathi ? 'बियाणे (Seeds)' : 'Seeds'}</option>
                    <option value="Equipment">{isMarathi ? 'अवजारे (Equipment)' : 'Equipment'}</option>
                    <option value="Fertilizers">{isMarathi ? 'खते (Fertilizers)' : 'Fertilizers'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'शेतमाल / वस्तूचे नाव' : 'Crop / Item Name'}</label>
                <input 
                  type="text" 
                  required 
                  placeholder={isMarathi ? 'उदा. शरबाती गहू, सेंद्रिय टोमॅटो, महिंद्रा ट्रॅक्टर' : 'e.g. Sharbati Wheat, Organic Tomatoes, Mahindra Tractor'}
                  value={formData.cropName}
                  onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'प्रमाण' : 'Quantity'}</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'एकक' : 'Unit'}</label>
                  <select 
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Quintal">{isMarathi ? 'क्विंटल' : 'Quintal'}</option>
                    <option value="Kg">{isMarathi ? 'किलो' : 'Kg'}</option>
                    <option value="Tonne">{isMarathi ? 'टन' : 'Tonne'}</option>
                    <option value="Bags">{isMarathi ? 'पोती' : 'Bags'}</option>
                    <option value="Units">{isMarathi ? 'नग' : 'Units'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'दर प्रति एकक (₹)' : 'Price / Unit (₹)'}</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.pricePerUnit}
                    onChange={e => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'गाव / शहर ठिकाण' : 'Village / City Location'}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder={isMarathi ? 'उदा. अमरावती, चांदूर रेल्वे, नाशिक' : 'e.g. Nashik, Ludhiana, Karnal'}
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'राज्य' : 'State'}</label>
                  <select 
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Maharashtra">{isMarathi ? 'महाराष्ट्र' : 'Maharashtra'}</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'दर्जा (Grade)' : 'Quality Grade'}</label>
                  <select 
                    value={formData.quality}
                    onChange={e => setFormData({ ...formData, quality: e.target.value as 'A' | 'B' | 'C' })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="A">{isMarathi ? 'अ वर्ग (उत्कृष्ट)' : 'Grade A (Premium)'}</option>
                    <option value="B">{isMarathi ? 'ब वर्ग (मध्यम)' : 'Grade B (Standard)'}</option>
                    <option value="C">{isMarathi ? 'क वर्ग (साधारण)' : 'Grade C (Fair)'}</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="isOrganic"
                    checked={formData.isOrganic}
                    onChange={e => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-input"
                  />
                  <label htmlFor="isOrganic" className="text-sm font-medium cursor-pointer">{isMarathi ? 'प्रमाणित सेंद्रिय' : 'Organic Certified'}</label>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="isNegotiable"
                    checked={formData.isNegotiable}
                    onChange={e => setFormData({ ...formData, isNegotiable: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-input"
                  />
                  <label htmlFor="isNegotiable" className="text-sm font-medium cursor-pointer">{isMarathi ? 'भावात बोलणी शक्य' : 'Price Negotiable'}</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">{isMarathi ? 'सविस्तर माहिती / वर्णन' : 'Description / Additional Info'}</label>
                <textarea 
                  rows={3}
                  placeholder={isMarathi ? 'कापणीची तारीख, ओलाव्याचे प्रमाण, डिलिव्हरी पर्याय टाका...' : 'Mention harvest date, moisture content, delivery options...'}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl font-medium border border-input hover:bg-muted transition-colors cursor-pointer"
                >
                  {isMarathi ? 'रद्द करा' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  disabled={createListing.isPending}
                  className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {createListing.isPending ? (isMarathi ? 'प्रसिद्ध करत आहे...' : 'Publishing...') : (isMarathi ? 'शेतमाल प्रसिद्ध करा' : 'Publish Listing')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSellerListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> {isMarathi ? 'संपर्क तपशील' : 'Contact Details'}
              </h2>
              <button 
                onClick={() => setSelectedSellerListing(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-muted/40 p-4 rounded-xl border border-border">
                <h3 className="font-bold text-lg text-foreground">{translateName(selectedSellerListing.cropName, language)}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedSellerListing.quantity} {translateName(selectedSellerListing.unit, language)} • {formatCurrency(selectedSellerListing.pricePerUnit)}/{translateName(selectedSellerListing.unit, language)}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {translateName(selectedSellerListing.location, language)}, {translateName(selectedSellerListing.state, language)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{isMarathi ? (selectedSellerListing.type === 'sell' ? 'विक्रेत्याचे नाव' : 'खरेदीदाराचे नाव') : (selectedSellerListing.type === 'sell' ? 'Seller Name' : 'Buyer Name')}</span>
                  <span className="font-bold text-foreground">{selectedSellerListing.sellerName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{isMarathi ? 'फोन नंबर' : 'Phone Number'}</span>
                  <span className="font-mono font-bold text-primary text-base">{selectedSellerListing.sellerPhone}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{isMarathi ? 'दर्जा व स्थिती' : 'Grade & Condition'}</span>
                  <span className="font-medium text-foreground">{isMarathi ? `दर्जा ${selectedSellerListing.quality} ${selectedSellerListing.isOrganic ? '• सेंद्रिय' : ''}` : `Grade ${selectedSellerListing.quality} ${selectedSellerListing.isOrganic ? '• Organic' : ''}`}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleCopyPhone(selectedSellerListing.sellerPhone)}
                  className="flex-1 py-3 px-4 rounded-xl border border-input font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copiedPhone ? (isMarathi ? 'कॉपी झाले!' : 'Copied!') : (isMarathi ? 'नंबर कॉपी करा' : 'Copy Number')}
                </button>
                <a 
                  href={`tel:${selectedSellerListing.sellerPhone}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20 cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> {isMarathi ? 'आत्ताच फोन करा' : 'Call Now'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
