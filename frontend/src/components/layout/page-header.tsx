import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  accentColor?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, accentColor = 'border-primary', actions, children }: PageHeaderProps) {
  const rightContent = actions || children;
  return (
    <div className={`mb-6 md:mb-8 pl-4 border-l-4 ${accentColor} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}
