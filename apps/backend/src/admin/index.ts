import AdminJS, { ComponentLoader } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import bcrypt from 'bcryptjs';
import prisma from '../database';
import config from '../config';
import { validateTable, validateCat } from './validation';
import { light } from '@adminjs/themes';
import chalk from 'chalk';

AdminJS.registerAdapter({ Database, Resource });

const componentLoader = new ComponentLoader();
const Components = {
  CatPhotoThumbnail: componentLoader.add('CatPhotoThumbnail', './components/CatPhotoThumbnail.tsx'),
};

function withValidation(resourceName: string) {
  return async (request: any) => {
    if (request.method === 'post' && request.payload) {
      const isCreate = !request.params?.recordId;

      if (resourceName === 'Table') {
        request.payload = validateTable(request.payload, isCreate);
      } else if (resourceName === 'Cat') {
        request.payload = validateCat(request.payload, isCreate);
      }
    }
    return request;
  };
}

const admin = new AdminJS({
  componentLoader,
  assets: {
    styles: ['/admin/custom.css'],
  },
  resources: [
    {
      resource: { model: getModelByName('Cat'), client: prisma },
      options: {
        actions: {
          new: { before: withValidation('Cat') },
          edit: { before: withValidation('Cat') },
        },
        properties: {
          id: {
            isVisible: { list: true, edit: false, filter: true, show: true },
            isSortable: true,
          },
          name: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          age: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          sex: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          experience: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          description: {
            isVisible: { list: false, edit: true, filter: false, show: true },
            isSortable: false,
          },
          photo_url: {
            type: 'string',
            isVisible: { list: true, edit: true, filter: false, show: true },
            components: {
              show: Components.CatPhotoThumbnail,
              list: Components.CatPhotoThumbnail,
            },
            isSortable: false,
          }
        }
      },
    },
    {
      resource: { model: getModelByName('Table'), client: prisma },
      options: {
        actions: {
          new: { before: withValidation('Table') },
          edit: { before: withValidation('Table') },
        },
        properties: {
          id: {
            isVisible: { list: true, edit: false, filter: true, show: true },
            isSortable: true,
          },
          max_seats: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
        }
      },
    },
    {
      resource: { model: getModelByName('Booking'), client: prisma },
      options: {
        properties: {
          id: {
            isVisible: { list: true, edit: false, filter: true, show: true },
            isSortable: true,
          },
          phone_number: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: false,
          },
          name: {
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          date_from: {
            type: 'datetime',
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          date_to: {
            type: 'datetime',
            isVisible: { list: true, edit: true, filter: true, show: true },
            isSortable: true,
          },
          table: {
            isVisible: { list: true, edit: true, filter: true, show: true, new: true },
          },
          table_id: {
            isVisible: false,
          },
        }
      },
    },
  ],
  defaultTheme: light.id,
  rootPath: '/admin',
  branding: {
    companyName: 'Cat Cafe Admin',
    favicon: '/static/logo.ico',
  },
});

async function authenticateAdmin(email: string, password: string): Promise<{ email: string } | null> {
  try {
    const adminEmail = config.auth.ADMIN_EMAIL;
    const adminHash = config.auth.ADMIN_PASSWORD_HASH;
    if (!adminEmail || !adminHash) {
      console.warn(chalk.yellow('Empty email or password'));
      return null;
    }
    const valid = email === adminEmail && await bcrypt.compare(password, adminHash);
    if (!valid) console.warn(chalk.yellow('Invalid login attempt for email:', email));
    return valid ? { email } : null;
  } catch (error) {
    console.error(chalk.red('Authentication error:', error));
    return null;
  }
}

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: authenticateAdmin,
    cookieName: 'adminjs',
    cookiePassword: config.auth.ADMIN_COOKIE_SECRET,
  },
);

export { admin, adminRouter };