import http from 'node:http';
import { config } from './config'
import type { Repository } from '../repositories/repository';
import { User } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';
import { ErrorsMessage } from '../constants/errors';
import { handleError, HttpStatusCode, Route, sendResponse } from './serverUtils';
import { isUUID } from "../utils/utils";


const parseBody = async (req: http.IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      if (!body) {
        reject();
        return;
      }
      resolve(body);
    });
  });
}

export const runServer = (
  port = config.port,
  userRepository: Repository<User> = new UserRepository()) => {
  const routes: Route[] = [
    {
      method: "GET",
      path: "api/users",
      handler: async (_: any, res: any) => {
        const users = await userRepository.getAll();
        sendResponse(res, HttpStatusCode.OK, users);
      }
    },
    {
      method: "GET",
      path: /^\api\/users\/{[^/]+}$/,
      handler: async (_: any, res: any, params: any) => {
        const userId = params?.[0] as string;
        if (!isUUID(userId)) {
          throw new Error(ErrorsMessage.InvalidUserIdError);
        }

        const user = await userRepository.getById(userId);
        if (!user){
          throw new Error(ErrorsMessage.UserNotFoundError);
        }

        sendResponse(res, HttpStatusCode.OK, user);
      }
    },
    {
      method: "POST",
      path: "api/users",
      handler: async (req: any, res: any) => {
        const body = await parseBody(req);
        const createdUserModel = User.fromJSON(body);
        const createdUser = await userRepository.create(createdUserModel);
        sendResponse(res, HttpStatusCode.Created, createdUser);
      }
    },
    {
      method: "PUT",
      path: /^\api\/users\/{[^/]+}$/,
      handler: async (req: any, res: any, params: any) => {
        const userId = params?.[0] as string;
        if (!isUUID(userId)) {
          throw new Error(ErrorsMessage.InvalidUserIdError);
        }

        const user = await userRepository.getById(userId);
        if (!user){
          throw new Error(ErrorsMessage.UserNotFoundError);
        }
        const body = await parseBody(req);
        const updatedUserModel = User.fromJSON(body);

        if (updatedUserModel.id !== userId){
          throw new Error(ErrorsMessage.InvalidUserDataError);
        }
        const updatedUser = await userRepository.update(updatedUserModel);
        if (!updatedUser){
          throw new Error(ErrorsMessage.InvalidUserDataError);
        }
        sendResponse(res, HttpStatusCode.OK, user);
      }
    },
    {
      method: "DELETE",
      path: /^\api\/users\/{[^/]+}$/,
      handler: async (_: any, res: any, params: any) => {
        const userId = params?.[0] as string;
        if (!isUUID(userId)) {
          throw new Error(ErrorsMessage.InvalidUserIdError);
        }

        const user = await userRepository.getById(userId);
        if (!user || user.id === null){
          throw new Error(ErrorsMessage.UserNotFoundError);
        }

        const deletedUser = await userRepository.delete(user.id);
        if (!deletedUser){
          throw new Error(ErrorsMessage.InvalidUserDataError);
        }
        sendResponse(res, HttpStatusCode.NoContent);
      }
    }
  ];

  const server = http.createServer(async (req, res) => {
    try {
      const route = routes.find((r) =>
        r.method === req.method &&
        (typeof r.path === "string"
          ? r.path === req.url
        : r.path.test(req.url || ''))
      );

      if (!route){
        sendResponse(res, HttpStatusCode.NotFound, { message: ErrorsMessage.UnknownResourceError });
        return;
      }

      const params = typeof route.path === "string"
        ? undefined
        : (req.url || '')
          .match(route.path)
          ?.slice(1);
      await route.handler(req, res, params);
    } catch (error) {
      handleError(res, error)
    }
  });
  server.on("error", (err) => {
    console.log(`ServerError: ${err}`);
  });
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })

  return server;
}
