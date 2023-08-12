import Telegram from '../utils/telegram'
import { BOT_TOKEN,ERRLOG_CHANNEL,ROBOT_NAME } from '../config'
import { reqJavbus } from '../utils/javbus'

export default async request => {
  try {
    const body = await request.json()

    const MESSAGE = {
      chat_id: body.message.chat.id,
      chat_type: body.message.chat.type,
      message_id: body.message.message_id,
      first_name: body.message.chat.first_name,
      last_name: body.message.chat.last_name,
      text: body.message.text.toLowerCase()
    }

    const headers = new Headers({'content-type': 'application/json;charset=UTF-8'})
    const RETURN_FORBIDDEN = new Response('Oops...', {status: 403, statusText: 'Forbidden'})
    const RETURN_OK = new Response('working', {status: 200, headers: headers})

    const bot = new Telegram(BOT_TOKEN, MESSAGE)

    const help_text = "命令格式: /av KAWD-723\n\nBy @loliclub\n由 Cloudflare Worker 强力驱动"

    if (body.message.sticker) {
      bot.sendText(MESSAGE.chat_id,help_text)
      return RETURN_OK
    }

    if ( MESSAGE.text.startsWith('/start')) {
      bot.sendText(MESSAGE.chat_id,help_text)
      return RETURN_OK

    } else if (MESSAGE.text == '/av') {
      bot.sendText(MESSAGE.chat_id,help_text)
      return RETURN_OK
    } else if ( MESSAGE.text.startsWith('/av')) {

      let code = MESSAGE.text.replace('/av','').trim() 

      let codeRegex = /^([a-z]+)(?:-|_|\s)?([0-9]+)$/;
      if (codeRegex.test(code)) {
        code = code.match(codeRegex);
        code = code[1] + '-' + code[2];
      }


      let isPrivate = MESSAGE.chat_type === 'private';
      let max = isPrivate ? 10 : 3;

      try {
        let {title,img,resultList} = await reqJavbus(code)

        if  (!img.startsWith('https://www.javbus.com')){
          img = 'https://www.javbus.com'+img
        }

        let media = {
          caption: title,
          url: img
        }
        bot.sendPhoto(MESSAGE.chat_id,media)

        let messageText = ''

        if (resultList.length > 0) {
          for (let i = 0; i < resultList.length; i++) {
            messageText += '\n-----------\n名字: ' + decodeURIComponent(resultList[i].name) 
            if (resultList[i].is_hd) {
              messageText += " [高清]"
            }
            if (resultList[i].has_subtitle) {
              messageText += " [字幕]"
            }
            messageText += " " + resultList[i].releaseDate
            messageText += '\n链接: <code>' + resultList[i].magnet + '</code>'
            if ((i + 1) > max) {
              break;
            };
          }

          if (!isPrivate && resultList.length > max) {
            messageText += `\n-----------\n在群聊中发车，还有 ${resultList.length - max} 个Magnet链接没有显示\n与 ${ROBOT_NAME} 机器人单聊可以显示所有链接`;
          }

          bot.sendText(MESSAGE.chat_id, messageText)
        } else {
          bot.sendText(MESSAGE.chat_id, "还没有Magnet链接")
        }


      } catch (e) {
        bot.sendText(ERRLOG_CHANNEL,e.message)
      }
      return RETURN_OK

    } else {
      bot.sendText(MESSAGE.chat_id,help_text)
      return RETURN_OK
    }

  } catch (err) {
    return new Response(err.stack || err)
  }
}