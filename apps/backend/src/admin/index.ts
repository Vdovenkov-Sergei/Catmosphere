import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import bcrypt from 'bcryptjs';
import prisma from '../database';
import config from '../config';
import { validateBooking, validateTable, validateCat } from './validation';
import * as console from 'node:console';

AdminJS.registerAdapter({ Database, Resource });

function withValidation(resourceName: string) {
  return async (request: any) => {
    if (request.method === 'post' && request.payload) {
      const isCreate = !request.params?.recordId;

      if (resourceName === 'Table') {
        request.payload = validateTable(request.payload, isCreate);
      } else if (resourceName === 'Booking') {
        request.payload = validateBooking(request.payload, isCreate);
      } else if (resourceName === 'Cat') {
        request.payload = validateCat(request.payload, isCreate);
      }
    }
    return request;
  };
}

const admin = new AdminJS({
  resources: [
    {
      resource: { model: getModelByName('Cat'), client: prisma },
      options: {
        actions: {
          new: { before: withValidation('Cat') },
          edit: { before: withValidation('Cat') },
        },
      },
    },
    {
      resource: { model: getModelByName('Table'), client: prisma },
      options: {
        actions: {
          new: { before: withValidation('Table') },
          edit: { before: withValidation('Table') },
        },
      },
    },
    {
      resource: { model: getModelByName('Booking'), client: prisma },
      options: {
        actions: {
          new: { before: withValidation('Booking') },
          edit: { before: withValidation('Booking') },
        },
      },
    },
  ],
  rootPath: '/admin',
  branding: { companyName: 'Cat Cafe Admin' },
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      const adminEmail = config.auth.ADMIN_EMAIL;
      const adminHash = config.auth.ADMIN_PASSWORD_HASH;
      if (!adminEmail || !adminHash) return null;
      const valid = email === adminEmail && await bcrypt.compare(password, adminHash);
      return valid ? { email } : null;
    },
    cookieName: 'adminjs',
    cookiePassword: config.auth.ADMIN_COOKIE_SECRET || 'secret',
  },
);

export { admin, adminRouter };