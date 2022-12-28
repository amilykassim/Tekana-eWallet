import { Injectable, Res } from '@nestjs/common';

@Injectable()
export class AppHelper {
    constructor() { }

    badRequest(@Res() res, message: string) {
        return res.status(400).json({ statusCode: 400, message });
    }

    successRequest(@Res() res, response: object, statusCode = 200) {
        return res.status(statusCode).json({ statusCode, data: { ...response } });
    }
}
