export type CurrentPage =
  | 'dashboard'
  | 'accounts'
  | 'campaigns'
  | 'createCampaign'
  | 'addFollowUp'
  | 'templates'
  | 'addTemplate'
  | 'domains'
  | 'addDomain'
  | 'lists'
  | 'inbox';

export interface User {
  email: string;
  name: string;
}

export interface EmailAccount {
  id: number;
  email: string;
  provider: string;
  status: 'Connected' | 'Connecting...' | 'Disconnected';
  reputation: number;
  dailyLimit: number;
  sentToday: number;
  warmupPhase: 'Active' | 'Starting' | 'Paused';
  lastActivity: string;
  domain: string;
}

export interface Campaign {
  id: number;
  name: string;
  status: 'Active' | 'Paused' | 'Draft';
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
  created: string;
  followUps: number;
  template: string;
}

export interface EmailList {
  id: number;
  name: string;
  emails: number;
  uploaded: string;
  verified: number;
  bounced: number;
}

export interface InboxEmail {
  id: number;
  from: string;
  subject: string;
  account: string;
  time: string;
  read: boolean;
  type: 'reply' | 'bounce' | 'other';
  campaign: string;
}

export interface TemplateItem {
  id: number;
  name: string;
  category: 'outreach' | 'followup' | 'nurture' | 'promotional';
  subject: string;
  content: string;
}

export interface DomainItem {
  id: number;
  domain: string;
  status: 'Connected' | 'Pending' | 'Error';
  records: 'Valid' | 'Checking...' | 'Missing SPF' | 'Missing DKIM' | 'Missing DMARC';
  tracking: 'Enabled' | 'Disabled';
  reputation: 'Good' | 'Unknown' | 'Poor';
}

export interface FollowUp {
  id: number;
  subject: string;
  content: string;
  delay: number;
  delayUnit: 'hours' | 'days' | 'weeks';
}
