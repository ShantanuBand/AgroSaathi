import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useGetProfile, useUpdateProfile } from '@workspace/api-client-react';
import { User, MapPin, Phone, Mail, Landmark, Sprout, Droplet, Layers, CheckCircle, Pencil, Save, Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { DistrictCitySelector } from '@/components/district-city-selector';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { translateName } from '@/lib/translations';

const CROP_OPTIONS = [
  "Soybean", "Tur (Pigeon Pea)", "Cotton", "Wheat", "Chana (Chickpea)",
  "Orange (Santra)", "Onion", "Tomato", "Banana", "Turmeric", "Moong", "Urad"
];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile, isLoading } = useGetProfile({ query: { queryKey: ['profile'] } });
  
  const activeProfile = React.useMemo(() => {
    if (!user && !profile) return null;
    return {
      id: profile?.id || user?.id || 'usr_demo',
      name: profile?.name || user?.name || '',
      phone: profile?.phone || user?.phone || '',
      email: profile?.email || user?.email || '',
      village: profile?.village || user?.city || 'Chandur Railway',
      district: profile?.district || user?.district || 'Amravati',
      state: profile?.state || user?.state || 'Maharashtra',
      landHolding: profile?.landHolding || user?.landHolding || 4.5,
      landUnit: 'Acres',
      primaryCrops: profile?.primaryCrops || user?.primaryCrops || ['Soybean', 'Tur (Pigeon Pea)', 'Cotton'],
      irrigationType: (profile as any)?.irrigationType || 'Drip / Sprinkler',
      soilType: (profile as any)?.soilType || 'Medium Black Soil',
      kccHolder: true,
      pmFasalBimaEnrolled: true,
    };
  }, [user, profile]);

  const updateProfile = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        setIsEditing(false);
      }
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    village: 'Chandur Railway',
    district: 'Amravati',
    state: 'Maharashtra',
    landHolding: 4.5,
    irrigationType: 'Drip / Sprinkler',
    soilType: 'Medium Black Soil',
    primaryCrops: ['Soybean', 'Tur (Pigeon Pea)', 'Cotton'],
    kccHolder: true,
    pmFasalBimaEnrolled: true,
  });

  useEffect(() => {
    if (activeProfile && !isEditing) {
      setFormData({
        name: activeProfile.name || '',
        phone: activeProfile.phone || '',
        email: activeProfile.email || '',
        village: activeProfile.village || 'Chandur Railway',
        district: activeProfile.district || 'Amravati',
        state: activeProfile.state || 'Maharashtra',
        landHolding: activeProfile.landHolding || 4.5,
        irrigationType: activeProfile.irrigationType || 'Drip / Sprinkler',
        soilType: activeProfile.soilType || 'Medium Black Soil',
        primaryCrops: Array.isArray(activeProfile.primaryCrops) && activeProfile.primaryCrops.length > 0 
          ? activeProfile.primaryCrops 
          : ['Soybean', 'Tur (Pigeon Pea)', 'Cotton'],
        kccHolder: activeProfile.kccHolder ?? true,
        pmFasalBimaEnrolled: activeProfile.pmFasalBimaEnrolled ?? true,
      });
    }
  }, [activeProfile, isEditing]);

  const toggleCrop = (crop: string) => {
    if (formData.primaryCrops.includes(crop)) {
      setFormData({
        ...formData,
        primaryCrops: formData.primaryCrops.filter(c => c !== crop)
      });
    } else {
      setFormData({
        ...formData,
        primaryCrops: [...formData.primaryCrops, crop]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      data: {
        name: formData.name,
        email: formData.email,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        landHolding: Number(formData.landHolding),
        irrigationType: formData.irrigationType,
        soilType: formData.soilType,
        primaryCrops: formData.primaryCrops,
      }
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-48 bg-muted rounded-2xl"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-64 bg-muted rounded-2xl md:col-span-1"></div>
            <div className="h-96 bg-muted rounded-2xl md:col-span-2"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto font-sans">
        <PageHeader 
          title="Farmer Profile & Farm Records" 
          description="Manage your personal details, land holdings, location & crop preferences."
          accentColor="border-emerald-500"
          actions={
            !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                <Pencil className="w-4 h-4" /> Edit Profile & Crops
              </button>
            )
          }
        />

        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-md">
            
            {/* Personal Info */}
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <User className="w-5 h-5 text-primary"/> Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Full Name / शेतकरी नाव *
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Mobile Number (Primary)
                </label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  disabled 
                  className="w-full px-3.5 py-2.5 bg-muted border border-input rounded-xl text-sm font-medium text-muted-foreground outline-none cursor-not-allowed" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Email Address (Optional)
                </label>
                <input 
                  type="email" 
                  placeholder="farmer@gmail.com"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
            </div>

            {/* Location Selector */}
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-primary"/> Location & Mandi Region
            </h2>
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                District & Taluka / City
              </label>
              <DistrictCitySelector
                selectedDistrict={formData.district}
                selectedCity={formData.village}
                onDistrictChange={(d) => setFormData({...formData, district: d})}
                onCityChange={(c) => setFormData({...formData, village: c})}
              />
            </div>

            {/* Farm Details */}
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <Landmark className="w-5 h-5 text-primary"/> Land & Farming Details
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Land Holding (Acres)
                </label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={formData.landHolding} 
                  onChange={e => setFormData({...formData, landHolding: Number(e.target.value)})} 
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Irrigation System
                </label>
                <select 
                  value={formData.irrigationType} 
                  onChange={e => setFormData({...formData, irrigationType: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  <option value="Drip / Sprinkler">Drip / Sprinkler</option>
                  <option value="Tube Well / Borewell">Tube Well / Borewell</option>
                  <option value="Canal Irrigation">Canal Irrigation</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed (Monsoon Dependent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Soil Type
                </label>
                <select 
                  value={formData.soilType} 
                  onChange={e => setFormData({...formData, soilType: e.target.value})} 
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  <option value="Medium Black Soil">Medium Black Soil</option>
                  <option value="Deep Black Cotton Soil">Deep Black Cotton Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Red / Loamy Soil">Red / Loamy Soil</option>
                </select>
              </div>
            </div>

            {/* Primary Cultivated Crops Selection */}
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-foreground">
              <Sprout className="w-5 h-5 text-primary"/> Primary Cultivated Crops
            </h2>
            <div className="mb-8">
              <p className="text-xs text-muted-foreground mb-3">
                Select the main crops you grow to receive customized Mandi rate alerts and weather forecasts.
              </p>
              <div className="flex flex-wrap gap-2">
                {CROP_OPTIONS.map((crop) => {
                  const isSelected = formData.primaryCrops.includes(crop);
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs' 
                          : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {crop}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <button 
                type="submit" 
                disabled={updateProfile.isPending} 
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-primary/20"
              >
                {updateProfile.isPending ? 'Updating...' : <><Save className="w-4 h-4" /> Save Profile & Farm Details</>}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-6 py-2.5 bg-muted text-foreground font-semibold text-sm rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Card: Farmer Profile Summary */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-xs">
                <div className="w-20 h-20 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-2 border-primary/20">
                  {activeProfile?.name ? translateName(activeProfile.name.trim().split(' ')[0], language).charAt(0) : 'S'}
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {activeProfile?.name ? translateName(activeProfile.name.trim().split(' ')[0], language) : ''}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {activeProfile?.village}, {activeProfile?.district} ({activeProfile?.state})
                </p>
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground justify-center">
                    <Phone className="w-3.5 h-3.5 text-foreground/60" /> +91 {activeProfile?.phone}
                  </div>
                  {activeProfile?.email && (
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground justify-center notranslate" data-no-translate="true">
                      <Mail className="w-3.5 h-3.5 text-foreground/60" /> <span className="notranslate">{activeProfile.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verifications */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
                <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-muted-foreground">Kisan Verifications</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold text-xs">Kisan Credit Card (KCC)</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold text-xs">PM Fasal Bima Enrolled</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Farm Specifications & Crops */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Landmark className="w-4 h-4 text-primary"/> Farm Specifications
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5" /> Total Land Holding
                    </p>
                    <p className="font-extrabold text-2xl font-mono text-foreground">
                      {activeProfile?.landHolding} <span className="text-xs font-sans font-medium text-muted-foreground">Acres</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 font-semibold">
                      <Droplet className="w-3.5 h-3.5" /> Irrigation System
                    </p>
                    <p className="font-bold text-sm text-foreground">{activeProfile?.irrigationType || 'Drip / Sprinkler'}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1 font-semibold">
                      <Layers className="w-3.5 h-3.5" /> Soil Classification
                    </p>
                    <p className="font-bold text-sm text-foreground">{activeProfile?.soilType || 'Medium Black Soil'}</p>
                  </div>
                </div>
              </div>

              {/* Primary Cultivated Crops */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-foreground">
                  <Sprout className="w-4 h-4 text-primary"/> Primary Cultivated Crops
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(activeProfile?.primaryCrops) && activeProfile.primaryCrops.map((crop, i) => (
                    <span key={i} className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
                      🌾 {crop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground pt-4">
                AgroSaathi Farmer ID: <span className="font-mono font-bold text-foreground">KS-MH-{activeProfile?.phone || '987654'}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </AppLayout>
  );
}
