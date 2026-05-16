"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, Lock, Eye, FileText, Globe, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 px-4 animate-fade-in text-slate-200">
        <header className="text-center mb-8">
          <div className="inline-flex p-4 bg-white/10 rounded-2xl border border-white/20 mb-6 shadow-glossy">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last Updated: May 16, 2026</p>
        </header>

        <div className="glass-panel p-8 md:p-12 space-y-10 leading-relaxed text-slate-300">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">1. Introduction</h2>
            </div>
            <p>
              Axom AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">2. Information Collection</h2>
            </div>
            <p>We collect information that you provide directly to us when you create an account, update your profile, or use our AI features:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, profile picture (via Google Auth), class, and district in Assam.</li>
              <li><strong>Academic Data:</strong> Subjects, chapters selected, and quiz scores to provide progress tracking.</li>
              <li><strong>Usage Data:</strong> AI chat interactions and activity logs to improve our learning models.</li>
              <li><strong>Payment Data:</strong> All payments are processed via secure third-party gateways (Razorpay). We do not store your credit card or bank details on our servers.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">3. Data Security</h2>
            </div>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. We utilize Firebase (Google Cloud) for secure data storage and authentication. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">4. Third-Party Services</h2>
            </div>
            <p>
              Our app integrates with Google Gemini AI for educational content generation and Razorpay for payment processing. These services have their own privacy policies. We are not responsible for the privacy practices of these third-party services.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">5. Children&apos;s Privacy</h2>
            </div>
            <p>
              Axom AI is designed for students. We do not knowingly collect information from children under 13 without parental consent. If we become aware that a child under 13 has provided us with personal information, we will delete such information immediately.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8 mt-12">
            <div className="flex items-center gap-3 text-white mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">6. Contact Us</h2>
            </div>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-white font-medium">
              Email: raxgamer84@gmail.com<br />
              Location: Guwahati, Assam, India
            </div>
          </section>
        </div>

        <footer className="text-center py-8 text-slate-500 text-sm">
          &copy; 2026 Axom AI. All rights reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
}
