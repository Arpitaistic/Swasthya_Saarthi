
// Voice recognition utilities

export interface VoiceRecognitionOptions {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  language?: string;
  continuous?: boolean;
}

// Define proper interfaces for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: any;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Define a global interface to handle browser-specific SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export class VoiceRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private options: VoiceRecognitionOptions;

  constructor(options: VoiceRecognitionOptions = {}) {
    this.options = {
      language: 'en-US',
      continuous: false,
      ...options,
    };
    
    this.initRecognition();
  }

  private initRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Initialize the SpeechRecognition object
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();
    
    // Configure options
    this.recognition.lang = this.options.language || 'en-US';
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = true;
    
    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.options.onStart) this.options.onStart();
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (this.options.onEnd) this.options.onEnd();
    };
    
    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      
      if (this.options.onResult) this.options.onResult(transcript);
    };
    
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.options.onError) this.options.onError(event.error || 'Recognition error');
    };
  }

  public start() {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        if (this.options.onError) this.options.onError('Speech recognition not supported');
        return;
      }
    }
    
    if (!this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        if (this.options.onError) this.options.onError('Failed to start speech recognition');
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public setLanguage(language: string) {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

// Simplified text-to-speech function
export const speak = (text: string, lang: string = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported in this browser');
    return;
  }
  
  // Create a new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // Speak the utterance
  window.speechSynthesis.speak(utterance);
};

// Available languages for the app, including more Indian languages
export const availableLanguages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'or-IN', name: 'Odia' },
  { code: 'as-IN', name: 'Assamese' },
  { code: 'ur-IN', name: 'Urdu' },
];

// Map Indian language phrases to English symptoms for better detection
export const languageSymptomsMap = {
  // Hindi symptoms
  'सिरदर्द': 'headache',
  'बुखार': 'fever',
  'खांसी': 'cough',
  'जुकाम': 'cold',
  'उल्टी': 'vomiting',
  'दस्त': 'diarrhea',
  'थकान': 'fatigue',
  'चक्कर': 'dizziness',
  'पेट दर्द': 'stomach ache',
  'सांस की तकलीफ': 'breathing difficulty',
  'सर्दी': 'cold',
  'गले में खराश': 'sore throat',
  'कमजोरी': 'weakness',
  'जोड़ों का दर्द': 'joint pain',
  'मांसपेशियों में दर्द': 'muscle pain',
  'नाक बहना': 'runny nose',
  'कंधे का दर्द': 'shoulder pain',
  'पीठ दर्द': 'back pain',
  'आंखों में जलन': 'eye irritation',
  'कमर दर्द': 'lower back pain',
  
  // Bengali symptoms
  'মাথাব্যথা': 'headache',
  'জ্বর': 'fever',
  'কাশি': 'cough',
  'সর্দি': 'cold',
  'বমি': 'vomiting',
  'ডায়রিয়া': 'diarrhea',
  'ক্লান্তি': 'fatigue',
  'মাথা ঘোরা': 'dizziness',
  'পেট ব্যথা': 'stomach ache',
  'শ্বাস নিতে কষ্ট': 'breathing difficulty',
  'গলা ব্যথা': 'sore throat',
  'দুর্বলতা': 'weakness',
  
  // Tamil symptoms
  'தலைவலி': 'headache',
  'காய்ச்சல்': 'fever',
  'இருமல்': 'cough',
  'சளி': 'cold',
  'வாந்தி': 'vomiting',
  'வயிற்றுப்போக்கு': 'diarrhea',
  'சோர்வு': 'fatigue',
  'தலைசுற்றல்': 'dizziness',
  'வயிற்று வலி': 'stomach ache',
  'மூச்சுத் திணறல்': 'breathing difficulty',
  'தொண்டை வலி': 'sore throat',
  'பலவீனம்': 'weakness',
  
  // Telugu symptoms
  'తలనొప్పి': 'headache',
  'జ్వరం': 'fever',
  'దగ్గు': 'cough',
  'జలుబు': 'cold',
  'వాంతి': 'vomiting',
  'విరేచనాలు': 'diarrhea',
  'అలసట': 'fatigue',
  'తలతిరుగుడు': 'dizziness',
  'కడుపు నొప్పి': 'stomach ache',
  'శ్వాస తీసుకోవడంలో ఇబ్బంది': 'breathing difficulty',
  'గొంతు నొప్పి': 'sore throat',
  'బలహీనత': 'weakness',
  
  // Marathi symptoms
  'डोकेदुखी': 'headache',
  'ताप': 'fever',
  'खोकला': 'cough',
  'सर्दी': 'cold',
  'उलटी': 'vomiting',
  'अतिसार': 'diarrhea',
  'थकवा': 'fatigue',
  'चक्कर येणे': 'dizziness',
  'पोटदुखी': 'stomach ache',
  'श्वास घेण्यास त्रास': 'breathing difficulty',
  'घसा दुखणे': 'sore throat',
  'अशक्तपणा': 'weakness',
  
  // Gujarati symptoms
  'માથાનો દુખાવો': 'headache',
  'તાવ': 'fever',
  'ખાંસી': 'cough',
  'શરદી': 'cold',
  'ઉલટી': 'vomiting',
  'ઝાડા': 'diarrhea',
  'થાક': 'fatigue',
  'ચક્કર': 'dizziness',
  'પેટમાં દુખાવો': 'stomach ache',
  'શ્વાસ લેવામાં તકલીફ': 'breathing difficulty',
  'ગળામાં દુખાવો': 'sore throat',
  'નબળાઈ': 'weakness',
  
  // Kannada symptoms
  'ತಲೆನೋವು': 'headache',
  'ಜ್ವರ': 'fever',
  'ಕೆಮ್ಮು': 'cough',
  'ಶೀತ': 'cold',
  'ವಾಂತಿ': 'vomiting',
  'ಅತಿಸಾರ': 'diarrhea',
  'ಆಯಾಸ': 'fatigue',
  'ತಲೆ ತಿರುಗುವಿಕೆ': 'dizziness',
  'ಹೊಟ್ಟೆ ನೋವು': 'stomach ache',
  'ಉಸಿರಾಟದ ತೊಂದರೆ': 'breathing difficulty',
  'ಗಂಟಲು ನೋವು': 'sore throat',
  'ದುರ್ಬಲತೆ': 'weakness',
  
  // Punjabi symptoms
  'ਸਿਰ ਦਰਦ': 'headache',
  'ਬੁਖਾਰ': 'fever',
  'ਖੰਘ': 'cough',
  'ਜ਼ੁਕਾਮ': 'cold',
  'ਉਲਟੀ': 'vomiting',
  'ਦਸਤ': 'diarrhea',
  'ਥਕਾਵਟ': 'fatigue',
  'ਚੱਕਰ': 'dizziness',
  'ਪੇਟ ਦਰਦ': 'stomach ache',
  'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ': 'breathing difficulty',
  'ਗਲੇ ਦੀ ਖਰਾਬੀ': 'sore throat',
  'ਕਮਜ਼ੋਰੀ': 'weakness',
};

// Helper function to translate multilingual symptoms to English
export const translateSymptom = (text: string): string => {
  const lowerText = text.toLowerCase();
  let translatedText = text;
  
  // Check each known symptom in various languages
  Object.entries(languageSymptomsMap).forEach(([localTerm, englishTerm]) => {
    if (lowerText.includes(localTerm.toLowerCase())) {
      // Replace the local language term with English
      translatedText = translatedText.replace(new RegExp(localTerm, 'gi'), englishTerm);
    }
  });
  
  return translatedText;
};
