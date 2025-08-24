'use client';
import { AppProvider, useApp } from '@/context/AppState';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/pages/Dashboard';
import EmailAccounts from '@/components/pages/EmailAccounts';
import Campaigns from '@/components/pages/Campaigns';
import CreateCampaign from '@/components/pages/CreateCampaign';
import EmailLists from '@/components/pages/EmailLists';
import UnifiedInbox from '@/components/pages/UnifiedInbox';
import Templates from '@/components/pages/Templates';
import AddTemplate from '@/components/pages/AddTemplate';
import Domains from '@/components/pages/Domains';
import AddDomain from '@/components/pages/AddDomain';
import { useSession } from 'next-auth/react';

function ContentRouter() {
  const { data: session } = useSession();
  const { currentPage } = useApp();

  if (!session?.user) {
    if (typeof window !== 'undefined') window.location.href = '/auth/signin';
    return null;
  }

  const render = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'accounts': return <EmailAccounts />;
      case 'campaigns': return <Campaigns />;
      case 'createCampaign': return <CreateCampaign />;
      case 'templates': return <Templates />;
      case 'addTemplate': return <AddTemplate />;
      case 'domains': return <Domains />;
      case 'addDomain': return <AddDomain />;
      case 'lists': return <EmailLists />;
      case 'inbox': return <UnifiedInbox />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1 overflow-auto">{render()}</div>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <ContentRouter />
    </AppProvider>
  );
}
