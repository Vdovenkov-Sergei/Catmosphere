import { Markup, Telegraf } from 'telegraf';
import axios from 'axios';
import { Cat, Booking, Table, MyContext } from './types';
import { config } from './config';

// Cats functions

let catsCache: Cat[] = [];
let catsOffset = 0;
const catsLimit = 5;
let currentCat = 0;

function sexToRussian(sex: 'MALE' | 'FEMALE'): string {
  if (sex === 'MALE') return 'Мужской';
  if (sex === 'FEMALE') return 'Женский';
  return 'Неизвестно';
}

async function fetchCats(offset: number, limit: number): Promise<Cat[]> {
  const res = await axios.get(`${config.API_URL}/cats`, { params: { offset, limit } });
  return res.data;
}

async function showCatFromCache(ctx: MyContext) {
  const cat = catsCache[currentCat];
  if (!cat) {
    await ctx.reply('Кот не найден');
    return;
  }

  const caption =
    `Имя: ${cat.name}\n` +
    `Пол: ${sexToRussian(cat.sex)}\n` +
    `Описание: ${cat.description}`;

  if (ctx.callbackQuery?.message?.message_id) {
    try {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }
  }

  await ctx.replyWithPhoto(cat.photo_url, {
    caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: '⏮ Назад', callback_data: 'back_to_menu' }],
        [
          { text: '⏮ Пред', callback_data: 'prev_cat' },
          { text: '⏭ След', callback_data: 'next_cat' },
        ],
      ],
    },
  });
}

// Booking functions

const hours = [
    '9:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00', '20:00',
];

function formatBookingDate(date: string): string {
  return `${date}T00:00:00+03:00`;
}

function toMoscowTimeString(dateStr: string) {
  return new Date(dateStr).toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}


// Handlers 

export function setupHandlers(bot: Telegraf<MyContext>) {
  bot.start((ctx) => {
    ctx.session = {};
    ctx.reply('Выберите действие:', Markup.keyboard(['Наши котики', 'Забронировать столик', 'Мои брони']).resize());
  });

// Cats handlers

  bot.hears('Наши котики', async (ctx) => {
    try {
      catsOffset = 0;
      catsCache = await fetchCats(catsOffset, catsLimit);
      currentCat = 0;
      await showCatFromCache(ctx);
    } catch (e) {
      console.error(e);
      await ctx.reply('Ошибка при получении котов с сервера');
    }
  });

  bot.action('next_cat', async (ctx) => {
    if (currentCat + 1 < catsCache.length) {
      currentCat++;
      await showCatFromCache(ctx);
    } else {
      catsOffset += catsLimit;
      try {
        const newCats = await fetchCats(catsOffset, catsLimit);
        if (newCats.length === 0) {
          await ctx.answerCbQuery('Больше котов нет');
          return;
        }
        catsCache = newCats;
        currentCat = 0;
        await showCatFromCache(ctx);
      } catch (e) {
        console.error(e);
        await ctx.answerCbQuery('Ошибка при загрузке котов');
      }
    }
  });

  bot.action('prev_cat', async (ctx) => {
    if (currentCat > 0) {
      currentCat--;
      await showCatFromCache(ctx);
    } else if (catsOffset >= catsLimit) {
      catsOffset -= catsLimit;
      try {
        catsCache = await fetchCats(catsOffset, catsLimit);
        currentCat = catsCache.length - 1;
        await showCatFromCache(ctx);
      } catch (e) {
        console.error(e);
        await ctx.answerCbQuery('Ошибка при загрузке котов');
      }
    } else {
      await ctx.answerCbQuery('Это первый кот');
    }
  });

// Booking handlers

  bot.hears('Забронировать столик', async (ctx) => {
    if (!ctx.session) ctx.session = {};
    ctx.session.booking = {};
    ctx.session.bookingStep = 'awaiting_date';

    await ctx.reply('Введите дату бронирования в формате ДД.ММ.ГГГГ или ДД-ММ-ГГГГ');
  });

  bot.hears('Мои брони', async (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.bookingStep = 'awaiting_lookup_phone';
    await ctx.reply('Введите номер телефона, который вы указывали при бронировании (например, +79161234567):');
  });

  bot.on('text', async (ctx) => {
    if (!ctx.session) ctx.session = {};
    if (!ctx.session.booking) ctx.session.booking = {};
    const step = ctx.session.bookingStep;

    if (!step) return;

    switch (step) {
      case 'awaiting_date': {
        const dateRegex = /^(\d{1,2})[.\-](\d{1,2})[.\-](\d{4})$/;
        const match = ctx.message.text.trim().match(dateRegex);
        if (!match) {
          await ctx.reply('Неверный формат даты. Введите дату в формате ДД.ММ.ГГГГ или ДД-ММ-ГГГГ (например, 1.1.2025, 01-01-2025):');
          return;
        }
        let [, day, month, year] = match;
        if (day.length === 1) day = '0' + day;
        if (month.length === 1) month = '0' + month;
        const formatted = `${year}-${month}-${day}`;
        ctx.session.booking!.date_from = formatBookingDate(formatted);
        ctx.session.bookingStep = 'awaiting_table';

        try {
          const res = await axios.get(`${config.API_URL}/tables`);
          const tables: Table[] = res.data;
          const buttons = tables.map((t) =>
            Markup.button.callback(`Столик № ${t.id} (${t.max_seats} мест)`, `table_${t.id}`)
          );
          await ctx.reply('Выберите столик:', Markup.inlineKeyboard(buttons, { columns: 2 }));
        } catch (e) {
          await ctx.reply('Ошибка при получении столиков');
          console.error(e);
        }
        break;
      }
      case 'awaiting_name': {
        ctx.session.booking!.name = ctx.message.text;
        ctx.session.bookingStep = 'awaiting_phone';
        await ctx.reply('Введите номер телефона в формате +79161234567:');
        break;
      }
      case 'awaiting_phone': {
        const phone = ctx.message.text.trim();

        if (!phone.match(/^\+?[0-9]{10,15}$/)) {
          await ctx.reply('Неверный формат номера, попробуйте снова:');
          return;
        }
        ctx.session.booking!.phone_number = phone;
        try {
          await axios.post(`${config.API_URL}/bookings`, ctx.session.booking);
          await ctx.reply('✅ Бронирование успешно создано!');
        } catch (e) {
          await ctx.reply('❌ Ошибка при создании бронирования');
          console.error(e);
        }
        ctx.session = {};
        break;
      }
      case 'awaiting_lookup_phone': {
        const phone = ctx.message.text.trim();
        if (!phone.match(/^\+?[0-9]{10,15}$/)) {
          await ctx.reply('Неверный формат номера, попробуйте снова:');
          return;
        }
        try {
          const res = await axios.get(`${config.API_URL}/bookings`, {
            params: { phone_number: phone }
          });
          const bookings: Booking[] = res.data;
          if (!bookings.length) {
            await ctx.reply('Бронирований с таким номером не найдено.');
          } else {
            for (const b of bookings) {
              await ctx.reply(
                `Столик: № ${b.table_id}\n` +
                `Дата: ${b.date_from ? toMoscowTimeString(b.date_from) : 'неизвестно'}\n` +
                `До: ${b.date_to ? toMoscowTimeString(b.date_to) : 'неизвестно'}\n` +
                `Имя: ${b.name}`,
                Markup.inlineKeyboard([
                  Markup.button.callback('❌ Удалить', `delete_booking_${b.id}`)
                ])
              );
            }
          }
        } catch (e) {
          await ctx.reply('Ошибка при получении бронирований');
          console.error(e);
        }
        ctx.session.bookingStep = undefined;
        break;
      }
    }
  });

  bot.action(/table_(\d+)/, async (ctx) => {
    const table_id = Number(ctx.match?.[1]);

    if (!ctx.session.booking) {
      ctx.session.booking = {};
    }

    ctx.session.booking!.table_id = table_id;
    ctx.session.bookingStep = 'awaiting_hours';

    const date = ctx.session.booking.date_from;

    if (!date) {
      await ctx.reply('Ошибка: не указана дата бронирования');
      return;
    }

    const formattedDate = date.includes('T') ? date : formatBookingDate(date);

    try {
      const res = await axios.get(`${config.API_URL}/bookings/availability`, {
        params: {
          table_id: table_id,
          date: formattedDate,
        },
      });
      const busyIntervals: boolean[] = res.data;

      const available = hours.filter((hour, idx) => !busyIntervals[idx]);
      
      if (available.length === 0) {
        await ctx.reply('К сожалению, на эту дату нет свободных часов для выбранного столика. Введите другую дату:');
        ctx.session.bookingStep = 'awaiting_date';
        return;
      }

      const buttons = available.map((hour) =>
        Markup.button.callback(hour, `hour_${hour}`)
      );

      await ctx.reply('Выберите часы бронирования:', Markup.inlineKeyboard(buttons, { columns: 4 }));
    } catch (e) {
      await ctx.reply('Ошибка при получении доступных часов');
      console.error(e);
    }
  });

  bot.action(/hour_(.+)/, async (ctx) => {
    if (ctx.session.bookingStep !== 'awaiting_hours') {
      await ctx.answerCbQuery('Время уже выбрано');
      return;
    }

    const hour = ctx.match?.[1];
    if (!hour) {
      await ctx.reply('Ошибка: не указаны часы бронирования');
      return;
    }

    if (!ctx.session.booking || !ctx.session.booking.date_from) {
      await ctx.reply('Ошибка: не указана дата бронирования');
      return;
    }
    
    const datePart = ctx.session.booking!.date_from.slice(0, 10);
    const hourNumber = parseInt(hour.split(':')[0], 10);
    const fromTime = `${hour.padStart(5, '0')}:00+03:00`;
    const toHour = (hourNumber + 1).toString().padStart(2, '0');
    const toTime = `${toHour}:00:00+03:00`;

    ctx.session.booking!.date_from = `${datePart}T${fromTime}`;
    ctx.session.booking!.date_to = `${datePart}T${toTime}`;
    ctx.session.bookingStep = 'awaiting_name'; 

    await ctx.reply('Введите ваше имя:');
  });

    bot.action(/^delete_booking_(\d+)/, async (ctx) => {
    const bookingId = ctx.match?.[1];
    if (!bookingId) {
      await ctx.reply('Ошибка: не удалось определить бронь');
      return;
    }
    try {
      await axios.delete(`${config.API_URL}/bookings/${bookingId}`);
      await ctx.editMessageText('Бронь успешно удалена ✅');
    } catch (e) {
      await ctx.reply('Ошибка при удалении брони');
      console.error(e);
    }
  });

// Back to menu

  bot.action('back_to_menu', async (ctx) => {
    try {
      if (ctx.callbackQuery?.message?.message_id) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      }
    } catch {}
    await ctx.reply('Выберите действие:', Markup.keyboard(['Наши котики', 'Забронировать столик', 'Мои брони']).resize());
  });
}
