'use client';

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
 Shield, 
 FileText, 
 CheckCircle, 
 ArrowRight, 
 Zap
} from 'lucide-react';

export default function LandingPage() {
 // تعريف المتغيرات لحفظ رابط المشروع وحالة الفحص
 const [projectUrl, setProjectUrl] = useState('');
 const [isAnalyzing, setIsAnalyzing] = useState(false);

 // دالة معالجة إرسال الرابط وحفظه في Supabase
 const handleStartAudit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!projectUrl) return;

 setIsAnalyzing(true);

 try {
 // كود الحفظ في جدول leads داخل عمود email (الذي نضع فيه الرابط مؤقتاً)
 const { data, error } = await supabase
 .from('leads')
 .insert([{ email: projectUrl }]);

 if (error) throw error;
 
 console.log("تم الحفظ بنجاح في Supabase!", data);
 alert("Audit lancé avec succès !");
 } catch (err) {
 console.error("خطأ أثناء الحفظ:", err);
 alert("Erreur lors de l'enregistrement.");
 } finally {
 setIsAnalyzing(false);
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
 <div className="flex items-center gap-8 text-sm font-medium">
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
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8 animate-fade-in">
 <Zap className="w-3 h-3" />
 <span>Nouveau : Rapports de conformité EU AI Act</span>
 </div>
 
 <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-slate-50 to-slate-400 bg-clip-text text-transparent">
 Prouvez votre conformité IA <br className="hidden md:block" />
 en 5 minutes, pas en 5 jours.
 </h1>
 
 <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
 Automatisez vos audits de transparence, générez vos rapports AI-BOM et accélérez vos cycles de vente B2B avec notre passerelle de confiance certifiée.
 </p>

 <div className="max-w-md mx-auto">
 {/* ربطنا الفورم بالدالة الجديدة handleStartAudit */}
 <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleStartAudit}>
 <input 
 type="url" // تم التعديل ليستقبل رابط عوضاً عن الإيميل
 placeholder="https://votre-projet.com" 
 value={projectUrl}
 onChange={(e) => setProjectUrl(e.target.value)}
 className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
 required
 />
 <button 
 type="submit" 
 disabled={isAnalyzing}
 className="group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all overflow-hidden disabled:opacity-50"
 >
 <span className="relative z-10">
 {isAnalyzing ? 'Analyse en cours...' : "Lancer l'audit gratuit"}
 </span>
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
 <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
 </button>
 </form>
 </div>
 </section>

 {/* Social Proof */}
 <section className="mt-24 py-12 border-y border-slate-900 bg-slate-900/30">
 <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium text-slate-500 uppercase tracking-widest">
 Conçu pour les DPO, CTO et Responsables Achats des entreprises innovantes
 </div>
 </section>

 {/* Benefits Grid */}
 <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-3 gap-8">
 <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/30 transition-all group">
 <Shield className="w-8 h-8 text-indigo-500 mb-6" />
 <h3 className="text-xl font-bold mb-3">Audit Automatisé</h3>
 <p className="text-slate-400 leading-relaxed">Scannez vos pipelines de données et modèles pour identify les risques en temps réel.</p>
 </div>
 <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/30 transition-all group">
 <FileText className="w-8 h-8 text-indigo-500 mb-6" />
 <h3 className="text-xl font-bold mb-3">Rapports AI-BOM</h3>
 <p className="text-slate-400 leading-relaxed">Générez des dossiers détaillés pour une transparence totale vis-à-vis des régulateurs.</p>
 </div>
 <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/30 transition-all group">
 <CheckCircle className="w-8 h-8 text-indigo-500 mb-6" />
 <h3 className="text-xl font-bold mb-3">Badge de Confiance</h3>
 <p className="text-slate-400 leading-relaxed">Affichez notre certification dynamique pour rassurer vos utilisateurs instantanément.</p>
 </div>
 </section>

 {/* How it works */}
 <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
 <h2 className="text-3xl font-bold mb-16">Trois étapes vers la certification</h2>
 <div className="grid md:grid-cols-3 gap-12">
 <div>
 <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-6 font-bold">1</div>
 <h4 className="font-bold mb-2">Scan</h4>
 <p className="text-slate-400">Connectez vos repos IA.</p>
 </div>
 <div>
 <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-6 font-bold">2</div>
 <h4 className="font-bold mb-2">Analyse</h4>
 <p className="text-slate-400">Vérification des points de contrôle.</p>
 </div>
 <div>
 <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-6 font-bold">3</div>
 <h4 className="font-bold mb-2">Certification</h4>
 <p className="text-slate-400">Génération du badge et rapports.</p>
 </div>
 </div>
 </section>
 </main>

 <footer className="border-t border-slate-900 py-12 text-center text-sm text-slate-500">
 <div className="flex justify-center gap-8 mb-4">
 <a href="#" className="hover:text-slate-300">Confidentialité</a>
 <a href="#" className="hover:text-slate-300">Mentions Légales</a>
 </div>
 <p>Propulsé par AI Trust Gateway - 2026</p>
 </footer>
 </div>
 );
}