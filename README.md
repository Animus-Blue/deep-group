# deep-group

Blazingly fast multi layer grouping of your data.

```bash
npm install deep-group
```

## Usage

### Group your data by multiple properties

Example:

```js
const students = [
  { name: "John", age: 20, group: "C" },
  { name: "Jane", age: 21, group: "C" },
  { name: "Jack", age: 21, group: "D" },
  { name: "Jacky", age: 21, group: "D" },
];

const grouped = group(students, "age", "group");
```

The returned object will look like this:

```js
{
  "20": {
    C: [{ name: "John", age: 20, group: "C" }],
  },
  "21": {
    C: [{ name: "Jane", age: 21, group: "C" }],
    D: [
      { name: "Jack", age: 21, group: "D" },
      { name: "Jacky", age: 21, group: "D" },
    ],
  },
};
```

### Group your data by nested properties and by custom functions

Example:

```js
const students = [
  {
    name: "John",
    age: 20,
    address: { street: "some street 1", zipCode: "zipCode A" },
  },
  {
    name: "Jane",
    age: 21,
    address: { street: "some street 1337", zipCode: "zipCode B" },
  },
  {
    name: "Jack",
    age: 21,
    address: { street: "some street 42", zipCode: "zipCode A" },
  },
  {
    name: "Jacky",
    age: 22,
    address: { street: "some street 3", zipCode: "zipCode B" },
  },
];

const grouped = group(students, "address.zipCode", (student) =>
  student.age >= 21 ? "senior" : "junior"
);
```

The returned object will look like this:

```js
{
  "zipCode A": {
    junior: [
      {
        name: "John",
        age: 20,
        address: {
          street: "some street 1",
          zipCode: "zipCode A",
        },
      },
    ],
    senior: [
      {
        name: "Jack",
        age: 21,
        address: {
          street: "some street 42",
          zipCode: "zipCode A",
        },
      },
    ],
  },
  "zipCode B": {
    senior: [
      {
        name: "Jane",
        age: 21,
        address: {
          street: "some street 1337",
          zipCode: "zipCode B",
        },
      },
      {
        name: "Jacky",
        age: 22,
        address: {
          street: "some street 3",
          zipCode: "zipCode B",
        },
      },
    ],
  },
};
```

## License

[MIT](./LICENSE)
