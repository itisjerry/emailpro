'use client';
import { useApp } from '@/context/AppState';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';

export default function Domains() {
  const { domains, setCurrentPage } = useApp();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
        <button
          onClick={() => setCurrentPage('addDomain')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNS Records</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.map(d => (
              <tr key={d.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.domain}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    d.status === 'Connected' ? 'bg-green-100 text-green-800' :
                    d.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>{d.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    d.records === 'Valid' ? 'bg-green-100 text-green-800' :
                    d.records === 'Checking...' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>{d.records}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.tracking}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.reputation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3"><ExternalLink className="h-4 w-4" /></button>
                  <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">DNS Setup Instructions</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>SPF Record:</strong> v=spf1 include:_spf.google.com ~all</p>
          <p><strong>DKIM Record:</strong> Will be provided after domain verification</p>
          <p><strong>DMARC Record:</strong> v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com</p>
        </div>
      </div>
    </div>
  );
}
