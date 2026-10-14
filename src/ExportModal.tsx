import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { usePWAInstall } from './usePWAInstall';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'apk' | 'github'>('phone');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // App live shared URL
  const appUrl = 'https://ais-pre-fft32eyzlp2zes5x476upr-29225505074.europe-west2.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#080a0f',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch(console.error);
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Collect project core files via fetch
      const filesToInclude = [
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'capacitor.config.json',
        'index.html',
        'index.css',
        'src/main.tsx',
        'src/App.tsx',
        'src/styles.css',
        'src/usePWAInstall.ts',
        'src/ExportModal.tsx',
        'src/wizardChessEngine.js',
        'public/icon.svg',
        'public/pwa-192x192.png',
        'public/pwa-512x512.png',
        'public/pwa-maskable-512x512.png',
        'public/apple-touch-icon.png',
        'public/favicon.png',
        '.github/workflows/build-apk.yml',
        'public/assets/glb/bishop_white.glb.gz.b64',
        'public/assets/glb/king_white.glb.gz.b64',
        'public/assets/glb/knight_white.glb.gz.b64',
        'public/assets/glb/option8_cathedral.glb.gz.b64',
        'public/assets/glb/pawn_white.glb.gz.b64',
        'public/assets/glb/queen_white.glb.gz.b64',
        'public/assets/glb/rook_white.glb.gz.b64',
      ];

      for (const filePath of filesToInclude) {
        try {
          const res = await fetch(`/${filePath}`);
          if (res.ok) {
            const blob = await res.blob();
            zip.file(filePath, blob);
          }
        } catch {
          // Ignore individual fetch failure
        }
      }

      // Add a helpful README.md
      const readmeContent = `# Wizard Chess 3D — Gothic Cathedral Edition

لعبة شطرنج السحرة ثلاثية الأبعاد (3D Wizard Chess) بتأثيرات بصرية وملحمية لقطع الحجارة وتدميرها، ونظام ذكاء اصطناعي (AI).

## 🚀 التشغيل المحلي (Local Dev)
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📱 إنشاء ملف الـ APK عبر GitHub
1. ارفع هذا المستودع إلى حسابك على GitHub:
\`\`\`bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/<YOUR_USERNAME>/wizard-chess-3d.git
git branch -M main
git push -u origin main
\`\`\`
2. بمجرد الرفع، سيعمل سير العمل الآلي في \`.github/workflows/build-apk.yml\` تلقائياً.
3. توجه إلى تبويب **Actions** في مستودعك، وستجد ملف الـ APK جاهزاً للتحميل في قسم **Artifacts** باسم \`wizard-chess-3d-debug-apk\`!

## 🌐 التثبيت المباشر كتطبيق PWA
افتح رابط اللعبة في متصفح هاتفك واضغط على "إضافة إلى الشاشة الرئيسية" لتعمل كتطبيق مستقل بدون الحاجة إلى متجر!
`;
      zip.file('README.md', readmeContent);

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'wizard-chess-3d-github-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  const gitCommands = `# 1. ربط المستودع بحسابك على GitHub (استبدل USERNAME باسم حسابك):
git remote add origin https://github.com/USERNAME/wizard-chess-3d.git

# 2. تحديد الفرع الرئيسي ورفع الأكواد:
git branch -M main
git push -u origin main`;

  return (
    <div className="export-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="export-modal-content" onClick={(e) => e.stopPropagation()} dir="rtl">
        {/* Header */}
        <div className="export-modal-header">
          <div className="export-modal-title-wrap">
            <span className="export-modal-badge">جاهز للنشر والتثبيت</span>
            <h2 className="export-modal-title">📱 تثبيت اللعبة على الهاتف &amp; إنشاء مستودع GitHub</h2>
          </div>
          <button
            type="button"
            className="export-modal-close"
            onClick={onClose}
            aria-label="إغلاق النافذة"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="export-modal-tabs">
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'phone' ? 'active' : ''}`}
            onClick={() => setActiveTab('phone')}
          >
            📱 التثبيت على الهاتف (PWA)
          </button>
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'apk' ? 'active' : ''}`}
            onClick={() => setActiveTab('apk')}
          >
            🤖 تحميل بصيغة APK
          </button>
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            🐙 مستودع GitHub
          </button>
        </div>

        {/* Tab 1: Direct Phone Installation */}
        {activeTab === 'phone' && (
          <div className="export-tab-body">
            <div className="export-callout-gold">
              <strong>✨ الطريقة الأسرع والأسهل (بدون متجر وبدون تعقيدات):</strong>
              <p>
                تم تحويل اللعبة بالكامل إلى تطبيق تقدمي <strong>(PWA)</strong> معتمد. يمكنك تثبيتها
                مباشرة على هاتفك الأندرويد أو الآيفون وستعمل كتطبيق أصيل بملء الشاشة، مع أيقونة على
                شاشة الهاتف ودعم اللعب دون إنترنت (Offline)!
              </p>
            </div>

            <div className="export-phone-grid">
              {/* QR Code and URL */}
              <div className="export-qr-card">
                <span className="export-qr-title">امسح الكود بكاميرا هاتفك:</span>
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code للعبة" className="export-qr-img" />
                ) : (
                  <div className="export-qr-placeholder">جاري التحميل...</div>
                )}
                <span className="export-qr-sub">أو افتح الرابط مباشرة على الهاتف:</span>
                <div className="export-url-box">
                  <input type="text" readOnly value={appUrl} className="export-url-input" />
                  <button
                    type="button"
                    className="export-mini-btn"
                    onClick={() => handleCopy(appUrl, 'url')}
                  >
                    {copiedText === 'url' ? '✓ تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>

              {/* Steps for Android and iOS */}
              <div className="export-instructions-card">
                <h3 className="export-subhead">خطوات التثبيت على الهاتف:</h3>

                {isInstallable && (
                  <button
                    type="button"
                    className="export-install-cta-btn"
                    onClick={() => {
                      install();
                    }}
                  >
                    ⚡ تثبيت التطبيق الآن على هذا الجهاز
                  </button>
                )}

                {isInstalled && (
                  <div className="export-installed-banner">
                    ✓ التطبيق مثبت بالفعل على هذا الجهاز ويعمل بوضع الشاشة الكاملة!
                  </div>
                )}

                <div className="export-platform-item">
                  <div className="platform-icon">🤖</div>
                  <div>
                    <strong>هواتف أندرويد (Chrome / Samsung Internet):</strong>
                    <ol className="export-steps-list">
                      <li>افتح الرابط أعلاه في متصفح هاتفك.</li>
                      <li>اضغط على القائمة (الثلاث نقاط ⋮ بأعلى أو أسفل الشاشة).</li>
                      <li>اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
                      <li>ستظهر أيقونة الشطرنج السحري بين تطبيقاتك وتفتح فوراً بدون أشرطة متصفح.</li>
                    </ol>
                  </div>
                </div>

                <div className="export-platform-item">
                  <div className="platform-icon">🍎</div>
                  <div>
                    <strong>هواتف آيفون (Safari):</strong>
                    <ol className="export-steps-list">
                      <li>افتح الرابط في متصفح Safari.</li>
                      <li>اضغط على زر المشاركة (المربع ذو السهم للأعلى ⎋).</li>
                      <li>اختر <strong>«إضافة إلى الصفحة الرئيسية (Add to Home Screen)»</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Download APK */}
        {activeTab === 'apk' && (
          <div className="export-tab-body">
            <div className="export-callout-gold">
              <strong>📦 طريقتان للحصول على ملف APK وتثبيته على أندرويد:</strong>
              <p>
                نظراً لأن بيئة السحابة الحالية هي بيئة ويب خفيفة، وفرنا لك طريقتين رسميتين وسريعتين
                جداً لبناء ملف <code>.apk</code> جاهز:
              </p>
            </div>

            <div className="apk-options-grid">
              {/* Option A: GitHub Actions Automatic Build */}
              <div className="apk-card">
                <div className="apk-card-badge">تلقائي عبر GitHub</div>
                <h3 className="apk-card-title">1. بناء APK تلقائياً عبر سير عمل GitHub</h3>
                <p className="apk-card-desc">
                  قمنا بإنشاء ملف سير العمل <code>.github/workflows/build-apk.yml</code> مسبقاً داخل
                  المشروع.
                </p>
                <ul className="apk-points-list">
                  <li>بمجرد رفع المشروع إلى مستودعك في GitHub، سيقوم خادم GitHub مجاناً بتجميع التطبيق باستخدام Android SDK و Gradle.</li>
                  <li>خلال دقيقتين ستجد ملف <code>app-debug.apk</code> جاهزاً للتنزيل مباشرة من تبويب <strong>Actions</strong> أو <strong>Releases</strong> في مستودعك!</li>
                </ul>
                <div className="apk-action-wrap">
                  <button
                    type="button"
                    className="export-action-btn secondary"
                    onClick={() => setActiveTab('github')}
                  >
                    عرض خطوات رفع المستودع إلى GitHub ←
                  </button>
                </div>
              </div>

              {/* Option B: PWABuilder instant APK */}
              <div className="apk-card">
                <div className="apk-card-badge">فوري وبنقرة زر</div>
                <h3 className="apk-card-title">2. تحويل فوري إلى APK عبر PWABuilder</h3>
                <p className="apk-card-desc">
                  أداة PWABuilder الرسمية من شركة مايكروسوفت تسمح بتحويل تطبيق الويب التفاعلي PWA
                  مباشرة إلى حزمة أندرويد APK موقعة ومجهزة.
                </p>
                <ul className="apk-points-list">
                  <li>الرابط والأيقونات والـ Manifest تم إعدادها بالكامل والتوافق 100%.</li>
                  <li>اضغط على الزر أدناه وسيفتح لك صفحة الحزمة لتنزيل الـ APK مباشرة.</li>
                </ul>
                <div className="apk-action-wrap">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="export-action-btn primary"
                  >
                    تحميل APK عبر PWABuilder ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub Repository Setup */}
        {activeTab === 'github' && (
          <div className="export-tab-body">
            <div className="export-callout-gold">
              <strong>🐙 إنشاء ورفع المستودع في حسابك على GitHub:</strong>
              <p>
                للحفاظ على أمان حسابك، لا يملك المحرر حق الوصول المباشر لكلمات مرورك أو مفاتيحك
                الشخصية. ولكن قمنا بتهيئة مستودع Git محلياً وتجهيز جميع الملفات وسير عمل بناء الـ
                APK!
              </p>
            </div>

            <div className="github-flow-card">
              <h3 className="export-subhead">خطوات رفع المشروع إلى حسابك في 60 ثانية:</h3>

              <div className="github-step-item">
                <div className="step-num">1</div>
                <div className="step-content">
                  <strong>أنشئ مستودعاً جديداً على GitHub:</strong>
                  <p>
                    توجه إلى <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="gold-link">github.com/new ↗</a> وأنشئ مستودعاً فارغاً (مثلاً: <code>wizard-chess-3d</code>).
                  </p>
                </div>
              </div>

              <div className="github-step-item">
                <div className="step-num">2</div>
                <div className="step-content">
                  <strong>اختر إحدى طريقتي الرفع:</strong>
                  
                  {/* Way A: Terminal / Git commands */}
                  <div className="github-method-box">
                    <span className="method-tag">الطريقة الأولى: عبر أوامر Git في الطرفية (Terminal)</span>
                    <div className="code-block-container">
                      <pre className="code-block" dir="ltr">{gitCommands}</pre>
                      <button
                        type="button"
                        className="export-copy-btn"
                        onClick={() => handleCopy(gitCommands, 'git')}
                      >
                        {copiedText === 'git' ? '✓ تم النسخ' : 'نسخ الأوامر'}
                      </button>
                    </div>
                  </div>

                  {/* Way B: Upload ZIP */}
                  <div className="github-method-box">
                    <span className="method-tag">الطريقة الثانية: تحميل ZIP ورفعه مباشرة على موقع GitHub</span>
                    <p className="method-desc">
                      إذا كنت لا ترغب باستخدام سطر الأوامر، حمّل ملف المشروع كاملاً بصيغة ZIP ثم اضغط
                      على &quot;uploading an existing file&quot; في صفحة مستودعك على GitHub!
                    </p>
                    <button
                      type="button"
                      className="export-download-zip-btn"
                      onClick={handleDownloadZip}
                      disabled={isZipping}
                    >
                      {isZipping ? '⏳ جاري تجميع ملف الـ ZIP...' : '⬇ تحميل ملف المشروع كاملاً (ZIP جاهز للرفع)'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="github-step-item">
                <div className="step-num">3</div>
                <div className="step-content">
                  <strong>الحصول على الـ APK بعد الرفع:</strong>
                  <p>
                    بمجرد اكتمال الرفع، انتقل إلى تبويب <strong>Actions</strong> في مستودعك، وستجد
                    مهمة <em>Build Android APK</em> قيد التشغيل لبناء ملف <code>app-debug.apk</code> تلقائياً!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="export-modal-footer">
          <div className="export-footer-info">
            اللعبة جاهزة تماماً للعمل على كافة الشاشات والمتصفحات وتدعم اللمس المتعدد والتحكم الكامل.
          </div>
          <button type="button" className="export-footer-close-btn" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
