import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Input, FormGroup } from '../components/UI/FormElements';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 }
    },
    async (formData) => {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Welcome Back!', 'Redirecting to dashboard...');
        navigate('/');
      } else {
        toast.error('Login Failed', result.message || 'Invalid email or password');
      }
    }
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `#fff`,
      position: 'relative',
      padding: 24,
      overflow: 'hidden'
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40vh',
        background: `linear-gradient(180deg, ${theme.primaryLight} 0%, transparent 100%)`,
        zIndex: 0
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              width: 52, height: 52, borderRadius: 14, 
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 10px 25px -5px rgba(3,217,133,0.3)`
            }}
          >
            <ShieldCheck style={{ color: '#fff', width: 26, height: 26 }} />
          </motion.div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.textPrimary, margin: 0, letterSpacing: '-0.8px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 16, color: theme.textMuted, marginTop: 10 }}>
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <Card style={{ 
          padding: '40px 36px', 
          borderRadius: 20,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
          background: '#fff'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <FormGroup label="Email Address" error={errors.email}>
              <Mail style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: theme.textMuted, zIndex: 1 }} />
              <Input
                name="email"
                type="email"
                placeholder="name@company.com"
                value={values.email}
                onChange={handleChange}
                style={{ 
                  paddingLeft: 48, height: 50,
                  background: '#fafafa', border: errors.email ? `1px solid ${theme.error}` : `1px solid ${theme.inputBorder}`,
                }}
              />
            </FormGroup>

            <FormGroup label="Password" error={errors.password}>
              <div style={{ position: 'absolute', right: 0, top: -30 }}>
                <a href="#" style={{ fontSize: 13, fontWeight: 600, color: theme.primary, textDecoration: 'none' }}>Forgot?</a>
              </div>
              <Lock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: theme.textMuted, zIndex: 1 }} />
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                style={{ 
                  paddingLeft: 48, height: 50, 
                  background: '#fafafa', border: errors.password ? `1px solid ${theme.error}` : `1px solid ${theme.inputBorder}`,
                }}
              />
            </FormGroup>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{ 
                width: '100%', height: 52, fontSize: 16, fontWeight: 700, 
                marginTop: 8, borderRadius: 5, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', gap: 10, boxShadow: `0 8px 20px -6px rgba(3,217,133,0.4)`
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in to Account'}
              {!isSubmitting && <ArrowRight style={{ width: 18, height: 18 }} />}
            </Button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', gap: 16 }}>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }}></div>
            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Social Login</span>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" style={{ height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', fontSize: 14 }}>
              <FcGoogle style={{ width: 20, height: 20 }} />
              Google
            </Button>
            <Button variant="outline" style={{ height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', fontSize: 14 }}>
              <FaGithub style={{ width: 20, height: 20 }} />
              GitHub
            </Button>
          </div>
        </Card>

        {/* <p style={{ textAlign: 'center', fontSize: 15, color: theme.textSecondary, marginTop: 32 }}>
          Don't have an account? <a href="#" style={{ color: theme.primary, fontWeight: 700, textDecoration: 'none' }}>Create Account</a>
        </p> */}

      </motion.div>
    </div>
  );
};

export default Login;
