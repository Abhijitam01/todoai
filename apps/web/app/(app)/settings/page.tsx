"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Monitor,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Calendar,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Passionate learner focused on personal growth and skill development.",
    timezone: "America/New_York",
    language: "en",
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    goalReminders: true,
    weeklyProgress: true,
    achievements: true,
    
    // Privacy settings
    profileVisibility: "private",
    dataSharing: false,
    analytics: true,
    
    // Appearance settings
    theme: "dark",
    compactMode: false,
    animations: true,
    
    // Goal settings
    defaultGoalDuration: "30",
    defaultTimePerDay: 1,
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    reminderTime: "09:00"
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1500);
  };

  const handleLogout = () => {
    // Handle logout logic
    router.push("/");
  };

  const stats = [
    { label: "Goals Created", value: "12", icon: Target, color: "text-purple-400" },
    { label: "Goals Completed", value: "8", icon: CheckCircle, color: "text-green-400" },
    { label: "Total Hours", value: "245", icon: Clock, color: "text-blue-400" },
    { label: "Current Streak", value: "15 days", icon: Zap, color: "text-yellow-400" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your account preferences and goal settings
          </p>
        </div>
      </motion.div>

      {/* User Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-purple-400" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/avatars/user.png" />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xl">
                      {settings.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Goal Reminders</Label>
                    <p className="text-sm text-gray-400">Daily reminders to work on your goals</p>
                  </div>
                  <Switch
                    checked={settings.goalReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, goalReminders: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Weekly Progress</Label>
                    <p className="text-sm text-gray-400">Weekly summary of your progress</p>
                  </div>
                  <Switch
                    checked={settings.weeklyProgress}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyProgress: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Achievement Notifications</Label>
                    <p className="text-sm text-gray-400">Celebrate when you complete milestones</p>
                  </div>
                  <Switch
                    checked={settings.achievements}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, achievements: checked }))}
                  />
                </div>

                {settings.goalReminders && (
                  <>
                    <Separator className="bg-gray-700" />
                    <div className="space-y-2">
                      <Label className="text-gray-300">Reminder Time</Label>
                      <Input
                        type="time"
                        value={settings.reminderTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Monitor className="w-5 h-5 text-green-400" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Compact Mode</Label>
                    <p className="text-sm text-gray-400">Use less spacing in the interface</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 font-medium">Animations</Label>
                    <p className="text-sm text-gray-400">Enable smooth animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animations: checked }))}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <h3 className="text-lg font-semibold text-white">Goal Defaults</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Default Goal Duration</Label>
                    <Select value={settings.defaultGoalDuration} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultGoalDuration: value }))}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="14">2 Weeks</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                        <SelectItem value="60">2 Months</SelectItem>
                        <SelectItem value="90">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Default Time Per Day (hours)</Label>
                    <Input
                      type="number"
                      min="0.5"
                      max="16"
                      step="0.5"
                      value={settings.defaultTimePerDay}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultTimePerDay: parseFloat(e.target.value) }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-red-400" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="bg-gray-800/50 border-gray-600 text-white pr-10"
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">New Password</Label>
                      <Input
                        type="password"
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Confirm New Password</Label>
                      <Input
                        type="password"
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      Update Password
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Profile Visibility</Label>
                      <p className="text-sm text-gray-400">Control who can see your profile</p>
                    </div>
                    <Select value={settings.profileVisibility} onValueChange={(value) => setSettings(prev => ({ ...prev, profileVisibility: value }))}>
                      <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Data Sharing</Label>
                      <p className="text-sm text-gray-400">Share anonymized data to improve the app</p>
                    </div>
                    <Switch
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataSharing: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 font-medium">Analytics</Label>
                      <p className="text-sm text-gray-400">Allow us to collect usage analytics</p>
                    </div>
                    <Switch
                      checked={settings.analytics}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analytics: checked }))}
                    />
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white text-red-400">Danger Zone</h3>
                  
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-400">Delete Account</h4>
                        <p className="text-sm text-red-300/70 mt-1">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive" className="mt-3" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex gap-4 justify-between"
      >
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-red-600 text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          {isSaving ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
} 