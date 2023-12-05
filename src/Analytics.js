import { useState } from 'react';
import { musicStatusColors } from './statusConstants';
import { hourValuesByDate } from './healthConstants';
import { dailyEventsMap } from './eventConstant';

const highThreshold = 100; // High heart rate threshold
const lowThreshold = 50;   // Low heart rate threshold

//Correlation Between Heart Rate and Events
//Heart Rate and Music Listening Correlation
//Consecutive High Heart Rate Analysis

const AnalyticsButton = () => {
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsData, setAnalyticsData] = useState('');

    function analyzeHeartRateEvents(heartRates, events) {
        let highHeartRateEvents = [];
        let lowHeartRateEvents = [];

        for (let hour in heartRates) {
            if (heartRates.hasOwnProperty(hour)) {
                const formattedHour = hour.padStart(2, '0') + ':00';
                const event = events[formattedHour] || "unspecified activity";
                if (heartRates[hour] >= highThreshold) {
                    highHeartRateEvents.push(`At ${formattedHour}, during ${event}, <span style="color: red;">heart rate was high</span> (above ${highThreshold} bpm). \n<span style="color: green;">Possible indication of intense activity or stress.</span>`);
                } else if (heartRates[hour] <= lowThreshold) {
                    lowHeartRateEvents.push(`At ${formattedHour}, during ${event}, heart rate was low (below ${lowThreshold} bpm). \n<span style="color: green;">This could suggest a period of rest or relaxation.</span>`);
                }
            }
        }

        return { highHeartRateEvents, lowHeartRateEvents };
    }

    function analyzeMusicHeartRateCorrelation(heartRates, musicStatus) {
        let correlationReports = [];
        let previousHourRate = 0; // Variable to hold the previous hour's heart rate
    
        for (let hour in heartRates) {
            if (heartRates.hasOwnProperty(hour) && musicStatus.hasOwnProperty(hour)) {
                const currentHourRate = heartRates[hour];
                const formattedHour = hour.padStart(2, '0') + ':00';
    
                if (musicStatus[hour] === 'pink') {
                    if (currentHourRate >= highThreshold) {
                        correlationReports.push(`<span style="color: red;">High heart rate</span> detected with music at ${formattedHour}. \n<span style="color: green;">Music might be influencing elevated heart rate.</span>`);
                    } else if (currentHourRate <= lowThreshold) {
                        correlationReports.push(`Low heart rate detected with music at ${formattedHour}. \n<span style="color: green;">Music could be contributing to a calming effect.</span>`);
                    }
    
                    // Check for a drop in heart rate while listening to music
                    if (previousHourRate > 0 && currentHourRate < previousHourRate) {
                        const dropRate = previousHourRate - currentHourRate;
                        correlationReports.push(`<span style="color: blue;">Drop in heart rate</span> by ${Math.round(dropRate)} bpm detected with music at ${formattedHour}. \n<span style="color: green;">This may indicate a relaxing or calming effect of the music.</span>`);
                    }
                }
    
                previousHourRate = currentHourRate; // Update the previous hour rate for the next iteration
            }
        }
    
        return correlationReports;
    }
    

    function analyzeConsecutiveHighHR(heartRates) {
        let consecutiveHigh = 0;
        let breakSuggestions = [];

        for (let hour in heartRates) {
            if (heartRates.hasOwnProperty(hour)) {
                if (heartRates[hour] >= highThreshold) {
                    consecutiveHigh++;
                    if (consecutiveHigh >= 2) { // Assuming 2 hours of consecutive high HR warrants a break
                        breakSuggestions.push(`Notice: Consecutive high heart rate for ${Math.round(consecutiveHigh)} hours. \n<span style="color: green;">Consider taking a break for relaxation or stress relief.</span>`);
                    }
                } else {
                    consecutiveHigh = 0;
                }
            }
        }

        return breakSuggestions;
    }

    function analyzeAndReportCorrelations(hourValuesByDate, musicStatusColors, dailyEventsMap, date) {
        let reports = [];

        const heartRates = hourValuesByDate[date];
        const musicStatus = musicStatusColors[date];
        const events = dailyEventsMap[date];

        const { highHeartRateEvents, lowHeartRateEvents } = analyzeHeartRateEvents(heartRates, events);
        const musicHeartRateCorrelation = analyzeMusicHeartRateCorrelation(heartRates, musicStatus);
        const breakSuggestions = analyzeConsecutiveHighHR(heartRates);

        reports.push(`<b> --- Analysis for ${date} --- </b>`);
        reports.push(...highHeartRateEvents, ...lowHeartRateEvents, ...musicHeartRateCorrelation, ...breakSuggestions);

        return reports.join('\n');
    }

    const handleAnalytics = () => {
        let allReports = '';
        for (let date in hourValuesByDate) {
            if (hourValuesByDate.hasOwnProperty(date)) {
                allReports += analyzeAndReportCorrelations(hourValuesByDate, musicStatusColors, dailyEventsMap, date) + '\n\n';
            }
        }
        setAnalyticsData(allReports);
        setShowAnalytics(!showAnalytics);
    };

    return (
        <div className="analytics-container">
            <button className="legend-toggle" onClick={handleAnalytics}>
                Show Analytics
            </button>

            {showAnalytics && (
                <div className="analytics-popup">
                    <pre dangerouslySetInnerHTML={{ __html: analyticsData }} />
                </div>
            )}
        </div>
    );
};

export default AnalyticsButton;