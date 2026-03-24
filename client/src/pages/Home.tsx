import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Code2, Layers, Sparkles } from "lucide-react";
import heroImg from "@assets/Gemini_Generated_Image_m78px4m78px4m78p.png";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Background Grid & Blur Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none z-0" />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center z-10 container mx-auto px-4 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left Column: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-primary border border-indigo-100 dark:border-indigo-500/20 text-sm font-medium mb-6 font-mono">
              <Sparkles className="w-4 h-4" />
              Next-Gen Content Generation
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 leading-[1.1] mb-6">
              Generate <span className="text-gradient">Professional</span>{" "}
              Website Content in Seconds
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
              Stop staring at a blank page. Our AI content forge crafts
              high-converting copy, structural layouts, and FAQs tailored to
              your exact business needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/generator"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Start Generating Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-gray-700 dark:text-gray-800 bg-white dark:bg-white/8 border border-gray-200 dark:border-white/15 shadow-sm hover:bg-gray-50 dark:hover:bg-white/12 transition-all duration-200"
              >
                View Past Generations
              </Link>
            </div>

            {/* Feature small points */}
            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Instant
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />{" "}
                JSON Export
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500 dark:text-purple-400" />{" "}
                Structured
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden glass-card p-2 border-white/40 dark:border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 pointer-events-none" />
              <img
                src={heroImg}
                alt="AI Interface Preview"
                className="w-full h-auto rounded-xl -mt-2 shadow-inner border border-gray-100 dark:border-white/10 object-cover"
              />
            </div>

            {/* Decorative floating elements */}
            <div
              className="absolute top-10 -right-10 px-4 py-3 bg-white dark:bg-[#1e2438] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <p className="text-xs font-mono font-semibold text-primary">
                {"{ status: 'generated' }"}
              </p>
            </div>
            <div
              className="absolute bottom-10 -left-6 px-4 py-3 bg-gray-900 dark:bg-[#252d3d] rounded-xl shadow-xl border border-gray-800 dark:border-white/10 animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <p className="text-xs font-mono font-semibold text-accent">
                100% Conversion Ready
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
