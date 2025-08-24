'use client';
import { useApp } from '@/context/AppState';
import { Upload, Eye, Download, Trash2 } from 'lucide-react';

export default function EmailLists() {
  const { emailLists, handleFileUpload } = useApp();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Lists</h1>
        <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV List
          <input type="file" accept=".csv" onChange={(e)=>{
            const f=e.target.files?.[0]; if(f) handleFileUpload(f,'emailList');}} className="hidden"/>
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">List Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Emails</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounced</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emailLists.map(list => (
              <tr key={list.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{list.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{list.emails}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-green-600 font-medium">{list.verified}</span></td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-red-600 font-medium">{list.bounced}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{list.uploaded}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3"><Eye className="h-4 w-4" /></button>
                  <button className="text-green-600 hover:text-green-900 mr-3"><Download className="h-4 w-4" /></button>
                  <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">List Processing Features</h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>✓ Automatic duplicate removal across all lists</p>
          <p>✓ Remove emails that have unsubscribed from previous campaigns</p>
          <p>✓ Remove emails that have already replied to campaigns</p>
          <p>✓ Email verification and bounce detection</p>
        </div>
      </div>
    </div>
  );
}
