import { useState, useEffect } from "react";
import { Users, TrendingUp, Target, Eye, Sparkles } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#0078d4", "#00b294", "#f3a536", "#d83b01"];

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('fetch-analytics');
      
      if (error) throw error;
      
      if (responseData?.data) {
        setData(responseData.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Retrying...",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate KPIs
  const totalFollowers = data.length > 0 ? data.reduce((sum, item) => sum + (parseInt(item.followers) || 0), 0) : 0;
  const avgGrowth = data.length > 0 ? (data.reduce((sum, item) => sum + (parseFloat(item.growth) || 0), 0) / data.length).toFixed(1) : "0";
  const avgEngagement = data.length > 0 ? (data.reduce((sum, item) => sum + (parseFloat(item.engagement) || 0), 0) / data.length).toFixed(1) : "0";
  const totalImpressions = data.length > 0 ? data.reduce((sum, item) => sum + (parseInt(item.impressions) || 0), 0) : 0;

  // Filter data
  const filteredData = data.filter(item => {
    const platformMatch = selectedPlatform === "all" || item.platform === selectedPlatform;
    const searchMatch = item.platform.toLowerCase().includes(searchTerm.toLowerCase());
    return platformMatch && searchMatch;
  });

  // Prepare chart data
  const growthData = filteredData.map(item => ({
    date: item.date,
    followers: item.followers,
    platform: item.platform,
  }));

  const engagementData = Array.from(new Set(filteredData.map(d => d.platform))).map(platform => ({
    platform,
    engagement: filteredData.filter(d => d.platform === platform)
      .reduce((sum, d) => sum + (parseFloat(d.engagement) || 0), 0) / 
      filteredData.filter(d => d.platform === platform).length,
  }));

  const reachData = Array.from(new Set(filteredData.map(d => d.platform))).map((platform, index) => ({
    platform,
    reach: filteredData.filter(d => d.platform === platform)
      .reduce((sum, d) => sum + (parseInt(d.reach) || 0), 0),
    fill: COLORS[index],
  }));

  const postsData = Array.from(new Set(filteredData.map(d => d.platform))).map(platform => ({
    platform,
    posts: filteredData.filter(d => d.platform === platform)
      .reduce((sum, d) => sum + (parseInt(String(d.posts)) || 0), 0),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Trust-Tech Innovation</h1>
                <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="X">X</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-48 bg-secondary/50 border-border"
              />
              
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Followers"
            value={totalFollowers.toLocaleString()}
            icon={Users}
            trend="+12.5%"
          />
          <KPICard
            title="Average Growth"
            value={`${avgGrowth}%`}
            icon={TrendingUp}
            trend="+2.3%"
          />
          <KPICard
            title="Engagement Rate"
            value={`${avgEngagement}%`}
            icon={Target}
            trend="+4.1%"
          />
          <KPICard
            title="Total Impressions"
            value={totalImpressions.toLocaleString()}
            icon={Eye}
            trend="+8.7%"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Follower Growth Over Time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Engagement Rate by Platform">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Reach Distribution by Platform">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reachData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="reach"
                >
                  {reachData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Posts Count per Platform">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="platform" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="posts" fill="#00b294" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Data Table */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[1.2rem] p-6 shadow-[0_8px_32px_hsl(0_0%_0%_/_0.08)] animate-fade-in overflow-x-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Analytics</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Platform</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Followers</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Impressions</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Reach</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Posts</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Engagement %</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{item.date}</td>
                  <td className="py-3 px-4 text-sm text-foreground font-medium">{item.platform}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right">{item.followers.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right">{item.impressions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right">{item.reach.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right">{item.posts}</td>
                  <td className="py-3 px-4 text-sm text-primary text-right font-medium">{item.engagement}%</td>
                  <td className="py-3 px-4 text-sm text-primary text-right font-medium">+{item.growth}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-muted-foreground text-sm border-t border-border mt-12">
        © 2025 Trust-Tech Innovation | All Rights Reserved
      </footer>
    </div>
  );
};

export default Dashboard;
