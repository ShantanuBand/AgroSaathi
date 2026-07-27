import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListCropPrices, useGetCropPriceSummary } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/format';
import { TrendingDown, TrendingUp, Search, Filter } from 'lucide-react';
import { AnimatedNumber } from '@/components/animated-number';

export default function MarketPage() {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [category, setCategory] = React.useState<string | undefined>();
  const [stateFilter, setStateFilter] = React.useState<string | undefined>();

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: summary } = useGetCropPriceSummary({ query: { queryKey: ['crop-price-summary'] } });
  
  const { data: prices, isLoading } = useListCropPrices(
    { search: debouncedSearch, category, state: stateFilter },
    { query: { queryKey: ['crop-prices', debouncedSearch, category, stateFilter] } }
  );

  return (
    <AppLayout>
      <PageHeader 
        title="Market Prices" 
        description="Live mandi rates across India. Last updated today."
      />

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">Total Crops Tracked</div>
            <div className="text-2xl font-bold font-mono">
              <AnimatedNumber value={summary.totalCrops} />
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl">
            <div className="text-sm text-muted-foreground mb-1">Avg Market Change</div>
            <div className={`text-2xl font-bold font-mono flex items-center gap-2 ${summary.averageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.averageChange >= 0 ? '+' : ''}<AnimatedNumber value={summary.averageChange} format={(v) => v.toFixed(1) + '%'} />
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 p-4 rounded-xl col-span-2 md:col-span-1">
            <div className="text-sm text-green-700 dark:text-green-400 mb-1 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> Top Gainer</div>
            <div className="font-bold text-green-900 dark:text-green-300 truncate">{summary.topGainers[0]?.cropName}</div>
            <div className="text-sm text-green-800 dark:text-green-500 font-mono">+{summary.topGainers[0]?.changePercent}%</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 p-4 rounded-xl col-span-2 md:col-span-1">
            <div className="text-sm text-red-700 dark:text-red-400 mb-1 flex items-center gap-1"><TrendingDown className="w-4 h-4"/> Top Loser</div>
            <div className="font-bold text-red-900 dark:text-red-300 truncate">{summary.topLosers[0]?.cropName}</div>
            <div className="text-sm text-red-800 dark:text-red-500 font-mono">{summary.topLosers[0]?.changePercent}%</div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search crops (e.g. Wheat, Basmati...)" 
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
            <option value="Cereals">Cereals</option>
            <option value="Pulses">Pulses</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Spices">Spices</option>
          </select>
          <select 
            className="bg-card border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            value={stateFilter || ''}
            onChange={(e) => setStateFilter(e.target.value || undefined)}
          >
            <option value="">All States</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Crop</th>
                <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Market</th>
                <th className="px-6 py-4 font-semibold text-sm text-muted-foreground text-right">Price</th>
                <th className="px-6 py-4 font-semibold text-sm text-muted-foreground text-right">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-5 bg-muted rounded w-32 mb-1"></div><div className="h-3 bg-muted rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-5 bg-muted rounded w-20 ml-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 bg-muted rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : prices && prices.length > 0 ? (
                prices.map(crop => (
                  <tr key={crop.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{crop.cropName}</div>
                      <div className="text-xs text-muted-foreground">{crop.cropNameHindi} • {crop.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{crop.market}</div>
                      <div className="text-xs text-muted-foreground">{crop.state}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-mono font-bold text-lg text-foreground">{formatCurrency(crop.currentPrice)}</div>
                      <div className="text-xs text-muted-foreground">per {crop.unit}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center justify-end gap-1 px-2 py-1 rounded-md text-sm font-medium ${
                        crop.changePercent > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 
                        crop.changePercent < 0 ? 'bg-red-50 text-red-700 border border-red-200' : 
                        'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {crop.changePercent > 0 ? <TrendingUp className="w-3 h-3" /> : crop.changePercent < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                        {Math.abs(crop.changePercent)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        {crop.change > 0 ? '+' : ''}{crop.change} ₹
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No crops found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
