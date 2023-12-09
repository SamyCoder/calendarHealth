
import hourValuesByDate from './hourValuesByDate';
import musicStatusColors from './musicStatusColors';
import dailyEventsMap from './dailyEventsMap';

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLegend } from 'victory';

import DataSender from './Dataparser';  // Import DataSender
import HealthDataSender from "./HealthDataParser";


import DataSender from './Dataparser';  // Import DataSender
import HealthDataSender from "./HealthDataParser";

import AnalyticsButton from './Analytics';
import Notes from "./Notes";


console.log(hourValuesByDate); 
const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const events = [
    {
        title: "Big Meeting",
        allDay: true,
        start: new Date(2021, 6, 0),
        end: new Date(2021, 6, 0),
    },
    {
        title: "Vacation",
        start: new Date(2021, 6, 7),
        end: new Date(2021, 6, 10),
    },
    {
        title: "Conference",
        start: new Date(2021, 6, 20),
        end: new Date(2021, 6, 23),
    },
];


/**
 * This component deals with the legend button and data
 * @returns 
 */
const LegendButton = () => {
    const [showLegend, setShowLegend] = useState(false);

    const legendContent = [
        { color: 'rgb(0, 0, 255)', text: 'Less than 55' },
        { color: 'rgb(255, 255, 0)', text: '55 to 85' },
        { color: 'rgb(0, 255, 0)', text: '85 to 116' },
        { color: 'rgb(255, 0, 0)', text: 'More than 116' },
        // Add more legend items as needed
    ];

    return (
        <div className="legend-container">
            <button className="legend-toggle" onClick={() => setShowLegend(!showLegend)}>
                Legend
            </button>

            {showLegend && (
                <div className="legend-popup">
                    <p>
                        <b>Calendar View</b>
                    </p>
                    <p>
                        <b>Left Bar:</b>Corresponding colors for the average heart rate range (bpm)
                    </p>
                    {legendContent.map((item, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-color-box" style={{ backgroundColor: item.color }}></span>
                            <span className="legend-text">{item.text}</span>
                        </div>
                    ))}
                    <p>-----------------------------------------------------</p>
                    <p>
                        <b>Spotify Bar</b> (Right Bar): Pink represents users actively listening music
                    </p>
                    <p>-----------------------------------------------------</p>
                    <p><b>Buttons</b></p>
                    <p>
                        <b>Analytics:</b> Connection between Events, Health, and Music choices.
                    </p>
                    <p>
                        <b>Health Data:</b> Per Day graph for a week display
                    </p>
                    <p>
                        <b>Spotify Button:</b> Spotify data for the week
                    </p>
                </div>
            )}
        </div>
    );
};

/**
 * Here we will deal with event rendering
 * @returns 
 */

function convertHourlyMapToEvents(dailyEventsMap) {
    const events = [];
    for (const [dateString, hoursMap] of Object.entries(dailyEventsMap)) {
        for (const [hourString, title] of Object.entries(hoursMap)) {
            const [hours, minutes] = hourString.split(':').map(Number);
            const dateParts = dateString.split('-').map(Number);
            const year = dateParts[0], month = dateParts[1] - 1, day = dateParts[2]; // Adjusting month -1 for JS Date

            const startDate = new Date(year, month, day, hours, minutes);
            const endDate = new Date(year, month, day, hours, minutes + 60); // Can change events here as needed

            events.push({
                title,
                start: startDate,
                end: endDate,
                allDay: false
            });
        }
    }
    return events;
}

/**
 * For getting the color value for the Health heat Map
 * @param {*} value 
 * @returns 
 */
function valueToColor(value) {
    if (value === 0)
        return 'white'
    // Define the value thresholds for your color scale
    const lowThreshold =70;  // Replace with your actual low threshold
    const highThreshold = 100; // Replace with your actual high threshold

    // Calculate the ratio of where the value falls between the low and high threshold
    let ratio = (value - lowThreshold) / (highThreshold - lowThreshold);

    // Define your colors for the lowest and highest values and for mid-range values
    const lowColor = { r: 0, g: 0, b: 255 }; // Blue color for low values
    const highColor = { r: 255, g: 0, b: 0 }; // Red color for high values

    // You can define more colors for a more complex gradient
    const midColor1 = { r: 255, g: 255, b: 0 }; // Yellow
    const midColor2 = { r: 0, g: 255, b: 0 }; // Green

    // Determine which two colors to use for interpolation
    let startColor, endColor;
    if (ratio < 0.5) {
        startColor = lowColor;
        endColor = midColor2;
        // Adjust ratio to work with the new range
        ratio = ratio * 2;
    } else {
        startColor = midColor1;
        endColor = highColor;
        // Adjust ratio to work with the new range
        ratio = (ratio - 0.5) * 2;
    }

    // Interpolate between the two colors
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

    return `rgb(${r},${g},${b})`;
}

const formatXTick = (tick, index, ticks) => {
    // Display a tick every 3 hours, or whatever makes sense for your data
    const totalTicks = ticks.length;
    const everyNth = Math.ceil(totalTicks / 6);
    return index % everyNth === 0 ? `${tick}:00` : '';
};

function App() {

    // At the top of your component, where you have other useState hooks
    const [showColorBlockPopup, setShowColorBlockPopup] = useState(false);
    const [popupText, setPopupText] = useState("");

    // Handler that toggles the popup and sets the text
    const handleColorBlockClick = (text) => {
        setPopupText(text);
        setShowColorBlockPopup(true);
    };

    const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), allDay: false });
    const [allEvents, setAllEvents] = useState(events);
    // Assuming you have a particular date you're adding events to
    const specificDay = new Date(2023, 10, 19); // Replace with the specific date

    useEffect(() => {
        const hourlyEvents = convertHourlyMapToEvents(dailyEventsMap, specificDay);
        setAllEvents([...allEvents, ...hourlyEvents]);
    }, []);

    function eventPropGetter(event, start, end, isSelected) {
        const style = {
            backgroundColor: 'rgba(0, 121, 191, 0.5)', // Custom event color with 50% opacity
            color: 'white', // White text color for better readability
            border: '1px solid #0a407b', // A darker border color than the background
            padding: '2px 5px', // Top and bottom padding of 2px, left and right padding of 5px
            borderRadius: '5px', // Rounded corners
            fontSize: '1rem', // Smaller font size
            textOverflow: 'ellipsis', // Add an ellipsis when the text is too long
            whiteSpace: 'nowrap', // Keep the event text on a single line
            overflow: 'hidden', // Hide overflowed content
            textAlign: 'left', // Center-align text
            marginLeft: '68px', // Left margin of 68px
        };
        return {
            style: style
        };
    }

    function dayPropGetter(date) {
        // console.log(date)

        const dayProps = {};
        console.log(date)
        const dateString = format(date, 'yyyy-MM-dd');
        const hourValueMap = hourValuesByDate[dateString] || {};

        // Check if the current date matches the date being viewed
        if (hourValuesByDate.hasOwnProperty(dateString)) {
            const hourColors = {};

            // Generate random colors for each hour of the day
            for (let hour = 0; hour < 24; hour++) {
                let color;
                const value = hourValueMap[hour];
                color = valueToColor(value);

                hourColors[hour] = color;
            }

            const colorList1 = Object.values(hourColors);
            const colorList2 = Object.values(musicStatusColors[dateString]);

            // Function to create a linear gradient for a single color
            // const createLinearGradient = (colors) => `linear-gradient(${colors.join(', ')})`;
            const createLinearGradient = (colors) => {
                var start = -4;
                var end = 0;
                let colorStops = colors.map((color, index) => {
                    // Adjust the start and end percentage for each color by the offset

                    start = start + 4.166;
                    end = end + 4.166;
                    return `${color} ${start}%, ${color} ${end}%`;
                });

                return `linear-gradient(${colorStops.join(', ')})`;
            };

            // Create linear gradients for each color list
            const gradient1 = createLinearGradient(colorList1);
            const gradient2 = createLinearGradient(colorList2);

            // Here, you could determine what text to show when the block is clicked
            let popupTextForThisBlock = "Some details about this block..."; // Customize this as needed


            // Setting the background style for the day cell for 2 colors
            dayProps.style = {
                backgroundImage: `${gradient1}, ${gradient2}`,
                backgroundSize: "30px 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 0, 35px 0",
                position: 'relative',
            };

            // Use a style object that includes an onClick event handler
            dayProps.style = {
                ...dayProps.style,
                cursor: 'pointer', // Change cursor to indicate clickable
                onClick: () => handleColorBlockClick(popupTextForThisBlock),
            };

        }

        return dayProps;

    }

    //UI for Spotify Analytics Display
    const [showPopup, setShowPopup] = useState(false);
    function handleSpotifyButton() {
        setShowPopup(!showPopup);
    }
    // Callback function to receive dynamic data from DataSender
    /*
        NOTE: This dynamic data is a map with key: date and value is an array
        with {type: 'artist', value: 'Shawn Mendes: 2 times'} format. 
        It will store the value once, then we can use this in the rendering
    */
    const [dynamicData, setDynamicData] = useState([]);
    const handleDataLoaded = (data) => {
        setDynamicData(data);
    };

    //UI for Health data Display
    const [showHealthData, setShowHealthData] = useState(false);
    function handleHealthDataButton() {
        setShowHealthData(!showHealthData);
    }

    const [dynamicHealthData, setDynamicHealthData] = useState([]);
    const handleHealthDataLoaded = (data) => {
        setDynamicHealthData(data);
    };


    function handleSelectSlot(slotInfo) {
        const title = window.prompt('Please enter event name');
        if (title) {
            const newEvent = {
                title,
                start: slotInfo.start,
                end: slotInfo.end,
                allDay: slotInfo.slots.length === 1  // if only one slot is selected, consider it as allDay event
            };
            setAllEvents([...allEvents, newEvent]);
        }
    }

    function handleSelectEvent(event) {
        const confirmDelete = window.confirm(`Do you really want to delete the event: "${event.title}"?`);
        if (confirmDelete) {
            setAllEvents(prevEvents => prevEvents.filter(e => e !== event));
        }
    }

    function handleAddEvent() {

        for (let i = 0; i < allEvents.length; i++) {

            const d1 = new Date(allEvents[i].start);
            const d2 = new Date(newEvent.start);
            const d3 = new Date(allEvents[i].end);
            const d4 = new Date(newEvent.end);

            if (
                ((d1 <= d2) && (d2 <= d3)) || ((d1 <= d4) &&
                    (d4 <= d3))
            ) {
                alert("CLASH");
                break;
            }

        }


        setAllEvents([...allEvents, newEvent]);
    }

    return (
        <div className="App">

            <h1>Calendar</h1>
            <h2>Add New Event</h2>
            <div>
                <input type="text" placeholder="Add Title" style={{ width: "20%", marginRight: "10px" }} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                <DatePicker placeholderText="Start Date" style={{ marginRight: "10px" }} selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} />
                <DatePicker placeholderText="End Date" selected={newEvent.end} onChange={(end) => setNewEvent({ ...newEvent, end })} />
                <button stlye={{ marginTop: "10px" }} onClick={handleAddEvent}>
                    Add Event
                </button>
            </div>

            <Calendar
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                // Add the toolbar with view options
                toolbar
                // Add the dayPropGetter to customize day rendering
                dayPropGetter={dayPropGetter}
                eventPropGetter={eventPropGetter}
                selectable={true}  // make the calendar selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
            />

            <div className="control-panel">
                <LegendButton /> {/* This is the legend button */}
                <AnalyticsButton /> {/* This is the analytics button */}
            </div>

            <div className="control-panel2">
                {/* Spotify button Element*/}
                <button
                    style={{
                        position: 'absolute',
                        bottom: '50px',
                        right: '60px',
                        //zIndex: 1,  // For the button to be above other content
                        borderRadius: '50%',
                        backgroundColor: '#1DB954',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={handleSpotifyButton} //NOTE: See how to get time/date pass, then use timestamp to access song info
                >
                    {/* <div dangerouslySetInnerHTML={{ __html: spotifyLogoSvg }} /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
                    </svg>
                </button>


                <DataSender onDataLoaded={handleDataLoaded} />
                {showPopup && (
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '70px',
                            right: '10px',
                            backgroundColor: 'white',
                            padding: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                            borderRadius: '5px',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 100px)',
                            zIndex: 2000,
                        }}
                    >
                        {/* Display dynamic data received from DataSender */}
                        {/* {Object.entries(dynamicData).map(([key, value], index) => (
                        <p key={index}>
                            <strong>{key}:</strong>
                        </p>
                    ))} */}
                        {Array.from(dynamicData.entries()).map(([date, items], index) => (
                            <div key={index}>
                                <p style={{ fontSize: '12px' }}><b>Date:</b> {date}</p>
                                <p style={{ fontSize: '12px' }}>
                                    <b>Top Artists:</b> {items.filter(item => item.type === 'artist').map(item => item.value).join(', ')}
                                </p>
                                <p style={{ fontSize: '12px' }}>
                                    <b>Top Albums:</b> {items.filter(item => item.type === 'album').map(item => item.value).join(', ')}
                                </p>
                                <hr />
                            </div>
                        ))}
                        {/* <p>Data coming soon ....</p> */}
                        {/* <p>Current Date: {currentDate && currentDate.toString()}</p> */}
                    </div>
                )}

                {/*Health data*/}
                <button
                    style={{
                        position: 'relative',
                        bottom: '40px', // Adjust as needed for spacing from the bottom
                        right: '10px', // Adjust as needed for spacing from the right
                        zIndex: 1, // For the button to be above other content
                        borderRadius: '4px', // Slight rounding of corners for aesthetics
                        backgroundColor: '#ADD8E6', // Light blue background
                        color: '#000', // White text color
                        padding: '10px 20px', // Padding inside the button for top/bottom and left/right
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem', // Adjust font size as needed
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Optional shadow for depth
                    }}
                    onClick={handleHealthDataButton}
                >
                    Health Data
                </button>
                <HealthDataSender onDataLoaded={handleHealthDataLoaded} />
                {showHealthData && (
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '70px',
                            right: '10px',
                            backgroundColor: 'white',
                            padding: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                            borderRadius: '5px',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 100px)',
                            zIndex: 2000,
                        }}
                    >
                        {/* Render your custom health data charts here, ensuring they're in a scrollable container IMPORTANT DO yarn add victory */}
                        <div style={{
                            overflowY: 'scroll',
                            maxHeight: '800px',
                            backgroundColor: 'white',
                            zIndex: 2000,
                            position: 'relative',
                            border: '1px solid #ccc',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                            boxSizing: 'border-box',
                            marginTop: '20px'
                        }}>
                            {Array.from(dynamicHealthData.entries()).map(([date, hourlyData], index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>Date: {date}</h4>
                                    <VictoryChart
                                        theme={VictoryTheme.material}

                                        //domainPadding={20}
                                        //TODO: !!! see issue here?
                                        containerComponent={
                                            <VictoryVoronoiContainer
                                                voronoiDimension="x"
                                                labels={({ datum }) => {
                                                    // Assuming 'datum' has a structure like { hour, average, minimum, maximum }
                                                    return `Hour: ${datum.hour}\nAvg: ${datum.average}\nMin: ${datum.minimum}\nMax: ${datum.maximum}`;
                                                }}
                                                labelComponent={<VictoryTooltip flyoutStyle={{ fill: "white" }} constrainToVisibleArea />}
                                            />
                                        }
                                    >
                                        <VictoryAxis
                                            tickFormat={formatXTick}
                                            style={{
                                                tickLabels: { fontSize: 10, padding: 5, angle: -45 },
                                                axisLabel: { fontSize: 12, padding: 30 }
                                            }}
                                            label="Hour"
                                        />
                                        <VictoryAxis
                                            dependentAxis
                                            tickFormat={(tick) => Math.round(tick)}
                                            tickCount={5}
                                            style={{
                                                tickLabels: { fontSize: 10, padding: 5 },
                                                axisLabel: { fontSize: 12, padding: 30 }
                                            }}
                                            label="Heart Rate"
                                        />
                                        <VictoryLegend x={50} y={0}
                                            orientation="horizontal"
                                            gutter={20}
                                            style={{ border: { stroke: "black" }, title: { fontSize: 14 } }}
                                            data={[
                                                { name: "Average", symbol: { fill: "#8884d8" } },
                                                { name: "Minimum", symbol: { fill: "#82ca9d" } },
                                                { name: "Maximum", symbol: { fill: "#f5222d" } }
                                            ]}
                                        />
                                        <VictoryLine
                                            data={hourlyData}
                                            x="hour"
                                            y="average"
                                            style={{ data: { stroke: "#8884d8" } }}
                                        />
                                        <VictoryLine
                                            data={hourlyData}
                                            x="hour"
                                            y="minimum"
                                            style={{ data: { stroke: "#82ca9d" } }}
                                        />
                                        <VictoryLine
                                            data={hourlyData}
                                            x="hour"
                                            y="maximum"
                                            style={{ data: { stroke: "#f5222d" } }}
                                        />
                                    </VictoryChart>
                                </div>
                            ))}
                        </div>

                        {/* You can map over data or display it in any format you want */}
                    </div>
                )}
            </div>

            <div className="control-panel3">
                <Notes /> {/* This is the Notes button */}
            </div>

        </div>
    );
}

export default App;