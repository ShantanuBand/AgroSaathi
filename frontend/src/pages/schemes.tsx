import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListSchemes } from '@workspace/api-client-react';
import { Search, FileText, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/format';
import { useLanguage } from '@/context/language-context';

export interface SchemeWithMarathi {
  id: string;
  title: string;
  titleMarathi?: string;
  shortDescription: string;
  shortDescriptionMarathi?: string;
  fullDescription: string;
  fullDescriptionMarathi?: string;
  category: string;
  categoryMarathi?: string;
  ministry: string;
  ministryMarathi?: string;
  eligibility: string[];
  eligibilityMarathi?: string[];
  benefits: string[];
  benefitsMarathi?: string[];
  documents: string[];
  documentsMarathi?: string[];
  applicationDeadline: string | null;
  applicationUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  states: string[];
  maxBenefitAmount: number | null;
  beneficiaryCount: number | null;
}

export default function SchemesPage() {
  const { language, t } = useLanguage();
  const isMarathi = language === 'mr';

  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [category, setCategory] = React.useState<string | undefined>();
  const [stateFilter, setStateFilter] = React.useState<string | undefined>();
  const [selectedSchemeId, setSelectedSchemeId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: rawSchemes, isLoading } = useListSchemes(
    { search: debouncedSearch, category, state: stateFilter },
    { query: { queryKey: ['schemes', debouncedSearch, category, stateFilter] } }
  );

  const schemes = rawSchemes as SchemeWithMarathi[] | undefined;
  const selectedScheme = Array.isArray(schemes) ? schemes.find(s => s.id === selectedSchemeId) : null;

  return (
    <AppLayout>
      <PageHeader 
        title={t('schemes.title', 'Government Schemes')} 
        description={isMarathi ? 'केन्द्र व राज्य सरकारच्या कृषी योजना, अनुदाने व मदतीची माहिती आणि ऑनलाईन अर्ज.' : 'Find and apply for central and state agricultural subsidies and grants.'}
        accentColor="border-violet-500"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={isMarathi ? 'योजना शोधा (उदा. पीएम-किसान, पीक विमा...)' : 'Search schemes (e.g. PM-Kisan, PMKSY...)'} 
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-card border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-sm font-semibold"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || undefined)}
          >
            <option value="">{isMarathi ? 'सर्व वर्ग' : 'All Categories'}</option>
            <option value="Insurance">{isMarathi ? 'पीक विमा' : 'Insurance'}</option>
            <option value="Subsidy">{isMarathi ? 'अनुदान' : 'Subsidy'}</option>
            <option value="Infrastructure">{isMarathi ? 'कृषी पायाभूत सुविधा' : 'Infrastructure'}</option>
            <option value="Credit">{isMarathi ? 'कृषी कर्ज व वित्त' : 'Credit'}</option>
          </select>
          <select 
            className="bg-card border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-sm font-semibold"
            value={stateFilter || 'Maharashtra'}
            onChange={(e) => setStateFilter(e.target.value || undefined)}
          >
            <option value="Maharashtra">{isMarathi ? 'महाराष्ट्र राज्य योजना' : 'Maharashtra State Schemes'}</option>
            <option value="Central">{isMarathi ? 'केंद्र सरकार योजना' : 'Central Govt. Schemes'}</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 h-64 animate-pulse">
              <div className="h-4 bg-muted w-20 rounded mb-4"></div>
              <div className="h-6 bg-muted w-3/4 rounded mb-2"></div>
              <div className="h-4 bg-muted w-full rounded mb-1"></div>
              <div className="h-4 bg-muted w-2/3 rounded mb-8"></div>
              <div className="h-10 bg-muted w-full rounded-xl"></div>
            </div>
          ))
        ) : Array.isArray(schemes) && schemes.length > 0 ? (
          schemes.map(scheme => {
            const displayTitle = isMarathi ? (scheme.titleMarathi || scheme.title) : scheme.title;
            const displayShortDesc = isMarathi ? (scheme.shortDescriptionMarathi || scheme.shortDescription) : scheme.shortDescription;
            const displayCategory = isMarathi ? (scheme.categoryMarathi || scheme.category) : scheme.category;

            return (
              <div key={scheme.id} className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/60 rounded-2xl flex flex-col overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all hover:-translate-y-1">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-md tracking-wide uppercase">
                      {displayCategory}
                    </span>
                    {scheme.isFeatured && (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md tracking-wide">
                        {isMarathi ? 'महत्त्वाची योजना' : 'FEATURED'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2" title={displayTitle}>{displayTitle}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {displayShortDesc}
                  </p>
                  <div className="space-y-2 mt-auto">
                    {scheme.maxBenefitAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isMarathi ? 'कमाल लाभ / अनुदान' : 'Max Benefit'}</span>
                        <span className="font-mono font-bold text-primary">{formatCurrency(scheme.maxBenefitAmount)}</span>
                      </div>
                    )}
                    {scheme.applicationDeadline && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{isMarathi ? 'अंतिम मुदत' : 'Deadline'}</span>
                        <span className="font-medium text-destructive flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(scheme.applicationDeadline)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-border bg-muted/20">
                  <button 
                    onClick={() => setSelectedSchemeId(scheme.id)}
                    className="w-full bg-card hover:bg-primary hover:text-primary-foreground border border-input hover:border-primary text-foreground font-medium py-2 rounded-xl transition-colors cursor-pointer text-sm font-bold"
                  >
                    {isMarathi ? 'तपशील पहा' : 'View Details'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground font-medium">
            {isMarathi ? 'तुमच्या शोधानुसार कोणतीही योजना आढळली नाही.' : 'No schemes found matching your criteria.'}
          </div>
        )}
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-start bg-muted/30">
              <div>
                <span className="px-2.5 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-md tracking-wide uppercase mb-2 inline-block">
                  {isMarathi ? (selectedScheme.categoryMarathi || selectedScheme.category) : selectedScheme.category}
                </span>
                <h2 className="text-2xl font-bold">
                  {isMarathi ? (selectedScheme.titleMarathi || selectedScheme.title) : selectedScheme.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isMarathi ? 'संबंधित मंत्रालय / विभाग:' : 'Nodal Ministry:'} <strong className="text-foreground">{isMarathi ? (selectedScheme.ministryMarathi || selectedScheme.ministry) : selectedScheme.ministry}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSelectedSchemeId(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {isMarathi ? 'योजनेची सविस्तर माहिती' : 'Description'}
                </h3>
                <p className="text-foreground leading-relaxed">
                  {isMarathi ? (selectedScheme.fullDescriptionMarathi || selectedScheme.fullDescription) : selectedScheme.fullDescription}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    {isMarathi ? 'पात्रता अटी' : 'Eligibility'}
                  </h3>
                  <ul className="space-y-2">
                    {(isMarathi ? (selectedScheme.eligibilityMarathi || selectedScheme.eligibility) : selectedScheme.eligibility).map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    {isMarathi ? 'योजनेचे मुख्य फायदे' : 'Key Benefits'}
                  </h3>
                  <ul className="space-y-2">
                    {(isMarathi ? (selectedScheme.benefitsMarathi || selectedScheme.benefits) : selectedScheme.benefits).map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm items-start">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {isMarathi ? 'आवश्यक कागदपत्रे' : 'Required Documents'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(isMarathi ? (selectedScheme.documentsMarathi || selectedScheme.documents) : selectedScheme.documents).map((doc, i) => (
                    <span key={i} className="bg-white dark:bg-black/20 text-amber-800 dark:text-amber-300 text-xs px-2.5 py-1.5 rounded-md border border-amber-200 dark:border-amber-800 font-medium">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-3 bg-card">
              <button 
                onClick={() => setSelectedSchemeId(null)}
                className="px-6 py-2.5 rounded-xl font-medium border border-input hover:bg-muted transition-colors cursor-pointer text-sm font-semibold"
              >
                {isMarathi ? 'बंद करा' : 'Close'}
              </button>
              {selectedScheme.applicationUrl && (
                <a 
                  href={selectedScheme.applicationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20 cursor-pointer text-sm"
                >
                  {isMarathi ? 'ऑनलाईन अर्ज करा' : 'Apply Now'} <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

