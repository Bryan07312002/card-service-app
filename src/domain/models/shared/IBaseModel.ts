export default abstract class IBaseModel<E> {
  // getters of the object
  serializeFields(): (keyof E)[] {
    return [];
  }

  toJson(): unknown {
    let fields = this.serializeFields();
    const json: any = {};
    for (let i = 0; i < fields.length; i++) {
      json[fields[i]] = (this as any)[fields[i]];
    }

    return json;
  }
}
