// В начале файла
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'

// Регистрируем адаптер
AdminJS.registerAdapter({ Database, Resource })

const prisma = new PrismaClient()

const admin = new AdminJS({
  resources: [
    {
      resource: {
        model: getModelByName('User'), // модель по имени
        client: prisma,
      },
      options: { properties: { password: { isVisible: false } } },
    },
    {
      resource: {
        model: getModelByName('Cat'),
        client: prisma,
      },
    },
    {
      resource: {
        model: getModelByName('Table'),
        client: prisma,
      },
    },
    {
      resource: {
        model: getModelByName('Booking'),
        client: prisma,
      },
    },
  ],
  rootPath: '/admin',
  branding: { companyName: 'Cat Cafe Admin' },
})

const adminRouter = AdminJSExpress.buildRouter(admin)
export { admin, adminRouter }
