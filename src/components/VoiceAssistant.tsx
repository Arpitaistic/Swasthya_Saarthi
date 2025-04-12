
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Languages, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceRecognition, speak, availableLanguages, translateSymptom } from '@/utils/voiceUtils';
import { commonSymptoms, checkSymptoms, Symptom } from '@/utils/healthData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [detectedSymptoms, setDetectedSymptoms] = useState<Symptom[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'assistant', text: string}[]>([]);
  
  const voiceRecognitionRef = useRef<VoiceRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Initialize voice recognition
  useEffect(() => {
    voiceRecognitionRef.current = new VoiceRecognition({
      language,
      onResult: (text) => {
        setTranscript(text);
        // Clear previous timeout if it exists
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      },
      onStart: () => {
        setIsListening(true);
        toast({
          title: "Listening",
          description: "Speak your symptoms now",
        });
      },
      onEnd: () => {
        setIsListening(false);
        // Process after a short delay when recognition ends
        if (transcript) {
          timeoutRef.current = window.setTimeout(() => {
            processVoiceInput(transcript);
          }, 1000);
        }
      },
      onError: (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
        toast({
          title: "Error",
          description: `Voice recognition error: ${error}`,
          variant: "destructive",
        });
      }
    });

    return () => {
      if (voiceRecognitionRef.current) {
        voiceRecognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [language]);

  // Update voice recognition language when language changes
  useEffect(() => {
    if (voiceRecognitionRef.current) {
      voiceRecognitionRef.current.setLanguage(language);
      toast({
        title: "Language Changed",
        description: `Now using ${availableLanguages.find(lang => lang.code === language)?.name || language}`,
      });
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      voiceRecognitionRef.current?.stop();
      toast({
        title: "Stopped Listening",
        description: "Voice recognition stopped",
      });
    } else {
      setTranscript('');
      voiceRecognitionRef.current?.start();
    }
  };

  const processVoiceInput = async (input: string) => {
    if (!input.trim()) return;
    
    // Add user input to chat history
    setChatHistory(prev => [...prev, { type: 'user', text: input }]);
    
    // Start processing
    setProcessing(true);
    
    // Translate input if it contains non-English symptoms
    const translatedInput = translateSymptom(input);

    // Detect symptoms in the translated input text
    const detectedSymptoms = detectSymptoms(translatedInput);
    setDetectedSymptoms(detectedSymptoms);
    
    // Generate response based on detected symptoms
    const response = generateResponse(detectedSymptoms);
    
    // Add delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set the response and add to chat history
    setCurrentResponse(response);
    setChatHistory(prev => [...prev, { type: 'assistant', text: response }]);
    
    // Speak the response
    speak(response, language);
    
    // End processing
    setProcessing(false);
  };

  const detectSymptoms = (input: string): Symptom[] => {
    // Simple detection by checking if symptom names appear in the input
    const lowercaseInput = input.toLowerCase();
    return commonSymptoms.filter(symptom => 
      lowercaseInput.includes(symptom.name.toLowerCase()) ||
      (symptom.description && lowercaseInput.includes(symptom.description.toLowerCase()))
    );
  };

  const generateResponse = (symptoms: Symptom[]): string => {
    if (symptoms.length === 0) {
      return "I couldn't detect any specific symptoms. Could you please describe how you're feeling in more detail?";
    }
    
    // Get symptom IDs for checking potential conditions
    const symptomIds = symptoms.map(s => s.id);
    
    // Check for potential health conditions
    const potentialConditions = checkSymptoms(symptomIds);
    
    if (potentialConditions.length === 0) {
      return `I've detected that you may be experiencing ${symptoms.map(s => s.name.toLowerCase()).join(", ")}. However, I don't have enough information to suggest a specific condition. Would you like to add any other symptoms?`;
    }
    
    // Get the most likely condition (first in the sorted list)
    const topCondition = potentialConditions[0];
    
    let response = `Based on your symptoms (${symptoms.map(s => s.name.toLowerCase()).join(", ")}), you might be experiencing ${topCondition.name}. `;
    response += topCondition.description + ' ';
    
    // Add urgency information
    switch (topCondition.urgency) {
      case 'low':
        response += "This is usually a minor concern. ";
        break;
      case 'medium':
        response += "This is a moderate concern that may require attention. ";
        break;
      case 'high':
        response += "This is a serious concern that requires prompt medical attention. ";
        break;
      case 'emergency':
        response += "THIS IS A POTENTIAL EMERGENCY. Please seek immediate medical help! ";
        break;
    }
    
    // Add home remedies if available
    if (topCondition.homeRemedies && topCondition.homeRemedies.length > 0) {
      response += "Here are some home remedies: " + topCondition.homeRemedies.join(", ") + ". ";
    }
    
    // Add medical attention advice
    if (topCondition.seekMedicalAttention) {
      response += "It's recommended that you consult with a healthcare professional.";
    }
    
    return response;
  };

  const handleManualSubmit = () => {
    if (transcript.trim() && !processing) {
      processVoiceInput(transcript);
      setTranscript('');
    }
  }

  return (
    <section id="services" className="py-16 bg-gradient-soft">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-swasthya-dark mb-4">AI Voice Health Assistant</h2>
          <p className="text-gray-600">
            Describe your symptoms in your own language and get instant AI-powered health insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chat Interface */}
          <Card className="lg:col-span-8 shadow-lg border-0 animate-fade-in-left">
            <CardHeader className="bg-swasthya-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center text-swasthya-dark">
                <div className="mr-3 h-10 w-10 rounded-full bg-swasthya-primary/20 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-swasthya-primary" />
                </div>
                SwasthyaSaarthi Assistant
              </CardTitle>
              <CardDescription>
                Your AI health companion is ready to help
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="h-[400px] overflow-y-auto p-4 bg-gray-50/50" id="chat-container">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-16">
                    <p>Start speaking or type your health concerns below</p>
                    <p className="text-sm mt-2">
                      For example: "I have a headache and fever since yesterday"
                    </p>
                    <p className="text-sm mt-2">
                      भारतीय भाषाओं में भी बोलें: "मुझे सिरदर्द और बुखार है"
                    </p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "mb-4 max-w-[80%] rounded-lg p-3 animate-fade-in",
                        message.type === 'user' 
                          ? "bg-swasthya-primary/10 ml-auto" 
                          : "bg-white shadow-sm"
                      )}
                    >
                      {message.text}
                    </div>
                  ))
                )}
                {processing && (
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-3 mb-4 max-w-[80%] animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-swasthya-primary" />
                    <span className="text-sm text-gray-500">Processing...</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="border-t flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 p-4">
              <div className="w-full relative">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Type or speak your symptoms..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-swasthya-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && transcript.trim() && !processing) {
                      processVoiceInput(transcript);
                      setTranscript('');
                    }
                  }}
                />
                {transcript && !processing && (
                  <Button 
                    className="absolute right-1 top-1 h-8 px-2"
                    onClick={handleManualSubmit}
                  >
                    Send
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  className={isListening ? "bg-red-500 hover:bg-red-600" : "bg-swasthya-primary hover:bg-swasthya-primary/90"}
                  onClick={toggleListening}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Speak
                    </>
                  )}
                </Button>
                
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[140px]">
                    <Languages className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardFooter>
          </Card>
          
          {/* Detected Symptoms Card */}
          <div className="lg:col-span-4 animate-fade-in-right">
            <Card className="shadow-lg border-0 h-full">
              <CardHeader className="bg-swasthya-secondary/5 rounded-t-lg">
                <CardTitle className="text-swasthya-dark">Detected Symptoms</CardTitle>
                <CardDescription>
                  Symptoms identified from your description
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4">
                {detectedSymptoms.length > 0 ? (
                  <ul className="space-y-2">
                    {detectedSymptoms.map(symptom => (
                      <li key={symptom.id} className="flex items-start p-2 rounded-md bg-swasthya-pink/20">
                        <div className="h-6 w-6 rounded-full bg-swasthya-pink flex items-center justify-center mr-2 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-swasthya-secondary">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">{symptom.name}</div>
                          {symptom.description && (
                            <div className="text-sm text-gray-600">{symptom.description}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    <p>No symptoms detected yet</p>
                    <p className="text-sm mt-2">
                      Describe how you're feeling and I'll identify your symptoms
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistant;
