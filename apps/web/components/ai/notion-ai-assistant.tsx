"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Lightbulb, 
  Target, 
  Calendar, 
  CheckSquare, 
  Brain,
  Zap,
  MessageSquare,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Wand2
} from "lucide-react";
import { NotionButton, NotionModal, NotionDropdown, NotionDropdownItem } from "../ui/notion-components";
import { cn } from "@/lib/utils";

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: AIAction[];
}

interface AIAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface NotionAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  onAction?: (action: string, data: any) => void;
}

export function NotionAIAssistant({ isOpen, onClose, context, onAction }: NotionAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && context) {
      // Auto-suggest based on context
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `I can help you with "${context}". What would you like me to do?`,
        timestamp: new Date(),
        suggestions: [
          `Create a plan for ${context}`,
          `Break down ${context} into tasks`,
          `Set goals for ${context}`,
          `Generate ideas for ${context}`
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, context]);

  const quickActions = [
    {
      id: 'breakdown',
      label: 'Break down into tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      prompt: 'Break this down into actionable tasks with deadlines'
    },
    {
      id: 'plan',
      label: 'Create a plan',
      icon: <Target className="w-4 h-4" />,
      prompt: 'Create a detailed plan with milestones'
    },
    {
      id: 'schedule',
      label: 'Schedule timeline',
      icon: <Calendar className="w-4 h-4" />,
      prompt: 'Create a realistic timeline and schedule'
    },
    {
      id: 'ideas',
      label: 'Generate ideas',
      icon: <Lightbulb className="w-4 h-4" />,
      prompt: 'Generate creative ideas and suggestions'
    }
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(message),
        timestamp: new Date(),
        suggestions: generateSuggestions(message),
        actions: generateActions(message)
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('break down') || lowerMessage.includes('tasks')) {
      return `I'll help you break this down into actionable tasks. Here's a structured approach:\n\n1. **Research Phase** (Week 1)\n   - Gather requirements\n   - Analyze current state\n   - Define success metrics\n\n2. **Planning Phase** (Week 2)\n   - Create detailed roadmap\n   - Allocate resources\n   - Set milestones\n\n3. **Implementation Phase** (Weeks 3-8)\n   - Execute core features\n   - Regular progress reviews\n   - Adjust timeline as needed\n\n4. **Testing & Launch** (Week 9-10)\n   - Quality assurance\n   - User testing\n   - Launch preparation\n\nWould you like me to create specific tasks for any of these phases?`;
    }
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('strategy')) {
      return `Here's a comprehensive plan for your project:\n\n**Phase 1: Foundation (Days 1-7)**\n- Set up development environment\n- Create project structure\n- Define core requirements\n\n**Phase 2: Core Development (Days 8-21)**\n- Implement main features\n- Set up database\n- Create API endpoints\n\n**Phase 3: Enhancement (Days 22-28)**\n- Add advanced features\n- Optimize performance\n- Implement security measures\n\n**Phase 4: Launch (Days 29-35)**\n- Final testing\n- Documentation\n- Deployment\n\nThis plan includes buffer time for unexpected challenges. Would you like me to adjust the timeline or add more detail to any phase?`;
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('timeline')) {
      return `I've created a realistic timeline for your project:\n\n**Week 1-2: Planning & Setup**\n- Project kickoff and requirements gathering\n- Team setup and tool configuration\n- Initial research and analysis\n\n**Week 3-6: Development**\n- Core feature development\n- Regular check-ins and progress reviews\n- Quality assurance integration\n\n**Week 7-8: Testing & Refinement**\n- Comprehensive testing\n- Bug fixes and improvements\n- User feedback integration\n\n**Week 9-10: Launch Preparation**\n- Final testing and optimization\n- Documentation and training\n- Launch strategy execution\n\nThis schedule accounts for potential delays and includes regular milestone reviews. Would you like me to create a detailed daily schedule for any of these phases?`;
    }
    
    return `I understand you're working on "${userMessage}". Here are some ways I can help:\n\n🎯 **Goal Setting**: I can help you define clear, measurable goals with specific timelines.\n\n📋 **Task Breakdown**: I can break down complex projects into manageable, actionable tasks.\n\n📅 **Schedule Planning**: I can create realistic timelines and help you prioritize tasks.\n\n💡 **Idea Generation**: I can brainstorm creative solutions and alternative approaches.\n\n🔍 **Problem Solving**: I can help you analyze challenges and find effective solutions.\n\nWhat specific aspect would you like to focus on first?`;
  };

  const generateSuggestions = (userMessage: string): string[] => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('break down')) {
      return [
        'Create subtasks for each phase',
        'Add deadlines to each task',
        'Assign priorities to tasks',
        'Set up progress tracking'
      ];
    }
    
    if (lowerMessage.includes('plan')) {
      return [
        'Add risk assessment',
        'Include resource allocation',
        'Create contingency plans',
        'Set up milestone tracking'
      ];
    }
    
    return [
      'Create a follow-up plan',
      'Generate related ideas',
      'Set up progress reminders',
      'Create a checklist'
    ];
  };

  const generateActions = (userMessage: string): AIAction[] => {
    return [
      {
        id: 'create-tasks',
        label: 'Create Tasks',
        icon: <CheckSquare className="w-4 h-4" />,
        onClick: () => {
          onAction?.('create-tasks', { message: userMessage });
        }
      },
      {
        id: 'create-goals',
        label: 'Create Goals',
        icon: <Target className="w-4 h-4" />,
        onClick: () => {
          onAction?.('create-goals', { message: userMessage });
        }
      },
      {
        id: 'schedule',
        label: 'Add to Calendar',
        icon: <Calendar className="w-4 h-4" />,
        onClick: () => {
          onAction?.('schedule', { message: userMessage });
        }
      }
    ];
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputValue(action.prompt);
    setSelectedSuggestion(action.id);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) return null;

  return (
    <NotionModal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Assistant"
      size="lg"
      className="max-w-4xl"
    >
      <div className="flex h-[600px]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.type === 'user'
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestion(suggestion)}
                            className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {message.actions.map((action) => (
                        <NotionButton
                          key={action.id}
                          size="sm"
                          variant="ghost"
                          icon={action.icon}
                          onClick={action.onClick}
                        >
                          {action.label}
                        </NotionButton>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    "flex items-center space-x-2 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                    selectedSuggestion === action.id && "border-blue-500 bg-blue-50"
                  )}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask me anything about your project..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <NotionButton
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              >
                Send
              </NotionButton>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 border-l border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">AI Features</h3>
            </div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Smart Suggestions</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Quick Actions</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm">Context Help</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <Wand2 className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Auto-Complete</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Conversations</h4>
              <div className="space-y-1">
                <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                  Project Planning
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                  Task Breakdown
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                  Goal Setting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NotionModal>
  );
}
