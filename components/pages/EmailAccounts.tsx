'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppState';
import { Upload, Plus, Edit, Trash2 } from 'lucide-react';

export default function EmailAccounts() {
  const { emailAccounts, addEmailAccount, handleFileUpload } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('gmail');
  const [dailyLimit, setDailyLimit] = useState(50);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Accounts</h1>
        <div className="flex space-x-3">
          <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
            <input type="file" accept=".csv" onChange={(e)=>{
              const f=e.target.files?.[0]; if(f) handleFileUpload(f,'emailList');}} className="hidden" />
          </label>
          <button
            onClick={()=>setShowAdd(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Account
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Email Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="your@email.com"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="App password or OAuth"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={provider} onChange={(e)=>setProvider(e.target.value)}>
                <option value="gmail">Gmail</option>
                <option value="outlook">Microsoft 365 / Outlook</option>
                <option value="yahoo">Yahoo</option>
                <option value="custom">Custom SMTP/IMAP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Send Limit</label>
              <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={dailyLimit} onChange={(e)=>setDailyLimit(parseInt(e.target.value))} min={1} max={200}/>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={()=>setShowAdd(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button onClick={()=>{ addEmailAccount({email, provider, password, dailyLimit}); setShowAdd(false); setEmail(''); setPassword(''); setProvider('gmail'); setDailyLimit(50);}}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              disabled={!email || !password}
            >Add Account</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warmup</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emailAccounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{account.email}</div>
                    <div className="text-sm text-gray-500">{account.lastActivity}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.provider}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.status === 'Connected' ? 'bg-green-100 text-green-800' :
                    account.status === 'Connecting...' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {account.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    account.reputation >= 90 ? 'bg-green-100 text-green-800' :
                    account.reputation >= 75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {account.reputation}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.sentToday}/{account.dailyLimit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.warmupPhase === 'Active' ? 'bg-blue-100 text-blue-800' :
                    account.warmupPhase === 'Starting' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {account.warmupPhase}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
