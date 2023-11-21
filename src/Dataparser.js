import { useEffect } from 'react';
import Papa from 'papaparse';

const dataMap = new Map();

const DataSender = ({ onDataLoaded }) => {
    useEffect(() => {
        // Function to read CSV file
        const readCsvFile = async () => {
            try {
                const response = await fetch('/database/musicInfoDaily.csv');
                const text = await response.text();

                // Parse CSV data
                Papa.parse(text, {
                    header: true, // Treat the first row as headers
                    complete: (result) => {

                        // Access the parsed data
                        const dynamicData = result.data;

                        dynamicData.forEach(item => {
                            const { date, type, value } = item;
                            if (date !== ""){
                                if (dataMap.has(date)) {
                                    dataMap.get(date).push({ type, value });
                                } else {
                                    dataMap.set(date, [{ type, value }]);
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

export default DataSender;



