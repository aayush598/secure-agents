'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Zap, CheckCircle, ArrowRight, Code, Key, BarChart3, Menu, X, Github, Twitter, Linkedin, Sparkles, Globe, Users, TrendingUp, Star, ChevronRight } from 'lucide-react';
import {
  ShieldCheck,
  Building2,
  Baby,
  HeartPulse,
  Landmark,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Profiles', href: '#profiles' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Hub', href: '/hub' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section from landingfolio*/}
      
        <div className="relative bg-gray-50">
            <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
                <img className="w-auto h-full" src="https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png" alt="" />
            </div>
        </div>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">₹0</span>
                  <span className="text-gray-600 ml-2">/ forever</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['10,000 requests/day', '100 requests/minute', 'All built-in profiles', 'Custom profile creation', 'Full API access', 'Usage analytics', 'Community support'].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white" onClick={() => router.push('/sign-up')}>
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 relative overflow-hidden scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-gray-800 to-gray-600 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl shadow-lg">
                Coming Soon
              </div>
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Pro</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">₹999</span>
                  <span className="text-gray-700 ml-2">/ month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['100,000 requests/day', '500 requests/minute', 'Everything in Free', 'Priority support', 'Advanced analytics', 'Custom guardrails', '99.9% uptime SLA'].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-600 text-white opacity-60 cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">Custom</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited requests', 'Dedicated infrastructure', 'Everything in Pro', 'On-premise deployment', 'Custom integrations', '24/7 dedicated support', 'SLA guarantees'].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 text-gray-900 font-semibold opacity-60 cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 mt-12 text-lg">
            No credit card required for free tier • Cancel anytime
          </p>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-gray-800 to-gray-600 p-2 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Guardrailz
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Enterprise-grade security guardrails for your LLM applications. Protect sensitive data, prevent prompt injection, and ensure compliance.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Profiles', 'Pricing', 'Documentation', 'API Reference'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Security', 'Compliance', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">
                &copy; 2025 Guardrailz. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Status
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Changelog
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}