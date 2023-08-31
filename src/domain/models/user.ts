import { Uuid } from "../types";
import IBaseModel from "./shared/IBaseModel";
import { DomainError } from "@domain/error";

export class User extends IBaseModel<User> {
  private _id: Uuid;
  private _username!: string;
  private _email!: string;
  private _password!: string;

  constructor(id: Uuid, username: string, email: string, password: string) {
    super();
    this._id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  serializeFields(): (keyof User)[] {
    return ["id", "username", "email"];
  }

  get id(): Uuid {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  set username(username: string) {
    if (username.length >= 3 && username.length <= 20) {
      this._username = username;
    } else {
      throw new DomainError(
        {
          errors: {
            username: "Username must be between 3 and 20 characters.",
          },
        },
        422,
      );
    }
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(email)) {
      this._email = email;
    } else {
      throw new DomainError(
        { errors: { email: "Invalid email format." } },
        422,
      );
    }
  }

  set password(password: string) {
    if (password.length >= 5) {
      this._password = password;
    } else {
      throw new DomainError(
        {
          errors: {
            password: "Password must be at least 5 characters.",
          },
        },
        422,
      );
    }
  }

  matchPassword(incomingPassword: string): boolean {
    return this._password === incomingPassword;
  }

  toJson(): unknown {
    return {
      email: this.email,
      username: this.username,
      id: this.id,
    };
  }
}
