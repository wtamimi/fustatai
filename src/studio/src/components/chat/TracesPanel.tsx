// components/chat/TracesPanel.tsx
'use client';

import { TraceEvent, StreamEventType } from '../../lib/types/chat';
import { 
  Activity, 
  Settings, 
  PencilRuler, 
  ArrowRightLeft, 
  AlertCircle,
  Play,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TracesPanelProps {
  traces: TraceEvent[];
}

const getEventIcon = (eventType: StreamEventType) => {
  switch (eventType) {
    case StreamEventType.AGENT_UPDATED:
      return <Settings className="h-4 w-4" />;
    case StreamEventType.TOOL_CALL:
      return <PencilRuler className="h-4 w-4" />;
    case StreamEventType.TOOL_OUTPUT:
      return <Activity className="h-4 w-4" />;
    case StreamEventType.HANDOFF:
      return <ArrowRightLeft className="h-4 w-4" />;
    case StreamEventType.ERROR:
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case StreamEventType.STREAM_START:
      return <Play className="h-4 w-4 text-green-500" />;
    case StreamEventType.STREAM_END:
      return <Square className="h-4 w-4 text-gray-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getEventColor = (eventType: StreamEventType) => {
  switch (eventType) {
    case StreamEventType.ERROR:
      return 'text-red-600 bg-red-50 border-red-200';
    case StreamEventType.STREAM_START:
      return 'text-green-600 bg-green-50 border-green-200';
    case StreamEventType.STREAM_END:
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case StreamEventType.TOOL_CALL:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case StreamEventType.TOOL_OUTPUT:
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case StreamEventType.HANDOFF:
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const formatEventType = (eventType: StreamEventType) => {
  return eventType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function TracesPanel({ traces }: TracesPanelProps) {
  if (traces.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No traces yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Agent traces will appear here during conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-2 p-4">
        {traces.map((trace) => (
          <div
            key={trace.id}
            className={cn(
              'border rounded-lg p-3 text-sm',
              getEventColor(trace.type)
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {getEventIcon(trace.type)}
              <span className="font-medium">
                {formatEventType(trace.type)}
              </span>
              <span className="text-xs opacity-70 ml-auto">
                {new Date(trace.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {Object.keys(trace.data).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(trace.data).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-medium opacity-80">{key}:</span>{' '}
                    <span className="opacity-70">
                      {typeof value === 'object' 
                        ? JSON.stringify(value, null, 2) 
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* {trace.session_id && (
              <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                <span className="text-xs opacity-60">
                  Session: {trace.session_id.slice(-8)}
                </span>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}