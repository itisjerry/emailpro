'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { useApp } from '@/context/AppState';

export default function EmailAccounts() {
  const { emailAccounts, setEmailAccounts } = useApp();

  const [form, setForm] = useState<any>({
    email: '', displayName: '',
    username: '', password: '',
    incoming_protocol: 'imap',
    incoming_host: '', incoming_port: 993, incoming_secure: true,
    smtp_host: '', smtp_port: 587, smtp_secure: false,
    dailyLimit: 100
  });
  const [msg, setMsg] = useState('');

  const verify = async () => {
    setMsg('Verifying...');
    const res = await fetch('/api/accounts/verify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const d = await res.json();
    setMsg(res.ok ? 'Verified OK ✅' : `Failed: ${d.error || 'Unknown error'}`);
  };

  const save = async () => {
    setMsg('Saving...');
    const res = await fetch('/api/accounts/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const d = await res.json();
    if (!res.ok) { setMsg(`Failed: ${d.error || 'Unknown error'}`); return; }
    setMsg('Saved ✅');
    setEmailAccounts(prev => [...prev, {
      id: d.id, email: form.email, provider: 'smtp', status: 'Connected',
      reputation: 90, dailyLimit: form.dailyLimit, sentToday: 0, warmupPhase: 'Active',
      lastActivity: 'Just now', domain: (form.email.split('@')[1] || '')
    } as any]);
  };

  const onCsv = async (file: File) => {
    setMsg('Uploading CSV...');
    const text = await file.text();
    const parsed = Papa.parse(text, { header: true });
    const res = await fetch('/api/accounts/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accounts: parsed.data })
    });
    const d = await res.json();
    setMsg(`Imported: ${d.ok} ok, ${d.fail} failed`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">SMTP / IMAP / POP3 Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-3">Add account</h2>
          <div className="space-y-2">
            <input className="w-full p-2 border rounded" placeholder="Email (From)" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
            <input className="w-full p-2 border rounded" placeholder="Display name (optional)" value={form.displayName} onChange={e=>setForm({...form, displayName:e.target.value})}/>
            <input className="w-full p-2 border rounded" placeholder="Mailbox username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
            <input className="w-full p-2 border rounded" placeholder="Mailbox password / app password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>

            <div className="grid grid-cols-3 gap-2">
              <select className="p-2 border rounded col-span-3" value={form.incoming_protocol} onChange={e=>setForm({...form, incoming_protocol:e.target.value})}>
                <option value="imap">IMAP (recommended)</option>
                <option value="pop3">POP3</option>
              </select>
              <input className="p-2 border rounded" placeholder="Incoming host" value={form.incoming_host} onChange={e=>setForm({...form, incoming_host:e.target.value})}/>
              <input className="p-2 border rounded" placeholder="Port" type="number" value={form.incoming_port} onChange={e=>setForm({...form, incoming_port:Number(e.target.value)})}/>
              <label className="inline-flex items-center gap-2 p-2 border rounded">
                <input type="checkbox" checked={form.incoming_secure} onChange={e=>setForm({...form, incoming_secure:e.target.checked})}/>
                SSL/TLS
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input className="p-2 border rounded col-span-3" placeholder="SMTP host" value={form.smtp_host} onChange={e=>setForm({...form, smtp_host:e.target.value})}/>
              <input className="p-2 border rounded" placeholder="SMTP port" type="number" value={form.smtp_port} onChange={e=>setForm({...form, smtp_port:Number(e.target.value)})}/>
              <label className="inline-flex items-center gap-2 p-2 border rounded">
                <input type="checkbox" checked={form.smtp_secure} onChange={e=>setForm({...form, smtp_secure:e.target.checked})}/>
                SSL/TLS (465). Uncheck for STARTTLS (587).
              </label>
              <input className="p-2 border rounded col-span-3" placeholder="Daily send limit" type="number" value={form.dailyLimit} onChange={e=>setForm({...form, dailyLimit:Number(e.target.value)})}/>
            </div>

            <div className="flex gap-2">
              <button onClick={verify} className="px-4 py-2 bg-gray-200 rounded">Verify</button>
              <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
            </div>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-3">Bulk import from CSV</h2>
          <p className="text-sm mb-2">
            Columns: email, displayName, username, password, incoming_protocol, incoming_host, incoming_port, incoming_secure, smtp_host, smtp_port, smtp_secure, dailyLimit
          </p>
          <input type="file" accept=".csv" onChange={e=>e.target.files && onCsv(e.target.files[0])}/>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-semibold mb-3">Connected Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {emailAccounts.map((a:any)=>(
            <div key={a.id} className="border rounded p-3">
              <div className="font-medium">{a.email}</div>
              <div className="text-sm text-gray-600">SMTP / {(a.email||'').split('@')[1]}</div>
              <div className="text-sm">Limit: {a.dailyLimit} / day</div>
              <div className="text-sm">Sent today: {a.sentToday}</div>
              <div className="text-sm">{a.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
