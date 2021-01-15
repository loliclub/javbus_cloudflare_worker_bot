class Telegram {
  constructor(token, message) {
    this.token = token
    this.message = message
    this.telegramUrl = 'https://api.telegram.org/bot' + this.token + '/'
    this.header = {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  }

  sendText (chat_id,text) {

    let payload = {
      "method": "sendMessage",
      "chat_id": chat_id,
      "parse_mode": "HTML",
      "disable_web_page_preview": true,
      "text": text
    };

    const opts = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    
    fetch(new Request(this.telegramUrl, opts))
  }

  sendPhoto (chat_id,photo) {
    let payload = {
      "method": "sendPhoto",
      "chat_id": chat_id,
      "parse_mode": "HTML",
      "disable_web_page_preview": true,
      "photo": photo.url
    };

    if (photo.caption) {
      payload.caption = photo.caption
    }

    const opts = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(new Request(this.telegramUrl, opts))
  }

}

module.exports = Telegram
