import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[1.2rem] p-6 shadow-[0_8px_32px_hsl(0_0%_0%_/_0.08)] animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        {title}
      </h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
