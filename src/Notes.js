// Notes.js
import React, { useState, useEffect } from 'react';

const Notes = () => {

    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    // Load notes from local storage on component mount
    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        setNotes(storedNotes);
    }, []);

    // Save notes to local storage whenever notes are updated
    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const handleAddNote = () => {
        if (newNote.trim() !== '') {
            setNotes([...notes, newNote]);
            setNewNote('');
        }
    };

    const handleDeleteNote = (index) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
    };

    const handleShowNotes = () => {
        setShowNotes(!showNotes);
    }

    return (
        <div className={`notes-container`}>
            <button class= "legend-toggle" style={{ marginLeft: 10 }} onClick={() => handleShowNotes()}>{
                showNotes ? "Hide Notes" : "Show Notes"
            }</button>
            {showNotes && (
                <div>
                    <textarea
                        placeholder="Type your note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button style={{ marginLeft: 10 }} onClick={handleAddNote}>Add Note</button>
                    <ul>
                        {notes.map((note, index) => (
                            <li style={{ textAlign: 'left' }} key={index}>
                                {note}
                                <button style={{ marginLeft: 10 }} onClick={() => handleDeleteNote(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notes;