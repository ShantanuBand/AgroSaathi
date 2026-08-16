import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLocation, Link } from 'wouter';
import { Sprout, Phone, Lock, ArrowRight, ShieldCheck, UserCheck, MapPin, Building2, TrendingUp, CloudRain, EyeOff, Eye, ChevronDown } from 'lucide-react';

const locationData: Record<string, string[]> = {
  "Ahilyanagar": ["Akole", "Jamkhed", "Karjat", "Kopargaon", "Nagar", "Nevasa", "Parner", "Pathardi", "Rahata", "Rahuri", "Sangamner", "Shevgaon", "Shrigonda", "Shrirampur"],
  "Akola": ["Akola", "Akot", "Balapur", "Barshitakli", "Murtizapur", "Patur", "Telhara"],
  "Amravati": ["Achalpur", "Amravati", "Anjangaon Surji", "Bhatkuli", "Chandur Bazar", "Chandur Railway", "Chikhaldara", "Dhamangaon Railway", "Dharni", "Daryapur", "Morshi", "Nandgaon Khandeshwar", "Tiosa", "Warud"],
  "Beed": ["Ambajogai", "Ashti", "Beed", "Dharur", "Georai", "Kaij", "Majalgaon", "Parli", "Patoda", "Shirur Kasar", "Wadwani"],
  "Bhandara": ["Bhandara", "Lakhani", "Lakhandur", "Mohadi", "Pauni", "Sakoli", "Tumsar"],
  "Buldhana": ["Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Khamgaon", "Lonar", "Malkapur", "Mehkar", "Motala", "Nandura", "Sangrampur", "Shegaon", "Sindkhed Raja"],
  "Chandrapur": ["Ballarpur", "Bhadravati", "Brahmapuri", "Chandrapur", "Chimur", "Gondpimpri", "Jiwati", "Korpana", "Mul", "Nagbhid", "Pombhurna", "Rajura", "Saoli", "Sindewahi", "Warora"],
  "Chhatrapati Sambhajinagar": ["Chhatrapati Sambhajinagar", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon", "Vaijapur"],
  "Dhule": ["Dhule", "Sakri", "Shirpur", "Sindkheda"],
  "Gadchiroli": ["Aheri", "Armori", "Bhamragad", "Chamorshi", "Dhanora", "Desaiganj", "Etapalli", "Gadchiroli", "Korchi", "Kurkheda", "Mulchera", "Sironcha"],
  "Gondia": ["Amgaon", "Arjuni Morgaon", "Deori", "Gondia", "Goregaon", "Salekasa", "Sadak Arjuni", "Tirora"],
  "Hingoli": ["Aundha Nagnath", "Basmath", "Hingoli", "Kalamnuri", "Sengaon"],
  "Jalgaon": ["Amalner", "Bhadgaon", "Bhusawal", "Bodwad", "Chalisgaon", "Chopda", "Dharangaon", "Erandol", "Jalgaon", "Jamner", "Muktainagar", "Pachora", "Parola", "Raver", "Yawal"],
  "Jalna": ["Ambad", "Badnapur", "Bhokardan", "Ghansawangi", "Jafrabad", "Jalna", "Mantha", "Partur"],
  "Kolhapur": ["Ajra", "Bhudargad", "Chandgad", "Gadhinglaj", "Gaganbawada", "Hatkanangale", "Kagal", "Karvir", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"],
  "Latur": ["Ahmedpur", "Ausa", "Chakur", "Deoni", "Jalkot", "Latur", "Nilanga", "Renapur", "Shirur Anantpal", "Udgir"],
  "Mumbai City": [],
  "Mumbai Suburban": ["Andheri", "Borivali", "Kurla"],
  "Nagpur": ["Bhiwapur", "Hingna", "Kalameshwar", "Kamptee", "Katol", "Kuhi", "Mouda", "Nagpur Rural", "Nagpur Urban", "Narkhed", "Parseoni", "Ramtek", "Savner", "Umred"],
  "Nanded": ["Ardhapur", "Biloli", "Bhokar", "Deglur", "Dharmabad", "Hadgaon", "Himayatnagar", "Kandhar", "Kinwat", "Loha", "Mahur", "Mudkhed", "Mukhed", "Naigaon", "Nanded", "Umri"],
  "Nandurbar": ["Akkalkuwa", "Akrani", "Nandurbar", "Navapur", "Shahada", "Taloda"],
  "Nashik": ["Baglan", "Chandwad", "Deola", "Dindori", "Igatpuri", "Kalwan", "Malegaon", "Nandgaon", "Nashik", "Niphad", "Peint", "Sinnar", "Surgana", "Trimbakeshwar", "Yeola"],
  "Dharashiv": ["Bhoom", "Dharashiv", "Kalamb", "Lohara", "Omerga", "Paranda", "Tuljapur", "Washi"],
  "Parbhani": ["Gangakhed", "Jintur", "Manwath", "Palam", "Parbhani", "Pathri", "Purna", "Sailu", "Sonpeth"],
  "Pune": ["Ambegaon", "Baramati", "Bhor", "Daund", "Haveli", "Indapur", "Junnar", "Khed", "Maval", "Mulshi", "Purandar", "Shirur", "Velhe", "Pune City"],
  "Raigad": ["Alibag", "Karjat", "Khalapur", "Mahad", "Mangaon", "Mhasala", "Murud", "Panvel", "Pen", "Poladpur", "Roha", "Shrivardhan", "Sudhagad", "Tala", "Uran"],
  "Ratnagiri": ["Chiplun", "Dapoli", "Guhagar", "Khed", "Lanja", "Mandangad", "Rajapur", "Ratnagiri", "Sangameshwar"],
  "Sangli": ["Atpadi", "Jat", "Kadegaon", "Kavathe Mahankal", "Khanapur", "Miraj", "Palus", "Shirala", "Tasgaon", "Walwa"],
  "Satara": ["Jaoli", "Karad", "Khandala", "Khatav", "Koregaon", "Mahabaleshwar", "Man", "Patan", "Phaltan", "Satara", "Wai"],
  "Sindhudurg": ["Devgad", "Dodamarg", "Kankavli", "Kudal", "Malvan", "Sawantwadi", "Vaibhavwadi", "Vengurla"],
  "Solapur": ["Akkalkot", "Barshi", "Karmala", "Madha", "Malshiras", "Mangalvedhe", "Mohol", "Pandharpur", "Sangole", "Solapur North", "Solapur South"],
  "Thane": ["Ambarnath", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Thane", "Ulhasnagar"],
  "Wardha": ["Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo", "Wardha"],
  "Washim": ["Karanja", "Malegaon", "Manora", "Mangrulpir", "Risod", "Washim"],
  "Yavatmal": ["Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Kelapur", "Mahagaon", "Maregaon", "Ner", "Pusad", "Ralegaon", "Umarkhed", "Wani", "Yavatmal", "Zari-Jamani"],
  "Palghar": ["Dahanu", "Jawhar", "Mokhada", "Palghar", "Talasari", "Vada", "Vasai", "Vikramgad"]
};

// Custom Select Component to force dropdown to open downwards
function CustomSelect({ value, onChange, options, placeholder, disabled, icon: Icon }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string, disabled?: boolean, icon: React.ElementType }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600 z-10">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none transition-all flex items-center justify-between ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'text-slate-800 cursor-pointer'}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto overflow-x-hidden">
          {options.length === 0 ? (
            <div className="p-3 text-xs text-slate-500 text-center">No options available</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-emerald-50 transition-colors ${value === opt ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700'}`}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [landHolding, setLandHolding] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password || !agreed) {
      setError('Please fill all fields and agree to terms.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register({
      name: name.trim(),
      phone: phone.trim(),
      password,
      district: district,
      city: taluka,
      landHolding: Number(landHolding) || 5,
      primaryCrops: ['Soybean', 'Cotton'],
    });

    setLoading(false);

    if (res.success) {
      setLocation('/');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background Image with slight scale to hide the left edge artifact */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('/images/register-bg-new.jpg')`,
          transform: 'scale(1.05) translateX(-1%)'
        }}
      ></div>

      <div className="absolute inset-0 bg-black/40 md:bg-black/20 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent hidden md:block z-0"></div>

      <div className="relative z-10 w-full mx-auto flex flex-col md:flex-row items-center justify-center md:justify-end gap-5 lg:gap-8 pr-8 sm:pr-12 lg:pr-32 xl:pr-48 pt-10 md:pt-0">
        
        {/* Left Side: Features List (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col max-w-sm">
          <div className="inline-flex items-center justify-center p-3.5 bg-emerald-600 text-white rounded-full shadow-lg mb-6 w-14 h-14">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-3xl lg:text-[2rem] font-extrabold tracking-tight mb-4 leading-tight text-emerald-300 drop-shadow-md">
            Smart Farming,<br />Now At Your Fingertips
          </h1>
          <div className="w-12 h-1 bg-emerald-500/80 rounded-full mb-8"></div>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Daily Market Rates</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Hyper-local Weather</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Government Schemes</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Expert Crop Advisory</span>
            </div>
          </div>
        </div>

        {/* Right Side: Register Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-[#FDFBF7]/95 backdrop-blur-md border border-white/50 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
            
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center p-2.5 bg-emerald-800 text-white rounded-full shadow-lg shadow-emerald-900/20 mb-3 w-10 h-10">
                <Sprout className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                New Farmer <span className="text-emerald-700">Sign Up</span>
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                    FULL NAME *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-8 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                    MOBILE *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10 digits"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="block w-full pl-8 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: District and Taluka */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                    DISTRICT *
                  </label>
                  <CustomSelect
                    value={district}
                    onChange={(val) => {
                      setDistrict(val);
                      setTaluka('');
                    }}
                    options={Object.keys(locationData)}
                    placeholder="District"
                    icon={Building2}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                    TALUKA *
                  </label>
                  <CustomSelect
                    value={taluka}
                    onChange={setTaluka}
                    options={district && locationData[district] ? locationData[district] : []}
                    placeholder="Taluka"
                    disabled={!district}
                    icon={Building2}
                  />
                </div>
              </div>

              {/* Row 3: Land Holding */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                  TOTAL LAND HOLDING (ACRES) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600">
                    <Sprout className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 5"
                    value={landHolding}
                    onChange={(e) => setLandHolding(e.target.value)}
                    className="block w-full pl-8 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                  />
                </div>
              </div>

              {/* Row 5: Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                    PASSWORD *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1 ml-1">
                    CONFIRM *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-700 border-slate-300 focus:ring-emerald-600"
                />
                <label htmlFor="terms" className="text-[9px] text-slate-600 font-medium">
                  I agree to the <a href="#" className="font-bold text-emerald-700 hover:underline">Terms & Conditions</a>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[13px] font-bold bg-[#0A5C36] text-white hover:bg-emerald-900 transition-all shadow-md shadow-[#0A5C36]/20 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Create Account'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>

            <div className="mt-6 text-center text-[11px] text-slate-500">
              Already registered?{' '}
              <Link href="/login" className="font-bold text-emerald-700 hover:underline">
                Login here →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
