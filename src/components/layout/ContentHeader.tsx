// src/components/layout/ContentHeader.tsx
import React from "react";

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
};

export default ContentHeader;
