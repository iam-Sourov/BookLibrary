import React from 'react';
import { NavLink } from 'react-router';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Library
} from 'lucide-react';

const XLogo = ({ className }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-card/30 backdrop-blur-xl border-t border-border/85 text-foreground shadow-2xl z-10">
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto p-8 md:px-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Library className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">BookLibrary</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
              Connecting readers with stories. We provide the fastest book delivery service and a curated collection for every genre.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Platform</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/all-books">Browse Collection</FooterLink>
              <FooterLink to="/dashboard">User Dashboard</FooterLink>
              <FooterLink to="/">Pricing & Plans</FooterLink>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Support</h3>
            <nav className="flex flex-col space-y-3">
              <FooterLink to="/login">Login / Register</FooterLink>
              <FooterLink to="/">Help Center</FooterLink>
              <FooterLink to="/">Terms of Service</FooterLink>
              <FooterLink to="/">Privacy Policy</FooterLink>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Contact</h3>
            <div className="flex flex-col space-y-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Library Avenue,<br />Knowledge City, 1200</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+880 1234 567 890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@booklibrary.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} BookLibrary Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
            <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
            <SocialLink href="#" icon={<XLogo className="h-4 w-4" />} label="X (Twitter)" />
            <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <NavLink
    to={to}
    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit font-medium">
    {children}
  </NavLink>
);

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    aria-label={label}
    className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform">
    {icon}
  </a>
);

export default Footer;