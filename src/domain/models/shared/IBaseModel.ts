export default abstract class IBaseModel {
  // getters of the object
  serializeFields(): (keyof this)[] {
    return [];
  }

  toJson(): unknown {
    let fields = this.serializeFields();
    const json: any = {};
    for (let i = 0; i < fields.length; i++) {
      json[fields[i]] = this[fields[i]];
    }

    return json;
  }
}
