import React from 'react';

interface IconProps {
    type: 'warning' | 'pill' | 'stethoscope' | 'clipboard' | 'firstAid' | 'doctor' | 'ambulance' | 'link' | 'food';
    className?: string;
}

export const Icon: React.FC<IconProps> = ({ type, className = "w-6 h-6" }) => {
    switch (type) {
        case 'warning':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            );
        case 'pill':
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.25,3A3.25,3.25,0,0,0,3,6.25v3.5A3.25,3.25,0,0,0,5,12.55V12a1,1,0,0,1,2,0v0.55A3.25,3.25,0,0,0,9.75,16h4.5A3.25,3.25,0,0,0,17,13.25V13a1,1,0,0,1,2,0v0.25a3.25,3.25,0,0,0,2.75-2.8V6.25A3.25,3.25,0,0,0,18.5,3Z"></path>
                </svg>
            );
        case 'stethoscope':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 15v-3a7 7 0 00-14 0v3m14 0l-1.5-1.5M5 15l1.5-1.5M12 3V2m0 20v-1m0 0a5 5 0 005-5V9a5 5 0 10-10 0v5a5 5 0 005 5zm-5-5h10" />
                </svg>
            );
        case 'clipboard':
             return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            );
        case 'firstAid':
             return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.75l-7.5-7.5-7.5 7.5m15-4.5l-7.5 7.5-7.5-7.5" />
                    <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 8v12h18V8L12 2zm4 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" />
                </svg>
            );
        case 'doctor':
             return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4 2 2 0 000-4zm0 8a3 3 0 100 6 3 3 0 000-6zm-7 6h14a2 2 0 002-2v-3a2 2 0 00-2-2h-2.11a5.01 5.01 0 01-9.78 0H5a2 2 0 00-2 2v3a2 2 0 002 2z" />
                </svg>
            );
        case 'ambulance':
             return (
                 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="none" fill="currentColor"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H4v-4h6m-3-3v6M14 14h6m-3-3v6" />
                </svg>
            );
        case 'link':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            );
        case 'food':
             return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
             );
        default:
            return null;
    }
};