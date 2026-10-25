import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Smartphone,
  X,
  Check,
  Copy,
  ShieldCheck,
} from 'lucide-react';

interface ApkModalProps {
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'bubblewrap' | 'qr'>('direct');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://pulsemind-app.com';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadApkPackage = () => {
    setDownloadingZip(true);

    const readme = `# PulseMind Android APK Testing & Installation Guide

## Option A: Instant 1-Tap Physical Device Install (Fastest)
1. Open this app's URL on your physical Android phone using Google Chrome:
   ${currentUrl}
2. Tap the browser menu (3 dots) in Chrome -> tap **"Install app"** or **"Add to Home screen"**.
3. Android automatically compiles a native **WebAPK** package and installs PulseMind directly onto your phone's app launcher with native splash screen, full biometric hardware access, and zero address bar!

## Option B: Build Standalone .APK File (Bubblewrap / Google TWA)
Google provides the official **Bubblewrap** CLI for building standalone production-grade APKs from PWAs:

\`\`\`bash
# 1. Install CLI
npm install -g @bubblewrap/cli

# 2. Build the APK using this directory
bubblewrap init --manifest="${currentUrl}/manifest.json"
bubblewrap build

# 3. Install directly on connected Android phone:
adb install app-release-signed.apk
\`\`\`

## Option C: PWABuilder (No Terminal Required)
1. Visit https://www.pwabuilder.com
2. Paste: ${currentUrl}
3. Click "Package for Android" -> Click "Download APK / Android Package"
4. Transfer the .apk file to your phone and tap to install!
`;

    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PulseMind-Android-APK-Setup.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingZip(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 text-slate-800 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto flex flex-col gap-4 text-slate-800 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Android Device Testing & APK
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Install on physical Android hardware
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'direct' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Instant WebAPK
          </button>
          <button
            onClick={() => setActiveTab('bubblewrap')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bubblewrap' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Build .APK
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'qr' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Phone QR Link
          </button>
        </div>

        {/* Tab 1: Instant 1-Tap WebAPK */}
        {activeTab === 'direct' && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Native Android WebAPK Protocol</span>
              </div>
              <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                Modern Android OS natively packages installable web apps into real <strong>.apk</strong> files behind the scenes. When you open this in Chrome on your physical device, it installs as a real native app on your home screen and drawer!
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Open URL on your physical Android phone in Chrome.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Tap the top-right Chrome menu (⋮) &gt; <strong>"Install app"</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Launch PulseMind directly from your Android app drawer.</span>
              </div>
            </div>

            {/* Quick URL Copy */}
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                {currentUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Build Standalone .APK File via Bubblewrap / PWABuilder */}
        {activeTab === 'bubblewrap' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You can generate a standalone <strong>.apk</strong> binary for distribution or sideloading via <strong>adb install</strong>:
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] flex flex-col gap-1 border border-slate-800">
              <span className="text-slate-400"># 1. Install Google Bubblewrap CLI</span>
              <span className="text-emerald-400">npm install -g @bubblewrap/cli</span>
              <span className="text-slate-400 mt-1"># 2. Initialize project from live manifest</span>
              <span className="text-emerald-400">bubblewrap init --manifest="{currentUrl}/manifest.json"</span>
              <span className="text-slate-400 mt-1"># 3. Build standalone APK</span>
              <span className="text-emerald-400">bubblewrap build</span>
            </div>

            <button
              onClick={handleDownloadApkPackage}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingZip ? 'Preparing Guide...' : 'Download APK Build Package & Guide'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Phone QR Link */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center gap-3 p-3 text-center">
            <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  currentUrl
                )}`}
                alt="Scan with Android camera to test on device"
                className="w-44 h-44 object-contain rounded-lg"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Scan with your Android camera to immediately test on physical device.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};
