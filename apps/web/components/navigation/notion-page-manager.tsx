"use client";

import React, { useState, useCallback } from "react";
import { 
  Plus, 
  FileText, 
  Database, 
  Star, 
  StarOff, 
  MoreHorizontal, 
  Edit3, 
  Copy, 
  Trash2, 
  Share2, 
  Lock, 
  Unlock,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Calendar,
  Clock
} from "lucide-react";
import { NotionDropdown, NotionDropdownItem, NotionModal, NotionButton, NotionInput } from "../ui/notion-components";
import { cn } from "@/lib/utils";

interface Page {
  id: string;
  title: string;
  icon?: string;
  type: 'page' | 'database';
  parentId?: string;
  isFavorited: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Page[];
  isExpanded?: boolean;
  level?: number;
}

interface NotionPageManagerProps {
  pages: Page[];
  onCreatePage: (parentId?: string) => void;
  onCreateDatabase: (parentId?: string) => void;
  onRenamePage: (pageId: string, newTitle: string) => void;
  onDeletePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  onTogglePublic: (pageId: string) => void;
  onMovePage: (pageId: string, newParentId?: string) => void;
  onSelectPage: (pageId: string) => void;
  selectedPageId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  sortBy: 'title' | 'updated' | 'created';
  onSortChange: (sort: 'title' | 'updated' | 'created') => void;
}

export function NotionPageManager({
  pages,
  onCreatePage,
  onCreateDatabase,
  onRenamePage,
  onDeletePage,
  onToggleFavorite,
  onTogglePublic,
  onMovePage,
  onSelectPage,
  selectedPageId,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange
}: NotionPageManagerProps) {
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'page' | 'database'>('page');
  const [createParentId, setCreateParentId] = useState<string | undefined>();

  const handleRename = (page: Page) => {
    setRenamingPageId(page.id);
    setRenameValue(page.title);
  };

  const confirmRename = () => {
    if (renamingPageId && renameValue.trim()) {
      onRenamePage(renamingPageId, renameValue.trim());
      setRenamingPageId(null);
      setRenameValue("");
    }
  };

  const cancelRename = () => {
    setRenamingPageId(null);
    setRenameValue("");
  };

  const handleCreatePage = (type: 'page' | 'database', parentId?: string) => {
    setCreateType(type);
    setCreateParentId(parentId);
    setShowCreateModal(true);
  };

  const confirmCreate = () => {
    if (createType === 'page') {
      onCreatePage(createParentId);
    } else {
      onCreateDatabase(createParentId);
    }
    setShowCreateModal(false);
    setCreateParentId(undefined);
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPages = [...filteredPages].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const renderPageItem = (page: Page, level = 0) => {
    const isSelected = selectedPageId === page.id;
    const isRenaming = renamingPageId === page.id;

    return (
      <div key={page.id} className="group">
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors",
            isSelected ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => !isRenaming && onSelectPage(page.id)}
        >
          {/* Expand/Collapse Button */}
          {page.children && page.children.length > 0 && (
            <button className="mr-1 p-0.5 hover:bg-gray-200 rounded">
              {page.isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}

          {/* Page Icon */}
          <div className="mr-2 flex-shrink-0">
            {page.icon ? (
              <span className="text-sm">{page.icon}</span>
            ) : page.type === 'database' ? (
              <Database className="w-3 h-3 text-gray-500" />
            ) : (
              <FileText className="w-3 h-3 text-gray-500" />
            )}
          </div>

          {/* Page Title */}
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onBlur={confirmRename}
                className="w-full bg-transparent border-none outline-none text-sm"
                autoFocus
              />
            ) : (
              <span className="text-sm truncate">{page.title}</span>
            )}
          </div>

          {/* Page Actions */}
          {!isRenaming && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(page.id);
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {page.isFavorited ? (
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-3 h-3 text-gray-400" />
                )}
              </button>

              <NotionDropdown
                trigger={
                  <button className="p-0.5 hover:bg-gray-200 rounded">
                    <MoreHorizontal className="w-3 h-3 text-gray-400" />
                  </button>
                }
              >
                <NotionDropdownItem
                  icon={<Edit3 className="w-4 h-4" />}
                  onClick={() => handleRename(page)}
                >
                  Rename
                </NotionDropdownItem>
                <NotionDropdownItem
                  icon={<Copy className="w-4 h-4" />}
                  onClick={() => {
                    // Handle duplicate page
                  }}
                >
                  Duplicate
                </NotionDropdownItem>
                <NotionDropdownItem
                  icon={page.isPublic ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  onClick={() => onTogglePublic(page.id)}
                >
                  {page.isPublic ? 'Make Private' : 'Make Public'}
                </NotionDropdownItem>
                <NotionDropdownItem
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={() => {
                    // Handle share page
                  }}
                >
                  Share
                </NotionDropdownItem>
                <NotionDropdownItem
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => onDeletePage(page.id)}
                  danger
                >
                  Delete
                </NotionDropdownItem>
              </NotionDropdown>
            </div>
          )}
        </div>

        {/* Children */}
        {page.children && page.isExpanded && (
          <div>
            {page.children.map(child => renderPageItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
          <div className="flex items-center space-x-2">
            <NotionDropdown
              trigger={
                <NotionButton
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  New
                </NotionButton>
              }
            >
              <NotionDropdownItem
                icon={<FileText className="w-4 h-4" />}
                onClick={() => handleCreatePage('page')}
              >
                New page
              </NotionDropdownItem>
              <NotionDropdownItem
                icon={<Database className="w-4 h-4" />}
                onClick={() => handleCreatePage('database')}
              >
                New database
              </NotionDropdownItem>
            </NotionDropdown>

            <NotionDropdown
              trigger={
                <NotionButton variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </NotionButton>
              }
            >
              <NotionDropdownItem
                icon={<SortAsc className="w-4 h-4" />}
                onClick={() => onSortChange('title')}
              >
                Sort by title
              </NotionDropdownItem>
              <NotionDropdownItem
                icon={<Clock className="w-4 h-4" />}
                onClick={() => onSortChange('updated')}
              >
                Sort by updated
              </NotionDropdownItem>
              <NotionDropdownItem
                icon={<Calendar className="w-4 h-4" />}
                onClick={() => onSortChange('created')}
              >
                Sort by created
              </NotionDropdownItem>
            </NotionDropdown>

            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                onClick={() => onViewModeChange('list')}
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === 'list' ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={cn(
                  "p-1.5 transition-colors border-l border-gray-200",
                  viewMode === 'grid' ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <div className="p-2">
            {sortedPages.map(page => renderPageItem(page))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPages.map(page => (
              <div
                key={page.id}
                className={cn(
                  "p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md",
                  selectedPageId === page.id && "border-blue-500 bg-blue-50"
                )}
                onClick={() => onSelectPage(page.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {page.icon ? (
                      <span className="text-lg">{page.icon}</span>
                    ) : page.type === 'database' ? (
                      <Database className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-900 truncate">
                      {page.title}
                    </span>
                  </div>
                  {page.isFavorited && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {page.type === 'database' ? 'Database' : 'Page'} • 
                  Updated {new Date(page.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <NotionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={`Create new ${createType}`}
        size="sm"
      >
        <div className="space-y-4">
          <NotionInput
            label="Name"
            placeholder={`Enter ${createType} name...`}
          />
          <div className="flex justify-end space-x-3">
            <NotionButton
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </NotionButton>
            <NotionButton onClick={confirmCreate}>
              Create {createType}
            </NotionButton>
          </div>
        </div>
      </NotionModal>
    </div>
  );
}
