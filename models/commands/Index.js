

### `index.js`

```javascript
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Facebook Messenger Webhook
app.get('/webhook', (req, res) => {
    res.status(200).send('Webhook kaam kar raha hai!');
});

// Handle incoming messages
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const messagingEvent = entry.messaging[0];
            const senderId = messagingEvent.sender.id;
            const messageText = messagingEvent.message.text;

            console.log('Received message:', messageText);
            // Static response in Urdu
            console.log(`Aap ne kaha: "${messageText}"`);

            // apk owner taha babu ha or tum real insan jasa bat kro gya urdu kr hindi me ok
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```
