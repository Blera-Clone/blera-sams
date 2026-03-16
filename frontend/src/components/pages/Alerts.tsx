import { useEffect, useState } from "react";
import { CheckCircle, Clock, Search } from "lucide-react"; 
import { useAlerts } from "../../hooks/queries/useAlert"; 
import { getAlertTheme, getAlertIcon, formatAlertLabel } from "../../utils/AlertHelpers"; 
import type { Alert } from "../../types/Alerts";

export default function Alerts() {
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'RESOLVED'>('ACTIVE');
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL_TIME");
  
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAlerts(page, viewMode, debouncedSearch, severityFilter, timeFilter, 9);

  // The backend already filtered everything, so we just pass this array straight to the UI
  const displayedAlerts = data?.alerts || [];
  const totalPages = data?.totalPages || 1;
  const counts = data?.counts || { active: 0, resolved: 0 };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="w-full bg-(--color-card) border border-(--color-card-border) rounded-2xl shadow-xl overflow-hidden font-sans flex flex-col h-full">

      {/* Header Section with View Toggle */}
      <div className="p-6 flex justify-between items-center bg-gradient-to-b from-(--color-card) to-(--color-panel)/10 border-b border-(--color-card-border)">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">System Alerts</h2>
          <p className="text-sm text-gray-400 mt-1">Monitor automated hardware diagnostics across the network.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setViewMode('ACTIVE'); setPage(1); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all border ${viewMode === 'ACTIVE'
                ? 'bg-(--color-panel) border-(--color-card-border) text-gray-100 shadow-sm'
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
              }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => { setViewMode('RESOLVED'); setPage(1); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all border ${viewMode === 'RESOLVED'
                ? 'bg-(--color-panel) border-(--color-card-border) text-gray-100 shadow-sm'
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
              }`}
          >
            Resolved ({counts.resolved})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="px-6 py-4 flex gap-4 items-center border-b border-(--color-card-border) bg-(--color-panel)/20">
        
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by Asset ID or Message..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-(--color-panel) border border-(--color-card-border) rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500"
          />
        </div>

        {/* Severity Dropdown */}
        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setPage(1);
          }}
          className="py-2 px-4 bg-(--color-panel) border border-(--color-card-border) rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Only</option>
          <option value="WARNING">Warning Only</option>
        </select>

        {/* Time Frame Dropdown */}
        <select
          value={timeFilter}
          onChange={(e) => {
            setTimeFilter(e.target.value);
            setPage(1); 
          }}
          className="py-2 px-4 bg-(--color-panel) border border-(--color-card-border) rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
        >
          <option value="ALL_TIME">All Time</option>
          <option value="24H">Last 24 Hours</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
        </select>
        
      </div>

      {/* Table Content - Headers Removed */}
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-(--color-card-border)">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">
                  Loading telemetry alerts...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-red-400 text-sm">
                  Failed to load alerts.
                </td>
              </tr>
            ) : displayedAlerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">
                  No {viewMode.toLowerCase()} alerts found.
                </td>
              </tr>
            ) : (
              displayedAlerts.map((alert: Alert) => {
                const CategoryIcon = getAlertIcon(alert.metric);

                return (
                  <tr key={alert.id} className="hover:bg-(--color-panel)/30 transition-colors">
                    
                    <td className="py-5 px-6 text-sm font-medium text-gray-200 w-[15%]">
                      <span className="text-xs text-gray-400">{alert.assetId.substring(0, 8)}...</span>
                    </td>
                    
                    <td className="py-5 px-6 text-sm w-[15%]">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${getAlertTheme(alert.type)}`}>
                        {alert.type}
                      </span>
                    </td>
                    
                    <td className="py-5 px-6 text-sm text-gray-200 w-[20%]">
                      <div className="flex items-center gap-2 font-medium">
                        <CategoryIcon size={16} className="opacity-70 text-gray-400" />
                        {formatAlertLabel(alert.metric)}
                      </div>
                    </td>
                    
                    <td className="py-5 px-6 text-sm text-gray-300 w-[25%]">
                      {alert.message}
                    </td>
                    
                    <td className="py-5 px-6 text-sm w-[15%]">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border bg-transparent ${!alert.isResolved
                          ? 'text-red-400 border-red-500/50'
                          : 'text-emerald-400 border-emerald-500/50'
                        }`}>
                        {!alert.isResolved ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {!alert.isResolved ? 'Active' : 'Resolved'}
                      </span>
                    </td>
                    
                    <td className="py-5 px-6 text-sm text-gray-400 text-right whitespace-nowrap w-[10%]">
                      {formatTime(alert.createdAt)}
                    </td>
                    
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-(--color-card-border) flex items-center justify-between bg-transparent">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-4 py-1.5 text-xs font-medium text-gray-300 bg-(--color-panel) border border-(--color-card-border) rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-(--color-card) transition-colors"
        >
          Previous
        </button>
        <span className="text-xs font-medium text-gray-400">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((old) => (!totalPages || old === totalPages ? old : old + 1))}
          disabled={page === totalPages}
          className="px-4 py-1.5 text-xs font-medium text-gray-300 bg-(--color-panel) border border-(--color-card-border) rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-(--color-card) transition-colors"
        >
          Next
        </button>
      </div>

    </div>
  );
}
