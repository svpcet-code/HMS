"use client";

interface LegendItem {
  label: string;
  value: number | string;
  color: string;
}

interface ChartLegendProps {
  items: LegendItem[];
  title: string;
}

export function ChartLegend({ items, title }: ChartLegendProps) {
  return (
    <div className="absolute top-20 right-6 z-10 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl transition-all hover:bg-white/20 dark:hover:bg-slate-800/60 group">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 border-b border-white/10 pb-2">{title}</h4>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 group/item">
            <div className="flex items-center gap-2">
              <div 
                className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform group-hover/item:scale-125" 
                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44` }} 
              />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 group-hover/item:text-blue-500 transition-colors">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
