import React, { useState, useEffect } from 'react';
import turso from '../../../lib/turso';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [visitData, setVisitData] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Visites Totales', value: '0', change: '0%', color: 'text-blue-500' },
    { label: 'Visiteurs Uniques', value: '0', change: '0%', color: 'text-green-500' },
    { label: 'Projets Actifs', value: '0', change: 'Live', color: 'text-primary' },
    { label: 'Uptime', value: '99.9%', change: 'Stable', color: 'text-purple-500' },
  ]);
  const [topCountries, setTopCountries] = useState([]);
  const [healthAudit, setHealthAudit] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Total Visits & Unique Visitors
      const resTotal = await turso.execute('SELECT COUNT(*) as total, COUNT(DISTINCT visitor_id) as unique_v FROM analytics');
      const totalVisits = resTotal.rows[0]?.total || 0;
      const uniqueVisitors = resTotal.rows[0]?.unique_v || 0;

      // 2. Weekly Visits Chart
      const resWeekly = await turso.execute(`
        SELECT 
          strftime('%w', created_at) as day_index,
          COUNT(*) as visits
        FROM analytics 
        WHERE created_at >= date('now', '-7 days')
        GROUP BY day_index
        ORDER BY created_at ASC
      `);
      
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const chartData = resWeekly.rows.map(row => ({
        name: dayNames[parseInt(row.day_index)],
        visits: row.visits
      }));

      // 3. Top Pages & Geolocation
      const resPages = await turso.execute(`
        SELECT page_path as name, COUNT(*) as value 
        FROM analytics 
        GROUP BY page_path 
        ORDER BY value DESC 
        LIMIT 4
      `);

      const resGeo = await turso.execute(`
        SELECT country as name, COUNT(*) as value
        FROM analytics
        WHERE country IS NOT NULL AND country != 'Local'
        GROUP BY country
        ORDER BY value DESC
        LIMIT 5
      `);

      const resProjects = await turso.execute('SELECT COUNT(*) as total FROM projects');

      setStats([
        { label: 'Visites Totales', value: totalVisits.toLocaleString(), change: '+100%', color: 'text-blue-500' },
        { label: 'Visiteurs Uniques', value: uniqueVisitors.toLocaleString(), change: '+100%', color: 'text-green-500' },
        { label: 'Projets Actifs', value: resProjects.rows[0].total.toString(), change: 'Live', color: 'text-primary' },
        { label: 'Uptime', value: '99.9%', change: 'Stable', color: 'text-purple-500' },
      ]);
      
      setVisitData(chartData.length > 0 ? chartData : [
        { name: 'Lun', visits: 0 }, { name: 'Mar', visits: 0 }, { name: 'Mer', visits: 0 }, 
        { name: 'Jeu', visits: 0 }, { name: 'Ven', visits: 0 }, { name: 'Sam', visits: 0 }, { name: 'Dim', visits: 0 }
      ]);
      
      setPageViews(resPages.rows.map(row => ({
        name: row.name === '/' ? 'Accueil' : row.name.replace('/', ''),
        value: row.value
      })));

      setTopCountries(resGeo.rows);

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    setIsAuditing(true);
    const { auditSiteHealth } = await import('../../../utils/health');
    await new Promise(r => setTimeout(r, 1500));
    const results = await auditSiteHealth();
    setHealthAudit(results);
    setIsAuditing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Statistiques</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light mt-1">Vue d'ensemble des performances de votre portfolio</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={runAudit}
            disabled={isAuditing}
            className="px-6 py-2 glass rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/20 text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            {isAuditing ? 'Audit en cours...' : 'Audit Santé Site'}
          </button>
          <button 
            onClick={fetchStats}
            className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Health Audit Results */}
      <AnimatePresence>
        {healthAudit && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="neumorph-card p-10 bg-primary/5 border border-primary/10 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Diagnostic de Santé SEO & Performance</h3>
               <button onClick={() => setHealthAudit(null)} className="text-gray-400 hover:text-primary">&times;</button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(healthAudit).map(([key, data], i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{key}</span>
                    <span className={`text-xl font-black ${data.score > 80 ? 'text-green-500' : data.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{data.score}%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${data.score}%` }} className={`h-full ${data.score > 80 ? 'bg-green-500' : data.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="space-y-2">
                    {data.issues.length > 0 ? data.issues.map((issue, idx) => (
                      <p key={idx} className="text-[10px] text-red-400 bg-red-400/5 px-3 py-1.5 rounded-lg flex items-center">
                        <span className="mr-2">⚠</span> {issue}
                      </p>
                    )) : (
                      <p className="text-[10px] text-green-500 bg-green-500/5 px-3 py-1.5 rounded-lg flex items-center">
                        <span className="mr-2">✔</span> Optimisé
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="neumorph-card p-8 bg-gray-50 dark:bg-[#1a1a1a]"
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</span>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Visit Chart */}
        <div className="neumorph-card p-10 bg-gray-50 dark:bg-[#1a1a1a]">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter">Volume de Visites (Hebdomadaire)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#871A1A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#871A1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#871A1A' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#871A1A" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geolocation Section */}
        <div className="neumorph-card p-10 bg-gray-50 dark:bg-[#1a1a1a]">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter">Provenance des Visiteurs</h3>
          <div className="space-y-6">
            {topCountries.length > 0 ? topCountries.map((c, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-900 dark:text-white">{c.name}</span>
                  <span className="text-primary">{c.value} visites</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (c.value / (parseInt(stats[0].value.replace(/\D/g,'')) || 1)) * 100)}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-12 text-xs uppercase tracking-widest font-bold">En attente de données...</p>
            )}
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="neumorph-card p-10 bg-gray-50 dark:bg-[#1a1a1a] lg:col-span-2">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter">Pages les plus vues</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pageViews.length > 0 ? pageViews : [{name: 'Vide', value: 0}]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {pageViews.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#871A1A' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
