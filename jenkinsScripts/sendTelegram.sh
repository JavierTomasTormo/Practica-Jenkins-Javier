const axios = require('axios');
const chatId = process.env.CHAT_ID;
const message = process.env.MESSAGE;

axios.post(`https://api.telegram.org/bot7850778055:AAF2jZyVc3aWrbZD8tRNx4ntTnpJ37T7APc/sendMessage`, {
    chat_id: chatId,
    text: message,
});
