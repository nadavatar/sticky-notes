let stickyNotes = getData('stickyNotes') || [];


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

    setData('stickyNotes', stickyNotes);
}


function getData(dataName) {
    try {
        return JSON.parse(localStorage.getItem(dataName));
    }
    catch (e) {
        return null;
    }
}

function setData(dataName, dataValue) {
    localStorage.setItem(dataName, JSON.stringify(value));
}


window.addEventListener('load', renderList);