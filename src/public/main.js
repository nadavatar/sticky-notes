let stickyNotes = [];

getStickyNotes()
.then(_stickyNotes => {
    stickyNotes = _stickyNotes;
    renderList();
});


function addStickyNote() {
    const contentElement = document.getElementById('stickyNoteContent');

    // take the content
    const content = contentElement.value;
    
    // add to the sticky note list
    stickyNotes.push({
        content,
        id: Date.now(),
    });
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));

    // Render list
    renderList();

    document.getElementById('stickyNoteContent').value = '';
}

const addButton = document.getElementById('addStickyNote');
addButton.addEventListener('click', addStickyNote);
enterClick = document.getElementById('stickyNoteContent');
enterClick.addEventListener('keypress', function(e){
    if (e.keyCode == 13){
        addStickyNote();
    }
})

const stickyNotesHtmlTemplate = `
<table class="table">
    <thead>
        <th>Id</th>
        <th>Content</th>
        <th></th>
        <tbody>
            {{notesPlaceholder}}
        </tbody>
        
    </thead>
</table>
`;

function renderList() {
    const stickyNotesHtmlRendered = stickyNotesHtmlTemplate.replace('{{notesPlaceholder}}', getStickyNotesRows());
    document.getElementById('stickyNotesContainer').innerHTML = stickyNotesHtmlRendered;
}   

function getStickyNotesRows() {
    let html = '';

    for (let index = 0; index < stickyNotes.length; index++) {
    const stickyNote = stickyNotes[index];
        
        html += `
            <tr id="stickyNote-${stickyNote.id}">
                <td>${stickyNote.id}</td>
                <td>
                    <span class="sticky-content non-edit-element">${stickyNote.content}</span>
                    <input class="sticky-content-input form-control edit-element" value="${stickyNote.content}" />
                </td>
                <td>
                    <i class="clickable glyphicon glyphicon-check edit-element" onclick="updateStickyNote(${stickyNote.id})"></i>
                    <i class="clickable glyphicon glyphicon-pencil sticky-pencil non-edit-element" onclick="toggleEditMode(${stickyNote.id})"></i>
                    <i class="clickable glyphicon glyphicon-trash" onclick="deleteStickyNote(${stickyNote.id})"></i>
                    
                </td>
            </tr>
        `;
        
    }

    return html;
}

function toggleEditMode(stickyNoteId) {
    // Toggle edit mode
    const stickyNoteRow = document.getElementById(`stickyNote-${stickyNoteId}`);
    stickyNoteRow.classList.add('edit-mode');
}

function updateStickyNote(stickyNoteId) {
    const stickyNoteContent = document.querySelector(`#stickyNote-${stickyNoteId} .sticky-content-input`);
    for (let i = 0; i < stickyNotes.length; i++) {
        const stickyNote = stickyNotes[i];
        if (stickyNote.id === stickyNoteId) {
            stickyNote.content = stickyNoteContent.value;
            break;
        }

    }
    setData('stickyNotes', stickyNotes);
    renderList();

}

function deleteStickyNote(stickNoteId) {
    // Remove note from list
    stickyNotes = stickyNotes.filter(stickyNote => stickyNote.id !== stickNoteId);

    renderList();

    setData('stickyNotes', stickyNotes);
}


function getStickyNotes() {
    try {
        return fetch('sticky-notes')
                .then(response => response.json());
    }
    catch (e) {
        return null;
    }
}

function setData(dataName, dataValue) {
    localStorage.setItem(dataName, JSON.stringify(dataValue));
}