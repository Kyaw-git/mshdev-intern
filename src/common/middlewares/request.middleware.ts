import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.headers["x-request-id"] || randomUUID();
    req.headers["x-request-id"] = traceId;

    const originalSend = res.send;

    res.send = (body) => {
      try {
        if (body && typeof body === 'object') {
          body = this.transformResponse(body);
        } else if (typeof body === 'string') {
          const parsed = JSON.parse(body);
          body = JSON.stringify(this.transformResponse(parsed));
        }
      } catch (e) {}
      return originalSend.call(res, body);
    };

    next();
  }

  private transformResponse(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformResponse(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        let newKey = key;
        if (key === 'imageUrl') newKey = 'image_url';
        if (key === 'createdAt') newKey = 'created_at';
        if (key === 'updatedAt') newKey = 'updated_at';

        newObj[newKey] = this.transformResponse(obj[key]);
      }
      return newObj;
    }

    return obj;
  }
}