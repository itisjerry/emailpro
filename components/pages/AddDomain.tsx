'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppState';

export default function AddDomain() {
  const { addDomain, setCurrentPage } = useApp();
  const [domain, setDomain] = useState('');
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Domain</h1>
        <button onClick={()=>setCurrentPage('domains')} className="text-gray-600 hover:text-gray-900">← Back to Domains</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="yourdomain.com"/>
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked={trackingEnabled} onChange={(e)=>setTrackingEnabled(e.target.checked)}/>
              <span className="text-sm font-medium text-gray-700">Enable Click & Open Tracking</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={()=>setCurrentPage('domains')} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button
              onClick={()=>{ addDomain({ domain, trackingEnabled }); setCurrentPage('domains'); }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              disabled={!domain}
            >
              Add Domain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
