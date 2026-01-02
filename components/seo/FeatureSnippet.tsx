import { Info } from 'lucide-react';

interface FactItem {
  label: string;
  value: string;
}

interface FeatureSnippetProps {
  title: string;
  description?: string;
  facts: FactItem[];
  highlight?: string;
}

export default function FeatureSnippet({ title, description, facts, highlight }: FeatureSnippetProps) {
  // Safety check for facts array
  const factsList = facts || [];
  
  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-primary text-white p-2 rounded-lg">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          {description && <p className="text-gray-700 text-sm">{description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {factsList.map((fact, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-border">
            <dt className="text-sm font-medium text-gray-600 mb-1">{fact.label}</dt>
            <dd className="text-base font-semibold text-foreground">{fact.value}</dd>
          </div>
        ))}
      </div>

      {highlight && (
        <div className="bg-secondary/10 border-l-4 border-secondary rounded-r-lg p-4">
          <p className="text-sm font-medium text-foreground">{highlight}</p>
        </div>
      )}
    </div>
  );
}
