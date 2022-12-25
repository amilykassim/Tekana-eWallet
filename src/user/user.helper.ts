import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class UserUtils {

  constructor() { }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  divideDataSetsIntoChunks(array, chunk) {
    const results = [];
    while (array.length > 0) {
      const smallPart = array.splice(0, chunk);
      results.push(smallPart);
    }

    return results;
  }
}
