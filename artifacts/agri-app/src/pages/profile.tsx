import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useGetProfile, useUpdateProfile } from '@workspace/api-client-react';
import { User, MapPin, Phone, Mail, Landmark, Sprout, Droplet, Layers, CheckCircle, Pencil, Save, X } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);
  const { data: profile, isLoading } = useGetProfile({ query: { queryKey: ['profile'] } });
  
  const updateProfile = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        setIsEditing(false);
      }
    }
  });

  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    village: '',
    district: '',
    state: '',
    landHolding: 0,
    irrigationType: '',
    soilType: ''
  });

  React.useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        email: profile.email || '',
        village: profile.village,
        district: profile.district,
        state: profile.state,
        landHolding: profile.landHolding,
        irrigationType: profile.irrigationType,
        soilType: profile.soilType
      });
    }
  }, [profile, isEditing]);

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
        soilType: formData.soilType
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
      <div className="max-w-4xl mx-auto">
        <PageHeader 
          title="Farmer Profile" 
          actions={
            !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-input hover:bg-muted font-medium rounded-xl transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
            )
          }
        />

        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-primary"/> Personal Details</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone Number (Read Only)</label>
                <input type="text" value={formData.phone} disabled className="w-full px-4 py-2.5 bg-muted border border-input rounded-xl text-muted-foreground outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Location</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Village/Town</label>
                <input type="text" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">District</label>
                <input type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">State</label>
                <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Landmark className="w-5 h-5 text-primary"/> Farm Details</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Land Holding (Acres)</label>
                <input type="number" step="0.1" value={formData.landHolding} onChange={e => setFormData({...formData, landHolding: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Irrigation Type</label>
                <select value={formData.irrigationType} onChange={e => setFormData({...formData, irrigationType: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none" required>
                  <option value="Tube Well">Tube Well</option>
                  <option value="Canal">Canal</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Drip/Sprinkler">Drip/Sprinkler</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Soil Type</label>
                <select value={formData.soilType} onChange={e => setFormData({...formData, soilType: e.target.value})} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none" required>
                  <option value="Alluvial">Alluvial</option>
                  <option value="Black">Black Soil</option>
                  <option value="Red">Red Soil</option>
                  <option value="Laterite">Laterite</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <button type="submit" disabled={updateProfile.isPending} className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                {updateProfile.isPending ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                <div className="w-24 h-24 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden border-4 border-background shadow-md">
                  {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" /> : profile.name[0]}
                </div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.village}, {profile.state}
                </p>
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <Phone className="w-4 h-4 text-foreground/50" /> {profile.phone}
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                      <Mail className="w-4 h-4 text-foreground/50" /> {profile.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Verifications</h3>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${profile.kccHolder ? 'bg-green-50 dark:bg-green-900/10 border-green-200 text-green-800' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                    <span className="font-medium text-sm">Kisan Credit Card</span>
                    {profile.kccHolder ? <CheckCircle className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5" />}
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${profile.pmFasalBimaEnrolled ? 'bg-green-50 dark:bg-green-900/10 border-green-200 text-green-800' : 'bg-muted/50 border-border text-muted-foreground'}`}>
                    <span className="font-medium text-sm">PM Fasal Bima</span>
                    {profile.pmFasalBimaEnrolled ? <CheckCircle className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Landmark className="w-5 h-5 text-primary"/> Farm Information</h3>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Total Land</p>
                    <p className="font-bold text-xl font-mono">{profile.landHolding} <span className="text-sm font-sans font-normal text-muted-foreground">{profile.landUnit}s</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><Droplet className="w-4 h-4" /> Irrigation</p>
                    <p className="font-bold text-lg">{profile.irrigationType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><Layers className="w-4 h-4" /> Soil Type</p>
                    <p className="font-bold text-lg">{profile.soilType}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sprout className="w-5 h-5 text-primary"/> Primary Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.primaryCrops.map((crop, i) => (
                    <span key={i} className="px-4 py-2 bg-accent/50 text-accent-foreground border border-accent rounded-xl font-medium shadow-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground mt-8">
                Member since {formatDate(profile.joinedAt)}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
