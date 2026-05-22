import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/UI/Button';
import { theme } from '../theme/constants';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.pageBg,
      padding: 24,
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: 480 }}>
        <h1
      
         style={{ 
          fontSize: 120, 
          fontWeight: 900, 
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: theme.textPrimary,
          lineHeight: 1,
          margin: 0,
          letterSpacing: '-4px'
        }}>
          404
        </h1>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: theme.textPrimary, marginTop: 24, marginBottom: 12 }}>
          Page not found
        </h2>
        
        <p style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.6, marginBottom: 32 }}>
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Go Back
          </Button>
          <Button variant="primary" onClick={() => navigate('/')} className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Home style={{ width: 16, height: 16 }} /> Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
