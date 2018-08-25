var stickyNotes = [
    {
        id: Date.now(),
        content: 'Do Something'
    },
    {
        id: Date.now() + 1,
        content: 'Do Something else'
    },
];

function addStickyNote() {
    // take the content
    const content = document.getElementById('stickyNoteContent').value;
    
    // add to the sticky note list
    stickyNotes.push({
        content,
        id: Date.now(),
    });

    // Render list
    renderList();
}

const button = document.getElementById('addStickyNote');
button.addEventListener('click', addStickyNote);

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
            <tr>
                <td>${stickyNote.id}</td>
                <td>${stickyNote.content}</td>
                <td><i class="glyphicon glyphicon-trash" onclick="deleteStickyNote(${stickyNote.id})"></i></td>
            </tr>
        `;
        
    }

    return html;
}

function deleteStickyNote(stickNoteId) {
    // Remove note from list
    stickyNotes = stickyNotes.filter(stickyNote => stickyNote.id !== stickNoteId);

    renderList();
}


window.addEventListener('load', renderList);