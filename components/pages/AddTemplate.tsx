'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppState';

export default function AddTemplate() {
  const { addTemplate, setCurrentPage, templateFormDefaults } = useApp();
  const [name, setName] = useState(templateFormDefaults.name);
  const [category, setCategory] = useState<'outreach'|'followup'|'nurture'|'promotional'>('outreach');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
        <button onClick={()=>setCurrentPage('templates')} className="text-gray-600 hover:text-gray-900">← Back to Templates</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={name} onChange={(e)=>setName(e.target.value)} placeholder="Template name"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={category} onChange={(e)=>setCategory(e.target.value as any)}>
                <option value="outreach">Cold Outreach</option>
                <option value="followup">Follow-up</option>
                <option value="nurture">Nurture</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject with {{variables}}"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
            <textarea rows={10} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Email content with {{variables}}"/>
            <p className="text-xs text-gray-500 mt-1">Available variables: firstName, lastName, company, senderName, achievement, topic</p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={()=>setCurrentPage('templates')} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button
              onClick={()=>addTemplate({ name, category, subject, content })}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              disabled={!name || !subject || !content}
            >
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
