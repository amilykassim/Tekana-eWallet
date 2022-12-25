
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UserDTO } from '../../user/dtos/user.dto';
const Joi = require('joi');

@Injectable()
export class RegisterUserValidation implements PipeTransform {
  transform(user: UserDTO, metadata: ArgumentMetadata) {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50).required(),
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(8).max(255).required(),
    });

    return schema.validate(user);
  }
}