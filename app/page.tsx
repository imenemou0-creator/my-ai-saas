'use client';

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Loader2,
  AlertTriangle,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  const [projectUrl, setProjectUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  // 1️⃣ الخطوة الأولى: تشغيل محاكاة الفحص دون حفظ أي شيء في قاعدة البيانات حتى الآن
  const handleStartAudit = (e) => {
    e.preventDefault();
    if (!projectUrl) return;

    setIsAnalyzing(true);
    setShowResult(false);
    setProgress(0);
    
    const steps = [
      { threshold: 0, message: "Analyse des clauses de données..." },
      { threshold: 40, message: "Vérification de la conformité AI Act..." },
      { threshold: 80, message: "Finalisation du rapport de transparence..." }
    ];

    const duration = 3000;
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        
        const currentStep = [...steps].reverse().find(s => next >= s.threshold);
        if (currentStep) setAnalysisStep(currentStep.message);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowResult(true);
          }, 500);
          return 100;
        }
        return next;
      });
    }, intervalTime);
  };

  // 2️⃣ الخطوة الثانية: حفظ الإيميل والـ URL معاً في خاناتهم المخصصة داخل Supabase عند الضغط على الزر
  const handleSaveLead = async (e) => {
    e.preventDefault();
    if (!email || !projectUrl) return;

    setIsSubmittingEmail(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ 
          email: email, 
          url: projectUrl 
        }]);

      if (error) throw error;
      
      alert("Rapport envoyé avec succès !");
      setEmail('');
      setProjectUrl('');
      setShowResult(false);
    } catch (err) {
      console.error("Error saving lead:", err);
      alert("Erreur lors de l'enregistrement de vos informations.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">AI Trust Gateway</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-slate-50 transition-colors">Fonctionnalités</a>
              <a href="#how-it-works" className="hover:text-slate-50 transition-colors">Méthodologie</a>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-95">
                Rejoindre la Beta
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            <span>Nouveau : Rapports de conformité EU AI Act</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-slate-50 to-slate-400 bg-clip-text text-transparent">
            Prouvez votre conformité IA <br className="hidden md:block" />
            en 5 minutes, pas en 5 days.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Automatisez vos audits de transparence, générez vos rapports AI-BOM et accélérez vos cycles de vente B2B avec notre passerelle de confiance certifiée.
          </p>

          <div className="max-w-xl mx-auto">
            {!isAnalyzing && !showResult && (
              <div>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleStartAudit}>
                  <input 
                    type="url" 
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="URL de votre projet ou API..." 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                    required
                  />
                  <button type="submit" className="group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all overflow-hidden whitespace-nowrap">
                    <span className="relative z-10">Lancer l'audit gratuit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                  </button>
                </form>
                <p className="mt-4 text-xs text-slate-500">
                  Déjà 200+ entreprises sur liste d'attente. Sans engagement.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-20 h-20">
                    <Loader2 className="w-20 h-20 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {Math.round(progress)}%
                    </div>
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-400">{analysisStep}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showResult && (
              <div className="p-8 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm text-left">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Résultats de l'analyse</h3>
                    <p className="text-slate-400 text-sm">Projet : {projectUrl}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-black text-indigo-400">78<span className="text-lg text-slate-500 font-normal">/100</span></div>
                    <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold">Score de Transparence</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-200">Point de vigilance 1</p>
                      <p className="text-xs text-amber-200/70 leading-relaxed">Manque de documentation sur le jeu de données d'entraînement (AI Act Compliance).</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-200">Point de vigilance 2</p>
                      <p className="text-xs text-amber-200/70 leading-relaxed">Risque potentiel de non-conformité à l'Article 52 (Transparence des systèmes IA).</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                  <p className="text-center text-sm font-medium mb-4">Obtenez le rapport complet et certifié</p>
                  <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSaveLead}>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com" 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                      required
                    />
                    <button type="submit" disabled={isSubmittingEmail} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                      <span>{isSubmittingEmail ? 'Envoi...' : 'Obtenir le rapport complet'}</span>
                      <Mail className="w-4 h-4" />
                    </button>
                  </form>
                  <button 
                    onClick={() => { setShowResult(false); setProjectUrl(''); }}
                    className="mt-6 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Réinitialiser le simulateur
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Social Proof */}
        <section className="mt-24 py-12 border-y border-slate-900 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">
              Conçu pour les DPO, CTO et Responsables Achats des entreprises innovantes
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-80 transition-opacity duration-300">
              <div className="flex items-center gap-2 font-bold text-xl">CloudFlow</div>
              <div className="flex items-center gap-2 font-bold text-xl">DataGuard</div>
              <div className="flex items-center gap-2 font-bold text-xl">SecureScale</div>
              <div className="flex items-center gap-2 font-bold text-xl">TrustLayer</div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">La confiance comme avantage compétitif</h2>
            <p className="text-slate-400">Des outils puissants pour sécuriser vos déploiements IA.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Audit Automatisé</h3>
              <p className="text-slate-400 leading-relaxed">
                Scannez vos pipelines de données et modèles pour identifier les risques de biais et de sécurité en temps réel.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rapports AI-BOM</h3>
              <p className="text-slate-400 leading-relaxed">
                Générez des "AI Bill of Materials" détaillés pour une transparence totale vis-à-vis de vos clients et régulateurs.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Badge de Confiance</h3>
              <p className="text-slate-400 leading-relaxed">
                Affichez notre certification dynamique sur vos interfaces pour rassurer vos utilisateurs finaux instantanément.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-indigo-600/5 rounded-[3rem] border border-indigo-500/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trois étapes vers la certification</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-slate-800 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-indigo-600 flex items-center justify-center mb-6 font-bold text-xl">1</div>
              <h4 className="text-xl font-bold mb-2">Scan</h4>
              <p className="text-slate-400">Connectez vos repos et APIs IA. Nous analysons l'architecture technique.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-indigo-600 flex items-center justify-center mb-6 font-bold text-xl">2</div>
              <h4 className="text-xl font-bold mb-2">Analyse</h4>
              <p className="text-slate-400">Notre moteur de conformité vérifie les points de contrôle (EU AI Act, NIST).</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-indigo-600 flex items-center justify-center mb-6 font-bold text-xl">3</div>
              <h4 className="text-xl font-bold mb-2">Certification</h4>
              <p className="text-slate-400">Génération automatique des documents et du badge de confiance.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              <span className="font-bold">AI Trust Gateway</span>
            </div>
            
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
            
            <div className="text-sm text-slate-600">
              Propulsé par AI Trust Gateway - 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}