import { FileText, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    {
      name: 'Totaal Artikelen',
      value: '24',
      change: '+4 deze maand',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Paginaweergaves',
      value: '12.5K',
      change: '+18% vs vorige maand',
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      name: 'SEO Score',
      value: '94/100',
      change: 'Uitstekend',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentArticles = [
    {
      id: 1,
      title: 'Beste Hotels in Maspalomas 2026',
      island: 'Gran Canaria',
      status: 'Gepubliceerd',
      date: '2026-01-15',
    },
    {
      id: 2,
      title: 'Top 10 Stranden op Tenerife',
      island: 'Tenerife',
      status: 'Concept',
      date: '2026-01-14',
    },
    {
      id: 3,
      title: 'Culinaire Hotspots in Las Palmas',
      island: 'Gran Canaria',
      status: 'Gepubliceerd',
      date: '2026-01-12',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welkom terug! Hier is een overzicht van uw content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/content/new"
          className="bg-primary text-white rounded-xl p-6 hover:bg-primary-dark transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">+ Nieuwe Content</h3>
          <p className="text-primary-100">Maak content aan voor menu items, artikelen, of pagina's</p>
        </Link>
        <Link
          href="/admin/accommodaties/new"
          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-colors"
        >
          <h3 className="text-xl font-bold mb-2 text-gray-900">Nieuwe Accommodatie</h3>
          <p className="text-gray-600">Voeg een hotel, resort of appartement toe</p>
        </Link>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recente Artikelen</h2>
          <Link
            href="/admin/content"
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Bekijk alles →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eiland
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{article.island}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'Gepubliceerd'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(article.date).toLocaleDateString('nl-NL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
