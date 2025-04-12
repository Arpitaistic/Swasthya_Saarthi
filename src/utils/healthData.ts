
// Health assessment data and utilities

// Common symptoms for the symptom checker
export interface Symptom {
  id: string;
  name: string;
  description?: string;
  relatedSymptoms?: string[];
  bodyPart?: string;
}

export const commonSymptoms: Symptom[] = [
  { id: 'fever', name: 'Fever', description: 'Body temperature higher than normal (98.6°F or 37°C)', bodyPart: 'whole_body' },
  { id: 'cough', name: 'Cough', description: 'Sudden expulsion of air from the lungs', bodyPart: 'chest' },
  { id: 'headache', name: 'Headache', description: 'Pain in the head or upper neck', bodyPart: 'head' },
  { id: 'fatigue', name: 'Fatigue', description: 'Extreme tiredness or lack of energy', bodyPart: 'whole_body' },
  { id: 'nausea', name: 'Nausea', description: 'Feeling of sickness with an inclination to vomit', bodyPart: 'stomach' },
  { id: 'dizziness', name: 'Dizziness', description: 'Feeling of spinning or lightheadedness', bodyPart: 'head' },
  { id: 'jointpain', name: 'Joint Pain', description: 'Pain in one or more joints', bodyPart: 'joints' },
  { id: 'rashorskin', name: 'Skin Rash', description: 'Area of irritated or swollen skin', bodyPart: 'skin' },
  { id: 'sore_throat', name: 'Sore Throat', description: 'Pain or irritation in the throat', bodyPart: 'throat' },
  { id: 'diarrhea', name: 'Diarrhea', description: 'Loose, watery stools', bodyPart: 'stomach' },
  { id: 'chest_pain', name: 'Chest Pain', description: 'Pain or discomfort in the chest', bodyPart: 'chest' },
  { id: 'short_breath', name: 'Shortness of Breath', description: 'Difficulty breathing or catching your breath', bodyPart: 'chest' },
  { id: 'stomachache', name: 'Stomach Pain', description: 'Pain in the abdominal region', bodyPart: 'stomach' },
  { id: 'weakness', name: 'Weakness', description: 'Lack of physical strength', bodyPart: 'whole_body' },
  { id: 'vomiting', name: 'Vomiting', description: 'Forceful expulsion of stomach contents', bodyPart: 'stomach' },
];

// Potential health conditions with associated symptoms
export interface HealthCondition {
  id: string;
  name: string;
  symptoms: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  homeRemedies?: string[];
  seekMedicalAttention: boolean;
}

export const healthConditions: HealthCondition[] = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['cough', 'sore_throat', 'fever', 'headache'],
    urgency: 'low',
    description: 'A viral infection of the upper respiratory tract that is usually harmless.',
    homeRemedies: [
      'Rest and drink plenty of fluids',
      'Gargle with warm salt water',
      'Use honey for cough (adults and children over 1 year)',
      'Use over-the-counter pain relievers if needed'
    ],
    seekMedicalAttention: false
  },
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'cough', 'fatigue', 'headache', 'sore_throat'],
    urgency: 'medium',
    description: 'A contagious respiratory illness caused by influenza viruses.',
    homeRemedies: [
      'Rest and stay hydrated',
      'Take over-the-counter fever reducers',
      'Use a humidifier'
    ],
    seekMedicalAttention: false
  },
  {
    id: 'food_poisoning',
    name: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomachache'],
    urgency: 'medium',
    description: 'Illness caused by eating contaminated food.',
    homeRemedies: [
      'Stay hydrated with small sips of water',
      'Rest the stomach for a few hours',
      'Gradually reintroduce bland foods',
      'Avoid dairy, caffeine, alcohol, and fatty foods'
    ],
    seekMedicalAttention: true
  },
  {
    id: 'dehydration',
    name: 'Dehydration',
    symptoms: ['dizziness', 'fatigue', 'headache', 'weakness'],
    urgency: 'medium',
    description: 'A condition that occurs when the body loses more fluids than it takes in.',
    homeRemedies: [
      'Drink water and oral rehydration solutions',
      'Avoid caffeine and alcohol',
      'Eat fruits and vegetables with high water content'
    ],
    seekMedicalAttention: true
  },
  {
    id: 'heatstroke',
    name: 'Heat Stroke',
    symptoms: ['headache', 'dizziness', 'fever', 'nausea'],
    urgency: 'high',
    description: 'A condition caused by your body overheating, usually as a result of prolonged exposure to or physical exertion in high temperatures.',
    homeRemedies: [
      'Move to a cool place',
      'Apply cool compresses',
      'Drink cool water'
    ],
    seekMedicalAttention: true
  },
  {
    id: 'heart_attack',
    name: 'Heart Attack',
    symptoms: ['chest_pain', 'short_breath', 'nausea', 'fatigue'],
    urgency: 'emergency',
    description: 'A serious medical emergency where the blood supply to the heart is suddenly blocked.',
    seekMedicalAttention: true
  },
];

// Simple symptom checker algorithm
export const checkSymptoms = (userSymptoms: string[]): HealthCondition[] => {
  // Filter health conditions that have at least one matching symptom
  const potentialConditions = healthConditions.filter(condition => {
    return condition.symptoms.some(symptom => userSymptoms.includes(symptom));
  });
  
  // Sort by number of matching symptoms (descending)
  potentialConditions.sort((a, b) => {
    const aMatches = a.symptoms.filter(symptom => userSymptoms.includes(symptom)).length;
    const bMatches = b.symptoms.filter(symptom => userSymptoms.includes(symptom)).length;
    return bMatches - aMatches;
  });
  
  return potentialConditions;
};

// Health record types
export interface HealthRecord {
  id: string;
  date: string;
  symptoms: string[];
  diagnosis?: string;
  notes?: string;
  followUp?: string;
}

// Mock health records for demonstration
export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    date: '2025-03-15',
    symptoms: ['fever', 'cough', 'sore_throat'],
    diagnosis: 'Common Cold',
    notes: 'Rest and fluids recommended',
    followUp: '2025-03-22'
  },
  {
    id: '2',
    date: '2025-02-10',
    symptoms: ['headache', 'dizziness', 'fatigue'],
    diagnosis: 'Dehydration',
    notes: 'Increase water intake, especially during summer',
    followUp: '2025-02-17'
  }
];
