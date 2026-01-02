import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface Topic {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  articleCount?: number;
}

interface TopicClusterProps {
  title: string;
  subtitle?: string;
  topics: Topic[];
}

export default function TopicCluster({ title, subtitle, topics }: TopicClusterProps) {
  return (
    <section className="my-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
        {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <Link
              key={index}
              href={topic.href}
              className="group bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {topic.title}
                  </h3>
                  {topic.articleCount && (
                    <span className="text-xs font-medium text-gray-500">
                      {topic.articleCount} artikel{topic.articleCount !== 1 ? 'en' : ''}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{topic.description}</p>
              <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                <span>Lees meer</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
