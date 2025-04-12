
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { commonSymptoms, checkSymptoms, HealthCondition } from '@/utils/healthData';

const HealthAssessment = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('today');
  const [severity, setSeverity] = useState<string>('mild');
  const [results, setResults] = useState<HealthCondition[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms(prev => [...prev, symptomId]);
    } else {
      setSelectedSymptoms(prev => prev.filter(id => id !== symptomId));
    }
  };
  
  const handleAssessment = () => {
    if (selectedSymptoms.length === 0) {
      return;
    }
    
    const assessmentResults = checkSymptoms(selectedSymptoms);
    setResults(assessmentResults);
    setShowResults(true);
  };
  
  const resetAssessment = () => {
    setSelectedSymptoms([]);
    setDuration('today');
    setSeverity('mild');
    setResults([]);
    setShowResults(false);
  };
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  return (
    <section id="assessment" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl font-bold text-swasthya-dark mb-4">Health Assessment</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Use our comprehensive symptom checker to get an initial assessment of your health condition.
            This is not a medical diagnosis but can help guide your next steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {!showResults ? (
            <>
              {/* Symptom Selector */}
              <Card className="lg:col-span-8 shadow-lg border-0 animate-fade-in-left">
                <CardHeader>
                  <CardTitle>Select Your Symptoms</CardTitle>
                  <CardDescription>
                    Check all symptoms you are currently experiencing
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {commonSymptoms.map(symptom => (
                      <div key={symptom.id} className="flex items-start space-x-2 p-3 rounded-md hover:bg-gray-50">
                        <Checkbox 
                          id={symptom.id} 
                          className="mt-1 data-[state=checked]:bg-swasthya-primary data-[state=checked]:text-white"
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked === true)}
                        />
                        <div className="flex flex-col">
                          <Label htmlFor={symptom.id} className="font-medium cursor-pointer">
                            {symptom.name}
                          </Label>
                          {symptom.description && (
                            <p className="text-sm text-gray-500">{symptom.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Additional Questions */}
              <Card className="lg:col-span-4 shadow-lg border-0 animate-fade-in-right">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    These details help provide a more accurate assessment
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-swasthya-dark">How long have you had these symptoms?</h3>
                    <RadioGroup value={duration} onValueChange={setDuration}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="today" id="today" />
                        <Label htmlFor="today">Started today</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="days" id="days" />
                        <Label htmlFor="days">Few days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="week" id="week" />
                        <Label htmlFor="week">About a week</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="longer" id="longer" />
                        <Label htmlFor="longer">More than a week</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-swasthya-dark">How severe are your symptoms?</h3>
                    <RadioGroup value={severity} onValueChange={setSeverity}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mild" id="mild" />
                        <Label htmlFor="mild">Mild - noticeable but not disrupting daily activities</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Moderate - somewhat disrupting daily activities</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="severe" id="severe" />
                        <Label htmlFor="severe">Severe - significantly disrupting daily activities</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={resetAssessment}
                  >
                    Clear All
                  </Button>
                  <Button 
                    className="bg-swasthya-primary hover:bg-swasthya-primary/90"
                    onClick={handleAssessment}
                    disabled={selectedSymptoms.length === 0}
                  >
                    Get Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card className="lg:col-span-12 shadow-lg border-0 animate-fade-in">
              <CardHeader>
                <CardTitle>Your Health Assessment Results</CardTitle>
                <CardDescription>
                  Based on the symptoms you selected, here are the potential conditions
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Important Note
                    </AlertTitle>
                    <AlertDescription className="text-blue-700">
                      This assessment is for informational purposes only and does not constitute medical advice. 
                      Please consult with a healthcare professional for proper diagnosis and treatment.
                    </AlertDescription>
                  </Alert>
                </div>
                
                {results.length > 0 ? (
                  <div className="space-y-6">
                    {results.slice(0, 3).map((condition, index) => (
                      <div 
                        key={condition.id}
                        className={`rounded-lg border p-4 ${getUrgencyColor(condition.urgency)}`}
                      >
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            {getUrgencyIcon(condition.urgency)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1 flex items-center">
                              {condition.name}
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/50 font-normal">
                                {condition.urgency.charAt(0).toUpperCase() + condition.urgency.slice(1)} Priority
                              </span>
                            </h3>
                            <p className="mb-3">{condition.description}</p>
                            
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Matching Symptoms:</h4>
                              <div className="flex flex-wrap gap-2">
                                {condition.symptoms
                                  .filter(symptomId => selectedSymptoms.includes(symptomId))
                                  .map(symptomId => {
                                    const symptom = commonSymptoms.find(s => s.id === symptomId);
                                    return symptom ? (
                                      <span key={symptomId} className="inline-block px-2 py-1 bg-white/70 rounded-full text-sm">
                                        {symptom.name}
                                      </span>
                                    ) : null;
                                  })}
                              </div>
                            </div>
                            
                            {condition.homeRemedies && condition.homeRemedies.length > 0 && (
                              <div className="mb-3">
                                <h4 className="font-medium text-sm mb-1">Home Care Suggestions:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {condition.homeRemedies.map((remedy, i) => (
                                    <li key={i}>{remedy}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {condition.seekMedicalAttention && (
                              <div className="mt-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z"></path>
                                  <line x1="8.5" y1="6" x2="8.51" y2="6"></line>
                                  <line x1="15.5" y1="6" x2="15.51" y2="6"></line>
                                  <path d="M17 10c-3.313 0-6 2.687-6 6H7c0-3.313-2.687-6-6-6v4c0 3.313 2.687 6 6 6h6c3.313 0 6-2.687 6-6v-4Z"></path>
                                </svg>
                                <span className="font-medium">Medical attention recommended</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No specific conditions matched your symptoms.</p>
                    <p className="text-gray-600">This could mean your symptoms are mild or unrelated. If you're concerned, please consult a healthcare professional.</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" onClick={resetAssessment}>
                  Start New Assessment
                </Button>
                <Button className="bg-swasthya-secondary hover:bg-swasthya-secondary/90">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Find Nearby Healthcare
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default HealthAssessment;
