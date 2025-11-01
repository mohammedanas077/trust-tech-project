import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

const KPICard = ({ title, value, icon: Icon, trend }: KPICardProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[1.2rem] p-6 shadow-[0_8px_32px_hsl(0_0%_0%_/_0.08)] hover:shadow-[0_8px_48px_hsl(var(--primary)_/_0.15)] transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-primary">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
};

export default KPICard;
