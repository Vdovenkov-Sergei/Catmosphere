import { config } from 'dotenv';
import path from 'path';

export function loadEnv() {
  config({ path: path.resolve(__dirname, '../../.env') });
}
