'use client';
import { useApp } from '@/context/AppState';
import { RefreshCw } from 'lucide-react';

export default function UnifiedInbox() {
  const { unifiedInbox } = useApp();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unified Inbox</h1>
        <button className="text-indigo-600 hover:text-indigo-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All Replies & Interactions</h2>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>Unread: {unifiedInbox.filter(e => !e.read).length}</span>
              <span>Total: {unifiedInbox.length}</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {unifiedInbox.map(email => (
            <div key={email.id} className={`p-6 hover:bg-gray-50 ${!email.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${!email.read ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{email.from}</p>
                    <p className="text-sm text-gray-600">{email.subject}</p>
                    <p className="text-xs text-gray-500">Campaign: {email.campaign} • Type: {email.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{email.time}</p>
                  <p className="text-xs text-gray-400">via {email.account}</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="text-indigo-600 hover:text-indigo-700 text-xs">Reply</button>
                    <button className="text-gray-600 hover:text-gray-700 text-xs">Mark Read</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
