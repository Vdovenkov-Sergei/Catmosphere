// apps/backend/src/admin/validation.ts

import { ValidationError as AdminValidationError } from 'adminjs';

// Валидация для Table
export function validateTable(input: any, isCreate = false) {
  const errors: string[] = [];
  const data: any = {};

  // max_seats обязателен всегда
  if (input.max_seats === undefined || input.max_seats === null) {
    errors.push('max_seats is required');
  } else {
    const n = Number(input.max_seats);
    if (!Number.isInteger(n) || n <= 0) {
      errors.push('max_seats must be a positive integer');
    } else {
      data.max_seats = n;
    }
  }

  // id обязателен только при редактировании
  if (!isCreate) {
    if (input.id === undefined || input.id === null) {
      errors.push('id is required');
    } else {
      const id = Number(input.id);
      if (!Number.isInteger(id) || id <= 0) {
        errors.push('id must be a positive integer');
      } else {
        data.id = id;
      }
    }
  }

  if (errors.length) {
    throw new AdminValidationError(
      { max_seats: { message: errors.join('; ') } },
      { message: errors.join('; ') }
    );
  }

  // При создании гарантированно удаляем id, если он случайно пришёл в payload
  if (isCreate && 'id' in data) {
    delete data.id;
  }

  return data;
}

// Валидация для Booking
export function validateBooking(input: any, isCreate = false) {
  const errors: string[] = [];
  const data: any = {};

  // phone_number
  if (!input.phone_number || typeof input.phone_number !== 'string' || !/^\+?[0-9]{10,15}$/.test(input.phone_number)) {
    errors.push('phone_number is required and must be a valid phone number');
  } else {
    data.phone_number = input.phone_number;
  }

  // name
  if (!input.name || typeof input.name !== 'string' || input.name.length < 1) {
    errors.push('name is required');
  } else {
    data.name = input.name;
  }

  // date_from
  if (!input.date_from) {
    errors.push('date_from is required');
  } else {
    const date = new Date(input.date_from);
    if (isNaN(date.getTime())) {
      errors.push('date_from must be a valid date');
    } else {
      data.date_from = date;
    }
  }

  // date_to
  if (!input.date_to) {
    errors.push('date_to is required');
  } else {
    const date = new Date(input.date_to);
    if (isNaN(date.getTime())) {
      errors.push('date_to must be a valid date');
    } else {
      data.date_to = date;
    }
  }

  // table_id
  if (input.table_id === undefined || input.table_id === null) {
    errors.push('table_id is required');
  } else {
    const tid = Number(input.table_id);
    if (!Number.isInteger(tid) || tid <= 0) {
      errors.push('table_id must be a positive integer');
    } else {
      data.table_id = tid;
    }
  }

  // id только при редактировании
  if (!isCreate) {
    if (input.id === undefined || input.id === null) {
      errors.push('id is required');
    } else {
      const id = Number(input.id);
      if (!Number.isInteger(id) || id <= 0) {
        errors.push('id must be a positive integer');
      } else {
        data.id = id;
      }
    }
  }

  if (errors.length) {
    throw new AdminValidationError(
      { phone_number: { message: errors.join('; ') } },
      { message: errors.join('; ') }
    );
  }

  // При создании гарантированно удаляем id, если он случайно пришёл в payload
  if (isCreate && 'id' in data) {
    delete data.id;
  }

  return data;
}

// Валидация для Cat
export function validateCat(input: any, isCreate = false) {
  const errors: string[] = [];
  const data: any = {};

  // name
  if (!input.name || typeof input.name !== 'string' || input.name.length < 1 || input.name.length > 100) {
    errors.push('name is required (1-100 chars)');
  } else {
    data.name = input.name;
  }

  // sex
  if (!input.sex || (input.sex !== 'MALE' && input.sex !== 'FEMALE')) {
    errors.push('sex is required and must be MALE or FEMALE');
  } else {
    data.sex = input.sex;
  }

  // photo_url
  if (!input.photo_url || typeof input.photo_url !== 'string' || !/^https?:\/\/.+/.test(input.photo_url)) {
    errors.push('photo_url is required and must be a valid URL');
  } else {
    data.photo_url = input.photo_url;
  }

  // age
  if (input.age === undefined || input.age === null) {
    errors.push('age is required');
  } else {
    const age = Number(input.age);
    if (!Number.isInteger(age) || age < 0) {
      errors.push('age must be a non-negative integer');
    } else {
      data.age = age;
    }
  }

  // experience
  if (input.experience === undefined || input.experience === null) {
    errors.push('experience is required');
  } else {
    const exp = Number(input.experience);
    if (!Number.isInteger(exp) || exp < 0) {
      errors.push('experience must be a non-negative integer');
    } else {
      data.experience = exp;
    }
  }

  // description
  if (!input.description || typeof input.description !== 'string' || input.description.length < 1 || input.description.length > 1000) {
    errors.push('description is required (1-1000 chars)');
  } else {
    data.description = input.description;
  }

  // id только при редактировании
  if (!isCreate) {
    if (input.id === undefined || input.id === null) {
      errors.push('id is required');
    } else {
      const id = Number(input.id);
      if (!Number.isInteger(id) || id < 0) {
        errors.push('id must be a non-negative integer');
      } else {
        data.id = id;
      }
    }
  }

  if (errors.length) {
    throw new AdminValidationError(
      { name: { message: errors.join('; ') } },
      { message: errors.join('; ') }
    );
  }

  // При создании гарантированно удаляем id, если он случайно пришёл в payload
  if (isCreate && 'id' in data) {
    delete data.id;
  }

  return data;
}