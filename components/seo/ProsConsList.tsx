import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

export default function ProsConsList({ pros, cons }: ProsConsListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      {/* Pros */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-green-900">Voordelen</h3>
        </div>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-0.5">+</span>
              <span className="text-gray-800 flex-1">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <ThumbsDown className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-red-900">Nadelen</h3>
        </div>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-0.5">−</span>
              <span className="text-gray-800 flex-1">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
