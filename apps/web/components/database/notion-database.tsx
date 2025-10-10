"use client";

import React, { useState } from "react";
import { 
  Table, 
  Grid3X3, 
  Calendar, 
  Gallery, 
  Plus, 
  Filter, 
  Search, 
  SortAsc,
  MoreHorizontal,
  ChevronDown,
  Star,
  Tag,
  User,
  Clock,
  CheckSquare,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = 'table' | 'board' | 'calendar' | 'gallery';

interface Property {
  id: string;
  name: string;
  type: 'title' | 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'person' | 'checkbox' | 'url' | 'email';
  options?: string[];
}

interface DatabaseRow {
  id: string;
  properties: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface NotionDatabaseProps {
  title: string;
  properties: Property[];
  rows: DatabaseRow[];
  viewType?: ViewType;
}

export function NotionDatabase({ 
  title, 
  properties, 
  rows, 
  viewType: initialViewType = 'table' 
}: NotionDatabaseProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialViewType);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const views = [
    { type: 'table' as ViewType, icon: Table, label: 'Table' },
    { type: 'board' as ViewType, icon: Grid3X3, label: 'Board' },
    { type: 'calendar' as ViewType, icon: Calendar, label: 'Calendar' },
    { type: 'gallery' as ViewType, icon: Gallery, label: 'Gallery' }
  ];

  const filteredRows = rows.filter(row => {
    if (!searchQuery) return true;
    return Object.values(row.properties).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortBy) return 0;
    
    const aValue = a.properties[sortBy];
    const bValue = b.properties[sortBy];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderPropertyValue = (value: any, property: Property) => {
    if (!value) return <span className="text-gray-400">Empty</span>;

    switch (property.type) {
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={value} 
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
              readOnly
            />
          </div>
        );
      
      case 'select':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value}
          </span>
        );
      
      case 'multi_select':
        return (
          <div className="flex flex-wrap gap-1">
            {Array.isArray(value) && value.map((item: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {item}
              </span>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString()}
          </span>
        );
      
      case 'person':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-sm">{value}</span>
          </div>
        );
      
      case 'url':
      case 'email':
        return (
          <a 
            href={property.type === 'email' ? `mailto:${value}` : value}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {value}
          </a>
        );
      
      default:
        return <span className="text-sm">{value}</span>;
    }
  };

  const renderTableView = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {properties.map((property) => (
              <th 
                key={property.id}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide min-w-32"
              >
                <div className="flex items-center space-x-2">
                  <span>{property.name}</span>
                  <button 
                    onClick={() => {
                      if (sortBy === property.id) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(property.id);
                        setSortOrder('asc');
                      }
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {properties.map((property) => (
                <td key={property.id} className="px-4 py-3">
                  {renderPropertyValue(row.properties[property.id], property)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBoardView = () => {
    const statusColumn = properties.find(p => p.type === 'select');
    const statuses = statusColumn?.options || ['To Do', 'In Progress', 'Done'];
    
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const statusRows = sortedRows.filter(row => 
            row.properties[statusColumn?.id || ''] === status
          );
          
          return (
            <div key={status} className="flex-shrink-0 w-80">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{status}</h3>
                  <span className="text-sm text-gray-500">{statusRows.length}</span>
                </div>
                
                <div className="space-y-3">
                  {statusRows.map((row) => {
                    const titleProperty = properties.find(p => p.type === 'title');
                    const title = row.properties[titleProperty?.id || ''];
                    
                    return (
                      <div key={row.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                        <div className="space-y-2">
                          {properties.filter(p => p.type !== 'title' && p.id !== statusColumn?.id).slice(0, 3).map((property) => (
                            <div key={property.id} className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 w-16 truncate">{property.name}:</span>
                              {renderPropertyValue(row.properties[property.id], property)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                    <Plus className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-sm">Add a card</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarView = () => {
    const dateProperty = properties.find(p => p.type === 'date');
    const titleProperty = properties.find(p => p.type === 'title');
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date();
            date.setDate(i - 6);
            const dateStr = date.toISOString().split('T')[0];
            const dayRows = sortedRows.filter(row => 
              row.properties[dateProperty?.id || ''] === dateStr
            );
            
            return (
              <div key={i} className="h-24 border border-gray-200 p-1">
                <div className="text-sm text-gray-900 mb-1">{date.getDate()}</div>
                <div className="space-y-1">
                  {dayRows.slice(0, 2).map((row) => (
                    <div 
                      key={row.id}
                      className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate"
                    >
                      {row.properties[titleProperty?.id || '']}
                    </div>
                  ))}
                  {dayRows.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayRows.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGalleryView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedRows.map((row) => {
        const titleProperty = properties.find(p => p.type === 'title');
        const title = row.properties[titleProperty?.id || ''];
        
        return (
          <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
            <div className="space-y-1">
              {properties.filter(p => p.type !== 'title').slice(0, 2).map((property) => (
                <div key={property.id} className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500 w-16 truncate">{property.name}:</span>
                  {renderPropertyValue(row.properties[property.id], property)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'table':
        return renderTableView();
      case 'board':
        return renderBoardView();
      case 'calendar':
        return renderCalendarView();
      case 'gallery':
        return renderGalleryView();
      default:
        return renderTableView();
    }
  };

  return (
    <div className="w-full">
      {/* Database Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              New
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.type}
                  onClick={() => setCurrentView(view.type)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                    currentView === view.type
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                showFilters
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <SortAsc className="w-4 h-4" />
              <span>Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Content */}
      <div className="min-h-96">
        {renderCurrentView()}
      </div>
    </div>
  );
}
