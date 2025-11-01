import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Shield, ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: "Real-Time Google Sheet Sync",
      description: "Automatically sync your analytics data from Google Sheets with instant updates",
    },
    {
      icon: TrendingUp,
      title: "Multi-Platform Growth Tracking",
      description: "Track Instagram, LinkedIn, YouTube, and X all in one unified dashboard",
    },
    {
      icon: Shield,
      title: "Secure Data Visualization",
      description: "Enterprise-grade security with beautiful, interactive charts and insights",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Trust-Tech Innovation
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-semibold">
            Empowering Digital Growth through Data & Insights
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Track your social media growth, engagement, and reach in real time with our unified analytics dashboard.
          </p>
          
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)_/_0.3)] hover:scale-105 group"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-xl border border-border rounded-[1.2rem] p-8 shadow-[0_8px_32px_hsl(0_0%_0%_/_0.08)] hover:shadow-[0_8px_48px_hsl(var(--primary)_/_0.15)] transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 animate-glow-pulse">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-muted-foreground text-sm">
        © 2025 Trust-Tech Innovation | All Rights Reserved
      </footer>
    </div>
  );
};

export default Hero;
