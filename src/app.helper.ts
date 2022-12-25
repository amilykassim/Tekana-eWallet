import { Injectable, Res } from '@nestjs/common';

@Injectable()
export class AppHelper {
    constructor() { }

    badRequest(@Res() res, message: string) {
        return res.status(400).json({ statusCode: 400, message });
    }

    successRequest(@Res() res, response: object) {
        return res.status(200).json({ statusCode: 200, data: { ...response } });
    }
}
