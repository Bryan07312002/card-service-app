import { describe, expect, jest, it } from "@jest/globals";
import { WorkspaceService } from "@domain/services/workspaceService";
import { Workspace } from "@domain/models/workspace";
import { Uuid } from "@domain/types";

describe("WorkspaceService tests", () => {
  const mockUuidRepository = {
    createV4: jest.fn((): Uuid => "a-a-a-a-a-a"),
  };

  const mockWorkspaceRepository = {
    insert: jest.fn(
      async () =>
        new Workspace(
          "a-a-a-a-a-a",
          "Workspace 1",
          "a-a-a-a-a-a",
          "Description 1",
        ),
    ),
    paginate: jest.fn(async () => ({
      data: [
        new Workspace(
          "a-a-a-a-a-a",
          "Workspace 1",
          "a-a-a-a-a-a",
          "Description 1",
        ),
        new Workspace(
          "a-a-a-a-a-2",
          "Workspace 2",
          "a-a-a-a-a-1",
          "Description 1",
        ),
      ],
      count: 2,
      page: 1,
    })),
    filter_one: jest.fn(
      async () =>
        new Workspace(
          "a-a-a-a-a-2",
          "Workspace 1",
          "a-a-a-a-a-1",
          "Description 1",
        ),
    ),
    delete: jest.fn(async () => {}),
    Update: jest.fn(
      async () =>
        new Workspace(
          "a-a-a-a-a-2",
          "workspace 2",
          "a-a-a-a-a-1",
          "description 1",
        ),
    ),
  };

  it("should create a workspace", async () => {
    const workspaceDto = {
      name: "Workspace 1",
      description: "Description 1",
    };

    const userId = "userId";

    const createdWorkspace = await WorkspaceService.create(
      {
        workspace: mockWorkspaceRepository,
        uuid: mockUuidRepository,
      },
      workspaceDto,
    );

    expect(createdWorkspace.id).toBeDefined();
    expect(createdWorkspace.name).toBe("Workspace 1");
    expect(createdWorkspace.description).toBe("Description 1");
    expect(createdWorkspace.userId).toBeDefined();
  });

  it("should paginate workspaces", async () => {
    const filter = {};
    const args = { page: 1, limit: 10 };

    const paginatedWorkspaces = await WorkspaceService.paginate(
      {
        workspace: mockWorkspaceRepository,
      },
      filter,
      args,
    );

    expect(paginatedWorkspaces.data.length).toBe(2);
    expect(paginatedWorkspaces.count).toBe(2);
    expect(paginatedWorkspaces.data[0].name).toBe("Workspace 1");
    expect(paginatedWorkspaces.data[1].name).toBe("Workspace 2");
  });

  it("should filter one workspace", async () => {
    const filter = { id: "workspaceId1" };

    const filteredWorkspace = await WorkspaceService.filter_one(
      {
        workspace: mockWorkspaceRepository,
      },
      filter,
    );

    expect(filteredWorkspace.id).toBeDefined();
    expect(filteredWorkspace.name).toBe("Workspace 1");
    expect(filteredWorkspace.description).toBe("Description 1");
  });
});
