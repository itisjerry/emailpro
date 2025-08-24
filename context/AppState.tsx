'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CurrentPage, User as UUser, EmailAccount, Campaign, EmailList, InboxEmail, TemplateItem, DomainItem, FollowUp } from '@/types';
import { useSession, signOut } from 'next-auth/react';

type AppContextType = {
  currentPage: CurrentPage;
  setCurrentPage: (p: CurrentPage) => void;

  user: { id: string; email: string; name?: string } | null;

  signout: () => void;
  demo: () => void;

  emailAccounts: EmailAccount[];
  setEmailAccounts: React.Dispatch<React.SetStateAction<EmailAccount[]>>;
  addEmailAccount: (acc: Partial<EmailAccount> & { email: string; provider: string; password?: string; dailyLimit?: number }) => void;

  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  createCampaign: (payload: {
    name: string; subject: string; content: string;
    selectedAccounts: number[]; selectedLists: number[]; selectedTemplate: string;
    interval: number; vpnEnabled: boolean; followUps: FollowUp[]; trackOpens: boolean; trackClicks: boolean; spintax: boolean;
  }) => void;

  emailLists: EmailList[];
  setEmailLists: React.Dispatch<React.SetStateAction<EmailList[]>>;
  handleFileUpload: (file: File, type: 'emailList') => void;

  unifiedInbox: InboxEmail[];
  setUnifiedInbox: React.Dispatch<React.SetStateAction<InboxEmail[]>>;

  templates: TemplateItem[];
  setTemplates: React.Dispatch<React.SetStateAction<TemplateItem[]>>;
  addTemplate: (t: Omit<TemplateItem, 'id'>) => void;

  domains: DomainItem[];
  setDomains: React.Dispatch<React.SetStateAction<DomainItem[]>>;
  addDomain: (d: { domain: string; trackingEnabled: boolean }) => void;

  templateFormDefaults: TemplateItem;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard');
  const { data: session } = useSession();

  const user = session?.user ? { id: (session.user as any).id, email: session.user.email!, name: session.user.name || undefined } : null;

  // Local demo data to keep UI functional; in production you'd fetch from DB
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [unifiedInbox, setUnifiedInbox] = useState<InboxEmail[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);

  useEffect(()=>{
    if (user) {
      setTemplates([
        { id: 1, name: 'Cold Outreach', category: 'outreach', subject: 'Quick question about {{company}}', content: 'Hi {{firstName}}, ...' },
        { id: 2, name: 'Follow Up', category: 'followup', subject: 'Re: {{previousSubject}}', content: 'Hi {{firstName}}, I wanted to follow up...' }
      ]);
    } else {
      setEmailAccounts([]); setCampaigns([]); setEmailLists([]); setTemplates([]); setDomains([]); setUnifiedInbox([]);
    }
  }, [user]);

  const demo = () => {}; // no-op when using real auth
  const signout = () => { signOut({ callbackUrl: '/auth/signin' }); };

  const addEmailAccount = ({ email, provider, dailyLimit = 50 }: any) => {
    const id = emailAccounts.length ? Math.max(...emailAccounts.map(a => a.id as any)) + 1 : 1;
    setEmailAccounts(prev => [...prev, {
      id, email, provider, status: 'Connected', reputation: 90, dailyLimit, sentToday: 0, warmupPhase: 'Active', lastActivity: 'Just now', domain: email.split('@')[1] || ''
    } as any]);
  };

  const addTemplate = (t: any) => {
    const id = templates.length ? Math.max(...templates.map(x => x.id)) + 1 : 1;
    setTemplates(prev => [...prev, { ...t, id }]);
    setCurrentPage('templates');
  };

  const addDomain = (d: any) => {
    const id = domains.length ? Math.max(...domains.map(x => (x as any).id)) + 1 : 1;
    setDomains(prev => [...prev, { id, domain: d.domain, status: 'Pending', records: 'Checking...', tracking: d.trackingEnabled ? 'Enabled' : 'Disabled', reputation: 'Unknown' } as any]);
  };

  const createCampaign = (payload: any) => {
    const id = campaigns.length ? Math.max(...campaigns.map(x => (x as any).id)) + 1 : 1;
    setCampaigns(prev => [...prev, { id, name: payload.name, status: 'Draft', sent: 0, delivered: 0, opened: 0, replied: 0, bounced: 0, unsubscribed: 0, created: new Date().toISOString().split('T')[0], followUps: payload.followUps.length, template: 'Custom' } as any]);
    setCurrentPage('campaigns');
  };

  const handleFileUpload = (file: File, type: 'emailList') => {
    // Client-side parse is fine; server-side persistence can be added
    const id = emailLists.length ? Math.max(...emailLists.map(x => (x as any).id)) + 1 : 1;
    setEmailLists(prev => [...prev, { id, name: file.name.replace('.csv',''), emails: 100, uploaded: new Date().toISOString().split('T')[0], verified: 95, bounced: 5 } as any]);
  };

  const templateFormDefaults = { id: 0, name: '', category: 'outreach', subject: '', content: '' } as any;

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      user, signout, demo,
      emailAccounts, setEmailAccounts, addEmailAccount,
      campaigns, setCampaigns, createCampaign,
      emailLists, setEmailLists, handleFileUpload,
      unifiedInbox, setUnifiedInbox,
      templates, setTemplates, addTemplate,
      domains, setDomains, addDomain,
      templateFormDefaults
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
