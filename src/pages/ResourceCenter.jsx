import React from 'react';
import { Download, FileText, Video, BookOpen, ExternalLink, HelpCircle, MessageCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Breadcrumb from '../components/UI/Breadcrumb';
import { theme } from '../theme/constants';

const RESOURCES = [
  { title: 'Getting Started Guide', desc: 'Learn how to set up your first app and start monetizing', icon: BookOpen, type: 'Guide', color: '#3b82f6' },
  { title: 'SDK Integration Docs', desc: 'Step-by-step SDK integration for Android & iOS', icon: FileText, type: 'Documentation', color: theme.primary },
  { title: 'Ad Format Best Practices', desc: 'Optimize your ad placements for maximum revenue', icon: Video, type: 'Video', color: '#a855f7' },
  { title: 'Mediation Setup Guide', desc: 'Configure mediation partners and waterfall logic', icon: BookOpen, type: 'Guide', color: '#f97316' },
  { title: 'Revenue Optimization Tips', desc: 'Advanced strategies to increase your eCPM', icon: FileText, type: 'Article', color: '#16a34a' },
  { title: 'API Documentation', desc: 'RESTful API reference for programmatic access', icon: FileText, type: 'Documentation', color: '#3b82f6' },
];

const FAQ_ITEMS = [
  { q: 'How often are payouts processed?', a: 'Payouts are processed on the 15th of each month for balances exceeding your minimum threshold.' },
  { q: 'Which ad formats generate the most revenue?', a: 'Rewarded video ads typically generate the highest eCPM, followed by interstitials and banners.' },
  { q: 'How do I add a new app to my account?', a: 'Go to My Applications > Add New App and enter your app store URL. The system will auto-detect your app.' },
  { q: 'What is the minimum payout threshold?', a: 'The default minimum threshold is $100, but you can adjust this in Payment Settings.' },
];

const ResourceCenter = () => {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Resource Center' }]} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary }}>Resource Center</h1>
        <Button variant="outline" className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle style={{ width: 16, height: 16 }} /> Contact Support
        </Button>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
        {RESOURCES.map((r, i) => (
          <Card key={i} style={{ padding: '20px', cursor: 'pointer', transition: theme.transitionSlow }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: `${r.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <r.icon style={{ width: 20, height: 20, color: r.color }} />
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
                background: '#f5f5f5', color: theme.textMuted,
              }}>
                {r.type}
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: theme.textPrimary, marginBottom: 6 }}>{r.title}</h3>
            <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{r.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 13, fontWeight: 600, color: theme.primary }}>
              Read More <ExternalLink style={{ width: 12, height: 12 }} />
            </div>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <HelpCircle style={{ width: 18, height: 18, color: theme.primary }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>Frequently Asked Questions</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 10,
              border: `1px solid ${theme.cardBorder}`,
              background: '#fafafa',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResourceCenter;
