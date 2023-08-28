import { FastifyRequest, FastifyReply } from "fastify";
import { Context, Controller } from "../types";
import { createWorkspace as createWorkspaceController } from "@infraestructure/controllers/workspace/createWorkspace";
import { paginateWorkspaceByUserUuid as paginateWorkspaceByUserUuidController } from "@infraestructure/controllers/workspace/paginateWorkspaceByUserUuid";
import { getFullWorkspaceByUuid } from "@infraestructure/controllers/workspace/getFullWorkspaceByUuid";

async function createWorkspace(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  return res
    .code(201)
    .send(
      await createWorkspaceController(
        req.body,
        req.headers.authorization?.slice(7) ?? "",
        context
      )
    );
}

async function paginateWorkspaceByUserUuid(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
): Promise<FastifyReply> {
  return res
    .code(200)
    .send(
      await paginateWorkspaceByUserUuidController(
        (req.query as any).take,
        (req.query as any).take,
        req.headers.authorization,
        context
      )
    );
}

async function getFullWorkspace(
  req: FastifyRequest,
  res: FastifyReply,
  context: Context,
) {
  return res
    .code(200)
    .send(
      await getFullWorkspaceByUuid((req.params as any).id,
        req.headers.authorization,
        context
      )
    );
}

export const WORKSPACE_CONTROLLERS: Controller[] = [
  {
    path: "/workspace",
    handler: createWorkspace,
    defaultCode: 201,
    method: "post",
  },
  {
    path: "/workspace/:id",
    handler: getFullWorkspace,
    defaultCode: 200,
    method: "get",
  },
  {
    path: "/workspace",
    handler: paginateWorkspaceByUserUuid,
    defaultCode: 200,
    method: "get",
  },
];
