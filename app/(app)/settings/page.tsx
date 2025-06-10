"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download, 
  Trash2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Smartphone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Save,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Passionate about personal growth and productivity. Always learning, always building.",
    location: "San Francisco, CA",
    timezone: "Pacific/Los_Angeles",
    website: "https://johndoe.dev"
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email: {
      daily_digest: true,
      goal_reminders: true,
      achievement_alerts: true,
      weekly_reports: false
    },
    push: {
      task_reminders: true,
      goal_deadlines: true,
      motivational_quotes: false,
      social_updates: false
    },
    sound: {
      enabled: true,
      volume: 80
    }
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: "dark",
    accent_color: "red",
    compact_mode: false,
    animations: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profile_visibility: "private",
    goal_sharing: false,
    analytics_tracking: true,
    data_export_enabled: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsDirty(false);
      console.log("Settings saved!");
    }, 1500);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const timezones = [
    "Pacific/Los_Angeles",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  const accentColors = [
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" }
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
            <SettingsIcon className="w-8 h-8 text-purple-400" />
            Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Customize your TodoAI experience and manage your preferences
          </p>
        </div>
        
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-gray-700">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-gray-700">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-2 border-gray-600">
                      <AvatarFallback className="bg-gray-800 text-gray-300 text-2xl">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                    <p className="text-gray-400">{profile.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      Premium Member
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleProfileChange("location", e.target.value)}
                      placeholder="City, Country"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                    <Select value={profile.timezone} onValueChange={(value) => handleProfileChange("timezone", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {timezones.map(tz => (
                          <SelectItem key={tz} value={tz} className="text-white hover:bg-gray-700">
                            {tz.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-gray-800 border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => handleProfileChange("website", e.target.value)}
                    placeholder="https://your-website.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Notifications */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-green-400" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300 capitalize">
                          {key.replace(/_/g, " ")}
                        </Label>
                        <p className="text-sm text-gray-400">
                          {key === "daily_digest" && "Daily summary of your progress"}
                          {key === "goal_reminders" && "Reminders about your goals"}
                          {key === "achievement_alerts" && "Notifications when you achieve milestones"}
                          {key === "weekly_reports" && "Weekly progress reports"}
                        </p>
                      </div>
                      <Switch 
                        checked={value} 
                        onCheckedChange={(checked) => {
                          setNotifications(prev => ({
                            ...prev,
                            email: { ...prev.email, [key]: checked }
                          }));
                          setIsDirty(true);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    Push Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300 capitalize">
                          {key.replace(/_/g, " ")}
                        </Label>
                        <p className="text-sm text-gray-400">
                          {key === "task_reminders" && "Reminders for upcoming tasks"}
                          {key === "goal_deadlines" && "Alerts for goal deadlines"}
                          {key === "motivational_quotes" && "Daily inspirational messages"}
                          {key === "social_updates" && "Updates from friends and team"}
                        </p>
                      </div>
                      <Switch 
                        checked={value} 
                        onCheckedChange={(checked) => {
                          setNotifications(prev => ({
                            ...prev,
                            push: { ...prev.push, [key]: checked }
                          }));
                          setIsDirty(true);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sound Settings */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-orange-400" />
                  Sound Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Enable Sounds</Label>
                    <p className="text-sm text-gray-400">Play notification sounds</p>
                  </div>
                  <Switch 
                    checked={notifications.sound.enabled} 
                    onCheckedChange={(checked) => {
                      setNotifications(prev => ({
                        ...prev,
                        sound: { ...prev.sound, enabled: checked }
                      }));
                      setIsDirty(true);
                    }}
                  />
                </div>
                
                {notifications.sound.enabled && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Volume: {notifications.sound.volume}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={notifications.sound.volume}
                      onChange={(e) => {
                        setNotifications(prev => ({
                          ...prev,
                          sound: { ...prev.sound, volume: parseInt(e.target.value) }
                        }));
                        setIsDirty(true);
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-400" />
                    Theme Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-3 block">Color Theme</Label>
                    <div className="space-y-2">
                      {["dark", "light", "auto"].map(theme => (
                        <div key={theme} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={theme}
                            name="theme"
                            value={theme}
                            checked={appearance.theme === theme}
                            onChange={(e) => {
                              setAppearance(prev => ({ ...prev, theme: e.target.value }));
                              setIsDirty(true);
                            }}
                            className="w-4 h-4 text-purple-600"
                          />
                          <Label htmlFor={theme} className="text-gray-300 capitalize flex items-center gap-2">
                            {theme === "dark" && <Moon className="w-4 h-4" />}
                            {theme === "light" && <Sun className="w-4 h-4" />}
                            {theme === "auto" && <Globe className="w-4 h-4" />}
                            {theme}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <Label className="text-gray-300 mb-3 block">Accent Color</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {accentColors.map(color => (
                        <button
                          key={color.value}
                          onClick={() => {
                            setAppearance(prev => ({ ...prev, accent_color: color.value }));
                            setIsDirty(true);
                          }}
                          className={`
                            flex items-center gap-2 p-3 rounded-lg border transition-all
                            ${appearance.accent_color === color.value 
                              ? 'border-white bg-gray-700' 
                              : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                            }
                          `}
                        >
                          <div className={`w-4 h-4 rounded-full ${color.class}`} />
                          <span className="text-sm text-gray-300">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UI Preferences */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    UI Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Compact Mode</Label>
                      <p className="text-sm text-gray-400">Reduce spacing and padding</p>
                    </div>
                    <Switch 
                      checked={appearance.compact_mode} 
                      onCheckedChange={(checked) => {
                        setAppearance(prev => ({ ...prev, compact_mode: checked }));
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Animations</Label>
                      <p className="text-sm text-gray-400">Enable smooth transitions and effects</p>
                    </div>
                    <Switch 
                      checked={appearance.animations} 
                      onCheckedChange={(checked) => {
                        setAppearance(prev => ({ ...prev, animations: checked }));
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Profile Visibility</Label>
                    <p className="text-sm text-gray-400">Control who can see your profile</p>
                  </div>
                  <Select 
                    value={privacy.profile_visibility} 
                    onValueChange={(value) => {
                      setPrivacy(prev => ({ ...prev, profile_visibility: value }));
                      setIsDirty(true);
                    }}
                  >
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="private" className="text-white hover:bg-gray-700">Private</SelectItem>
                      <SelectItem value="friends" className="text-white hover:bg-gray-700">Friends</SelectItem>
                      <SelectItem value="public" className="text-white hover:bg-gray-700">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Goal Sharing</Label>
                      <p className="text-sm text-gray-400">Allow others to see your goals</p>
                    </div>
                    <Switch 
                      checked={privacy.goal_sharing} 
                      onCheckedChange={(checked) => {
                        setPrivacy(prev => ({ ...prev, goal_sharing: checked }));
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Analytics Tracking</Label>
                      <p className="text-sm text-gray-400">Help improve TodoAI with usage data</p>
                    </div>
                    <Switch 
                      checked={privacy.analytics_tracking} 
                      onCheckedChange={(checked) => {
                        setPrivacy(prev => ({ ...prev, analytics_tracking: checked }));
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Data Management</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Data Export</Label>
                      <p className="text-sm text-gray-400">Download your data anytime</p>
                    </div>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300 text-red-400">Delete Account</Label>
                      <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 