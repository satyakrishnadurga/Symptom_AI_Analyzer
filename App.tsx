import React, { useState, useCallback } from 'react';
import ContactUs from './components/ContactUs';
import { analyzeSymptoms } from './services/geminiService';
import type { SymptomInput, AnalysisResponse } from './types';
import { AnalysisResult } from './components/AnalysisResult';
import { Icon } from './components/Icons';

const ErrorMessage: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
     <div className="max-w-md mx-auto my-10 text-center p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 rounded-lg">
        <Icon type="warning" className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="mt-4 text-xl font-semibold text-red-800 dark:text-red-200">An Error Occurred</h3>
        <p className="mt-2 text-red-700 dark:text-red-300">{message}</p>
        <button
            onClick={onRetry}
            className="mt-6 bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
            Try Again
        </button>
    </div>
);

const SymptomForm: React.FC<{ onSubmit: (data: SymptomInput) => void; isLoading: boolean; }> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SymptomInput & { symptomImage?: File }>({
    age: '',
    weight: '',
    symptoms: '',
    allergies: '',
    symptomImage: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, symptomImage: files && files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="text-center mb-8">
         <Icon type="stethoscope" className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
         <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">Symptom AI Analyzer</h1>
         <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Enter your details below for an AI-powered analysis.</p>
         <div className="mt-6 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-200 p-4 text-left rounded-r-lg" role="alert">
          <p className="font-bold">Disclaimer</p>
          <p>This tool is for informational purposes only and is not a substitute for professional medical advice.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isLoading} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block text-base font-medium text-gray-700 dark:text-gray-300">Age</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" placeholder="e.g., 35" />
            </div>
            <div>
              <label htmlFor="weight" className="block text-base font-medium text-gray-700 dark:text-gray-300">Weight (lbs)</label>
              <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" placeholder="e.g., 150" />
            </div>
          </div>
          {!formData.symptomImage && (
            <>
            <div>
              <label htmlFor="symptoms" className="block text-base font-medium text-gray-700 dark:text-gray-300">Symptoms</label>
              <textarea name="symptoms" id="symptoms" rows={5} value={formData.symptoms} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" placeholder="Describe your symptoms in detail. e.g., 'Sore throat, headache, and a dry cough for 3 days.'"></textarea>
            </div>
            <div>
              <label htmlFor="allergies" className="block text-base font-medium text-gray-700 dark:text-gray-300">Allergies or Pre-existing Conditions</label>
              <textarea name="allergies" id="allergies" rows={3} value={formData.allergies} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base" placeholder="e.g., 'Allergic to penicillin, has asthma.' (Leave blank if none)"></textarea>
            </div>
            </>
          )}
          <div>
            <label htmlFor="symptom-image" className="block text-base font-medium text-gray-700 dark:text-gray-300">Upload Image (optional)</label>
            <input
              type="file"
              name="symptomImage"
              id="symptom-image"
              accept="image/*"
              title="Upload an image for suggestions"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
              onChange={handleChange}
            />
          </div>
        </fieldset>
        <div>
           <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200">
            {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'contact'>('analyzer');
  // ...existing analyzer state and logic...
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [lastSubmission, setLastSubmission] = useState<SymptomInput | null>(null);

  const handleFormSubmit = useCallback(async (data: SymptomInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setLastSubmission(data);
    try {
      const result = await analyzeSymptoms(data);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
      setAnalysisResult(null);
      setError(null);
      setIsLoading(false);
      setLastSubmission(null);
  };
  
  const handleRetry = () => {
    if (lastSubmission) {
      handleFormSubmit(lastSubmission);
    } else {
        handleReset();
    }
  };
  
  const renderAnalyzer = () => {
    if (error) {
      return <ErrorMessage message={error} onRetry={handleRetry} />;
    }
    if (analysisResult) {
      return <AnalysisResult data={analysisResult} onReset={handleReset} />;
    }
    return <SymptomForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
  };

  return (
    <>
      <div className="app-overlay" />
    <main className="min-h-screen container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 rounded-l-lg font-semibold border ${activeTab === 'analyzer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('analyzer')}
        >
          Symptom Analyzer
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg font-semibold border ${activeTab === 'contact' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Us
        </button>
      </div>
      {activeTab === 'analyzer' ? renderAnalyzer() : <ContactUs />}
    </main>
    </>
  );
}

export default App;