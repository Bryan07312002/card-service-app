export type Uuid = `${string}-${string}-${string}-${string}-${string}`;
import { Card } from "./models/card";

export type NewUser = {
  username: string;
  email: string;
  password: string;
};

export type NewWorkspace = {
  name: string;
  description: string;
  userId: Uuid;
};

export type NewCard = {
  title: string;
  description: string;
  workspaceId: Uuid;
};
