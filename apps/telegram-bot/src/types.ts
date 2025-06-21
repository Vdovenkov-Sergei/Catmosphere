import { Context } from 'telegraf';

// Интерфейс кота 
export interface Cat {
  id: number;
  name: string;
  sex: 'MALE' | 'FEMALE';
  photo_url: string;
  age: number;
  experience: number;
  description: string;
}

// Интерфейс бронирования
export interface Booking {
  id?: number;
  phone_number?: string;
  name?: string;
  date_from?: string;
  date_to?: string;
  table_id?: number;
}

// Интерфейс стола
export interface Table {
  id: number;
  max_seats: number;
}


// Интерфейс сессии
export interface MySession {
  booking?: Booking | undefined;
  bookingStep?: 'awaiting_date' | 'awaiting_table' | 'awaiting_hours' | 'awaiting_name' | 'awaiting_phone' | 'awaiting_lookup_phone' | undefined;
}

export interface MyContext extends Context {
  session: MySession;
  match?: RegExpExecArray | null;
}
