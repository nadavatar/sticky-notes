const express = require('express');
const app = express();

const stickyNotes = [
    {
        id: Date.now(),
        content: 'Do Something'

    },
    {
        id: Date.now() + 10,
        content: 'Do Something else'

    }
];

app.use(express.static('./src/public'))

app.get('/sticky-notes', (req, res) => {
    console.log('Got a request for sticky notes');
    res.json(stickyNotes);
});

const port = 3000;
app.listen(port, () => {
   console.log(`App is running on port ${port}`);
});