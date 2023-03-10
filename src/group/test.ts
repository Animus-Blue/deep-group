import group from ".";
import tasks from "../testdata/tasks.json";
import { students } from "../testdata/students";
import { studentsWithMissingKeys } from "../testdata/students";

test("returns correct result with one key", () => {
  const groupedByShift = group(tasks, "shift");
  const groupedExpected = tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task["shift"]]: [...(acc[task["shift"]] || []), task],
    }),
    {}
  );
  expect(Object.keys(groupedByShift).length).toBe(
    Object.keys(groupedExpected).length
  );
  for (let key of Object.keys(groupedExpected)) {
    groupedByShift[key].sort((a, b) => b.id.localeCompare(a.id));
    groupedExpected[key].sort((a, b) => b.id.localeCompare(a.id));
    expect(groupedByShift[key]).toEqual(groupedExpected[key]);
  }
});

test("returns correct result with multiple keys", () => {
  const groupedByShiftAndType = group(tasks, "shift", "type");
  const groupedExpected = tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task["shift"]]: {
        ...(acc[task["shift"]] || []),
        [task["type"]]: [...(acc[task["shift"]]?.[task["type"]] || []), task],
      },
    }),
    {}
  );
  expect(Object.keys(groupedByShiftAndType).length).toBe(
    Object.keys(groupedExpected).length
  );
  for (let key of Object.keys(groupedExpected)) {
    expect(Object.keys(groupedByShiftAndType[key]).length).toBe(
      Object.keys(groupedExpected[key]).length
    );
    for (let subKey of Object.keys(groupedExpected[key])) {
      groupedByShiftAndType[key][subKey].sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      groupedExpected[key][subKey].sort((a, b) => b.id.localeCompare(a.id));
      expect(groupedByShiftAndType[key][subKey]).toEqual(
        groupedExpected[key][subKey]
      );
    }
  }
});

test("returns correct result with multiple keys and ignores missing values", () => {
  const groupedByShiftAndType = group(tasks, "workStation", "employee");
  const groupedExpected = tasks
    .filter((task) => task.workStation && task.employee)
    .reduce(
      (acc, task: any) => ({
        ...acc,
        [task["workStation"]]: {
          ...(acc[task["workStation"]] || []),
          [task["employee"]]: [
            ...(acc[task["workStation"]]?.[task["employee"]] || []),
            task,
          ],
        },
      }),
      {}
    );
  expect(Object.keys(groupedByShiftAndType).length).toBe(
    Object.keys(groupedExpected).length
  );
  for (let key of Object.keys(groupedExpected)) {
    expect(Object.keys(groupedByShiftAndType[key]).length).toBe(
      Object.keys(groupedExpected[key]).length
    );
    for (let subKey of Object.keys(groupedExpected[key])) {
      groupedByShiftAndType[key][subKey].sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      groupedExpected[key][subKey].sort((a, b) => b.id.localeCompare(a.id));
      expect(groupedByShiftAndType[key][subKey]).toEqual(
        groupedExpected[key][subKey]
      );
    }
  }
});

test("returns correct result with multiple keys and ignores missing values mixed with present values", () => {
  const groupedByShiftAndType = group(tasks, "type", "employee");
  const groupedExpected = tasks
    .filter((task) => task.employee)
    .reduce(
      (acc, task: any) => ({
        ...acc,
        [task["type"]]: {
          ...(acc[task["type"]] || []),
          [task["employee"]]: [
            ...(acc[task["type"]]?.[task["employee"]] || []),
            task,
          ],
        },
      }),
      {}
    );
  expect(Object.keys(groupedByShiftAndType).length).toBe(
    Object.keys(groupedExpected).length
  );
  for (let key of Object.keys(groupedExpected)) {
    expect(Object.keys(groupedByShiftAndType[key]).length).toBe(
      Object.keys(groupedExpected[key]).length
    );
    for (let subKey of Object.keys(groupedExpected[key])) {
      groupedByShiftAndType[key][subKey].sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      groupedExpected[key][subKey].sort((a, b) => b.id.localeCompare(a.id));
      expect(groupedByShiftAndType[key][subKey]).toEqual(
        groupedExpected[key][subKey]
      );
    }
  }
});

test("returns correct result with a nested key", () => {
  const studentsByAgeAndZipCode = group(students, "age", "address.zipCode");

  expect(studentsByAgeAndZipCode).toEqual({
    "20": {
      "zipCode A": [
        {
          address: { street: "street A", zipCode: "zipCode A" },
          age: 20,
          id: "1",
          name: "John",
        },
      ],
    },
    "21": {
      "zipCode A": [
        {
          address: { street: "street B", zipCode: "zipCode A" },
          age: 21,
          id: "2",
          name: "Jane",
        },
        {
          address: { street: "street A", zipCode: "zipCode A" },
          age: 21,
          id: "3",
          name: "Jack",
        },
      ],
    },
    "22": {
      "zipCode A": [
        {
          address: { street: "street A", zipCode: "zipCode A" },
          age: 22,
          id: "6",
          name: "Jacky",
        },
      ],
      "zipCode B": [
        {
          address: { street: "street B", zipCode: "zipCode B" },
          age: 22,
          id: "4",
          name: "Jacky",
        },
      ],
    },
    "24": {
      "zipCode B": [
        {
          address: { street: "street A", zipCode: "zipCode B" },
          age: 24,
          id: "5",
          name: "Jacky",
        },
      ],
    },
  });
});

test("returns correct result with a nested key as first parameter", () => {
  const studentsByAgeAndZipCode = group(students, "address.zipCode", "age");

  expect(studentsByAgeAndZipCode).toEqual({
    "zipCode A": {
      "20": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode A",
          },
          age: 20,
          id: "1",
          name: "John",
        },
      ],
      "21": [
        {
          address: {
            street: "street B",
            zipCode: "zipCode A",
          },
          age: 21,
          id: "2",
          name: "Jane",
        },
        {
          address: {
            street: "street A",
            zipCode: "zipCode A",
          },
          age: 21,
          id: "3",
          name: "Jack",
        },
      ],
      "22": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode A",
          },
          age: 22,
          id: "6",
          name: "Jacky",
        },
      ],
    },
    "zipCode B": {
      "22": [
        {
          address: {
            street: "street B",
            zipCode: "zipCode B",
          },
          age: 22,
          id: "4",
          name: "Jacky",
        },
      ],
      "24": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode B",
          },
          age: 24,
          id: "5",
          name: "Jacky",
        },
      ],
    },
  });
});

test("returns correct result with a function", () => {
  const studentsByAgeAndZipCode = group(students, "age", (item) =>
    item.address.street.endsWith("A")
  );

  expect(studentsByAgeAndZipCode).toEqual({
    "20": {
      true: [
        {
          address: { street: "street A", zipCode: "zipCode A" },
          age: 20,
          id: "1",
          name: "John",
        },
      ],
    },
    "21": {
      true: [
        {
          address: { street: "street A", zipCode: "zipCode A" },
          age: 21,
          id: "3",
          name: "Jack",
        },
      ],
      false: [
        {
          address: { street: "street B", zipCode: "zipCode A" },
          age: 21,
          id: "2",
          name: "Jane",
        },
      ],
    },
    "22": {
      true: [
        {
          address: { street: "street A", zipCode: "zipCode A" },
          age: 22,
          id: "6",
          name: "Jacky",
        },
      ],
      false: [
        {
          address: { street: "street B", zipCode: "zipCode B" },
          age: 22,
          id: "4",
          name: "Jacky",
        },
      ],
    },
    "24": {
      true: [
        {
          address: { street: "street A", zipCode: "zipCode B" },
          age: 24,
          id: "5",
          name: "Jacky",
        },
      ],
    },
  });
});

test("returns correct result with a function as first parameter", () => {
  const studentsByAgeAndZipCode = group(
    students,
    (item) => item.address.street.endsWith("A"),
    "age"
  );

  expect(studentsByAgeAndZipCode).toEqual({
    false: {
      "21": [
        {
          address: {
            street: "street B",
            zipCode: "zipCode A",
          },
          age: 21,
          id: "2",
          name: "Jane",
        },
      ],
      "22": [
        {
          address: {
            street: "street B",
            zipCode: "zipCode B",
          },
          age: 22,
          id: "4",
          name: "Jacky",
        },
      ],
    },
    true: {
      "20": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode A",
          },
          age: 20,
          id: "1",
          name: "John",
        },
      ],
      "21": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode A",
          },
          age: 21,
          id: "3",
          name: "Jack",
        },
      ],
      "22": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode A",
          },
          age: 22,
          id: "6",
          name: "Jacky",
        },
      ],
      "24": [
        {
          address: {
            street: "street A",
            zipCode: "zipCode B",
          },
          age: 24,
          id: "5",
          name: "Jacky",
        },
      ],
    },
  });
});

test("ignores items with missing keys", () => {
  const studentsByAgeAndZipCode = group(
    studentsWithMissingKeys,
    "age",
    "address.zipCode"
  );

  expect(studentsByAgeAndZipCode).toEqual({
    "21": {
      "zipCode A": [
        {
          address: { street: "street B", zipCode: "zipCode A" },
          age: 21,
          id: "2",
          name: "Jane",
        },
        { address: { zipCode: "zipCode A" }, age: 21, id: "3", name: "Jack" },
      ],
    },
    "22": {
      "zipCode B": [
        {
          address: { street: "street B", zipCode: "zipCode B" },
          age: 22,
          id: "4",
          name: "Jacky",
        },
      ],
    },
  });
});

test("returns correct result with a function and ignores those for which function returns null or undefined", () => {
  const studentsByAgeAndZipCode = group(
    studentsWithMissingKeys,
    "age",
    (item) => item.address?.street?.endsWith("A")
  );

  expect(studentsByAgeAndZipCode).toEqual({
    "20": {
      true: [
        { address: { street: "street A" }, age: 20, id: "1", name: "John" },
      ],
    },
    "21": {
      false: [
        {
          address: { street: "street B", zipCode: "zipCode A" },
          age: 21,
          id: "2",
          name: "Jane",
        },
      ],
    },
    "22": {
      false: [
        {
          address: { street: "street B", zipCode: "zipCode B" },
          age: 22,
          id: "4",
          name: "Jacky",
        },
      ],
    },
  });
});

test("cannot pollute prototype with __proto__ property", () => {
  const toString = Object.prototype.toString;
  const attack1 = group(studentsWithMissingKeys, "__proto__", "name", "age");
  const attack2 = group(studentsWithMissingKeys, "name", "__proto__", "age");
  const attack3 = group(studentsWithMissingKeys, "name", "age", "__proto__");
  const attack4 = group(studentsWithMissingKeys, "__proto__.toString", "age");
  const attack5 = group(studentsWithMissingKeys, "__proto__");
  const attack6 = group(studentsWithMissingKeys, "__proto__.toString");
  const a: any = {};
  expect(a.name).toBe(undefined);
  expect(a.toString).toBe(toString);
  expect(a.John).toBe(undefined);
  expect(a.age).toBe(undefined);
  expect(a["20"]).toBe(undefined);
});

test("cannot pollute prototype with __proto__ values", () => {
  const toString = Object.prototype.toString;
  const students = [
    {
      id: "1",
      name: "John",
      age: "__proto__",
      address: { street: "street A" },
    },
    {
      id: "2",
      name: "__proto__",
      age: 21,
      address: { street: "street B", zipCode: "zipCode A" },
    },
    {
      id: "3",
      name: "John",
      age: 21,
      address: { street: "__proto__", zipCode: "zipCode A" },
    },
  ];
  const attack1 = group(students, "age", "name");
  const attack2 = group(students, "age.name");
  const attack3 = group(students, "age.__proto__");
  const attack4 = group(students, "age.name", "address.street");
  const attack5 = group(students, "age.__proto__", "address.street");
  const attack6 = group(students, "address.street", "name");
  const attack7 = group(students, "__proto__", "name", "age");
  const attack8 = group(students, "name", "__proto__", "age");
  const a: any = {};
  expect(a.name).toBe(undefined);
  expect(a.toString).toBe(toString);
  expect(a.John).toBe(undefined);
  expect(a.age).toBe(undefined);
  expect(a.street).toBe(undefined);
  expect(a.address).toBe(undefined);
  expect(a["street A"]).toBe(undefined);
  expect(a["street B"]).toBe(undefined);
  expect(a["20"]).toBe(undefined);
  expect(a["21"]).toBe(undefined);
});
