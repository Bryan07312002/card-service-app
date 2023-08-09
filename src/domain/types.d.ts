export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

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
