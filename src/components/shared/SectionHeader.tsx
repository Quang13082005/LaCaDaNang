import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actionButton?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  actionButton,
}) => {
  return (
    <div className="flex items-start justify-between gap-2 mb-4">
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 mb-1.5">
            {badge}
          </span>
        )}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actionButton && <div className="shrink-0">{actionButton}</div>}
    </div>
  );
};
