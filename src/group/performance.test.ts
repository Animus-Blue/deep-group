import group from ".";
import tasks from "../testdata/tasks.json";

test("group performance one key", () => {
  const t = performance.now();
  for (let i = 0; i < 1000; i++) {
    group(tasks, "shift");
  }
  console.log(
    "performance group by one key: " + Math.round(performance.now() - t)
  );
});

test("group performance two keys", () => {
  const t = performance.now();
  for (let i = 0; i < 1000; i++) {
    group(tasks, "type", "employee");
  }
  console.log(
    "performance group by 2 keys: " + Math.round(performance.now() - t)
  );
});

test("group performance three keys", () => {
  const t = performance.now();
  for (let i = 0; i < 1000; i++) {
    group(tasks, "shift", "type", "department");
  }
  console.log(
    "performance group by 3 keys: " + Math.round(performance.now() - t)
  );
});

test("group performance four keys", () => {
  const t = performance.now();
  for (let i = 0; i < 1000; i++) {
    group(tasks, "shift", "type", "department", "workstation");
  }
  console.log(
    "performance group by 4 keys: " + Math.round(performance.now() - t)
  );
});

test("group performance two keys - one is nearly unique", () => {
  const t = performance.now();
  for (let i = 0; i < 1000; i++) {
    group(tasks, "shift", "type", "department", "date");
  }
  console.log(
    "performance group by 4 keys - one nearly unique: " +
      Math.round(performance.now() - t)
  );
});
