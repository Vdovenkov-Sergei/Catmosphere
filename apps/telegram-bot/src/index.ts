import { Telegraf, session } from 'telegraf';
import { MyContext } from './types';
import { setupHandlers } from './handlers';
import { config } from './config';

const bot = new Telegraf<MyContext>(config.TELEGRAM_BOT_TOKEN);
bot.use(session());

setupHandlers(bot);

bot.launch();
console.log('🤖 Бот запущен');
