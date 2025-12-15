import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { generateSpeech, getStoredApiKeys, saveStoredApiKeys } from './services/geminiService';
import { createWavBlob } from './utils/audioUtils';
import { VOICES_BY_LANGUAGE, BANNED_WORDS, TOKEN_PER_CHAR, PRICE_PER_1K_TOKENS } from './constants';
import { Voice, ApiKeyData } from './types';

// --- UI Atom Components ---

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-900 mb-1">{children}</label>
);

const Field: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className={
      "w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
      (props.className ?? "")
    }
  />
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
}

const Button: React.FC<ButtonProps> = ({ loading, variant = 'primary', className, ...rest }) => {
  let baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed ";
  let variantClasses = "";
  
  if (variant === 'icon') {
    baseClasses = "inline-flex items-center justify-center rounded-full p-2 transition-colors disabled:opacity-50 ";
    variantClasses = "text-gray-500 hover:text-indigo-600 hover:bg-gray-100";
  } else {
    baseClasses += "px-4 py-2 ";
    switch (variant) {
      case 'primary': variantClasses = "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400"; break;
      case 'secondary': variantClasses = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"; break;
      case 'danger': variantClasses = "bg-red-50 text-red-600 hover:bg-red-100"; break;
      case 'ghost': variantClasses = "text-indigo-600 hover:bg-indigo-50 shadow-none px-2"; break;
    }
  }

  return (
    <button
      {...rest}
      className={`${baseClasses} ${variantClasses} ${className ?? ""}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {variant !== 'icon' && 'Processing'}
        </>
      ) : rest.children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  title?: string;
  desc?: string;
  rightAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, desc, rightAction }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm h-full flex flex-col">
    {(title || rightAction) && (
      <div className="mb-3 flex justify-between items-start">
        <div>
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          {desc && <p className="text-sm text-gray-700">{desc}</p>}
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    )}
    <div className="flex-grow flex flex-col">{children}</div>
  </div>
);

// --- Constants ---

const LANGUAGE_LABELS: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文 (Chinese)",
  es: "Español (Spanish)",
  fr: "Français (French)",
  de: "Deutsch (German)",
  it: "Italiano (Italian)",
  pt: "Português (Portuguese)",
  ru: "Русский (Russian)",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
  ar: "العربية (Arabic)",
  hi: "हिन्दी (Hindi)",
  bn: "বাংলা (Bengali)",
  id: "Bahasa Indonesia",
  tr: "Türkçe (Turkish)",
  nl: "Nederlands (Dutch)",
  pl: "Polski (Polish)",
  sv: "Svenska (Swedish)",
  no: "Norsk (Norwegian)",
  da: "Dansk (Danish)",
  fi: "Suomi (Finnish)",
  el: "Ελληνικά (Greek)",
  cs: "Čeština (Czech)",
  hu: "Magyar (Hungarian)",
  ro: "Română (Romanian)",
  th: "ไทย (Thai)",
  he: "עברית (Hebrew)",
  uk: "Українська (Ukrainian)",
  ms: "Bahasa Melayu (Malay)",
  fa: "فارسی (Persian)",
  fil: "Filipino",
  af: "Afrikaans",
  bg: "Български (Bulgarian)",
  ca: "Català (Catalan)",
  hr: "Hrvatski (Croatian)",
  et: "Eesti (Estonian)",
  gl: "Galego (Galician)",
  is: "Íslenska (Icelandic)",
  lt: "Lietuvių (Lithuanian)",
  lv: "Latviešu (Latvian)",
  mk: "Македонски (Macedonian)",
  sk: "Slovenčina (Slovak)",
  sl: "Slovenščina (Slovenian)",
  sr: "Српски (Serbian)",
  sw: "Kiswahili (Swahili)",
  ur: "اردو (Urdu)",
  gu: "ગુજરાતી (Gujarati)",
  kn: "ಕನ್ನಡ (Kannada)",
  ml: "മലയാളം (Malayalam)",
  mr: "मराठी (Marathi)",
  ta: "தமிழ் (Tamil)",
  te: "తెలుగు (Telugu)",
  jv: "Basa Jawa (Javanese)"
};

// --- Types for Batch Mode ---

interface BatchItem {
  id: string; // Internal unique ID
  stt: string; // From CSV
  text: string; // From CSV
  status: 'idle' | 'loading' | 'success' | 'error';
  audioUrl?: string;
  errorMsg?: string;
  usedKey?: string; // Track which key was used
}

export default function App() {
  // --- General State ---
  const [language, setLanguage] = useState('vi');
  const [voiceId, setVoiceId] = useState<string>(VOICES_BY_LANGUAGE['vi'].female[0].id);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [isSSML, setIsSSML] = useState(false);
  
  // --- Single Mode State ---
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [text, setText] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singleAudioUrl, setSingleAudioUrl] = useState<string | null>(null);
  const singleAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Batch Mode State ---
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [clearConfirmation, setClearConfirmation] = useState(false);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const batchAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- API Key State ---
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [newKeyInput, setNewKeyInput] = useState("");
  
  // Ref for Round Robin
  const globalKeyIndex = useRef(0);

  useEffect(() => {
    const keys = getStoredApiKeys();
    setApiKeys(keys);
  }, []);

  // Update storage whenever apiKeys changes
  useEffect(() => {
    if (apiKeys.length > 0 || localStorage.getItem('gemini_api_keys_v2')) {
       saveStoredApiKeys(apiKeys);
    }
  }, [apiKeys]);

  // --- API Key Management Logic ---

  const handleAddKey = () => {
    if (!newKeyInput.trim()) return;
    
    // Check for duplicates
    if (apiKeys.some(k => k.key === newKeyInput.trim())) {
      alert("This key is already in the list.");
      return;
    }

    const newKeyEntry: ApiKeyData = {
      key: newKeyInput.trim(),
      status: 'active',
      usageCount: 0,
      addedAt: Date.now()
    };
    
    setApiKeys(prev => [...prev, newKeyEntry]);
    setNewKeyInput("");
  };

  const handleRemoveKey = (keyToRemove: string) => {
    setApiKeys(prev => prev.filter(k => k.key !== keyToRemove));
  };

  const handleResetKeyStatus = (keyToReset: string) => {
    setApiKeys(prev => prev.map(k => k.key === keyToReset ? { ...k, status: 'active', errorMessage: undefined } : k));
  };

  // --- Round Robin & Retry Logic ---

  // Helper to mark a key as error in state
  const markKeyError = useCallback((failedKey: string, reason: string, isQuota: boolean) => {
    setApiKeys(prev => prev.map(k => {
      if (k.key === failedKey) {
        return {
          ...k,
          status: isQuota ? 'quota_exceeded' : 'error',
          errorMessage: reason
        };
      }
      return k;
    }));
  }, []);

  const incrementKeyUsage = useCallback((usedKey: string) => {
    setApiKeys(prev => prev.map(k => k.key === usedKey ? { ...k, usageCount: k.usageCount + 1 } : k));
  }, []);

  // Centralized function to try generation with rotation and retry
  const attemptGenerate = useCallback(async (params: any): Promise<string> => {
    // 1. Filter active keys
    // NOTE: We read from the current state ref or pass state?
    // We need the freshest keys. We'll use the functional state updater pattern indirectly or trust the closures.
    // For safety in async loops, we should pass the current keys list or trust the `apiKeys` state if it's updated.
    // However, inside a loop, state might be stale.
    // Strategy: We will maintain a local copy of "failed keys" for this specific attempt to avoid infinite loops,
    // but we will update the global state when a key fails so UI updates.
    
    let attemptedKeys = new Set<string>();
    
    // Loop until success or no keys left
    while (true) {
        // dynamic check of active keys (excluding ones we just failed in this loop)
        const activeKeys = apiKeys.filter(k => k.status === 'active' && !attemptedKeys.has(k.key));
        
        if (activeKeys.length === 0) {
            throw new Error("No active API keys available. Please check your key list.");
        }

        // Round Robin Selection
        const currentIdx = globalKeyIndex.current % activeKeys.length;
        const selectedKey = activeKeys[currentIdx];
        globalKeyIndex.current++; // Rotate for next request

        try {
            const result = await generateSpeech(params, selectedKey.key);
            incrementKeyUsage(selectedKey.key);
            return result;
        } catch (error: any) {
            attemptedKeys.add(selectedKey.key);
            const msg = error.message || error.toString();
            
            let isQuota = false;
            if (msg.includes("QUOTA_EXCEEDED")) isQuota = true;
            
            // If it's a critical key error (403 or 429), mark globally. 
            // If it's a random network error, maybe don't kill the key permanently?
            // Requirement says: "Có lỗi không thì hiển thị icon error... không dùng lại api cũ nữa" -> Mark it.
            markKeyError(selectedKey.key, msg, isQuota);

            console.warn(`Key ${selectedKey.key.substring(0, 8)}... failed. Trying next key.`);
            
            // Loop continues to next active key
        }
    }
  }, [apiKeys, markKeyError, incrementKeyUsage]);


  // --- Derived State ---
  const charCount = text.length;
  const estTokens = useMemo(() => charCount * TOKEN_PER_CHAR, [charCount]);
  
  const violations = useMemo(() => {
    const lowerText = text.toLowerCase();
    return BANNED_WORDS.filter(word => lowerText.includes(word));
  }, [text]);

  const selectedVoice = useMemo<Voice>(() => {
    const voices = VOICES_BY_LANGUAGE[language];
    if (!voices) return { id: 'unknown', apiId: 'Kore', name: 'Unknown', description: '' };

    const allVoices = [...voices.female, ...voices.male];
    return allVoices.find(v => v.id === voiceId) || allVoices[0];
  }, [voiceId, language]);

  const isAllSelected = useMemo(() => {
    return batchItems.length > 0 && selectedIds.size === batchItems.length;
  }, [batchItems, selectedIds]);

  const isIndeterminate = useMemo(() => {
    return selectedIds.size > 0 && selectedIds.size < batchItems.length;
  }, [batchItems, selectedIds]);

  // --- Handlers: Single Mode ---

  const handleSynthesizeSingle = useCallback(async () => {
    if (!text.trim()) {
      setSingleError("Please enter some text to synthesize.");
      return;
    }
    if (violations.length > 0) {
      setSingleError(`Content contains banned words: ${violations.join(", ")}`);
      return;
    }

    setSingleError(null);
    setSingleLoading(true);
    setSingleAudioUrl(null);

    try {
      const base64Audio = await attemptGenerate({
        text,
        voiceId: selectedVoice.apiId,
        speed: speed,
        pitch: pitch,
        isSSML
      });
      
      const wavBlob = createWavBlob(base64Audio);
      const url = URL.createObjectURL(wavBlob);
      setSingleAudioUrl(url);

      setTimeout(() => {
        singleAudioRef.current?.play().catch(console.error);
      }, 100);

    } catch (e: any) {
      console.error(e);
      setSingleError(e.message || "An error occurred. Please check your API keys.");
    } finally {
      setSingleLoading(false);
    }
  }, [text, selectedVoice, speed, pitch, isSSML, violations, attemptGenerate]);
  
  const handleDownloadSingle = useCallback(() => {
    if (!singleAudioUrl) return;
    const a = document.createElement("a");
    a.href = singleAudioUrl;
    a.download = `tts_${voiceId}_${new Date().toISOString().replace(/[:.]/g, '-')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [singleAudioUrl, voiceId]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const newLangVoices = VOICES_BY_LANGUAGE[newLang];
    const firstVoice = newLangVoices.female[0] || newLangVoices.male[0];
    if(firstVoice) {
      setVoiceId(firstVoice.id);
    }
  };

  // --- Handlers: Batch Mode ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split(/\r?\n/);
      const dataLines = lines.length > 0 ? lines.slice(1) : [];
      const newItems: BatchItem[] = [];
      
      dataLines.forEach((line) => {
        if (!line.trim()) return;
        const match = line.match(/^([^,]+),(.*)$/);
        
        if (match) {
          let stt = match[1].trim();
          let txt = match[2].trim();
          if (stt.startsWith('"') && stt.endsWith('"')) stt = stt.slice(1, -1);
          if (txt.startsWith('"') && txt.endsWith('"')) txt = txt.slice(1, -1);
          txt = txt.replace(/""/g, '"');

          newItems.push({
            id: Math.random().toString(36).substring(7),
            stt: stt,
            text: txt,
            status: 'idle'
          });
        }
      });
      
      setBatchItems(prev => [...prev, ...newItems]);
      setSelectedIds(prev => {
        const next = new Set(prev);
        newItems.forEach(i => next.add(i.id));
        return next;
      });
      if (batchFileInputRef.current) batchFileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const allIds = batchItems.map(i => i.id);
      setSelectedIds(new Set(allIds));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Updated processBatchItem to use attemptGenerate
  const processBatchItem = async (item: BatchItem): Promise<BatchItem> => {
    try {
      const base64Audio = await attemptGenerate({
        text: item.text,
        voiceId: selectedVoice.apiId,
        speed: speed,
        pitch: pitch,
        isSSML: true,
      });
      const wavBlob = createWavBlob(base64Audio);
      const url = URL.createObjectURL(wavBlob);
      return { ...item, status: 'success', audioUrl: url, errorMsg: undefined };
    } catch (e: any) {
      return { ...item, status: 'error', errorMsg: e.message || "Failed" };
    }
  };

  const handleGenerateBatch = async () => {
    if (apiKeys.filter(k => k.status === 'active').length === 0) {
      alert("No active API keys available. Please check configuration.");
      setShowKeyModal(true);
      return;
    }

    setIsBatchProcessing(true);
    
    const itemsToProcess = batchItems
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => 
          selectedIds.has(item.id) && 
          (item.status === 'idle' || item.status === 'error')
        );

    for (const { index } of itemsToProcess) {
      setBatchItems(prev => {
        const next = [...prev];
        next[index] = { ...next[index], status: 'loading' };
        return next;
      });

      const currentItem = batchItems[index];
      const freshItem = batchItems.find(i => i.id === currentItem.id);
      if(!freshItem) continue;

      const resultItem = await processBatchItem(freshItem);

      setBatchItems(prev => {
        const next = [...prev];
        const idx = next.findIndex(i => i.id === resultItem.id);
        if (idx !== -1) next[idx] = resultItem;
        return next;
      });

      // Small delay to prevent complete UI freezing
      await new Promise(r => setTimeout(r, 100));
    }

    setIsBatchProcessing(false);
  };

  const handleRetryItem = async (id: string) => {
    setBatchItems(prev => prev.map(i => i.id === id ? { ...i, status: 'loading' } : i));
    const item = batchItems.find(i => i.id === id);
    if (!item) return;

    const result = await processBatchItem(item);
    setBatchItems(prev => prev.map(i => i.id === id ? result : i));
  };

  const handlePlayItem = (url: string) => {
    if (batchAudioRef.current) {
      batchAudioRef.current.src = url;
      batchAudioRef.current.play();
    }
  };

  const handleDownloadItem = (item: BatchItem) => {
    if (!item.audioUrl) return;
    const a = document.createElement("a");
    a.href = item.audioUrl;
    a.download = `${item.stt}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = async () => {
    const successItems = batchItems.filter(i => i.status === 'success' && i.audioUrl);
    if (successItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      await Promise.all(successItems.map(async (item) => {
        if(item.audioUrl) {
            const response = await fetch(item.audioUrl);
            const blob = await response.blob();
            const filename = `${item.stt.replace(/[^a-z0-9]/gi, '_')}.wav`;
            zip.file(filename, blob);
        }
      }));

      const content = await zip.generateAsync({type: "blob"});
      const url = URL.createObjectURL(content);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `voice_batch_${new Date().toISOString().slice(0, 19).replace(/[-:]/g, "")}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("Failed to create zip file.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleClearBatch = () => {
    if (clearConfirmation) {
      batchItems.forEach(i => i.audioUrl && URL.revokeObjectURL(i.audioUrl));
      setBatchItems([]);
      setSelectedIds(new Set());
      setClearConfirmation(false);
    } else {
      setClearConfirmation(true);
      setTimeout(() => setClearConfirmation(false), 3000);
    }
  };

  // --- Render ---

  const { male: maleVoices, female: femaleVoices } = VOICES_BY_LANGUAGE[language];
  const selectedCount = selectedIds.size;
  const successCount = batchItems.filter(i => i.status === 'success').length;
  const activeKeysCount = apiKeys.filter(k => k.status === 'active').length;

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 font-sans text-gray-900">
      <header className="flex items-center justify-between text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AI Voice Studio</h1>
          <p className="mt-2 text-sm text-gray-600">Powered by Google Gemini. Generate multi-lingual speech with SSML support.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${activeKeysCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {activeKeysCount} Keys Active
            </span>
            <button 
              onClick={() => setShowKeyModal(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors relative"
              title="Manage API Keys"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              {apiKeys.some(k => k.status !== 'active') && (
                 <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10.03 13.97c.3.966.463 1.97.47 2.98l-6 6L2.5 21.5a1 1 0 01-1.495-1.495l2.005-2.005-.75-4.505 1.5-1.5 4.505.75L10.257 10.03A6.002 6.002 0 0118 8zm-6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                API Key Management
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Keys are used in a round-robin fashion. Failed keys are automatically disabled for the session.
              </p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
               {/* Add New Key */}
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter new Gemini API Key (AIzaSy...)" 
                    className="flex-grow rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                  />
                  <Button onClick={handleAddKey} disabled={!newKeyInput.trim()}>Add</Button>
               </div>

               {/* Key List */}
               <div className="space-y-2 mt-4">
                  {apiKeys.length === 0 && <p className="text-center text-gray-400 italic">No keys added yet.</p>}
                  {apiKeys.map((k, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${k.status === 'active' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                         <div className="flex items-center gap-3 overflow-hidden">
                            {/* Status Icon */}
                            {k.status === 'active' && <span className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0" title="Active"></span>}
                            {k.status === 'quota_exceeded' && (
                                <svg className="h-4 w-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {k.status === 'error' && (
                                <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            
                            <div className="flex flex-col min-w-0">
                                <span className={`text-sm font-mono truncate ${k.status !== 'active' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {k.key.substring(0, 8)}...{k.key.substring(k.key.length - 4)}
                                </span>
                                {k.errorMessage && <span className="text-xs text-red-500 truncate">{k.errorMessage}</span>}
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 mr-2">Used: {k.usageCount}</span>
                            {k.status !== 'active' && (
                                <Button variant="icon" onClick={() => handleResetKeyStatus(k.key)} title="Retry/Enable Key">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </Button>
                            )}
                            <Button variant="icon" onClick={() => handleRemoveKey(k.key)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </Button>
                         </div>
                      </div>
                  ))}
               </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowKeyModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Settings Card */}
        <Card title="Settings" desc="Voice parameters apply to all generations">
          <Field>
            <Label htmlFor="lang-select">Ngôn ngữ (Language)</Label>
            <Select id="lang-select" value={language} onChange={handleLanguageChange}>
              {Object.keys(VOICES_BY_LANGUAGE).map((langCode) => (
                <option key={langCode} value={langCode}>
                  {LANGUAGE_LABELS[langCode] || langCode}
                </option>
              ))}
            </Select>
          </Field>
          
          <Field>
            <Label htmlFor="voice-select">Giọng đọc (Voice)</Label>
            <Select
              id="voice-select"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
            >
              {femaleVoices.length > 0 && (
                <optgroup label="Giọng nữ">
                  {femaleVoices.map((voice) => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))}
                </optgroup>
              )}
              {maleVoices.length > 0 && (
                <optgroup label="Giọng nam">
                  {maleVoices.map((voice) => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))}
                </optgroup>
              )}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="speed-range">Tốc độ (Speed): {speed.toFixed(2)}x</Label>
            <input id="speed-range" type="range" min={0.5} max={2} step={0.01} value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" disabled={isSSML || mode === 'batch'}/>
            {mode === 'batch' && <p className="text-xs text-gray-500 mt-1">Batch mode uses raw text/SSML from CSV.</p>}
          </Field>
          <Field>
            <Label htmlFor="pitch-range">Cao độ (Pitch): {pitch} semitones</Label>
            <input id="pitch-range" type="range" min={-20} max={20} step={0.1} value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" disabled={isSSML || mode === 'batch'}/>
          </Field>
          
          {mode === 'single' && (
            <div className="flex items-center gap-2 mt-4">
              <input id="ssml-checkbox" type="checkbox" checked={isSSML} onChange={e => setIsSSML(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <label htmlFor="ssml-checkbox" className="text-sm font-medium text-gray-700">Enable SSML</label>
            </div>
          )}
        </Card>

        {/* Content & Result Area - Spans 2 columns */}
        <div className="md:col-span-2 h-full">
          <Card 
            rightAction={
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setMode('single')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Single Text
                </button>
                <button
                  onClick={() => setMode('batch')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'batch' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Batch (CSV)
                </button>
              </div>
            }
          >
            
            {mode === 'single' ? (
              // --- SINGLE MODE UI ---
              <div className="flex flex-col h-full space-y-4">
                <div className="flex-grow">
                  <Label>Input Text / SSML</Label>
                  <textarea
                    className="h-full min-h-[200px] w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder={isSSML ? '<speak>Hello <emphasis>world</emphasis>!</speak>' : "Enter text to synthesize..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{charCount} chars</span>
                    {violations.length > 0 && <span className="text-red-600 font-medium">Banned: {violations.join(", ")}</span>}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Result</h4>
                      <div className="space-x-2">
                        <Button onClick={handleSynthesizeSingle} disabled={singleLoading || !text.trim()} loading={singleLoading}>Generate</Button>
                        <Button onClick={handleDownloadSingle} disabled={!singleAudioUrl} variant="secondary">Download WAV</Button>
                      </div>
                   </div>
                   
                   {singleError && <p className="mb-2 text-sm text-red-600 bg-red-50 p-2 rounded">{singleError}</p>}
                   <audio ref={singleAudioRef} src={singleAudioUrl ?? undefined} controls className="w-full" />
                </div>
              </div>
            ) : (
              // --- BATCH MODE UI ---
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Upload CSV</h4>
                    <p className="text-xs text-blue-700">Format: <code>Header Row</code> then <code>STT, Content</code></p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    ref={batchFileInputRef}
                    onChange={handleFileUpload}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                  />
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium">
                    {selectedCount > 0 ? `${selectedCount} selected` : `${batchItems.length} items loaded`}
                  </div>
                  <div className="space-x-2">
                     <Button 
                        variant="secondary" 
                        onClick={handleClearBatch} 
                        disabled={batchItems.length === 0 || isBatchProcessing}
                        className={clearConfirmation ? "bg-red-50 text-red-700 border-red-200" : "text-red-600 hover:text-red-700"}
                      >
                        {clearConfirmation ? "Confirm Clear?" : "Clear"}
                      </Button>
                     <Button 
                        variant="secondary" 
                        onClick={handleDownloadAll} 
                        disabled={successCount === 0 || isZipping}
                        loading={isZipping}
                      >
                        {isZipping ? 'Zipping...' : 'Download All (ZIP)'}
                      </Button>
                     <Button 
                        onClick={handleGenerateBatch} 
                        disabled={selectedCount === 0 || isBatchProcessing} 
                        loading={isBatchProcessing}
                      >
                        {isBatchProcessing ? 'Processing...' : `Generate Selected (${selectedCount})`}
                      </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-grow overflow-auto border border-gray-200 rounded-lg bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 w-10 text-center bg-gray-50">
                           <input 
                              type="checkbox" 
                              checked={isAllSelected} 
                              ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                              onChange={handleToggleSelectAll}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                           />
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">STT</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-36">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchItems.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-400 italic">
                            No items. Upload a CSV file to get started.
                          </td>
                        </tr>
                      )}
                      {batchItems.map((item) => (
                        <tr key={item.id} className={selectedIds.has(item.id) ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-gray-50"}>
                          <td className="px-3 py-2 text-center">
                            <input 
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => handleToggleSelect(item.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">{item.stt}</td>
                          <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-xs" title={item.text}>
                            {item.text}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {item.status === 'idle' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Idle</span>}
                            {item.status === 'loading' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">Running</span>}
                            {item.status === 'success' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Done</span>}
                            {item.status === 'error' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 cursor-help" title={item.errorMsg}>Error</span>}
                          </td>
                          <td className="px-3 py-2 text-right space-x-1 whitespace-nowrap">
                            {item.status === 'success' ? (
                              <>
                                <button onClick={() => handlePlayItem(item.audioUrl!)} className="text-gray-500 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50" title="Play">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                </button>
                                <button onClick={() => handleDownloadItem(item)} className="text-gray-500 hover:text-green-600 p-1 rounded hover:bg-green-50" title="Download">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                                <button onClick={() => handleRetryItem(item.id)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50" title="Regenerate with current settings">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                              </>
                            ) : item.status === 'error' ? (
                               <button onClick={() => handleRetryItem(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Retry">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                               </button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Invisible Audio player for batch previews */}
                <audio ref={batchAudioRef} className="hidden" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}