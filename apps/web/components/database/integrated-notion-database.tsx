"use client";

import React, { useState, useCallback } from "react";
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
  ArrowUpDown,
  Edit3,
  Trash2,
  Copy,
  Share2
} from "lucide-react";
import { NotionButton, NotionDropdown, NotionDropdownItem, NotionCard } from "../ui/notion-components";
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

interface IntegratedNotionDatabaseProps {
  title: string;
  properties: Property[];
  rows: DatabaseRow[];
  viewType?: ViewType;
  onRowClick?: (row: DatabaseRow) => void;
  onRowUpdate?: (rowId: string, updates: Partial<DatabaseRow>) => void;
  onRowDelete?: (rowId: string) => void;
  onCreateNew?: () => void;
  loading?: boolean;
}

export function IntegratedNotionDatabase({ 
  title, 
  properties, 
  rows, 
  viewType: initialViewType = 'table',
  onRowClick,
  onRowUpdate,
  onRowDelete,
  onCreateNew,
  loading = false
}: IntegratedNotionDatabaseProps) {
  const [currentView, setCurrentView] = useState<ViewType>(initialViewType);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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

  const handleSort = (propertyId: string) => {
    if (sortBy === propertyId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(propertyId);
      setSortOrder('asc');
    }
  };

  const handleRowSelect = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === sortedRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedRows.map(row => row.id)));
    }
  };

  const renderPropertyValue = (value: any, property: Property) => {
    if (!value && value !== 0) return <span className="text-gray-400">Empty</span>;

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
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            value === 'completed' ? 'bg-green-100 text-green-800' :
            value === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            value === 'high' ? 'bg-red-100 text-red-800' :
            value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            value === 'low' ? 'bg-gray-100 text-gray-800' :
            'bg-gray-100 text-gray-800'
          )}>
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
      
      case 'number':
        return <span className="text-sm">{value}</span>;
      
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
    <NotionCard border={false} className="overflow-hidden">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === sortedRows.length && sortedRows.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
              </th>
              {properties.map((property) => (
                <th 
                  key={property.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide min-w-32"
                >
                  <button 
                    onClick={() => handleSort(property.id)}
                    className="flex items-center space-x-2 hover:text-gray-700"
                  >
                    <span>{property.name}</span>
                    {sortBy === property.id && (
                      <ArrowUpDown className={cn(
                        "w-3 h-3",
                        sortOrder === 'desc' && "transform rotate-180"
                      )} />
                    )}
                  </button>
                </th>
              ))}
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRows.map((row) => (
              <tr 
                key={row.id} 
                className={cn(
                  "hover:bg-gray-50 transition-colors cursor-pointer",
                  selectedRows.has(row.id) && "bg-blue-50"
                )}
                onClick={() => onRowClick?.(row)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRowSelect(row.id);
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="px-4 py-3">
                    {renderPropertyValue(row.properties[property.id], property)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <NotionDropdown
                    trigger={
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    }
                  >
                    <NotionDropdownItem icon={<Edit3 className="w-4 h-4" />}>
                      Edit
                    </NotionDropdownItem>
                    <NotionDropdownItem icon={<Copy className="w-4 h-4" />}>
                      Duplicate
                    </NotionDropdownItem>
                    <NotionDropdownItem icon={<Share2 className="w-4 h-4" />}>
                      Share
                    </NotionDropdownItem>
                    <NotionDropdownItem 
                      icon={<Trash2 className="w-4 h-4" />}
                      danger
                      onClick={() => onRowDelete?.(row.id)}
                    >
                      Delete
                    </NotionDropdownItem>
                  </NotionDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NotionCard>
  );

  const renderBoardView = () => {
    const statusColumn = properties.find(p => p.type === 'select');
    const statuses = statusColumn?.options || ['pending', 'in_progress', 'completed'];
    
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const statusRows = sortedRows.filter(row => 
            row.properties[statusColumn?.id || ''] === status
          );
          
          return (
            <div key={status} className="flex-shrink-0 w-80">
              <NotionCard className="bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 capitalize">{status.replace('_', ' ')}</h3>
                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                    {statusRows.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {statusRows.map((row) => {
                    const titleProperty = properties.find(p => p.type === 'title');
                    const title = row.properties[titleProperty?.id || ''];
                    
                    return (
                      <NotionCard 
                        key={row.id} 
                        hover
                        className="cursor-pointer"
                        onClick={() => onRowClick?.(row)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                        <div className="space-y-2">
                          {properties.filter(p => p.type !== 'title' && p.id !== statusColumn?.id).slice(0, 3).map((property) => (
                            <div key={property.id} className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 w-16 truncate">{property.name}:</span>
                              {renderPropertyValue(row.properties[property.id], property)}
                            </div>
                          ))}
                        </div>
                      </NotionCard>
                    );
                  })}
                  
                  <button 
                    onClick={onCreateNew}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-sm">Add a card</span>
                  </button>
                </div>
              </NotionCard>
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
      <NotionCard>
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
                      className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate cursor-pointer hover:bg-blue-200"
                      onClick={() => onRowClick?.(row)}
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
      </NotionCard>
    );
  };

  const renderGalleryView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedRows.map((row) => {
        const titleProperty = properties.find(p => p.type === 'title');
        const title = row.properties[titleProperty?.id || ''];
        
        return (
          <NotionCard 
            key={row.id} 
            hover
            className="cursor-pointer"
            onClick={() => onRowClick?.(row)}
          >
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
          </NotionCard>
        );
      })}
    </div>
  );

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      );
    }

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
          <h1 className="notion-page-title">{title}</h1>
          <div className="flex items-center space-x-2">
            <NotionButton onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-1" />
              New
            </NotionButton>
            <NotionButton variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </NotionButton>
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
