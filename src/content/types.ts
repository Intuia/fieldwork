export interface SlideContent {
  slideRef: number;
  title: string;
  subtitle: string;
  points: string[];
}

export interface LearningObjective {
  number: number;
  text: string;
  slideRef: number;
}

export interface AccessChainLink {
  id: string;
  label: string;
  description: string;
  slideRef: number;
}

export interface DesignFlaw {
  id: string;
  slideRef: number;
  title: string;
  subtitle: string;
  section: string;
  flawType: 'design-flaw' | 'attack-pattern' | 'defense-design' | 'information-leakage';
  whatGoesWrong: string;
  attackerOutcome: string;
  fix: string;
  points: string[];
}

export interface ImplementationFlaw {
  id: string;
  slideRef: number;
  title: string;
  subtitle: string;
  section: string;
  points: string[];
}

export interface ThreatMapping {
  id: string;
  weakness: string;
  attackerCapability: string;
  slideRef: number;
}

export interface Defense {
  id: string;
  slideRef: number;
  title: string;
  subtitle: string;
  layer: 'credential' | 'protocol' | 'lifecycle' | 'operations' | 'framework';
  points: string[];
}

export interface CaseAnalysis {
  id: string;
  slideRef: number;
  title: string;
  subtitle: string;
  points: string[];
}

export interface ThenVsNowItem {
  id: string;
  slideRef: number;
  title: string;
  subtitle: string;
  section: string;
  tag: 'enduring-principle' | 'updated-practice' | 'historical' | 'evolution' | 'comparison' | 'implications';
  points: string[];
}

export interface QuizQuestion {
  id: string;
  section: string;
  slideRef: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  slideRef?: number;
}

export interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  slideRef: number;
}

export interface Reference {
  title: string;
  url: string;
  description: string;
}

export interface KeyTakeaway {
  number: number;
  text: string;
  slideRef: number;
}
