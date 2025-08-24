'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppState';
import { Plus, Send, Trash2 } from 'lucide-react';

export default function CreateCampaign() {
  const { setCurrentPage, templates, emailAccounts, emailLists, createCampaign } = useApp();

  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [interval, setInterval] = useState(30);
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [spintax, setSpintax] = useState(false);
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [followUps, setFollowUps] = useState<{id:number;subject:string;content:string;delay:number;delayUnit:'hours'|'days'|'weeks'}[]>([]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
        <button onClick={()=>setCurrentPage('campaigns')} className="text-gray-600 hover:text-gray-900">
          ← Back to Campaigns
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter campaign name"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={selectedTemplate}
                onChange={(e)=>{
                  const v = e.target.value; setSelectedTemplate(v);
                  const tmpl = templates.find(t => String(t.id) === v);
                  if (tmpl) { setSubject(tmpl.subject); setContent(tmpl.content); }
                }}>
                <option value="">Create from scratch</option>
                {templates.map(t => (
                  <option key={t.id} value={String(t.id)}>{t.name} ({t.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject supports {{firstName}}, {{company}} variables"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
              <textarea rows={8} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Use variables: {{firstName}}, {{lastName}}, {{company}}, {{senderName}}"/>
              <p className="text-xs text-gray-500 mt-1">Variables: firstName, lastName, company, senderName, achievement, topic</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Interval (seconds)</label>
                <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={interval} onChange={(e)=>setInterval(parseInt(e.target.value))} min={10} max={3600}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={trackOpens} onChange={(e)=>setTrackOpens(e.target.checked)} />
                    <span className="text-sm">Track Opens</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={trackClicks} onChange={(e)=>setTrackClicks(e.target.checked)} />
                    <span className="text-sm">Track Clicks</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={spintax} onChange={(e)=>setSpintax(e.target.checked)} />
                    <span className="text-sm">Enable Spintax</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Email Accounts</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {emailAccounts.map(acc => (
                  <label key={acc.id} className="flex items-center">
                    <input type="checkbox" className="mr-2"
                      checked={selectedAccounts.includes(acc.id)}
                      onChange={(e)=>{
                        setSelectedAccounts(prev => e.target.checked ? [...prev, acc.id] : prev.filter(id=>id!==acc.id));
                      }}
                    />
                    <span className="text-sm">{acc.email} ({acc.reputation}% rep)</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Email Lists</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {emailLists.map(list => (
                  <label key={list.id} className="flex items-center">
                    <input type="checkbox" className="mr-2"
                      checked={selectedLists.includes(list.id)}
                      onChange={(e)=>{
                        setSelectedLists(prev => e.target.checked ? [...prev, list.id] : prev.filter(id=>id!==list.id));
                      }}
                    />
                    <span className="text-sm">{list.name} ({list.verified} verified emails)</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Follow-up Emails</label>
                <button
                  onClick={()=>{
                    const id = followUps.length ? Math.max(...followUps.map(f=>f.id))+1 : 1;
                    setFollowUps(prev => [...prev, { id, subject: 'Re: (follow-up)', content: 'Following up...', delay: 3, delayUnit: 'days' }]);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Follow-up
                </button>
              </div>
              <div className="space-y-2">
                {followUps.map(f => (
                  <div key={f.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <input value={f.subject} onChange={(e)=>setFollowUps(prev=>prev.map(x=>x.id===f.id?{...x,subject:e.target.value}:x))}
                          className="text-sm font-medium text-gray-900 bg-transparent outline-none"/>
                        <p className="text-xs text-gray-600">
                          Send {f.delay} {f.delayUnit} after previous email
                        </p>
                      </div>
                      <button onClick={()=>setFollowUps(prev=>prev.filter(x=>x.id!==f.id))} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea value={f.content} onChange={(e)=>setFollowUps(prev=>prev.map(x=>x.id===f.id?{...x,content:e.target.value}:x))}
                      className="w-full mt-2 text-sm p-2 border rounded"/>
                    <div className="flex gap-2 mt-2">
                      <input type="number" min={1} className="w-20 p-2 border rounded text-sm" value={f.delay} onChange={(e)=>setFollowUps(prev=>prev.map(x=>x.id===f.id?{...x,delay:parseInt(e.target.value)}:x))}/>
                      <select className="p-2 border rounded text-sm" value={f.delayUnit} onChange={(e)=>setFollowUps(prev=>prev.map(x=>x.id===f.id?{...x,delayUnit:e.target.value as any}:x))}>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center mb-4">
                <input type="checkbox" className="mr-2" checked={vpnEnabled} onChange={(e)=>setVpnEnabled(e.target.checked)} />
                <span className="text-sm font-medium text-gray-700">Enable VPN IP Rotation</span>
              </label>
            </div>

            <div className="pt-4">
              <button
                onClick={()=>createCampaign({ name, subject, content, selectedAccounts, selectedLists, selectedTemplate, interval, vpnEnabled, followUps, trackOpens, trackClicks, spintax })}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                disabled={!name || !subject || !content}
              >
                <Send className="h-4 w-4 mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
