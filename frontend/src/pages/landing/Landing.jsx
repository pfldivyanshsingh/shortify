import { Link } from 'react-router-dom';
import { Zap, Link2, BarChart3, Shield, Globe, Smartphone, ArrowRight } from 'lucide-react';
import './Landing.css';

const features = [
  { icon: Link2, title: 'Smart URL Shortening', desc: 'Generate short, memorable links with custom aliases and auto-generated codes.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track clicks, locations, browsers, devices, and referrers in real-time.' },
  { icon: Shield, title: 'Password Protection', desc: 'Secure your links with password protection for private sharing.' },
  { icon: Globe, title: 'Geo Tracking', desc: 'Know exactly where your visitors come from with built-in geo analytics.' },
  { icon: Smartphone, title: 'QR Code Generation', desc: 'Auto-generated QR codes for every link, downloadable as PNG.' },
  { icon: Zap, title: 'Blazing Fast', desc: 'Redis-cached redirects for sub-millisecond response times.' },
];

const Landing = () => {
  return (
    <div className="landing">
      {/* Background Effects */}
      <div className="landing-bg">
        <div className="landing-bg-orb landing-bg-orb-1" />
        <div className="landing-bg-orb landing-bg-orb-2" />
        <div className="landing-bg-grid" />
      </div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-logo">
            <Zap size={22} />
            <span>Shortify</span>
          </div>
          <div className="landing-nav-links">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Zap size={14} />
          Premium URL Shortener
        </div>
        <h1 className="landing-hero-title">
          Shorten. Track.<br />
          <span className="gradient-text">Optimize.</span>
        </h1>
        <p className="landing-hero-desc">
          The enterprise-grade URL shortener that gives you full control over your links.
          Advanced analytics, password protection, custom aliases, and QR codes — all in one platform.
        </p>
        <div className="landing-hero-actions">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Try It Free — No Sign Up <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need</h2>
        <p className="landing-section-desc">Powerful features to manage, track, and optimize your links.</p>
        <div className="landing-features-grid">
          {features.map((f, i) => (
            <div key={i} className="landing-feature-card glass-card">
              <div className="landing-feature-icon">
                <f.icon size={22} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-inner glass-card">
          <h2>Ready to shorten your first link?</h2>
          <p>No account required. Start shortening links instantly — upgrade anytime for permanent storage.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Start Now — No Sign Up <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-logo">
            <Zap size={18} />
            <span>Shortify</span>
          </div>
          <p>© {new Date().getFullYear()} Shortify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
