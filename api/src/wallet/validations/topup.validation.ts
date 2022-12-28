import { TopUpDTO } from './../dtos/topup.dto';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
const Joi = require('joi');

@Injectable()
export class TopUpValidation implements PipeTransform {
  transform(topup: TopUpDTO, metadata: ArgumentMetadata) {
    const schema = Joi.object({
      amount: Joi.number().min(100).max(1000000).required()
    });

    return schema.validate(topup);
  }
}