import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

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
                    {legendContent.map((item, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-color-box" style={{ backgroundColor: item.color }}></span>
                            <span className="legend-text">{item.text}</span>
                        </div>
                    ))}
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
                <div className="legend-popup">
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
    21: 78
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
    const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), allDay: false });
    const [allEvents, setAllEvents] = useState(events);

    function eventPropGetter(event, start, end, isSelected) {
        const style = {
            backgroundColor: 'rgba(0, 121, 191, 0.4)',  // This is the default event color with 60% opacity
            marginLeft: '28px',
        };
        return {
            style: style
        };
    }

    function dayPropGetter(date) {
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
            const createLinearGradient = (colors) => `linear-gradient(${colors.join(', ')})`;

            // Create linear gradients for each color list
            const gradient1 = createLinearGradient(colorList1);
            const gradient2 = createLinearGradient(colorList2);

            // Setting the background style for the day cell for 2 colors
            dayProps.style = {
                backgroundImage: `${gradient1}, ${gradient2}`,
                backgroundSize: "30px 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 0, 35px 0",
                position: 'relative',
            };

        }

        return dayProps;

    }

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
            // components={{
            //     dateCellWrapper: DateCellWrapper // Here we are passing our custom wrapper component
            //   }}
            />
            <div className="control-panel">
                <LegendButton /> {/* This is the legend button */}
                <AnalyticsButton /> {/* This is the analytics button */}
            </div>
        </div>
    );
}

export default App;