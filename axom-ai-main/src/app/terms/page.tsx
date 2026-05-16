"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText, Shield, AlertCircle, Scale, Globe, Mail } from "lucide-react";

export default function TermsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 px-4 animate-fade-in text-slate-200">
        <header className="text-center mb-8">
          <div className="inline-flex p-4 bg-white/10 rounded-2xl border border-white/20 mb-6 shadow-glossy">
            <Scale className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last Updated: May 16, 2026</p>
        </header>

        <div className="glass-panel p-8 md:p-12 space-y-10 leading-relaxed text-slate-300">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
            </div>
            <p>
              By accessing or using Axom AI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, students, and others who access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">2. Use of Service</h2>
            </div>
            <p>
              Axom AI provides AI-powered educational tools. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the service.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate account information.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You agree not to use the AI to generate harmful, illegal, or inappropriate content.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">3. Subscriptions and Payments</h2>
            </div>
            <p>
              Axom AI offers Premium subscriptions for enhanced features.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments are processed securely via third-party gateways.</li>
              <li>Subscription fees are non-refundable unless required by law.</li>
              <li>We reserve the right to change subscription pricing with prior notice.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">4. Intellectual Property</h2>
            </div>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Axom AI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Axom AI.
            </p>
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8 mt-12">
            <div className="flex items-center gap-3 text-white mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">5. Contact Information</h2>
            </div>
            <p>
              If you have any questions about these Terms, please contact us:
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
