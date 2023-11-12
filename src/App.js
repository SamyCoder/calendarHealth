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

// utils.js

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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

function App() {
    const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), allDay: false });
    const [allEvents, setAllEvents] = useState(events);

    function eventPropGetter(event, start, end, isSelected) {
        const style = {
            backgroundColor: 'rgba(0, 121, 191, 0.4)',  // This is the default event color with 60% opacity
            marginLeft: '28px', //NOTE: Can change the marginLeft to Add Spotify item + reduce the width of the bar
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
                hourColors[hour] = getRandomColor(); // Use getRandomColor or any other color generation logic
            }

            // Create a comma-separated list of colors for the repeating gradient
            const colorList = Object.values(hourColors).join(", ");

            // Set the background style for the day cell
            dayProps.style = {
                backgroundImage: `linear-gradient(${colorList})`,
                backgroundSize: "30px 100%", // Adjust the width and height of the strip
                backgroundRepeat: "no-repeat",

            };
        }

        return dayProps;
    }


    function handleSpotifyButton(timestamp){

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
            /*
                console.log(d1 <= d2);
                console.log(d2 <= d3);
                console.log(d1 <= d4);
                console.log(d4 <= d3);
                  */

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
                {/* Spotify button Element*/}
                <button
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px', 
                        zIndex: 1,  // For the button to be above other content
                        borderRadius: '50%',
                        backgroundColor: '#1DB954',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={handleSpotifyButton()} //NOTE: See how to get time/date pass, then use timestamp to access song info
                >
                    {/* <div dangerouslySetInnerHTML={{ __html: spotifyLogoSvg }} /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
                    </svg>
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
        </div>
    );
}

export default App;
