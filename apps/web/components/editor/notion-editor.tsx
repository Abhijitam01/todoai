"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Type, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image, 
  Link, 
  Calendar,
  Database,
  FileText,
  CheckSquare,
  ToggleLeft,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Plus,
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
  Link2
} from "lucide-react";

interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulleted_list' | 'numbered_list' | 'quote' | 'code' | 'toggle' | 'divider';
  content: string;
  children?: Block[];
  isExpanded?: boolean;
}

interface NotionEditorProps {
  initialContent?: Block[];
  onContentChange?: (blocks: Block[]) => void;
}

export function NotionEditor({ initialContent = [], onContentChange }: NotionEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialContent);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [slashMenuQuery, setSlashMenuQuery] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const slashCommands = [
    { type: 'paragraph', icon: Type, label: 'Text', description: 'Just start typing with plain text.' },
    { type: 'heading1', icon: Heading1, label: 'Heading 1', description: 'Big section heading.' },
    { type: 'heading2', icon: Heading2, label: 'Heading 2', description: 'Medium section heading.' },
    { type: 'heading3', icon: Heading3, label: 'Heading 3', description: 'Small section heading.' },
    { type: 'bulleted_list', icon: List, label: 'Bulleted list', description: 'Create a simple bulleted list.' },
    { type: 'numbered_list', icon: ListOrdered, label: 'Numbered list', description: 'Create a list with numbering.' },
    { type: 'quote', icon: Quote, label: 'Quote', description: 'Capture a quote.' },
    { type: 'code', icon: Code, label: 'Code', description: 'Capture a code snippet.' },
    { type: 'toggle', icon: ToggleLeft, label: 'Toggle', description: 'Toggleable content.' },
    { type: 'divider', icon: MoreHorizontal, label: 'Divider', description: 'Visually divide blocks.' }
  ];

  const filteredCommands = slashCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(slashMenuQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(slashMenuQuery.toLowerCase())
  );

  useEffect(() => {
    if (blocks.length === 0) {
      addBlock('paragraph');
    }
  }, []);

  const addBlock = (type: Block['type'], afterId?: string) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      children: []
    };

    setBlocks(prev => {
      if (!afterId) {
        return [...prev, newBlock];
      }
      
      const index = prev.findIndex(b => b.id === afterId);
      if (index === -1) return [...prev, newBlock];
      
      return [...prev.slice(0, index + 1), newBlock, ...prev.slice(index + 1)];
    });

    setActiveBlockId(newBlock.id);
    setShowSlashMenu(false);
    
    // Focus the new block after a brief delay
    setTimeout(() => {
      const element = document.getElementById(`block-${newBlock.id}`);
      if (element) {
        element.focus();
      }
    }, 0);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const newBlocks = prev.filter(b => b.id !== id);
      
      // If we deleted the last block, add a new empty paragraph
      if (newBlocks.length === 0) {
        newBlocks.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'paragraph',
          content: '',
          children: []
        });
      }
      
      return newBlocks;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === '/' && e.currentTarget.textContent === '') {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setSlashMenuPosition({ x: rect.left, y: rect.bottom });
      setShowSlashMenu(true);
      setSlashMenuQuery('');
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('paragraph', blockId);
    }
    
    if (e.key === 'Backspace' && e.currentTarget.textContent === '' && blocks.length > 1) {
      e.preventDefault();
      deleteBlock(blockId);
    }
  };

  const handleSlashMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        addBlock(filteredCommands[0].type as Block['type']);
      }
    }
    
    if (e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  const getBlockIcon = (type: Block['type']) => {
    switch (type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return Type;
      case 'bulleted_list':
        return List;
      case 'numbered_list':
        return ListOrdered;
      case 'quote':
        return Quote;
      case 'code':
        return Code;
      case 'toggle':
        return ToggleLeft;
      default:
        return Type;
    }
  };

  const getBlockStyles = (type: Block['type']) => {
    switch (type) {
      case 'heading1':
        return 'text-2xl font-bold text-gray-900';
      case 'heading2':
        return 'text-xl font-semibold text-gray-900';
      case 'heading3':
        return 'text-lg font-medium text-gray-900';
      case 'quote':
        return 'border-l-4 border-gray-300 pl-4 italic text-gray-700';
      case 'code':
        return 'font-mono text-sm bg-gray-100 px-3 py-2 rounded';
      case 'bulleted_list':
        return 'list-disc list-inside';
      case 'numbered_list':
        return 'list-decimal list-inside';
      default:
        return 'text-gray-900';
    }
  };

  const renderBlock = (block: Block) => {
    const Icon = getBlockIcon(block.type);
    
    return (
      <div key={block.id} className="group flex items-start space-x-2 py-1">
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
          <Icon className="w-4 h-4 text-gray-400" />
        </button>
        
        <div className="flex-1 min-w-0">
          {block.type === 'divider' ? (
            <div className="border-t border-gray-200 my-4" />
          ) : (
            <div
              id={`block-${block.id}`}
              contentEditable
              className={`outline-none w-full ${getBlockStyles(block.type)} ${
                block.type === 'paragraph' && !block.content ? 'text-gray-400' : ''
              }`}
              onInput={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onFocus={() => setActiveBlockId(block.id)}
              suppressContentEditableWarning={true}
            >
              {block.content || (block.type === 'paragraph' ? 'Type \'/\' for commands' : '')}
            </div>
          )}
          
          {block.children && block.children.length > 0 && (
            <div className="ml-4 mt-2 space-y-1">
              {block.children.map(child => renderBlock(child))}
            </div>
          )}
        </div>
        
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    );
  };

  return (
    <div className="relative">
      <div ref={editorRef} className="max-w-4xl mx-auto p-8">
        {/* Page Title */}
        <div className="mb-8">
          <div
            contentEditable
            className="text-3xl font-bold text-gray-900 outline-none"
            onInput={(e) => {
              // Handle title change
            }}
            suppressContentEditableWarning={true}
          >
            Untitled
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-1">
          {blocks.map(block => renderBlock(block))}
        </div>

        {/* Add Block Button */}
        <div className="mt-8">
          <button
            onClick={() => addBlock('paragraph')}
            className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add a block</span>
          </button>
        </div>
      </div>

      {/* Slash Menu */}
      {showSlashMenu && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-64"
          style={{
            left: slashMenuPosition.x,
            top: slashMenuPosition.y,
          }}
          onKeyDown={handleSlashMenuKeyDown}
        >
          <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-100">
            Choose a block
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.map((command, index) => {
              const Icon = command.icon;
              return (
                <button
                  key={command.type}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 text-left"
                  onClick={() => addBlock(command.type as Block['type'])}
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {command.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {command.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
