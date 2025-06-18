"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Target, 
  BookOpen, 
  Settings, 
  Zap,
  Plus,
  X,
  AlertTriangle,
  Sparkles,
  Calendar,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (revisions: GoalRevisions) => void;
  currentGoal?: {
    id: string;
    name: string;
    description: string;
    timeline: number; // weeks
    timePerDay: number; // hours
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
    currentWeek: number;
    completedTasks: number;
    totalTasks: number;
  };
}

interface GoalRevisions {
  name?: string;
  description?: string;
  timeline?: number;
  timePerDay?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  topics?: string[];
  reason: string;
  adaptationType: 'timeline' | 'content' | 'pace' | 'comprehensive';
}

interface Topic {
  id: string;
  name: string;
  isCore: boolean;
  estimatedWeeks: number;
}

export function GoalRevisionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentGoal 
}: GoalRevisionModalProps) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [revisions, setRevisions] = useState<Partial<GoalRevisions>>({});
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Available topics for the goal
  const availableTopics: Topic[] = [
    { id: '1', name: 'Python Basics', isCore: true, estimatedWeeks: 1 },
    { id: '2', name: 'Control Flow & Loops', isCore: true, estimatedWeeks: 1 },
    { id: '3', name: 'Functions & Modules', isCore: true, estimatedWeeks: 1 },
    { id: '4', name: 'Object-Oriented Programming', isCore: true, estimatedWeeks: 2 },
    { id: '5', name: 'Data Structures & Algorithms', isCore: true, estimatedWeeks: 2 },
    { id: '6', name: 'File Operations & Regex', isCore: false, estimatedWeeks: 1 },
    { id: '7', name: 'Web APIs & Scraping', isCore: false, estimatedWeeks: 1 },
    { id: '8', name: 'Database Operations', isCore: false, estimatedWeeks: 1 },
    { id: '9', name: 'Testing & Debugging', isCore: false, estimatedWeeks: 1 },
    { id: '10', name: 'GUI Development', isCore: false, estimatedWeeks: 1 },
    { id: '11', name: 'Machine Learning Basics', isCore: false, estimatedWeeks: 2 },
    { id: '12', name: 'Web Development (Flask/Django)', isCore: false, estimatedWeeks: 3 }
  ];

  useEffect(() => {
    if (isOpen && currentGoal) {
      setRevisions({});
      setCustomTopics([]);
      setNewTopic('');
    }
  }, [isOpen, currentGoal]);

  const handleSave = async () => {
    if (!revisions.reason?.trim()) {
      return; // Validation
    }

    setIsLoading(true);
    
    try {
      const finalRevisions: GoalRevisions = {
        ...revisions,
        reason: revisions.reason!,
        adaptationType: determineAdaptationType(revisions),
        topics: customTopics.length > 0 ? customTopics : undefined
      };
      
      await onSave(finalRevisions);
      onClose();
    } catch (error) {
      console.error('Failed to save revisions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineAdaptationType = (revisions: Partial<GoalRevisions>): GoalRevisions['adaptationType'] => {
    const hasTimelineChanges = revisions.timeline || revisions.timePerDay;
    const hasContentChanges = revisions.topics || customTopics.length > 0;
    const hasDifficultyChanges = revisions.difficulty;
    
    if (hasTimelineChanges && hasContentChanges) return 'comprehensive';
    if (hasContentChanges) return 'content';
    if (hasTimelineChanges) return 'timeline';
    if (hasDifficultyChanges) return 'pace';
    return 'comprehensive';
  };

  const addCustomTopic = () => {
    if (newTopic.trim() && !customTopics.includes(newTopic.trim())) {
      setCustomTopics([...customTopics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const removeCustomTopic = (topic: string) => {
    setCustomTopics(customTopics.filter(t => t !== topic));
  };

  const toggleTopic = (topicName: string) => {
    const currentTopics = revisions.topics || currentGoal?.topics || [];
    const updatedTopics = currentTopics.includes(topicName)
      ? currentTopics.filter(t => t !== topicName)
      : [...currentTopics, topicName];
    
    setRevisions({ ...revisions, topics: updatedTopics });
  };

  const getTimelineEstimate = () => {
    const selectedTopics = revisions.topics || currentGoal?.topics || [];
    const totalTopics = [...selectedTopics, ...customTopics];
    const coreTopics = availableTopics.filter(t => t.isCore && totalTopics.includes(t.name));
    const optionalTopics = availableTopics.filter(t => !t.isCore && totalTopics.includes(t.name));
    
    const estimatedWeeks = coreTopics.reduce((sum, t) => sum + t.estimatedWeeks, 0) +
                          optionalTopics.reduce((sum, t) => sum + t.estimatedWeeks, 0) +
                          customTopics.length; // 1 week per custom topic
    
    return estimatedWeeks;
  };

  if (!currentGoal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Settings className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Revise Your Goal
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-1">
                Modify your learning plan to better fit your needs
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-600">
                <Clock className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">
                <BookOpen className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="pace" className="data-[state=active]:bg-purple-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Pace
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-purple-600">
                <Target className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="timeline" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Current Progress */}
                  <Card className="bg-gray-800/30 border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-white mb-3">Current Progress</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Week</p>
                          <p className="text-white font-medium">{currentGoal.currentWeek}/{currentGoal.timeline}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Tasks</p>
                          <p className="text-white font-medium">{currentGoal.completedTasks}/{currentGoal.totalTasks}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Time/Day</p>
                          <p className="text-white font-medium">{currentGoal.timePerDay}h</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline Adjustments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-white">Total Timeline (weeks)</Label>
                      <Select
                        value={revisions.timeline?.toString() || currentGoal.timeline.toString()}
                        onValueChange={(value) => setRevisions({ ...revisions, timeline: parseInt(value) })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {[8, 10, 12, 16, 20, 24].map(weeks => (
                            <SelectItem key={weeks} value={weeks.toString()}>
                              {weeks} weeks
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-white">Daily Time Commitment (hours)</Label>
                      <Select
                        value={revisions.timePerDay?.toString() || currentGoal.timePerDay.toString()}
                        onValueChange={(value) => setRevisions({ ...revisions, timePerDay: parseFloat(value) })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {[0.5, 1, 1.5, 2, 2.5, 3, 4].map(hours => (
                            <SelectItem key={hours} value={hours.toString()}>
                              {hours} {hours === 1 ? 'hour' : 'hours'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Impact Warning */}
                  {(revisions.timeline || revisions.timePerDay) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="text-yellow-400 font-medium">Timeline Changes</h4>
                          <p className="text-yellow-300/80 text-sm mt-1">
                            Modifying your timeline will trigger a complete plan regeneration. 
                            Your progress will be preserved, but tasks may be restructured.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-medium text-white mb-3">Learning Topics</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Select topics you want to include or exclude from your learning plan.
                    </p>
                  </div>

                  {/* Core Topics */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      Core Topics (Required)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableTopics.filter(t => t.isCore).map(topic => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{topic.name}</p>
                            <p className="text-gray-400 text-xs">{topic.estimatedWeeks} week{topic.estimatedWeeks > 1 ? 's' : ''}</p>
                          </div>
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
                            Core
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional Topics */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-green-400" />
                      Optional Topics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableTopics.filter(t => !t.isCore).map(topic => {
                        const isSelected = (revisions.topics || currentGoal.topics || []).includes(topic.name);
                        return (
                          <div
                            key={topic.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                              isSelected
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-gray-800/30 border-gray-700 hover:border-gray-600"
                            )}
                            onClick={() => toggleTopic(topic.name)}
                          >
                            <div className="flex-1">
                              <p className="text-white font-medium">{topic.name}</p>
                              <p className="text-gray-400 text-xs">{topic.estimatedWeeks} week{topic.estimatedWeeks > 1 ? 's' : ''}</p>
                            </div>
                            <div className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center",
                              isSelected ? "bg-green-500 border-green-500" : "border-gray-600"
                            )}>
                              {isSelected && <X className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Topics */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Custom Topics
                    </h4>
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Add a custom topic..."
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomTopic()}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button onClick={addCustomTopic} size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {customTopics.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {customTopics.map(topic => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="bg-purple-500/10 text-purple-400 border-purple-500/20 pr-1"
                          >
                            {topic}
                            <button
                              onClick={() => removeCustomTopic(topic)}
                              className="ml-2 hover:bg-purple-500/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Estimated Timeline */}
                  <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Estimated Timeline</p>
                          <p className="text-blue-400 text-sm">
                            ~{getTimelineEstimate()} weeks based on selected topics
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="pace" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <Label className="text-white text-lg">Learning Difficulty</Label>
                    <p className="text-gray-400 text-sm mt-1">
                      Adjust the pace and depth of your learning experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(level => {
                      const isSelected = (revisions.difficulty || currentGoal.difficulty) === level;
                      return (
                        <div
                          key={level}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            isSelected
                              ? "bg-purple-500/10 border-purple-500/30"
                              : "bg-gray-800/30 border-gray-700 hover:border-gray-600"
                          )}
                          onClick={() => setRevisions({ ...revisions, difficulty: level })}
                        >
                          <div className="text-center">
                            <h3 className={cn(
                              "font-medium capitalize mb-2",
                              isSelected ? "text-purple-400" : "text-white"
                            )}>
                              {level}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {level === 'beginner' && 'Step-by-step guidance with lots of practice'}
                              {level === 'intermediate' && 'Balanced approach with real-world projects'}
                              {level === 'advanced' && 'Fast-paced with complex challenges'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-white">Goal Name</Label>
                    <Input
                      value={revisions.name || currentGoal.name}
                      onChange={(e) => setRevisions({ ...revisions, name: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={revisions.description || currentGoal.description}
                      onChange={(e) => setRevisions({ ...revisions, description: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                      placeholder="Describe what you want to achieve..."
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white">Reason for Changes *</Label>
                    <Textarea
                      value={revisions.reason || ''}
                      onChange={(e) => setRevisions({ ...revisions, reason: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                      placeholder="Tell us why you want to make these changes. This helps AI create a better adapted plan..."
                      required
                    />
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-gray-400">
              Changes will trigger AI plan regeneration
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 hover:border-gray-500"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!revisions.reason?.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Apply Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 