import * as http from 'node:http';
import { ErrorsMessage } from '../constants/errors';

enum HttpStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  NotFound = 404,
  BadRequest = 400,
  InternalServerError = 503,
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Route {
  method: HttpMethod;
  path: RegExp | string;
  handler: (req: http.IncomingMessage, res: http.ServerResponse, params?: string[]) => Promise<void>;
}

const sendResponse = (res: http.ServerResponse, statusCode: number, data?: any)=> {
  if(!data) {
    res.writeHead(statusCode);
    res.end();
  }
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const handleError = (res: http.ServerResponse, error: any) => {
  if (error !instanceof Error) sendResponse(res, HttpStatusCode.BadRequest, { message: ErrorsMessage.InternalServerError });

  switch (error.message) {
    case ErrorsMessage.InvalidUserDataError:
      sendResponse(res, HttpStatusCode.BadRequest, { message: ErrorsMessage.InvalidUserDataError });
      break;
    case ErrorsMessage.InvalidUserIdError:
      sendResponse(res, HttpStatusCode.BadRequest, { message: ErrorsMessage.InvalidUserIdError });
      break;
    case ErrorsMessage.UserNotFoundError:
      sendResponse(res, HttpStatusCode.BadRequest, { message: ErrorsMessage.UserNotFoundError });
      break;
    case ErrorsMessage.InternalServerError:
      sendResponse(res, HttpStatusCode.BadRequest, { message: ErrorsMessage.InternalServerError });
      break;
    default:
      sendResponse(res, HttpStatusCode.BadRequest, { message: ErrorsMessage.InternalServerError });
  }
}

export {
  handleError,
  sendResponse,
  Route,
  HttpMethod,
  HttpStatusCode
}