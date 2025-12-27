import { RefreshCw } from 'lucide-react';

export const LoadingSpinner = () => (
  // <div className="flex justify-center py-8">
  //   <Loader2 className="h-8 w-8 animate-spin text-primary" />
  // </div>
  <div className="flex items-center justify-center h-64">
    <RefreshCw className="h-8 w-8 animate-spin" />
  </div>

);