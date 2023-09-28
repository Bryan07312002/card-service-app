export interface IInsert<E> {
  insert(entity: E): Promise<E>;
}

export interface IFilterOne<E> {
  filter_one(filter: Filter<E>): Promise<E | null>;
}

export type Paginate<E> = {
  data: E[];
  page: number;
  count: number;
};

export type Filter<E> = {
  select: (keyof E)[];
  where: Partial<E>[];
};

export type Args = {
  take: number;
  page: number;
};

export interface IPaginate<E> {
  paginate(filter: Filter<E>, arg: Args): Promise<Paginate<Partial<E>>>;
}

export interface IDeleteOne<E> {
  delete(filter: Filter<E>): Promise<void>;
}

export interface IUpdateOne<E> {
  update(filter: Filter<E>, newData: Partial<E>): Promise<void>;
}
