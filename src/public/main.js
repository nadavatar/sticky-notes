let stickyNotes = []

//get The Current Notes From The Server
getStickyNotesFromServer();

async function getStickyNotesFromServer() {
  try {
    const response = await axios.get("http://localhost:3000/getStickyNotes");
    stickyNotes = response.data;
    renderList();
  } catch (error) {
    console.error(error);
  }
}

async function addStickyNote() {
  const contentElement = document.getElementById("stickyNoteContent");

  // take the content
  const content = contentElement.value;
  //get the id of the last sticky note
  let currentId = stickyNotes[stickyNotes.length - 1].id + 1;

  const mongoDocument = {
    content,
    id: currentId
  };

  document.getElementById("stickyNoteContent").value = "";

  try {
    const response = await axios.post("http://localhost:3000/addStickyNote", mongoDocument);
    if (response.status != 200) {
      console.error(`Got ${response.status} from the server`);
    } else {
      renderList();
    }
  } catch (error) {
    console.error(error);
  }

  // Render list
  getStickyNotesFromServer();
}

//add event listeners to the add button and method
const addButton = document.getElementById("addStickyNote");
addButton.addEventListener("click", addStickyNote);
enterClick = document.getElementById("stickyNoteContent");
enterClick.addEventListener("keypress", function (e) {
  if (e.keyCode == 13) {
    addStickyNote();
  }
});

const stickyNotesHtmlTemplate = `
<table class="table">
    <thead>
        <th><b>Content</b></th>
        <th></th>
        <tbody>
            {{notesPlaceholder}}
        </tbody>
        
    </thead>
</table>
`;

async function renderList() {
  const stickyNotesHtmlRendered = stickyNotesHtmlTemplate.replace(
    "{{notesPlaceholder}}",
    await getStickyNotesRows()
  );
  document.getElementById(
    "stickyNotesContainer"
  ).innerHTML = stickyNotesHtmlRendered;
}

function getStickyNotesRows() {
  let html = "";

  for (let index = 0; index < stickyNotes.length; index++) {
    const stickyNote = stickyNotes[index];

    html += `
            <tr id="stickyNote-${stickyNote.id}">
                
                <td>
                    <span class="sticky-content non-edit-element">${
                      stickyNote.content
                    }</span>
                    <input class="sticky-content-input form-control edit-element" value="${
                      stickyNote.content
                    }" />
                </td>
                <td>
                    <i class="clickable glyphicon glyphicon-check edit-element" onclick="updateStickyNote(${
                      stickyNote.id
                    })"></i>
                    <i class="clickable glyphicon glyphicon-pencil sticky-pencil non-edit-element" onclick="toggleEditMode(${
                      stickyNote.id
                    })"></i>
                    <i class="clickable glyphicon glyphicon-trash" onclick="deleteStickyNote(${
                      stickyNote.id
                    })"></i>
                    
                </td>
            </tr>
        `;
  }

  return html;
}

function toggleEditMode(stickyNoteId) {
  // Toggle edit mode
  const stickyNoteRow = document.getElementById(`stickyNote-${stickyNoteId}`);
  stickyNoteRow.classList.add("edit-mode");
  enterEditClick = document.getElementById("stickyNoteContent");
  enterEditClick.addEventListener("keypress", function (e) {
    if (e.keyCode == 13) {
      updateStickyNote(stickyNoteId);
    }
  });
}

function updateStickyNote(stickyNoteId) {
  const stickyNoteContent = document.querySelector(
    `#stickyNote-${stickyNoteId} .sticky-content-input`
  );
  for (let i = 0; i < stickyNotes.length; i++) {
    const stickyNote = stickyNotes[i];
    if (stickyNote.id === stickyNoteId) {
      stickyNote.content = stickyNoteContent.value;
      break;
    }
  }
  setData("stickyNotes", stickyNotes);
  renderList();
}

function deleteStickyNote(stickNoteId) {
  // Remove note from list
  stickyNotes = stickyNotes.filter(stickyNote => stickyNote.id !== stickNoteId);

  renderList();

  setData("stickyNotes", stickyNotes);
}

function setData(dataName, dataValue) {
  localStorage.setItem(dataName, JSON.stringify(dataValue));
}