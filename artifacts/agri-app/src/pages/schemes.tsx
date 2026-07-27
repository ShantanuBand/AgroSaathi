import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListSchemes } from '@workspace/api-client-react';
import { Search, Filter, FileText, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/format';

export default function SchemesPage() {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [category, setCategory] = React.useState<string | undefined>();
  const [stateFilter, setStateFilter] = React.useState<string | undefined>();
  const [selectedSchemeId, setSelectedSchemeId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: schemes, isLoading } = useListSchemes(
    { search: debouncedSearch, category, state: stateFilter },
    { query: { queryKey: ['schemes', debouncedSearch, category, stateFilter] } }
  );

  const selectedScheme = schemes?.find(s => s.id === selectedSchemeId);

  return (
    <AppLayout>
      <PageHeader 
        title="Government Schemes" 
        description="Find and apply for central and state agricultural subsidies and grants."
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search schemes (e.g. PM-Kisan, PMKSY...)" 
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-card border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || undefined)}
          >
            <option value="">All Categories</option>
            <option value="Insurance">Insurance</option>
            <option value="Subsidy">Subsidy</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Credit">Credit</option>
          </select>
          <select 
            className="bg-card border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            value={stateFilter || ''}
            onChange={(e) => setStateFilter(e.target.value || undefined)}
          >
            <option value="">All States</option>
            <option value="Central">Central Govt.</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
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
        ) : schemes && schemes.length > 0 ? (
          schemes.map(scheme => (
            <div key={scheme.id} className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-md tracking-wide uppercase">
                    {scheme.category}
                  </span>
                  {scheme.isFeatured && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md tracking-wide">
                      FEATURED
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2" title={scheme.title}>{scheme.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {scheme.shortDescription}
                </p>
                <div className="space-y-2 mt-auto">
                  {scheme.maxBenefitAmount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Benefit</span>
                      <span className="font-mono font-bold text-primary">{formatCurrency(scheme.maxBenefitAmount)}</span>
                    </div>
                  )}
                  {scheme.applicationDeadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deadline</span>
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
                  className="w-full bg-card hover:bg-primary hover:text-primary-foreground border border-input hover:border-primary text-foreground font-medium py-2 rounded-xl transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No schemes found matching your criteria.
          </div>
        )}
      </div>

      {/* Detail Modal Overlay */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-start bg-muted/30">
              <div>
                <span className="px-2.5 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-md tracking-wide uppercase mb-2 inline-block">
                  {selectedScheme.category}
                </span>
                <h2 className="text-2xl font-bold">{selectedScheme.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">Nodal Ministry: {selectedScheme.ministry}</p>
              </div>
              <button 
                onClick={() => setSelectedSchemeId(null)}
                className="p-2 hover:bg-muted rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                <p className="text-foreground leading-relaxed">{selectedScheme.fullDescription}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Eligibility</h3>
                  <ul className="space-y-2">
                    {selectedScheme.eligibility.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Key Benefits</h3>
                  <ul className="space-y-2">
                    {selectedScheme.benefits.map((item, i) => (
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
                  <FileText className="w-4 h-4" /> Required Documents
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScheme.documents.map((doc, i) => (
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
                className="px-6 py-2.5 rounded-xl font-medium border border-input hover:bg-muted transition-colors"
              >
                Close
              </button>
              {selectedScheme.applicationUrl && (
                <a 
                  href={selectedScheme.applicationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
