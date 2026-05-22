import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter } from 'recharts';
import Breadcrumb from '../components/UI/Breadcrumb';
import Card from '../components/UI/Card';
import { theme } from '../theme/constants';

const DATA_BASIC = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const DATA_PIE = [
  { name: 'Mobile', value: 400 },
  { name: 'Desktop', value: 300 },
  { name: 'Tablet', value: 300 },
  { name: 'Other', value: 200 },
];

const DATA_RADAR = [
  { subject: 'Math', A: 120, B: 110, fullMark: 150 },
  { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
  { subject: 'English', A: 86, B: 130, fullMark: 150 },
  { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
  { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
  { subject: 'History', A: 65, B: 85, fullMark: 150 },
];

const DATA_SCATTER = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

const COLORS = [theme.primary, '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

const ChartsGallery = () => {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Charts Gallery' }]} />
      
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, marginBottom: 4 }}>Charts Gallery</h1>
        <p style={{ fontSize: 14, color: theme.textMuted }}>Beautiful, interactive charts using Recharts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 20 }}>Gradient Area Chart</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_BASIC} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.cardBorder} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadowLg }} />
                <Area type="monotone" dataKey="uv" stroke={theme.primary} fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="pv" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 20 }}>Stacked Bar Chart</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_BASIC} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.cardBorder} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadowLg }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="pv" stackId="a" fill={theme.primary} radius={[0, 0, 4, 4]} />
                <Bar dataKey="uv" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 20 }}>Dashed Line Chart</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DATA_BASIC} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.cardBorder} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadowLg }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey="pv" stroke={theme.primary} strokeWidth={3} dot={{ r: 4, fill: theme.primary, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="uv" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 20 }}>Donut Chart</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {DATA_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadowLg }} />
                <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Radar Chart */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 20 }}>Radar Chart</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={DATA_RADAR}>
                <PolarGrid stroke={theme.cardBorder} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: theme.textSecondary, fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Student A" dataKey="A" stroke={theme.primary} fill={theme.primary} fillOpacity={0.5} />
                <Radar name="Student B" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadowLg }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Scatter Chart */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, marginBottom: 20 }}>Scatter Chart</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.cardBorder} />
                <XAxis type="number" dataKey="x" name="stature" unit="cm" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dy={10} />
                <YAxis type="number" dataKey="y" name="weight" unit="kg" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.textMuted }} dx={-10} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadowLg }} />
                <Scatter name="A school" data={DATA_SCATTER} fill={theme.primary} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChartsGallery;
