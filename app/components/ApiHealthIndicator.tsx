import React, { useState, useEffect } from 'react';
import { Activity, Database, Clock, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';

interface HealthStatus {
  success: boolean;
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
  environment?: string;
  database?: {
    status: 'connected' | 'disconnected';
    responseTime: string;
    provider?: string;
    host?: string;
  };
  stats?: {
    timezones: number;
    users: number;
  };
  uptime?: string;
  error?: string;
}

export default function ApiHealthIndicator() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth({
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Failed to connect to API',
      });
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (loading) return <Clock className="w-5 h-5 animate-spin text-gray-400" />;
    if (health?.success && health?.status === 'healthy') 
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (health?.status === 'unhealthy') 
      return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusColor = () => {
    if (loading) return 'text-gray-500';
    if (health?.success && health?.status === 'healthy') return 'text-green-600';
    if (health?.status === 'unhealthy') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    if (health?.success && health?.status === 'healthy') return 'API Online';
    if (health?.status === 'unhealthy') return 'API Offline';
    return 'API Issues';
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#219EBC]" />
            <h3 className="font-semibold text-[#023047]">API Status</h3>
          </div>
          <Button
            onClick={checkHealth}
            variant="outline"
            size="sm"
            disabled={loading}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {lastChecked && (
            <span className="text-xs text-gray-500">
              {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Database Status */}
        {health?.database && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-400" />
              <span>Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={health.database.status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                {health.database.status}
              </span>
              <span className="text-gray-500">({health.database.responseTime})</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {health?.stats && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-[#219EBC]">{health.stats.timezones}</div>
              <div className="text-gray-500">Timezones</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-[#219EBC]">{health.stats.users}</div>
              <div className="text-gray-500">Users</div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {health?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{health.error}</p>
          </div>
        )}

        {/* API Docs Link */}
        <div className="pt-2 border-t border-gray-200">
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-sm text-[#219EBC] hover:text-[#023047] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>API Documentation</span>
          </a>
        </div>

        {/* Environment Info */}
        {health?.environment && (
          <div className="text-xs text-gray-500 flex justify-between">
            <span>v{health.version || '1.0.0'}</span>
            <span>{health.environment}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
