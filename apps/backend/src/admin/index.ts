import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import bcrypt from 'bcryptjs';
import prisma from '../database';
import config from '../config';

AdminJS.registerAdapter({ Database, Resource });

const admin = new AdminJS({
  resources: [
    { resource: { model: getModelByName('Cat'), client: prisma } },
    { resource: { model: getModelByName('Table'), client: prisma } },
    { resource: { model: getModelByName('Booking'), client: prisma } },
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
