type Property = string | ((item: any) => string | number | boolean);

function add(properties: Property[]) {
  const property = properties[properties.length - 1];
  let add;
  if (typeof property === "function") {
    add = (data: any, item: any) => {
      const value: any = property(item);
      if (value === null || value === undefined) {
        return false;
      }
      if (data.hasOwnProperty(value)) {
        data[value].push(item);
      } else {
        data[value] = [item];
      }
      return true;
    };
  } else if (property.indexOf(".") === -1) {
    add = (data: any, item: any) => {
      const value: any = item[property];
      if (value === null || value === undefined) {
        return false;
      }
      if (data.hasOwnProperty(value)) {
        data[value].push(item);
      } else {
        data[value] = [item];
      }
      return true;
    };
  } else {
    const path = property.split(".");
    add = (data: any, item: any) => {
      let value = item;
      for (const property of path) {
        value = value[property];
        if (value === undefined || value === null) {
          return false;
        }
      }
      if (data.hasOwnProperty(value)) {
        data[value].push(item);
      } else {
        data[value] = [item];
      }
      return true;
    };
  }
  let result = add;
  for (let i = properties.length - 2; i >= 0; i--) {
    const prev = result;
    const property = properties[i];
    if (typeof property === "function") {
      result = (data: any, item: any) => {
        const value: any = property(item);
        if (value === null || value === undefined) {
          return false;
        }
        if (data.hasOwnProperty(value)) {
          return prev(data[value], item);
        }
        const newData = {};
        if (prev(newData, item)) {
          data[value] = newData;
          return true;
        }
        return false;
      };
    } else if (property.indexOf(".") === -1) {
      result = (data: any, item: any) => {
        const value: any = item[property];
        if (value === null || value === undefined) {
          return false;
        }
        if (data.hasOwnProperty(value)) {
          return prev(data[value], item);
        }
        const newData = {};
        if (prev(newData, item)) {
          data[value] = newData;
          return true;
        }
        return false;
      };
    } else {
      const path = property.split(".");
      result = (data: any, item: any) => {
        let value = item;
        for (const property of path) {
          value = value[property];
          if (value === undefined || value === null) {
            return false;
          }
        }
        if (data.hasOwnProperty(value)) {
          return prev(data[value], item);
        }
        const newData = {};
        if (prev(newData, item)) {
          data[value] = newData;
          return true;
        }
        return false;
      };
    }
  }
  return result;
}

function group(
  items: any[],
  ...properties: (string | ((item: any) => string | number | boolean))[]
): { [property: string]: any } {
  if (!Array.isArray(items)) {
    throw new Error("Can only group arrays");
  }
  const result = {};
  const addItem = add(properties);
  for (const item of items) {
    addItem(result, item);
  }
  return result;
}

export default group;
