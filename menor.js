const tasks = require('./tasks.js');
// Time Work.
const declOfNum = require('./time/deadline');
const { weekTime, today, weekStart } = require('./time/weektime')
let week = 0;





const TelegramBot = require('node-telegram-bot-api');
const token = '5139898362:AAGWBI_YyL4VsvYicNHeeYN2A-lRFpbmu18';
const fs = require('fs')

console.log('Bot начал свою работу ... ')


const bot = new TelegramBot(token, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});


bot.onText(/\/start/, msg => {
    const {id} = msg.chat

    bot.sendMessage(id, `
Итак, это твой чат-бот. 
Он будет выдавать тебе материал, собирать домашние задания и помогать следить тебе за дедлайном.
Каждая неделя была разбита на 2 части будь внимателен!

Команды которые тебе доступны:
1) /list - Твои задачи на неделю. 2 части. Это важно. Делай по порядку. Изначально они скрыты. Нажимай на них чтобы открыть.

2) /time - Показывает сколько времени у тебя есть до дедлайна. Каждый день простоя = минус со следующей недели.

3) /success - Команда для перехода к следующей неделе. Назад вернуть нельзя. Если раньше срока сделал задачи - можешь перейти заранее.

4) /addday - Попытка добавить +1 день к дедлайну. Не увлекайся этим.

5) /work - Используй чтобы отправить ссылку на дз.

6) /artem - Чтобы я точно увидел вопрос.

Не забудь отправлять ссылку на дз в формате PULL REQUEST - https://clck.ru/atUmr.    
    
    `);
})


// Лист с задачами на неделю.
bot.onText(/\/list/, msg => {
    const {id} = msg.chat
    let number = 1;
    let listOne = `<strong>ТВОЙ СПИСОК ЗАДАЧ (${week + 1} - АЯ НЕДЕЛЯ - ЧАСТЬ 1) .</strong>

${tasks[week][0].map(i=>`<strong>${number++}. </strong><span class="tg-spoiler">${i}</span>`).join("\n\n")}`;

    let listTwo = `<strong>ТВОЙ СПИСОК ЗАДАЧ (${week + 1} - АЯ НЕДЕЛЯ - ЧАСТЬ 2) .</strong>

${tasks[week][1].map(i=>`<strong>${number++}. </strong><span class="tg-spoiler">${i}</span>`).join("\n\n")}`;

    bot.sendMessage(id, listOne, {
        parse_mode: 'HTML'
    })

    setTimeout(() => {
        bot.sendMessage(id, listTwo, {
            parse_mode: 'HTML'
        })
    }, 1000)
})

// ---------------------------------


// Приём ДЗ
bot.onText(/\/work/, msg => {
    const {id} = msg.chat
    bot.sendMessage(id, `В следующем сообщении отправь ссылку на Pull Request в GIT`);

})

// ---------------------------------





// Посмотреть сколько до конца дедлайна
bot.onText(/\/time/, msg => {
    const {id} = msg.chat

    let timeDiff = Math.abs(weekTime[week + 1].getTime() - today.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if(diffDays > 0) {
        bot.sendMessage(id, `Идёт неделя №${week + 1} 
До конца первого дедлайна: ${diffDays} ${declOfNum(diffDays, ['день', 'дня', 'дней'])}
    `)
    } else {
        bot.sendMessage(id, `Идёт неделя №${week + 1} 
ДЕДЛАЙН СЕГОДНЯ!
    `)
    }

})


// Заранее перейти к следующей неделе.
bot.onText(/\/success/, msg => {
    const {id} = msg.chat
    week++;

    bot.sendMessage(id, `Ты выполнил задание раньше срока или вовремя. Теперь приступай к неделе № ${week + 1}`);
})
// -----------------------------------------------------------------




bot.onText(/\/addday/, msg => {
    const {id} = msg.chat

    bot.sendMessage(id, 'А вот и не угадал. Делайн есть дедлайн :) ');
    bot.sendPhoto(id, fs.readFileSync(__dirname + '/img/kek.jpg') )
})

bot.onText(/\/artem/, msg => {
    const {id} = msg.chat

    bot.sendMessage(id, '@front_art - Мне нужна помощь.');
})