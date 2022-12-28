
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UserDTO } from '../../user/dtos/user.dto';
const Joi = require('joi');

@Injectable()
export class LoginValidation implements PipeTransform {
  transform(user: UserDTO, metadata: ArgumentMetadata) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    return schema.validate(user);
  }
}