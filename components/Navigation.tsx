'use client';
import { useApp } from '@/context/AppState';
import { Mail, BarChart3, Settings, Send, Users, Copy, Globe, Inbox } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Navigation() {
  const { currentPage, setCurrentPage, user } = useApp();

  const btn = (key: any, icon: any, label: string) => (
    <button
      onClick={() => setCurrentPage(key)}
      className={`w-full flex items-center p-3 rounded-lg transition-colors ${
        currentPage === key ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen relative">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <Mail className="h-8 w-8 text-indigo-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">EmailPro</h1>
        </div>
        <div className="space-y-2">
          {btn('dashboard', <BarChart3 className="h-5 w-5" />, 'Dashboard')}
          {btn('accounts', <Settings className="h-5 w-5" />, 'Email Accounts')}
          {btn('campaigns', <Send className="h-5 w-5" />, 'Campaigns')}
          {btn('lists', <Users className="h-5 w-5" />, 'Email Lists')}
          {btn('templates', <Copy className="h-5 w-5" />, 'Templates')}
          {btn('domains', <Globe className="h-5 w-5" />, 'Domains')}
          {btn('inbox', <Inbox className="h-5 w-5" />, 'Unified Inbox')}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Welcome, {user?.name ?? user?.email ?? 'user'}!</p>
          <button onClick={() => signOut()} className="text-sm text-red-600 hover:text-red-700">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
