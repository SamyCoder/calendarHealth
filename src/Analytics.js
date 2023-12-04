import { useState } from 'react';
import {hourValuesByDate} from './hourValuesByDate'
import {musicStatusColors} from './musicStatusColors'
import dailyEventsMap from './dailyEventsMap';

const AnalyticsButton = () => {
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsData, setAnalyticsData] = useState('');
    function analyzeAndReportCorrelations(hourValuesByDate, musicStatusColors, dailyEventsMap, date) {
        const highThreshold = 116;
        const lowThreshold=60;
        let reports = [];
    
        const heartRates = hourValuesByDate[date];
        const musicStatus = musicStatusColors[date];
        const events = dailyEventsMap[date];
    
        for (let hour in heartRates) {
            if (heartRates.hasOwnProperty(hour) && heartRates[hour] >= highThreshold) {
                const formattedHour = hour.padStart(2, '0') + ':00'; // Convert hour to "HH:00" format
                const event = events[formattedHour] || "no specific event";
                const listeningToMusic = musicStatus[hour] === 'pink' ? 'while listening to music' : 'without listening to music';
    
                reports.push(`At ${formattedHour}, during ${event}, the heart rate was above the high threshold ${listeningToMusic}.`);
            }
        }
        for (let hour in heartRates) {
            if (heartRates.hasOwnProperty(hour) && heartRates[hour] <= lowThreshold && heartRates[hour] !=0 ) {
                const formattedHour = hour.padStart(2, '0') + ':00'; // Convert hour to "HH:00" format
                const event = events[formattedHour] || "no specific event";
                const listeningToMusic = musicStatus[hour] === 'pink' ? 'while listening to music' : 'without listening to music';
    
                reports.push(`At ${formattedHour}, during ${event}, the heart rate was above the low threshold ${listeningToMusic}.`);
            }
        }
    
        return reports.join('\n');
    }

    const handleAnalytics = () => {
        let allReports = '';
        for (let date in hourValuesByDate) {
            if (hourValuesByDate.hasOwnProperty(date)) {
                allReports += `Date: ${date}\n` + analyzeAndReportCorrelations(hourValuesByDate, musicStatusColors, dailyEventsMap, date) + '\n\n';
            }
        }
        setAnalyticsData(allReports);
        setShowAnalytics(!showAnalytics);
    };

    return (
        <div className="analytics-container">
            <button className="legend-toggle" onClick={handleAnalytics}>
                Analytics
            </button>

            {showAnalytics && (
                <div className="analytics-popup">
                    <pre>{analyticsData}</pre>
                </div>
            )}
        </div>
    );
};

export default AnalyticsButton;