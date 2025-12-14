'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Zap, CheckCircle, ArrowRight, Code, Key, BarChart3, Menu, X, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Profiles', href: '#profiles' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="relative">
                <Shield className="h-8 w-8 text-indigo-400" />
                <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-30"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Secure Agents
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/sign-in')}
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push('/sign-up')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                  >
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
            <UserButton />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-slate-300 hover:text-white py-2 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                {isSignedIn ? (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/sign-in')}
                      className="w-full text-slate-300 hover:bg-slate-800"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => router.push('/sign-up')}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                      Get Started Free
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-5 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="h-4 w-4" />
            <span>Secure Your LLM Applications with Intelligent Guardrails</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Enterprise-Grade
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LLM Security Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Protect your AI applications with intelligent guardrails that detect PII, prevent prompt injection, 
            and ensure compliance — all processed in parallel for maximum speed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => router.push('/sign-up')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-10 py-6 shadow-2xl shadow-indigo-500/30 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#how-it-works')}
              className="text-lg px-10 py-6 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white"
            >
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Guardrails', value: '50+' },
              { label: 'Processing Time', value: '<100ms' },
              { label: 'Uptime SLA', value: '99.9%' },
              { label: 'Active Users', value: '10K+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Comprehensive Protection
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Multi-layered security that adapts to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Input Validation',
                desc: 'Detect secrets, PII, PHI, and malicious patterns before they reach your LLM. Real-time scanning with configurable sensitivity levels.',
                gradient: 'from-indigo-500 to-indigo-600',
                features: ['PII Detection', 'Secret Scanning', 'Prompt Injection Defense'],
              },
              {
                icon: Lock,
                title: 'Output Sanitization',
                desc: 'Automatically redact sensitive information from LLM responses. Prevent data leaks and maintain confidentiality at scale.',
                gradient: 'from-purple-500 to-purple-600',
                features: ['PII Redaction', 'Leak Prevention', 'Schema Validation'],
              },
              {
                icon: Zap,
                title: 'Parallel Processing',
                desc: 'Execute multiple guardrails simultaneously with sub-100ms latency. Built for production workloads and high throughput.',
                gradient: 'from-pink-500 to-pink-600',
                features: ['Concurrent Execution', 'Load Balancing', 'Auto-scaling'],
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <CardContent className="pt-6">
                  <div className={`bg-gradient-to-br ${feature.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-400 mb-4 leading-relaxed">{feature.desc}</p>
                  <div className="space-y-2">
                    {feature.features.map((item) => (
                      <div key={item} className="flex items-center text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profiles" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Pre-Built Security Profiles
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Industry-specific configurations ready to deploy in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Default',
                desc: 'Balanced security and performance for general-purpose applications',
                icon: '🛡️',
                guardrails: 7,
                color: 'indigo',
              },
              {
                name: 'Enterprise Security',
                desc: 'Maximum protection with strict controls for business-critical systems',
                icon: '🏢',
                guardrails: 15,
                color: 'purple',
              },
              {
                name: 'Child Safety',
                desc: 'Content filtering and safety measures for educational platforms',
                icon: '👶',
                guardrails: 10,
                color: 'pink',
              },
              {
                name: 'Healthcare',
                desc: 'HIPAA-compliant guardrails for protected health information',
                icon: '🏥',
                guardrails: 8,
                color: 'green',
              },
              {
                name: 'Financial',
                desc: 'Regulatory compliance for banking and financial services',
                icon: '💰',
                guardrails: 9,
                color: 'yellow',
              },
              {
                name: 'Minimal',
                desc: 'Lightweight validation for development and testing environments',
                icon: '🔧',
                guardrails: 1,
                color: 'slate',
              },
            ].map((profile) => (
              <Card
                key={profile.name}
                className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group hover:shadow-xl"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl group-hover:scale-110 transition-transform">{profile.icon}</span>
                    <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-slate-300">
                      {profile.guardrails} guardrails
                    </div>
                  </div>
                  <h4 className="font-semibold text-xl mb-2 text-white">{profile.name}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{profile.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/sign-up')}
              variant="outline"
              className="border-slate-700 hover:bg-slate-800 text-white px-8"
            >
              Create Custom Profile
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Simple integration process with powerful results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: Key,
                title: 'Generate API Key',
                desc: 'Sign up and create your API key instantly from the dashboard. No credit card required for free tier.',
              },
              {
                step: '2',
                icon: Code,
                title: 'Integrate API',
                desc: 'Add our REST API or SDK to your application with just a few lines of code. Full documentation included.',
              },
              {
                step: '3',
                icon: BarChart3,
                title: 'Monitor & Scale',
                desc: 'Track usage, view analytics, and scale your guardrails as your application grows.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 inline-block mb-4">
                  <item.icon className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <Code className="h-6 w-6 text-indigo-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-3 text-white">Quick Integration Example</h4>
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                  <code className="text-sm text-slate-300 font-mono">
                    <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-green-400">'https://api.guardrails.ai/validate'</span>, {'{'}
                    <br />
                    &nbsp;&nbsp;method: <span className="text-green-400">'POST'</span>,
                    <br />
                    &nbsp;&nbsp;headers: {'{'} <span className="text-orange-400">'X-API-Key'</span>: <span className="text-green-400">'your_api_key'</span> {'}'},
                    <br />
                    &nbsp;&nbsp;body: <span className="text-blue-400">JSON</span>.<span className="text-yellow-400">stringify</span>({'{'} input, profile: <span className="text-green-400">'default'</span> {'}'})
                    <br />
                    {'}'});
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start free and scale as you grow
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold mb-2 text-white">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">₹0</span>
                  <span className="text-slate-400 ml-2">/ forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    '10,000 requests/day',
                    '100 requests/minute',
                    'All built-in profiles',
                    'Custom profile creation',
                    'Full API access',
                    'Usage analytics',
                    'Community support',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                  onClick={() => router.push('/sign-up')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white px-4 py-1 text-xs font-semibold">
                Coming Soon
              </div>
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold mb-2 text-white">Pro</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">₹999</span>
                  <span className="text-slate-300 ml-2">/ month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    '100,000 requests/day',
                    '500 requests/minute',
                    'Everything in Free',
                    'Priority support',
                    'Advanced analytics',
                    'Custom guardrails',
                    '99.9% uptime SLA',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start space-x-2 text-slate-200">
                      <CheckCircle className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white opacity-50 cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold mb-2 text-white">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited requests',
                    'Dedicated infrastructure',
                    'Everything in Pro',
                    'On-premise deployment',
                    'Custom integrations',
                    '24/7 dedicated support',
                    'SLA guarantees',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 hover:bg-slate-700 text-white opacity-50 cursor-not-allowed"
                  onClick={() => window.location.href = 'mailto:enterprise@guardrails.ai'}
                >
                  Coming soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-slate-400 mt-8">
            No credit card required for free tier • Cancel anytime
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Ready to Secure Your AI?
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers protecting their LLM applications with intelligent guardrails
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push('/sign-up')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-12 py-6 shadow-2xl shadow-indigo-500/30"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#pricing')}
                className="text-lg px-12 py-6 border-slate-600 hover:bg-slate-800 text-white"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-indigo-400" />
                <span className="text-lg font-bold text-white">Secure Agents</span>
              </div>
              <p className="text-sm text-slate-400">
                Enterprise-grade security for your LLM applications
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Profiles', 'Pricing', 'Documentation'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
                  <li key={item}>
                    <button className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              &copy; 2025 Secure Agents. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}