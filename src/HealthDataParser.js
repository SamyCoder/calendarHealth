import { useEffect } from 'react';
import Papa from 'papaparse';

const dataMap = new Map();

const HealthDataSender = ({ onDataLoaded }) => {
    useEffect(() => {
        // Function to read CSV file
        const readCsvFile = async () => {
            try {
                const response = await fetch('/database/User2S.csv');
                const text = await response.text();

                // Parse CSV data
                Papa.parse(text, {
                    header: true, // Treat the first row as headers
                    complete: (result) => {

                        // Access the parsed data
                        const dynamicData = result.data;

                        dynamicData.forEach(item => {
                            const {date,hour,average,minimum,maximum } = item;
                            if (date !== ""){
                                if (dataMap.has(date)) {
                                    dataMap.get(date).push({ hour,average,minimum,maximum});
                                } else {
                                    dataMap.set(date, [{ hour,average,minimum,maximum }]);
                                }
                            }
                        });

                        console.log(dataMap);

                        onDataLoaded(dataMap);
                    },
                    error: (error) => {
                        console.error('Error parsing CSV:', error.message);
                    },
                });
            } catch (error) {
                console.error('Error reading CSV file:', error);
            }
        };

        // Call the function to read CSV file
        readCsvFile();
    }, []);

    // This component doesn't render anything
    return null;
};

export default HealthDataSender;


