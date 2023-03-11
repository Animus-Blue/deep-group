type Property = string | ((item: any) => string | number | boolean);

function addOnLeaf(
  property: string | ((item: any) => string | number | boolean)
): (data: { [value: string]: any }, item: any) => boolean {
  if (typeof property === "function") {
    return (data: any, item: any) => {
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
    return (data: any, item: any) => {
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
    return (data: any, item: any) => {
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
}

function addOnNode(
  property: string | ((item: any) => string | number | boolean),
  addOnNextNode: (data: { [value: string]: any }, item: any) => boolean
): (data: { [value: string]: any }, item: any) => boolean {
  if (typeof property === "function") {
    return (data: any, item: any) => {
      const value: any = property(item);
      if (value === null || value === undefined) {
        return false;
      }
      if (data.hasOwnProperty(value)) {
        return addOnNextNode(data[value], item);
      }
      const newData = {};
      if (addOnNextNode(newData, item)) {
        data[value] = newData;
        return true;
      }
      return false;
    };
  } else if (property.indexOf(".") === -1) {
    return (data: any, item: any) => {
      const value: any = item[property];
      if (value === null || value === undefined) {
        return false;
      }
      if (data.hasOwnProperty(value)) {
        return addOnNextNode(data[value], item);
      }
      const newData = {};
      if (addOnNextNode(newData, item)) {
        data[value] = newData;
        return true;
      }
      return false;
    };
  } else {
    const path = property.split(".");
    return (data: any, item: any) => {
      let value = item;
      for (const property of path) {
        value = value[property];
        if (value === undefined || value === null) {
          return false;
        }
      }
      if (data.hasOwnProperty(value)) {
        return addOnNextNode(data[value], item);
      }
      const newData = {};
      if (addOnNextNode(newData, item)) {
        data[value] = newData;
        return true;
      }
      return false;
    };
  }
}

function add(properties: Property[]) {
  const property = properties[properties.length - 1];
  let result: (data: { [value: string]: any }, item: any) => boolean =
    addOnLeaf(property);
  for (let i = properties.length - 2; i >= 0; i--) {
    result = addOnNode(properties[i], result);
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
