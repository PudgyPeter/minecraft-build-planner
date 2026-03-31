import { useState, useEffect } from 'react';
import { Database, Download, RefreshCw, Save, AlertCircle } from 'lucide-react';

export default function BackupStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBackupStatus();
    const interval = setInterval(fetchBackupStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBackupStatus = async () => {
    try {
      const response = await fetch('/api/backup/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch backup status:', error);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/backup/create', { method: 'POST' });
      const data = await response.json();
      setMessage('✅ Backup created and saved to Git!');
      fetchBackupStatus();
    } catch (error) {
      setMessage('❌ Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async () => {
    if (!confirm('⚠️ This will replace all current data with the last backup. Continue?')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/backup/restore', { method: 'POST' });
      const data = await response.json();
      setMessage('✅ Data restored from backup! Refreshing page...');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage('❌ Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = async () => {
    try {
      const response = await fetch('/api/backup/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `minecraft-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setMessage('❌ Failed to download backup');
    }
  };

  if (!status) {
    return (
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex items-center gap-2 text-gray-400">
          <Database size={16} />
          <span>Loading backup status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Database className="text-green-500" size={20} />
        <h3 className="text-white font-semibold">Data Backup</h3>
        {status.autoBackupEnabled && (
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Auto</span>
        )}
      </div>

      <div className="space-y-2 mb-3 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Projects:</span>
          <span className="text-white">{status.projectsCount}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Templates:</span>
          <span className="text-white">{status.templatesCount}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Last Backup:</span>
          <span className="text-white">
            {status.lastBackup 
              ? new Date(status.lastBackup).toLocaleString()
              : 'Never'
            }
          </span>
        </div>
      </div>

      {message && (
        <div className={`p-2 rounded text-sm mb-3 ${
          message.includes('✅') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={createBackup}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
        >
          <Save size={14} />
          {loading ? 'Saving...' : 'Backup Now'}
        </button>
        
        <button
          onClick={restoreBackup}
          disabled={loading}
          className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
        >
          <RefreshCw size={14} />
          Restore
        </button>
        
        <button
          onClick={downloadBackup}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
          title="Download backup file"
        >
          <Download size={14} />
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-400 flex items-start gap-1">
        <AlertCircle size={12} className="mt-0.5" />
        <span>
          Auto-backups run every 5 minutes and are saved to Git for maximum safety.
        </span>
      </div>
    </div>
  );
}
