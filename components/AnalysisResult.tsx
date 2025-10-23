import React from 'react';
import type { AnalysisResponse, PossibleCause, StructuredSymptom, TriageRecommendation, MedicationOption, FoodSuggestion } from '../types';
import { TriageLevel } from '../types';
import { Icon } from './Icons';

interface AnalysisResultProps {
  data: AnalysisResponse;
  onReset: () => void;
}

const TriageCard: React.FC<{ recommendation: TriageRecommendation }> = ({ recommendation }) => {
    const config = {
        [TriageLevel.SELF_CARE]: {
            bgColor: 'bg-green-100 dark:bg-green-900/50',
            borderColor: 'border-green-500 dark:border-green-400',
            textColor: 'text-green-800 dark:text-green-200',
            title: 'Recommendation: Self-Care',
            icon: <Icon type="firstAid" className="w-8 h-8 text-green-600 dark:text-green-400" />
        },
        [TriageLevel.SEE_PRIMARY_CARE]: {
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
            borderColor: 'border-yellow-500 dark:border-yellow-400',
            textColor: 'text-yellow-800 dark:text-yellow-200',
            title: 'Recommendation: See Primary Care Doctor',
            icon: <Icon type="doctor" className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        },
        [TriageLevel.EMERGENCY]: {
            bgColor: 'bg-red-100 dark:bg-red-900/50',
            borderColor: 'border-red-500 dark:border-red-400',
            textColor: 'text-red-800 dark:text-red-200',
            title: 'Recommendation: Seek Emergency Care',
            icon: <Icon type="ambulance" className="w-8 h-8 text-red-600 dark:text-red-400" />
        },
    };

    const currentConfig = config[recommendation.level] || config[TriageLevel.SEE_PRIMARY_CARE];

    return (
        <div className={`border-l-4 ${currentConfig.borderColor} ${currentConfig.bgColor} p-6 rounded-lg shadow-md mb-8`}>
            <div className="flex items-center">
                {currentConfig.icon}
                <h2 className={`ml-4 text-2xl font-bold ${currentConfig.textColor}`}>{currentConfig.title}</h2>
            </div>
            <p className={`mt-3 text-lg ${currentConfig.textColor}`}>{recommendation.reason}</p>
        </div>
    );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="ml-3 text-xl font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        </div>
        {children}
    </div>
);

const SymptomsSummary: React.FC<{ symptoms: StructuredSymptom[] }> = ({ symptoms }) => (
    <Section title="Symptom Summary" icon={<Icon type="clipboard" className="w-6 h-6 text-blue-500" />}>
        <ul className="space-y-3">
            {symptoms.map((symptom, index) => (
                <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-lg">{symptom.name}</span>
                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                         <span className="text-sm text-gray-500 dark:text-gray-400">Severity: <span className="font-semibold text-gray-600 dark:text-gray-300">{symptom.severity}</span></span>
                         <span className="text-sm text-gray-500 dark:text-gray-400">Duration: <span className="font-semibold text-gray-600 dark:text-gray-300">{symptom.duration_days} days</span></span>
                    </div>
                </li>
            ))}
        </ul>
    </Section>
);

const LikelihoodBar: React.FC<{ value: number }> = ({ value }) => {
    const barColor = value >= 0.9 ? 'bg-red-500' : value >= 0.7 ? 'bg-yellow-500' : 'bg-green-500';
    
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${value * 100}%` }}></div>
        </div>
    );
};

const PossibleCauses: React.FC<{ causes: PossibleCause[] }> = ({ causes }) => (
    <Section title="Possible Causes" icon={<Icon type="stethoscope" className="w-6 h-6 text-blue-500" />}>
        <div className="space-y-6">
            {causes.map((cause, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{cause.condition}</h4>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{(cause.likelihood * 100).toFixed(0)}% Likelihood</span>
                    </div>
                    <LikelihoodBar value={cause.likelihood} />
                    <div className="mt-4">
                        <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Supporting Symptoms:</h5>
                        <div className="flex flex-wrap gap-2">
                            {cause.supporting_symptoms.map((s, i) => <span key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{s}</span>)}
                        </div>
                    </div>
                     <div className="mt-4">
                        <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">References:</h5>
                        <ul className="space-y-1">
                            {cause.references.map((ref, i) => {
                                let hostname: string;
                                try {
                                    if (!ref || typeof ref !== 'string' || !ref.startsWith('http')) {
                                        throw new Error('Invalid URL format');
                                    }
                                    hostname = new URL(ref).hostname;
                                } catch (e) {
                                    console.error(`Invalid URL provided by AI: ${ref}`, e);
                                    return (
                                        <li key={i}>
                                            <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                                                <Icon type="warning" className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                                <span className="truncate">Invalid Reference Link</span>
                                            </span>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={i}>
                                        <a href={ref} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                            <Icon type="link" className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                            <span className="truncate" title={ref}>{hostname}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    </Section>
);

const MedicationOptions: React.FC<{ medications: MedicationOption[] }> = ({ medications }) => (
     <Section title="Medication Options" icon={<Icon type="pill" className="w-6 h-6 text-blue-500" />}>
        {medications.length > 0 ? (
            <div className="space-y-4">
                {medications.map((med, index) => {
                    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(med.name)}`;
                    return (
                         <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{med.name}</h4>
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-1">{med.purpose}</p>
                            <a href={googleSearchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                Learn More <Icon type="link" className="w-4 h-4 ml-1.5" />
                            </a>
                         </div>
                    );
                })}
            </div>
        ) : <p className="text-gray-500 dark:text-gray-400">No specific medications suggested. Please consult a doctor.</p>}
     </Section>
);

const FoodSuggestions: React.FC<{ food: FoodSuggestion }> = ({ food }) => (
    <Section title="Dietary Suggestions" icon={<Icon type="food" className="w-6 h-6 text-green-500" />}>
        {food.suggestions.length > 0 ? (
            <>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">{food.reason}</p>
                <ul className="space-y-2">
                    {food.suggestions.map((item, i) => (
                        <li key={i} className="flex items-start">
                             <span className="mr-2 text-green-500">&#10003;</span>
                             <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>
            </>
        ) : <p className="text-gray-500 dark:text-gray-400">No specific dietary suggestions available.</p>}
    </Section>
);

const WarningDisclaimer: React.FC<{ warnings: string[] }> = ({ warnings }) => (
    <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 rounded-md shadow-sm">
        <div className="flex">
            <div className="flex-shrink-0">
                 <Icon type="warning" className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium">
                    {warnings.join(' ')}
                </p>
            </div>
        </div>
    </div>
);


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in">
            <TriageCard recommendation={data.triage_recommendation} />
            <SymptomsSummary symptoms={data.structured_symptoms} />
            <PossibleCauses causes={data.possible_causes} />
            <MedicationOptions medications={data.medication_options} />
            {data.food_suggestions && <FoodSuggestions food={data.food_suggestions} />}
            <div className="mt-8">
                <WarningDisclaimer warnings={data.warnings} />
            </div>
            <div className="mt-8 text-center">
                <button 
                    onClick={onReset}
                    className="bg-blue-600 text-white font-bold py-3 px-8 text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Analyze New Symptoms
                </button>
            </div>
        </div>
    );
};