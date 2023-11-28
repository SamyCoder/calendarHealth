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

import DataSender from './Dataparser';  // Import DataSender
// import useCollapse from 'react-collapsed';

// function Collapsible() {
//     const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
//     return (
//         <div className="collapsible">
//             <div className="header" {...getToggleProps()}>
//                 {isExpanded ? 'Collapse' : 'Expand'}
//             </div>
//             <div {...getCollapseProps()}>
//                 <div className="content">
//                     Now you can see the hidden content. <br /><br />
//                     Click again to hide...
//                 </div>
//             </div>
//         </div>
//     );
// }

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
                       Left Bar: Corresponding colors for the average heart rate range (bpm)
                    </p>
                    {legendContent.map((item, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-color-box" style={{ backgroundColor: item.color }}></span>
                            <span className="legend-text">{item.text}</span>
                        </div>
                    ))}
                    <p>-----------------------------------------------------</p>
                    <p>
                       Spotify Bar (Right Bar): Green represents users actively listening music
                    </p>
                </div>
            )}
        </div>
    );
};

const AnalyticsButton = () => {
    const [showLegend, setShowAnalytics] = useState(false);

    const analyticsContent = [
        { text: 'Showing some events to stress mappings,music to events to stress mappings' }
        // Add more legend items as needed
    ];

    return (
        <div className="analytics-container">
            <button className="legend-toggle" onClick={() => setShowAnalytics(!showLegend)}>
                Analytics
            </button>

            {showLegend && (
                <div className="analytics-popup">
                    {analyticsContent.map((item, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-text">{item.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function valueToColor(value) {
    if (value === 0)
        return 'white'
    // Define the value thresholds for your color scale
    const lowThreshold = 60;  // Replace with your actual low threshold
    const highThreshold = 120; // Replace with your actual high threshold

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

const hourValues = {
    0: 72,
    1: 77,
    2: 77,
    3: 80,
    4: 80,
    5: 75,
    6: 100,
    7: 70,
    8: 116,
    9: 85,
    10: 75,
    11: 73,
    12: 77,
    13: 83,
    14: 81,
    15: 80,
    16: 72,
    17: 94,
    18: 110,
    19: 100,
    20: 75,
    21: 78,
    22: 0,
    23: 0,
    24: 0,
};

const musicStatusColors = {
    0: 'white',
    1: 'white',
    2: 'white',
    3: 'white',
    4: 'white',
    5: 'white',
    6: 'white',
    7: 'green',
    8: 'white',
    9: 'white',
    10: 'green',
    11: 'green',
    12: 'green',
    13: 'white',
    14: 'white',
    15: 'green',
    16: 'white',
    17: 'white',
    18: 'green',
    19: 'white',
    20: 'green',
    21: 'white',
    22: 'green',
    23: 'white',
    24: 'white',
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

    // Function to close the popup
    const closePopup = () => {
        setShowColorBlockPopup(false);
    };

    const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), allDay: false });
    const [allEvents, setAllEvents] = useState(events);

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

        // Check if the current date matches the date being viewed
        if (true) {
            const hourColors = {};

            // Generate random colors for each hour of the day
            for (let hour = 0; hour < 24; hour++) {
                let color;
                if (hourValues.hasOwnProperty(hour)) {
                    // If the hour exists in hourValues, use its value for color
                    const value = hourValues[hour];
                    color = valueToColor(value);
                } else {
                    // If the hour doesn't exist in hourValues, use a default color
                    color = 'white'; // Replace with any default color you prefer
                }
                hourColors[hour] = color;
            }

            const colorList1 = Object.values(hourColors);
            const colorList2 = Object.values(musicStatusColors);

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


    //Trying to get the current date?? or view??
    const [currentDate, setCurrentDate] = useState(null);
    const handleNavigate = (date) => {
        console.log("You running?????????")
        setCurrentDate(date);

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

            {/* <Collapsible /> */}

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
                onNavigate={handleNavigate}
            />
            <div className="control-panel">
                <LegendButton /> {/* This is the legend button */}
                <AnalyticsButton /> {/* This is the analytics button */}
            </div>
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
                        zIndex: 2,
                    }}
                >
                    {/* Display dynamic data received from DataSender */}
                    {/* {dynamicData.map((dataItem, index) => (
                        <p key={index}>{dataItem}</p>
                    ))} */}
                    <p>Data coming soon ....</p>
                    <p>Current Date: {currentDate && currentDate.toString()}</p>
                </div>
            )}

            {showColorBlockPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                        borderRadius: '5px',
                        zIndex: 2,
                    }}
                >
                    <p>{popupText}</p>
                    <button onClick={closePopup}>Close</button>
                </div>

            )}


        </div>
    );
}

export default App;