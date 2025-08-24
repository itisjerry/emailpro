'use client';
import { useApp } from '@/context/AppState';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Templates() {
  const { templates, setCurrentPage } = useApp();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <button
          onClick={() => setCurrentPage('addTemplate')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{t.category}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900"><Edit className="h-4 w-4" /></button>
                <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{t.subject}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Content Preview:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded h-20 overflow-hidden">
                {t.content.substring(0, 100)}...
              </p>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
