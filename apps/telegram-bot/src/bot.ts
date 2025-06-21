import { config } from 'dotenv';
import path from 'path';
import { Telegraf, session } from 'telegraf';
import { MyContext } from './types';
import { setupHandlers } from './handlers';

config({ path: path.resolve(__dirname, '..', '.env') });

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);
bot.use(session());

setupHandlers(bot);

bot.launch();
console.log('🤖 Бот запущен');
