export interface DistrictRecord {
  id: string;
  name: string;
  state: string;
  division: string;
  lat: number;
  lon: number;
}

export interface CityRecord {
  id: string;
  districtId: string;
  districtName: string;
  name: string;
  nameHindi?: string;
  pincode?: string;
  lat: number;
  lon: number;
  isMandiCenter: boolean;
}

export const MAHARASHTRA_DISTRICTS: DistrictRecord[] = [
  { id: "d_amravati", name: "Amravati", state: "Maharashtra", division: "Amravati", lat: 20.9374, lon: 77.7796 },
  { id: "d_akola", name: "Akola", state: "Maharashtra", division: "Amravati", lat: 20.7002, lon: 77.0082 },
  { id: "d_buldhana", name: "Buldhana", state: "Maharashtra", division: "Amravati", lat: 20.5293, lon: 76.1843 },
  { id: "d_washim", name: "Washim", state: "Maharashtra", division: "Amravati", lat: 20.1110, lon: 77.1352 },
  { id: "d_yavatmal", name: "Yavatmal", state: "Maharashtra", division: "Amravati", lat: 20.3888, lon: 78.1204 },
  { id: "d_nagpur", name: "Nagpur", state: "Maharashtra", division: "Nagpur", lat: 21.1458, lon: 79.0882 },
  { id: "d_wardha", name: "Wardha", state: "Maharashtra", division: "Nagpur", lat: 20.7453, lon: 78.6022 },
  { id: "d_bhandara", name: "Bhandara", state: "Maharashtra", division: "Nagpur", lat: 21.1730, lon: 79.6548 },
  { id: "d_gondia", name: "Gondia", state: "Maharashtra", division: "Nagpur", lat: 21.4624, lon: 80.2210 },
  { id: "d_chandrapur", name: "Chandrapur", state: "Maharashtra", division: "Nagpur", lat: 19.9615, lon: 79.2961 },
  { id: "d_gadchiroli", name: "Gadchiroli", state: "Maharashtra", division: "Nagpur", lat: 20.1849, lon: 79.9962 },
  { id: "d_aurangabad", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 19.8762, lon: 75.3433 },
  { id: "d_jalna", name: "Jalna", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 19.8347, lon: 75.8816 },
  { id: "d_parbhani", name: "Parbhani", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 19.2686, lon: 76.7708 },
  { id: "d_hingoli", name: "Hingoli", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 19.7188, lon: 77.1476 },
  { id: "d_nanded", name: "Nanded", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 19.1383, lon: 77.3210 },
  { id: "d_beed", name: "Beed", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 18.9891, lon: 75.7601 },
  { id: "d_latur", name: "Latur", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 18.4088, lon: 76.5604 },
  { id: "d_osmanabad", name: "Dharashiv (Osmanabad)", state: "Maharashtra", division: "Chhatrapati Sambhajinagar", lat: 18.1861, lon: 76.0419 },
  { id: "d_nashik", name: "Nashik", state: "Maharashtra", division: "Nashik", lat: 19.9975, lon: 73.7898 },
  { id: "d_dhule", name: "Dhule", state: "Maharashtra", division: "Nashik", lat: 20.9042, lon: 74.7749 },
  { id: "d_nandurbar", name: "Nandurbar", state: "Maharashtra", division: "Nashik", lat: 21.3723, lon: 74.2464 },
  { id: "d_jalgaon", name: "Jalgaon", state: "Maharashtra", division: "Nashik", lat: 21.0077, lon: 75.5626 },
  { id: "d_ahmednagar", name: "Ahmednagar", state: "Maharashtra", division: "Nashik", lat: 19.0948, lon: 74.7480 },
  { id: "d_pune", name: "Pune", state: "Maharashtra", division: "Pune", lat: 18.5204, lon: 73.8567 },
  { id: "d_satara", name: "Satara", state: "Maharashtra", division: "Pune", lat: 17.6805, lon: 74.0183 },
  { id: "d_sangli", name: "Sangli", state: "Maharashtra", division: "Pune", lat: 16.8524, lon: 74.5815 },
  { id: "d_kolhapur", name: "Kolhapur", state: "Maharashtra", division: "Pune", lat: 16.7050, lon: 74.2433 },
  { id: "d_solapur", name: "Solapur", state: "Maharashtra", division: "Pune", lat: 17.6599, lon: 75.9064 },
  { id: "d_raigad", name: "Raigad (Alibag)", state: "Maharashtra", division: "Konkan", lat: 18.6414, lon: 72.8722 },
  { id: "d_ratnagiri", name: "Ratnagiri", state: "Maharashtra", division: "Konkan", lat: 16.9902, lon: 73.3120 },
  { id: "d_sindhudurg", name: "Sindhudurg", state: "Maharashtra", division: "Konkan", lat: 16.1667, lon: 73.6667 },
  { id: "d_palghar", name: "Palghar", state: "Maharashtra", division: "Konkan", lat: 19.6967, lon: 72.7699 },
  { id: "d_thane", name: "Thane", state: "Maharashtra", division: "Konkan", lat: 19.2183, lon: 72.9781 },
  { id: "d_mumbai", name: "Mumbai City", state: "Maharashtra", division: "Konkan", lat: 18.9388, lon: 72.8353 },
  { id: "d_mumbai_suburban", name: "Mumbai Suburban", state: "Maharashtra", division: "Konkan", lat: 19.1176, lon: 72.8481 },
];

export const MAHARASHTRA_CITIES: CityRecord[] = [
  // Amravati District
  { id: "c_amravati_city", districtId: "d_amravati", districtName: "Amravati", name: "Amravati Main APMC", nameHindi: "अमरावती मुख्य एपीएमसी", pincode: "444601", lat: 20.9374, lon: 77.7796, isMandiCenter: true },
  { id: "c_chandur_railway", districtId: "d_amravati", districtName: "Amravati", name: "Chandur Railway APMC", nameHindi: "चांदूर रेल्वे एपीएमसी", pincode: "444904", lat: 20.8167, lon: 77.9667, isMandiCenter: true },
  { id: "c_chandur_bazar", districtId: "d_amravati", districtName: "Amravati", name: "Chandur Bazar APMC", nameHindi: "चांदूर बाजार एपीएमसी", pincode: "444704", lat: 21.2461, lon: 77.7511, isMandiCenter: true },
  { id: "c_achalpur", districtId: "d_amravati", districtName: "Amravati", name: "Achalpur (Paratwada) APMC", nameHindi: "अचलपूर (परतवाडा) एपीएमसी", pincode: "444805", lat: 21.2583, lon: 77.5083, isMandiCenter: true },
  { id: "c_anjangaon", districtId: "d_amravati", districtName: "Amravati", name: "Anjangaon Surji APMC", nameHindi: "अंजनगांव सुर्जी एपीएमसी", pincode: "444705", lat: 21.1636, lon: 76.9639, isMandiCenter: true },
  { id: "c_morshi", districtId: "d_amravati", districtName: "Amravati", name: "Morshi APMC", nameHindi: "मोर्शी एपीएमसी", pincode: "444905", lat: 21.3167, lon: 78.0167, isMandiCenter: true },
  { id: "c_warud", districtId: "d_amravati", districtName: "Amravati", name: "Warud Orange Mandi", nameHindi: "वरुड संत्री मंडी", pincode: "444906", lat: 21.4667, lon: 78.2667, isMandiCenter: true },
  { id: "c_daryapur", districtId: "d_amravati", districtName: "Amravati", name: "Daryapur Cotton Yard", nameHindi: "दर्यापूर कॉटन यार्ड", pincode: "444803", lat: 20.9258, lon: 77.3217, isMandiCenter: true },
  { id: "c_dhamangaon", districtId: "d_amravati", districtName: "Amravati", name: "Dhamangaon Railway APMC", nameHindi: "धामणगांव रेल्वे एपीएमसी", pincode: "444709", lat: 20.8500, lon: 78.1333, isMandiCenter: true },
  { id: "c_nandgaon_kh", districtId: "d_amravati", districtName: "Amravati", name: "Nandgaon Khandeshwar", nameHindi: "नांदगांव खंडेश्वर", pincode: "444708", lat: 20.6833, lon: 77.8333, isMandiCenter: true },
  { id: "c_teosa", districtId: "d_amravati", districtName: "Amravati", name: "Teosa APMC", nameHindi: "तिवसा एपीएमसी", pincode: "444903", lat: 20.9500, lon: 78.0833, isMandiCenter: true },

  // Akola District
  { id: "c_akola_city", districtId: "d_akola", districtName: "Akola", name: "Akola Cotton Market", nameHindi: "अकोला कॉटन मार्केट", pincode: "444001", lat: 20.7002, lon: 77.0082, isMandiCenter: true },
  { id: "c_akot", districtId: "d_akola", districtName: "Akola", name: "Akot APMC", nameHindi: "अकोट एपीएमसी", pincode: "444401", lat: 21.0964, lon: 77.0589, isMandiCenter: true },
  { id: "c_balapur", districtId: "d_akola", districtName: "Akola", name: "Balapur APMC", nameHindi: "बाळापूर एपीएमसी", pincode: "444302", lat: 20.6667, lon: 76.7833, isMandiCenter: true },
  { id: "c_murtizapur", districtId: "d_akola", districtName: "Akola", name: "Murtizapur APMC", nameHindi: "मूर्तीजापूर एपीएमसी", pincode: "444107", lat: 20.7303, lon: 77.3606, isMandiCenter: true },
  { id: "c_patur", districtId: "d_akola", districtName: "Akola", name: "Patur APMC", nameHindi: "पातूर एपीएमसी", pincode: "444501", lat: 20.4500, lon: 76.9333, isMandiCenter: true },
  { id: "c_telhara", districtId: "d_akola", districtName: "Akola", name: "Telhara APMC", nameHindi: "तेल्हारा एपीएमसी", pincode: "444108", lat: 21.0333, lon: 76.8333, isMandiCenter: true },

  // Buldhana District
  { id: "c_buldhana_city", districtId: "d_buldhana", districtName: "Buldhana", name: "Buldhana APMC", nameHindi: "बुलढाणा एपीएमसी", pincode: "443001", lat: 20.5293, lon: 76.1843, isMandiCenter: true },
  { id: "c_khamgaon", districtId: "d_buldhana", districtName: "Buldhana", name: "Khamgaon Silver & Cotton Mandi", nameHindi: "खामगांव कॉटन मंडी", pincode: "444303", lat: 20.6833, lon: 76.5667, isMandiCenter: true },
  { id: "c_malkapur", districtId: "d_buldhana", districtName: "Buldhana", name: "Malkapur APMC", nameHindi: "मलकापूर एपीएमसी", pincode: "443101", lat: 20.8833, lon: 76.2000, isMandiCenter: true },
  { id: "c_shegaon", districtId: "d_buldhana", districtName: "Buldhana", name: "Shegaon APMC", nameHindi: "शेगांव एपीएमसी", pincode: "444203", lat: 20.7936, lon: 76.6939, isMandiCenter: true },
  { id: "c_mehkar", districtId: "d_buldhana", districtName: "Buldhana", name: "Mehkar APMC", nameHindi: "मेहकर एपीएमसी", pincode: "443301", lat: 20.1500, lon: 76.5667, isMandiCenter: true },
  { id: "c_chikhli", districtId: "d_buldhana", districtName: "Buldhana", name: "Chikhli APMC", nameHindi: "चिखली एपीएमसी", pincode: "443201", lat: 20.3500, lon: 76.2500, isMandiCenter: true },
  { id: "c_jalgaon_jamod", districtId: "d_buldhana", districtName: "Buldhana", name: "Jalgaon Jamod APMC", nameHindi: "जळगांव जामोद एपीएमसी", pincode: "443402", lat: 21.0500, lon: 76.5333, isMandiCenter: true },

  // Washim District
  { id: "c_washim_city", districtId: "d_washim", districtName: "Washim", name: "Washim Main Mandi", nameHindi: "वाशीम मुख्य मंडी", pincode: "444505", lat: 20.1110, lon: 77.1352, isMandiCenter: true },
  { id: "c_karanja_lad", districtId: "d_washim", districtName: "Washim", name: "Karanja Lad APMC", nameHindi: "कारंजा लाड एपीएमसी", pincode: "444105", lat: 20.4833, lon: 77.4833, isMandiCenter: true },
  { id: "c_risod", districtId: "d_washim", districtName: "Washim", name: "Risod APMC", nameHindi: "रिसोड एपीएमसी", pincode: "444506", lat: 19.9667, lon: 76.7833, isMandiCenter: true },
  { id: "c_mangrulpir", districtId: "d_washim", districtName: "Washim", name: "Mangrulpir APMC", nameHindi: "मंगरुळपीर एपीएमसी", pincode: "444403", lat: 20.3167, lon: 77.3500, isMandiCenter: true },

  // Yavatmal District
  { id: "c_yavatmal_city", districtId: "d_yavatmal", districtName: "Yavatmal", name: "Yavatmal Cotton Market", nameHindi: "यवतमाळ कॉटन मार्केट", pincode: "445001", lat: 20.3888, lon: 78.1204, isMandiCenter: true },
  { id: "c_pusad", districtId: "d_yavatmal", districtName: "Yavatmal", name: "Pusad APMC", nameHindi: "पुसद एपीएमसी", pincode: "445204", lat: 19.9000, lon: 77.5667, isMandiCenter: true },
  { id: "c_umarkhed", districtId: "d_yavatmal", districtName: "Yavatmal", name: "Umarkhed APMC", nameHindi: "उमरखेड एपीएमसी", pincode: "445206", lat: 19.6000, lon: 77.7000, isMandiCenter: true },
  { id: "c_wani", districtId: "d_yavatmal", districtName: "Yavatmal", name: "Wani APMC", nameHindi: "वणी एपीएमसी", pincode: "445304", lat: 20.0667, lon: 78.9500, isMandiCenter: true },
  { id: "c_darwha", districtId: "d_yavatmal", districtName: "Yavatmal", name: "Darwha APMC", nameHindi: "दारव्हा एपीएमसी", pincode: "445202", lat: 20.3167, lon: 77.7667, isMandiCenter: true },
  { id: "c_digras", districtId: "d_yavatmal", districtName: "Yavatmal", name: "Digras APMC", nameHindi: "दिग्रस एपीएमसी", pincode: "445203", lat: 20.1000, lon: 77.7167, isMandiCenter: true },

  // Nagpur District
  { id: "c_nagpur_kalamna", districtId: "d_nagpur", districtName: "Nagpur", name: "Nagpur Kalamna Grain & Orange Market", nameHindi: "नागपूर कळमणा धान्य व संत्री मंडी", pincode: "440008", lat: 21.1685, lon: 79.1353, isMandiCenter: true },
  { id: "c_katol", districtId: "d_nagpur", districtName: "Nagpur", name: "Katol Orange APMC", nameHindi: "काटोल संत्री एपीएमसी", pincode: "441302", lat: 21.2678, lon: 78.5839, isMandiCenter: true },
  { id: "c_saoner", districtId: "d_nagpur", districtName: "Nagpur", name: "Saoner Cotton & Grain APMC", nameHindi: "सावनेर एपीएमसी", pincode: "441107", lat: 21.3853, lon: 78.9172, isMandiCenter: true },
  { id: "c_umred", districtId: "d_nagpur", districtName: "Nagpur", name: "Umred APMC", nameHindi: "उमरेड एपीएमसी", pincode: "441203", lat: 20.8528, lon: 79.3253, isMandiCenter: true },
  { id: "c_ramtek", districtId: "d_nagpur", districtName: "Nagpur", name: "Ramtek APMC", nameHindi: "रामटेक एपीएमसी", pincode: "441106", lat: 21.3967, lon: 79.3283, isMandiCenter: true },
  { id: "c_narkhed", districtId: "d_nagpur", districtName: "Nagpur", name: "Narkhed APMC", nameHindi: "नरखेड एपीएमसी", pincode: "441304", lat: 21.4667, lon: 78.5333, isMandiCenter: true },
  { id: "c_hingna", districtId: "d_nagpur", districtName: "Nagpur", name: "Hingna Sub-Market Yard", nameHindi: "हिंगणा उपबाजार", pincode: "441110", lat: 21.0500, lon: 78.9667, isMandiCenter: true },

  // Wardha District
  { id: "c_wardha_city", districtId: "d_wardha", districtName: "Wardha", name: "Wardha Main APMC", nameHindi: "वर्धा मुख्य एपीएमसी", pincode: "442001", lat: 20.7453, lon: 78.6022, isMandiCenter: true },
  { id: "c_hinganghat", districtId: "d_wardha", districtName: "Wardha", name: "Hinganghat Cotton & Soybean Mandi", nameHindi: "हिंगणघाट कापूस व सोयाबीन मंडी", pincode: "442301", lat: 20.5500, lon: 78.8333, isMandiCenter: true },
  { id: "c_arvi", districtId: "d_wardha", districtName: "Wardha", name: "Arvi Cotton Yard", nameHindi: "आर्वी कॉटन यार्ड", pincode: "442201", lat: 20.9833, lon: 78.2333, isMandiCenter: true },
  { id: "c_deoli", districtId: "d_wardha", districtName: "Wardha", name: "Deoli APMC", nameHindi: "देवळी एपीएमसी", pincode: "442101", lat: 20.6500, lon: 78.4833, isMandiCenter: true },
  { id: "c_seloo", districtId: "d_wardha", districtName: "Wardha", name: "Seloo Sub-Yard", nameHindi: "सेलू उपबाजार", pincode: "442104", lat: 20.8333, lon: 78.7000, isMandiCenter: true },

  // Bhandara & Gondia
  { id: "c_bhandara_city", districtId: "d_bhandara", districtName: "Bhandara", name: "Bhandara Paddy APMC", nameHindi: "भंडारा धान एपीएमसी", pincode: "441904", lat: 21.1730, lon: 79.6548, isMandiCenter: true },
  { id: "c_tumsar", districtId: "d_bhandara", districtName: "Bhandara", name: "Tumsar Rice Market", nameHindi: "तुमसर तांदूळ मार्केट", pincode: "441912", lat: 21.3833, lon: 79.7333, isMandiCenter: true },
  { id: "c_sakoli", districtId: "d_bhandara", districtName: "Bhandara", name: "Sakoli APMC", nameHindi: "साकोली एपीएमसी", pincode: "441802", lat: 21.0833, lon: 79.9833, isMandiCenter: true },
  { id: "c_gondia_city", districtId: "d_gondia", districtName: "Gondia", name: "Gondia Rice City APMC", nameHindi: "गोंदिया तांदूळ शहर एपीएमसी", pincode: "441601", lat: 21.4624, lon: 80.2210, isMandiCenter: true },
  { id: "c_tirora", districtId: "d_gondia", districtName: "Gondia", name: "Tirora APMC", nameHindi: "तिरोडा एपीएमसी", pincode: "441911", lat: 21.4167, lon: 79.9333, isMandiCenter: true },

  // Chandrapur & Gadchiroli
  { id: "c_chandrapur_city", districtId: "d_chandrapur", districtName: "Chandrapur", name: "Chandrapur Grain & Cotton Mandi", nameHindi: "चंद्रपूर धान्य व कापूस मंडी", pincode: "442401", lat: 19.9615, lon: 79.2961, isMandiCenter: true },
  { id: "c_warora", districtId: "d_chandrapur", districtName: "Chandrapur", name: "Warora Cotton Yard", nameHindi: "वरोरा कॉटन यार्ड", pincode: "442907", lat: 20.2333, lon: 79.0000, isMandiCenter: true },
  { id: "c_gadchiroli_city", districtId: "d_gadchiroli", districtName: "Gadchiroli", name: "Gadchiroli Forest & Paddy Mandi", nameHindi: "गडचिरोली धान मंडी", pincode: "442605", lat: 20.1849, lon: 79.9962, isMandiCenter: true },
  { id: "c_wadsa", districtId: "d_gadchiroli", districtName: "Gadchiroli", name: "Wadsa (Desaiganj) APMC", nameHindi: "वडसा (देसाईगंज) एपीएमसी", pincode: "441207", lat: 20.6167, lon: 79.9667, isMandiCenter: true },

  // Chhatrapati Sambhajinagar (Aurangabad)
  { id: "c_aurangabad_city", districtId: "d_aurangabad", districtName: "Chhatrapati Sambhajinagar", name: "Jadhavwadi APMC Sambhajinagar", nameHindi: "जाधववाडी एपीएमसी संभाजीनगर", pincode: "431003", lat: 19.9056, lon: 75.3619, isMandiCenter: true },
  { id: "c_gangapur", districtId: "d_aurangabad", districtName: "Chhatrapati Sambhajinagar", name: "Gangapur APMC", nameHindi: "गंगापूर एपीएमसी", pincode: "431109", lat: 19.6997, lon: 75.0067, isMandiCenter: true },
  { id: "c_paithan", districtId: "d_aurangabad", districtName: "Chhatrapati Sambhajinagar", name: "Paithan Sweet Lime & Cotton Mandi", nameHindi: "पैठण मोसंबी व कापूस मंडी", pincode: "431107", lat: 19.4794, lon: 75.3853, isMandiCenter: true },
  { id: "c_vaijapur", districtId: "d_aurangabad", districtName: "Chhatrapati Sambhajinagar", name: "Vaijapur APMC", nameHindi: "वैजापूर एपीएमसी", pincode: "423701", lat: 19.9261, lon: 74.7292, isMandiCenter: true },
  { id: "c_kannad", districtId: "d_aurangabad", districtName: "Chhatrapati Sambhajinagar", name: "Kannad Maize & Cotton Yard", nameHindi: "कन्नड मका व कापूस यार्ड", pincode: "431103", lat: 20.2667, lon: 75.1333, isMandiCenter: true },
  { id: "c_sillod", districtId: "d_aurangabad", districtName: "Chhatrapati Sambhajinagar", name: "Sillod Ginger & Maize APMC", nameHindi: "सिल्लोड आले व मका एपीएमसी", pincode: "431112", lat: 20.3000, lon: 75.6500, isMandiCenter: true },

  // Jalna District
  { id: "c_jalna_city", districtId: "d_jalna", districtName: "Jalna", name: "Jalna Steel & Sweet Lime Mandi", nameHindi: "जालना मोसंबी व धान्य मंडी", pincode: "431203", lat: 19.8347, lon: 75.8816, isMandiCenter: true },
  { id: "c_ambad", districtId: "d_jalna", districtName: "Jalna", name: "Ambad APMC", nameHindi: "अंबड एपीएमसी", pincode: "431204", lat: 19.6167, lon: 75.8000, isMandiCenter: true },
  { id: "c_partur", districtId: "d_jalna", districtName: "Jalna", name: "Partur APMC", nameHindi: "परतूर एपीएमसी", pincode: "431501", lat: 19.6000, lon: 76.2167, isMandiCenter: true },
  { id: "c_bhokardan", districtId: "d_jalna", districtName: "Jalna", name: "Bhokardan APMC", nameHindi: "भोकरदन एपीएमसी", pincode: "431114", lat: 20.2667, lon: 75.7667, isMandiCenter: true },

  // Parbhani & Hingoli
  { id: "c_parbhani_city", districtId: "d_parbhani", districtName: "Parbhani", name: "Parbhani Main APMC", nameHindi: "परभणी मुख्य एपीएमसी", pincode: "431401", lat: 19.2686, lon: 76.7708, isMandiCenter: true },
  { id: "c_gangakhed", districtId: "d_parbhani", districtName: "Parbhani", name: "Gangakhed APMC", nameHindi: "गंगाखेड एपीएमसी", pincode: "431514", lat: 18.9500, lon: 76.7500, isMandiCenter: true },
  { id: "c_jintur", districtId: "d_parbhani", districtName: "Parbhani", name: "Jintur APMC", nameHindi: "जिंतूर एपीएमसी", pincode: "431509", lat: 19.6167, lon: 76.6833, isMandiCenter: true },
  { id: "c_hingoli_city", districtId: "d_hingoli", districtName: "Hingoli", name: "Hingoli Turmeric & Soybean Mandi", nameHindi: "हिंगोली हळद व सोयाबीन मंडी", pincode: "431513", lat: 19.7188, lon: 77.1476, isMandiCenter: true },
  { id: "c_basmath", districtId: "d_hingoli", districtName: "Hingoli", name: "Basmath Turmeric APMC", nameHindi: "वसमत हळद एपीएमसी", pincode: "431512", lat: 19.3333, lon: 77.1667, isMandiCenter: true },

  // Nanded District
  { id: "c_nanded_city", districtId: "d_nanded", districtName: "Nanded", name: "Nanded Mondha Cotton & Banana APMC", nameHindi: "नांदेड मोंढा कापूस व केळी एपीएमसी", pincode: "431601", lat: 19.1383, lon: 77.3210, isMandiCenter: true },
  { id: "c_degloor", districtId: "d_nanded", districtName: "Nanded", name: "Degloor APMC", nameHindi: "देगलूर एपीएमसी", pincode: "431717", lat: 18.5500, lon: 77.5833, isMandiCenter: true },
  { id: "c_mukhed", districtId: "d_nanded", districtName: "Nanded", name: "Mukhed APMC", nameHindi: "मुखेड एपीएमसी", pincode: "431715", lat: 18.7000, lon: 77.3667, isMandiCenter: true },
  { id: "c_kinwat", districtId: "d_nanded", districtName: "Nanded", name: "Kinwat Forest APMC", nameHindi: "किनवट एपीएमसी", pincode: "431804", lat: 19.6333, lon: 78.2000, isMandiCenter: true },
  { id: "c_bhokar", districtId: "d_nanded", districtName: "Nanded", name: "Bhokar APMC", nameHindi: "भोकर एपीएमसी", pincode: "431801", lat: 19.2333, lon: 77.6833, isMandiCenter: true },

  // Beed District
  { id: "c_beed_city", districtId: "d_beed", districtName: "Beed", name: "Beed Main APMC", nameHindi: "बीड मुख्य एपीएमसी", pincode: "431122", lat: 18.9891, lon: 75.7601, isMandiCenter: true },
  { id: "c_parli", districtId: "d_beed", districtName: "Beed", name: "Parli Vaijnath APMC", nameHindi: "परळी वैजनाथ एपीएमसी", pincode: "431515", lat: 18.8500, lon: 76.5333, isMandiCenter: true },
  { id: "c_majalgaon", districtId: "d_beed", districtName: "Beed", name: "Majalgaon Cotton Yard", nameHindi: "माजलगांव कॉटन यार्ड", pincode: "431131", lat: 19.1500, lon: 76.2167, isMandiCenter: true },
  { id: "c_georai", districtId: "d_beed", districtName: "Beed", name: "Georai APMC", nameHindi: "गेवराई एपीएमसी", pincode: "431127", lat: 19.2667, lon: 75.7500, isMandiCenter: true },
  { id: "c_ambajogai", districtId: "d_beed", districtName: "Beed", name: "Ambajogai APMC", nameHindi: "अंबाजोगाई एपीएमसी", pincode: "431517", lat: 18.7333, lon: 76.3833, isMandiCenter: true },

  // Latur District
  { id: "c_latur_city", districtId: "d_latur", districtName: "Latur", name: "Latur Premier Pulses & Soybean Market", nameHindi: "लातूर मुख्य डाळ व सोयाबीन मार्केट", pincode: "413512", lat: 18.4088, lon: 76.5604, isMandiCenter: true },
  { id: "c_udgir", districtId: "d_latur", districtName: "Latur", name: "Udgir Grain & Pulses Mandi", nameHindi: "उदगीर धान्य मंडी", pincode: "413517", lat: 18.3942, lon: 77.1172, isMandiCenter: true },
  { id: "c_ahmedpur", districtId: "d_latur", districtName: "Latur", name: "Ahmedpur APMC", nameHindi: "अहमदपूर एपीएमसी", pincode: "413515", lat: 18.7061, lon: 76.9317, isMandiCenter: true },
  { id: "c_ausa", districtId: "d_latur", districtName: "Latur", name: "Ausa APMC", nameHindi: "औसा एपीएमसी", pincode: "413520", lat: 18.2514, lon: 76.5028, isMandiCenter: true },
  { id: "c_nilanga", districtId: "d_latur", districtName: "Latur", name: "Nilanga APMC", nameHindi: "निलंगा एपीएमसी", pincode: "413521", lat: 18.1067, lon: 76.7583, isMandiCenter: true },
  { id: "c_chakur", districtId: "d_latur", districtName: "Latur", name: "Chakur Sub-Yard", nameHindi: "चाकूर उपबाजार", pincode: "413513", lat: 18.5833, lon: 76.8167, isMandiCenter: true },

  // Dharashiv (Osmanabad)
  { id: "c_dharashiv_city", districtId: "d_osmanabad", districtName: "Dharashiv (Osmanabad)", name: "Dharashiv Main APMC", nameHindi: "धाराशिव मुख्य एपीएमसी", pincode: "413501", lat: 18.1861, lon: 76.0419, isMandiCenter: true },
  { id: "c_tuljapur", districtId: "d_osmanabad", districtName: "Dharashiv (Osmanabad)", name: "Tuljapur APMC", nameHindi: "तुळजापूर एपीएमसी", pincode: "413601", lat: 18.0000, lon: 76.0833, isMandiCenter: true },
  { id: "c_omerga", districtId: "d_osmanabad", districtName: "Dharashiv (Osmanabad)", name: "Omerga APMC", nameHindi: "उमरगा एपीएमसी", pincode: "413606", lat: 17.8333, lon: 76.6167, isMandiCenter: true },
  { id: "c_kalamb_dh", districtId: "d_osmanabad", districtName: "Dharashiv (Osmanabad)", name: "Kalamb APMC", nameHindi: "कळंब एपीएमसी", pincode: "413507", lat: 18.4500, lon: 75.9500, isMandiCenter: true },

  // Nashik District
  { id: "c_lasalgaon", districtId: "d_nashik", districtName: "Nashik", name: "Lasalgaon Asia's Largest Onion Mandi", nameHindi: "लासलगांव कांदा महामंडी", pincode: "422306", lat: 20.1472, lon: 74.2289, isMandiCenter: true },
  { id: "c_pimpalgaon", districtId: "d_nashik", districtName: "Nashik", name: "Pimpalgaon Baswant Tomato & Grape Mandi", nameHindi: "पिंपलगांव बसवंत टोमॅटो व द्राक्ष मंडी", pincode: "422209", lat: 20.1691, lon: 73.9854, isMandiCenter: true },
  { id: "c_niphad", districtId: "d_nashik", districtName: "Nashik", name: "Niphad Wheat & Onion APMC", nameHindi: "निफाड गहू व कांदा एपीएमसी", pincode: "422303", lat: 20.0772, lon: 74.1089, isMandiCenter: true },
  { id: "c_malegaon", districtId: "d_nashik", districtName: "Nashik", name: "Malegaon Cotton & Grain APMC", nameHindi: "मालेगांव कॉटन व धान्य मंडी", pincode: "423203", lat: 20.5517, lon: 74.5298, isMandiCenter: true },
  { id: "c_sinnar", districtId: "d_nashik", districtName: "Nashik", name: "Sinnar APMC", nameHindi: "सिन्नर एपीएमसी", pincode: "422103", lat: 19.8458, lon: 74.0003, isMandiCenter: true },
  { id: "c_yeola", districtId: "d_nashik", districtName: "Nashik", name: "Yeola Onion & Maize APMC", nameHindi: "येवला कांदा व मका एपीएमसी", pincode: "423401", lat: 20.0419, lon: 74.4881, isMandiCenter: true },
  { id: "c_chandwad", districtId: "d_nashik", districtName: "Nashik", name: "Chandwad APMC", nameHindi: "चांदवड एपीएमसी", pincode: "423101", lat: 20.3297, lon: 74.2411, isMandiCenter: true },
  { id: "c_nashik_city", districtId: "d_nashik", districtName: "Nashik", name: "Nashik Dindori Road APMC", nameHindi: "नाशिक दिंडोरी रोड एपीएमसी", pincode: "422003", lat: 20.0150, lon: 73.8050, isMandiCenter: true },
  { id: "c_kalwan", districtId: "d_nashik", districtName: "Nashik", name: "Kalwan Onion APMC", nameHindi: "कळवण कांदा एपीएमसी", pincode: "423501", lat: 20.4833, lon: 73.9167, isMandiCenter: true },
  { id: "c_satana", districtId: "d_nashik", districtName: "Nashik", name: "Satana (Baglan) APMC", nameHindi: "सटाणा (बागलाण) एपीएमसी", pincode: "423301", lat: 20.5833, lon: 74.2000, isMandiCenter: true },

  // Dhule & Nandurbar
  { id: "c_dhule_city", districtId: "d_dhule", districtName: "Dhule", name: "Dhule Cotton & Groundnut Mandi", nameHindi: "धुळे कापूस व भुईमूग मंडी", pincode: "424001", lat: 20.9042, lon: 74.7749, isMandiCenter: true },
  { id: "c_shirpur", districtId: "d_dhule", districtName: "Dhule", name: "Shirpur Cotton Yard", nameHindi: "शिरपूर कॉटन यार्ड", pincode: "425405", lat: 21.3500, lon: 74.8833, isMandiCenter: true },
  { id: "c_sakri", districtId: "d_dhule", districtName: "Dhule", name: "Sakri APMC", nameHindi: "साक्री एपीएमसी", pincode: "424304", lat: 20.9333, lon: 74.3167, isMandiCenter: true },
  { id: "c_nandurbar_city", districtId: "d_nandurbar", districtName: "Nandurbar", name: "Nandurbar Red Chili Mandi", nameHindi: "नंदुरबार लाल मिरची मंडी", pincode: "425412", lat: 21.3723, lon: 74.2464, isMandiCenter: true },
  { id: "c_shahada", districtId: "d_nandurbar", districtName: "Nandurbar", name: "Shahada Papaya & Cotton APMC", nameHindi: "शहादा पपई व कापूस एपीएमसी", pincode: "425409", lat: 21.5667, lon: 74.4667, isMandiCenter: true },

  // Jalgaon District
  { id: "c_jalgaon_city", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Jalgaon Banana & Cotton Golden Mandi", nameHindi: "जळगांव केळी व कापूस सुवर्ण मंडी", pincode: "425001", lat: 21.0077, lon: 75.5626, isMandiCenter: true },
  { id: "c_bhusawal", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Bhusawal Banana APMC", nameHindi: "भुसावळ केळी एपीएमसी", pincode: "425201", lat: 21.0456, lon: 75.7892, isMandiCenter: true },
  { id: "c_chalisgaon", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Chalisgaon Cotton & Maize Mandi", nameHindi: "चाळीसगांव मका व कापूस मंडी", pincode: "424101", lat: 20.4636, lon: 75.0169, isMandiCenter: true },
  { id: "c_chopda", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Chopda APMC", nameHindi: "चोपडा एपीएमसी", pincode: "425107", lat: 21.2469, lon: 75.2975, isMandiCenter: true },
  { id: "c_raver", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Raver Banana Hub APMC", nameHindi: "रावेर केळी हब एपीएमसी", pincode: "425508", lat: 21.2500, lon: 76.0333, isMandiCenter: true },
  { id: "c_pachora", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Pachora Cotton APMC", nameHindi: "पाचोरा कापूस एपीएमसी", pincode: "424201", lat: 20.6667, lon: 75.3500, isMandiCenter: true },
  { id: "c_amalner", districtId: "d_jalgaon", districtName: "Jalgaon", name: "Amalner APMC", nameHindi: "अमळनेर एपीएमसी", pincode: "425401", lat: 21.0500, lon: 75.0667, isMandiCenter: true },

  // Ahmednagar District
  { id: "c_ahmednagar_city", districtId: "d_ahmednagar", districtName: "Ahmednagar", name: "Ahmednagar Market Yard", nameHindi: "अहमदनगर मार्केट यार्ड", pincode: "414001", lat: 19.0948, lon: 74.7480, isMandiCenter: true },
  { id: "c_rahuri", districtId: "d_ahmednagar", districtName: "Ahmednagar", name: "Rahuri MPKV Agricultural Mandi", nameHindi: "राहुरी कृषी विद्यापीठ मंडी", pincode: "413705", lat: 19.3908, lon: 74.6489, isMandiCenter: true },
  { id: "c_sangamner", districtId: "d_ahmednagar", districtName: "Ahmednagar", name: "Sangamner Tomato & Pomegranate APMC", nameHindi: "संगमनेर डाळिंब व टोमॅटो मंडी", pincode: "422605", lat: 19.5772, lon: 74.2081, isMandiCenter: true },
  { id: "c_kopargaon", districtId: "d_ahmednagar", districtName: "Ahmednagar", name: "Kopargaon Sugarcane & Grain APMC", nameHindi: "कोपरगांव एपीएमसी", pincode: "423601", lat: 19.8833, lon: 74.4833, isMandiCenter: true },
  { id: "c_shrirampur", districtId: "d_ahmednagar", districtName: "Ahmednagar", name: "Shrirampur Sweet Lime APMC", nameHindi: "श्रीरामपूर मोसंबी एपीएमसी", pincode: "413709", lat: 19.6167, lon: 74.6667, isMandiCenter: true },
  { id: "c_shevgaon", districtId: "d_ahmednagar", districtName: "Ahmednagar", name: "Shevgaon Cotton APMC", nameHindi: "शेवगांव कापूस एपीएमसी", pincode: "414502", lat: 19.3333, lon: 75.3000, isMandiCenter: true },

  // Pune District
  { id: "c_pune_gultekdi", districtId: "d_pune", districtName: "Pune", name: "Pune Gultekdi Market Yard", nameHindi: "पुणे गुलटेकडी मार्केट यार्ड", pincode: "411037", lat: 18.4967, lon: 73.8683, isMandiCenter: true },
  { id: "c_baramati", districtId: "d_pune", districtName: "Pune", name: "Baramati Hi-Tech APMC", nameHindi: "बारामती हाय-टेक एपीएमसी", pincode: "413102", lat: 18.1517, lon: 74.5772, isMandiCenter: true },
  { id: "c_junnar", districtId: "d_pune", districtName: "Pune", name: "Junnar (Narayangaon) Tomato Hub", nameHindi: "जुन्नर (नारायणगांव) टोमॅटो हब", pincode: "410502", lat: 19.1228, lon: 73.9786, isMandiCenter: true },
  { id: "c_indapur", districtId: "d_pune", districtName: "Pune", name: "Indapur Sugarcane & Grain APMC", nameHindi: "इंदापूर एपीएमसी", pincode: "413106", lat: 18.1158, lon: 75.0256, isMandiCenter: true },
  { id: "c_khed", districtId: "d_pune", districtName: "Pune", name: "Khed (Rajgurunagar) Potato Mandi", nameHindi: "खेड (राजगुरुनगर) बटाटा मंडी", pincode: "410505", lat: 18.8542, lon: 73.8864, isMandiCenter: true },
  { id: "c_shirur", districtId: "d_pune", districtName: "Pune", name: "Shirur Onion & Grain APMC", nameHindi: "शिरूर कांदा व धान्य एपीएमसी", pincode: "412210", lat: 18.8272, lon: 74.3756, isMandiCenter: true },
  { id: "c_daund", districtId: "d_pune", districtName: "Pune", name: "Daund APMC", nameHindi: "दौंड एपीएमसी", pincode: "413801", lat: 18.4639, lon: 74.5906, isMandiCenter: true },
  { id: "c_manchar", districtId: "d_pune", districtName: "Pune", name: "Manchar (Ambegaon) Vegetable APMC", nameHindi: "मंचर (आंबेगाव) भाजीपाला एपीएमसी", pincode: "410503", lat: 19.0000, lon: 73.9333, isMandiCenter: true },

  // Satara District
  { id: "c_satara_city", districtId: "d_satara", districtName: "Satara", name: "Satara Market Yard", nameHindi: "सातारा मार्केट यार्ड", pincode: "415001", lat: 17.6805, lon: 74.0183, isMandiCenter: true },
  { id: "c_karad", districtId: "d_satara", districtName: "Satara", name: "Karad Jaggery & Turmeric APMC", nameHindi: "कराड गूळ व हळद एपीएमसी", pincode: "415110", lat: 17.2889, lon: 74.1831, isMandiCenter: true },
  { id: "c_wai", districtId: "d_satara", districtName: "Satara", name: "Wai Strawberry & Turmeric Mandi", nameHindi: "वाई हळद व स्ट्रॉबेरी मंडी", pincode: "412803", lat: 17.9486, lon: 73.8925, isMandiCenter: true },
  { id: "c_phaltan", districtId: "d_satara", districtName: "Satara", name: "Phaltan Sugarcane & Pomegranate APMC", nameHindi: "फलटण डाळिंब व ऊस एपीएमसी", pincode: "415523", lat: 17.9833, lon: 74.4333, isMandiCenter: true },
  { id: "c_koregaon", districtId: "d_satara", districtName: "Satara", name: "Koregaon Ginger Hub APMC", nameHindi: "कोरेगाव आले हब एपीएमसी", pincode: "415501", lat: 17.7000, lon: 74.1667, isMandiCenter: true },

  // Sangli District
  { id: "c_sangli_city", districtId: "d_sangli", districtName: "Sangli", name: "Sangli World Turmeric Market Yard", nameHindi: "सांगली जागतिक हळद मार्केट", pincode: "416416", lat: 16.8524, lon: 74.5815, isMandiCenter: true },
  { id: "c_tasgaon", districtId: "d_sangli", districtName: "Sangli", name: "Tasgaon Asia's Raisin & Grape Capital", nameHindi: "तासगांव बेदाणा व द्राक्ष राजधानी", pincode: "416312", lat: 17.0342, lon: 74.6033, isMandiCenter: true },
  { id: "c_islampur", districtId: "d_sangli", districtName: "Sangli", name: "Islampur (Walwa) Sugarcane APMC", nameHindi: "इस्लामपूर (वाळवा) एपीएमसी", pincode: "415409", lat: 17.0500, lon: 74.2667, isMandiCenter: true },
  { id: "c_vita", districtId: "d_sangli", districtName: "Sangli", name: "Vita (Khanapur) APMC", nameHindi: "विटा (खानापूर) एपीएमसी", pincode: "415311", lat: 17.2667, lon: 74.5333, isMandiCenter: true },
  { id: "c_jat", districtId: "d_sangli", districtName: "Sangli", name: "Jat Pomegranate APMC", nameHindi: "जत डाळिंब एपीएमसी", pincode: "416404", lat: 17.0500, lon: 75.1667, isMandiCenter: true },

  // Kolhapur District
  { id: "c_kolhapur_shahupuri", districtId: "d_kolhapur", districtName: "Kolhapur", name: "Kolhapur Shahupuri Jaggery Market", nameHindi: "कोल्हापूर शाहूपुरी गूळ मार्केट", pincode: "416001", lat: 16.7050, lon: 74.2433, isMandiCenter: true },
  { id: "c_shirol_jaysingpur", districtId: "d_kolhapur", districtName: "Kolhapur", name: "Jaysingpur (Shirol) Tobacco & Grain Yard", nameHindi: "जयसिंगपूर (शिरोळ) एपीएमसी", pincode: "416101", lat: 16.7792, lon: 74.6019, isMandiCenter: true },
  { id: "c_kagal", districtId: "d_kolhapur", districtName: "Kolhapur", name: "Kagal APMC", nameHindi: "कागल एपीएमसी", pincode: "416216", lat: 16.5819, lon: 74.3161, isMandiCenter: true },
  { id: "c_gadhinglaj", districtId: "d_kolhapur", districtName: "Kolhapur", name: "Gadhinglaj Red Chili & Grain APMC", nameHindi: "गडहिंग्लज लाल मिरची एपीएमसी", pincode: "416502", lat: 16.2333, lon: 74.3500, isMandiCenter: true },

  // Solapur District
  { id: "c_solapur_city", districtId: "d_solapur", districtName: "Solapur", name: "Solapur Siddheshwar Market Yard", nameHindi: "सोलापूर सिद्धेश्वर मार्केट यार्ड", pincode: "413001", lat: 17.6599, lon: 75.9064, isMandiCenter: true },
  { id: "c_pandharpur", districtId: "d_solapur", districtName: "Solapur", name: "Pandharpur Pomegranate & Grain Mandi", nameHindi: "पंढरपूर डाळिंब व धान्य मंडी", pincode: "413304", lat: 17.6778, lon: 75.3278, isMandiCenter: true },
  { id: "c_barshi", districtId: "d_solapur", districtName: "Solapur", name: "Barshi Pulses & Tur Mandi", nameHindi: "बार्शी डाळ व तूर मंडी", pincode: "413401", lat: 18.2333, lon: 75.6833, isMandiCenter: true },
  { id: "c_sangole", districtId: "d_solapur", districtName: "Solapur", name: "Sangole Bhagwa Pomegranate Capital", nameHindi: "सांगोला भगवा डाळिंब राजधानी", pincode: "413307", lat: 17.4333, lon: 75.1833, isMandiCenter: true },
  { id: "c_akluj", districtId: "d_solapur", districtName: "Solapur", name: "Akluj (Malshiras) Sugarcane APMC", nameHindi: "अकलूज (माळशिरस) एपीएमसी", pincode: "413101", lat: 17.8833, lon: 75.0167, isMandiCenter: true },
  { id: "c_karmala", districtId: "d_solapur", districtName: "Solapur", name: "Karmala APMC", nameHindi: "करमाळा एपीएमसी", pincode: "413203", lat: 18.4167, lon: 75.2000, isMandiCenter: true },

  // Konkan Region (Raigad, Ratnagiri, Sindhudurg, Palghar, Thane, Mumbai)
  { id: "c_panvel_apmc", districtId: "d_raigad", districtName: "Raigad (Alibag)", name: "Panvel APMC Mandi", nameHindi: "पनवेल एपीएमसी मंडी", pincode: "410206", lat: 18.9894, lon: 73.1175, isMandiCenter: true },
  { id: "c_alibag", districtId: "d_raigad", districtName: "Raigad (Alibag)", name: "Alibag Coastal Produce APMC", nameHindi: "अलिबाग किनारपट्टी एपीएमसी", pincode: "402201", lat: 18.6414, lon: 72.8722, isMandiCenter: true },
  { id: "c_ratnagiri_alphonso", districtId: "d_ratnagiri", districtName: "Ratnagiri", name: "Ratnagiri Alphonso Mango & Cashew Mandi", nameHindi: "रत्नागिरी हापूस आंबा व काजू मंडी", pincode: "415612", lat: 16.9902, lon: 73.3120, isMandiCenter: true },
  { id: "c_chiplun", districtId: "d_ratnagiri", districtName: "Ratnagiri", name: "Chiplun APMC", nameHindi: "चिपळूण एपीएमसी", pincode: "415605", lat: 17.5333, lon: 73.5167, isMandiCenter: true },
  { id: "c_devgad", districtId: "d_sindhudurg", districtName: "Sindhudurg", name: "Devgad World Alphonso Mango APMC", nameHindi: "देवगड जागतिक हापूस आंबा एपीएमसी", pincode: "416613", lat: 16.3750, lon: 73.3750, isMandiCenter: true },
  { id: "c_kudal", districtId: "d_sindhudurg", districtName: "Sindhudurg", name: "Kudal Spices & Cashew Yard", nameHindi: "कुडाळ मसाले व काजू यार्ड", pincode: "416520", lat: 16.0167, lon: 73.6833, isMandiCenter: true },
  { id: "c_kalyan_apmc", districtId: "d_thane", districtName: "Thane", name: "Kalyan APMC Mandi", nameHindi: "कल्याण एपीएमसी मंडी", pincode: "421301", lat: 19.2437, lon: 73.1355, isMandiCenter: true },
  { id: "c_palghar_city", districtId: "d_palghar", districtName: "Palghar", name: "Palghar Sapota & Flowers APMC", nameHindi: "पालघर चिकू व फुले एपीएमसी", pincode: "401404", lat: 19.6967, lon: 72.7699, isMandiCenter: true },
  { id: "c_vashi_mumbai_apmc", districtId: "d_mumbai_suburban", districtName: "Mumbai Suburban", name: "Navi Mumbai Vashi Central APMC Complex", nameHindi: "नवी मुंबई वाशी मध्यवर्ती एपीएमसी संकुल", pincode: "400703", lat: 19.0768, lon: 73.0039, isMandiCenter: true },
  { id: "c_dadar_mandi", districtId: "d_mumbai", districtName: "Mumbai City", name: "Dadar Central Wholesale Flower & Veg Mandi", nameHindi: "दादर मध्यवर्ती घाऊक फूल व भाजी मंडी", pincode: "400028", lat: 19.0178, lon: 72.8478, isMandiCenter: true }
];
