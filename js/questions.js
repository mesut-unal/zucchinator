/*
 * Zucchinator question bank.
 *
 * HOW TO ADD QUESTIONS (this is meant to be edited by hand):
 *   - Copy any object below and change the fields.
 *   - Questions are served in ARRAY ORDER within each topic. Put a series'
 *     parts in order and they'll be delivered on consecutive days.
 *   - Fields:
 *       id        unique string (used to remember your progress) - never reuse
 *       topic     one of: "python" | "sql" | "ds" | "ai"
 *       series    optional group name shown as a chip, e.g. "Generators"
 *       part      optional [n, total], e.g. [2, 4]  -> shows "Part 2/4"
 *       title     short title
 *       difficulty "easy" | "medium" | "hard"
 *       minutes   estimated minutes (keep <= 10)
 *       prompt    the question (markdown supported: # headers, **bold**,
 *                 `inline code`, ```fenced code```, - lists, 1. lists)
 *       hint      one nudge (markdown)
 *       solution  worked answer (markdown)
 */

window.TOPICS = {
  python: { label: "Python", emoji: "🐍", blurb: "Coding practices & idioms" },
  sql:    { label: "SQL",    emoji: "🗃️", blurb: "Queries & window functions" },
  ds:     { label: "Data Science", emoji: "📊", blurb: "Stats & ML concepts" },
  ai:     { label: "AI Coding", emoji: "🤖", blurb: "DNN, ML & Agentic code" },
};

window.QUESTIONS = [
  /* ============================ PYTHON ============================ */
  {
    id: "py-gen-1", topic: "python", series: "Generators", part: [1, 4],
    title: "Your first generator", difficulty: "easy", minutes: 6,
    prompt:
`A **generator** produces values lazily, one at a time, instead of building a whole list in memory.

Write a generator function \`countdown(n)\` that yields \`n, n-1, ..., 1\`.

\`\`\`python
def countdown(n):
    # your code
    pass

print(list(countdown(3)))  # -> [3, 2, 1]
\`\`\``,
    hint: "Use the `yield` keyword inside a `while` or `for` loop. A function that contains `yield` automatically becomes a generator.",
    solution:
`\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1
\`\`\`

Calling \`countdown(3)\` does **not** run the body — it returns a generator object. Each \`next()\` (or a loop step) runs until the next \`yield\`, hands back the value, and pauses. Memory stays O(1) no matter how big \`n\` is.`,
  },
  {
    id: "py-gen-2", topic: "python", series: "Generators", part: [2, 4],
    title: "Generator expression vs list comprehension", difficulty: "easy", minutes: 6,
    prompt:
`Yesterday you wrote a generator function. Today: the one-liner form.

1. What does \`(x*x for x in range(5))\` return, and how is it different from \`[x*x for x in range(5)]\`?
2. Sum the squares of the first **10 million** integers. Which form should you use and why?`,
    hint: "Square brackets build the whole list in memory first. Parentheses build a generator that produces one value at a time.",
    solution:
`1. \`(x*x for x in range(5))\` is a **generator expression** — a lazy iterator. \`[...]\` builds a full list in memory immediately.
2. Use the generator form so nothing large is materialized:

\`\`\`python
total = sum(x * x for x in range(10_000_000))
\`\`\`

The list-comprehension version would allocate ~10M ints at once. The generator streams them into \`sum\`, staying O(1) in memory. Rule of thumb: if you only iterate once and don't need indexing, prefer the generator.`,
  },
  {
    id: "py-gen-3", topic: "python", series: "Generators", part: [3, 4],
    title: "Chaining generators into a pipeline", difficulty: "medium", minutes: 9,
    prompt:
`Generators compose into memory-light pipelines. Given a log file iterator \`lines\`, build a pipeline that:

1. strips whitespace,
2. keeps only lines containing \`"ERROR"\`,
3. yields the timestamp (first whitespace-separated token).

Write it as three small generators wired together. Assume \`lines\` is any iterable of strings.`,
    hint: "Each stage is a generator that takes an iterable and yields a transformed iterable. Feed the output of one into the next.",
    solution:
`\`\`\`python
def stripped(lines):
    for ln in lines:
        yield ln.strip()

def errors_only(lines):
    for ln in lines:
        if "ERROR" in ln:
            yield ln

def timestamps(lines):
    for ln in lines:
        yield ln.split()[0]

pipe = timestamps(errors_only(stripped(lines)))
for ts in pipe:
    print(ts)
\`\`\`

Nothing is read until you iterate \`pipe\`, and only one line is in flight at a time — you can process a 50 GB log on a laptop. This is the same idea as Unix pipes.`,
  },
  {
    id: "py-gen-4", topic: "python", series: "Generators", part: [4, 4],
    title: "yield from and delegation", difficulty: "medium", minutes: 8,
    prompt:
`\`yield from\` delegates to a sub-iterable. Use it to write \`flatten\` that flattens **one** level of nesting:

\`\`\`python
flatten([[1, 2], [3], [4, 5]])  # -> 1 2 3 4 5  (as a generator)
\`\`\`

Then explain in one line what \`yield from sub\` is shorthand for.`,
    hint: "`yield from iterable` yields every item from that iterable in turn.",
    solution:
`\`\`\`python
def flatten(nested):
    for sub in nested:
        yield from sub
\`\`\`

\`yield from sub\` is shorthand for \`for x in sub: yield x\` (and it also forwards \`send\`/\`throw\`/return values, which matters for coroutines). It makes delegating to sub-generators clean and is the building block for recursion over trees.`,
  },
  {
    id: "py-comp-filter", topic: "python", title: "Comprehension with filter + transform",
    difficulty: "easy", minutes: 5,
    prompt:
`In **one** list comprehension, from \`nums = range(20)\` produce the squares of the even numbers only.

Expected start: \`[0, 4, 16, 36, ...]\``,
    hint: "Comprehensions allow a trailing `if` for filtering: `[expr for x in it if cond]`.",
    solution:
`\`\`\`python
[x * x for x in range(20) if x % 2 == 0]
\`\`\`

Order matters: the \`for\` comes first, then the filtering \`if\`, then the transform \`x*x\` sits at the front. Filtering happens **before** the transform, so you never square odd numbers.`,
  },
  {
    id: "py-dict-invert", topic: "python", title: "Invert a dictionary",
    difficulty: "easy", minutes: 5,
    prompt:
`Given \`d = {"a": 1, "b": 2, "c": 3}\`, produce \`{1: "a", 2: "b", 3: "c"}\` in one line.

Bonus: what breaks if two keys share the same value?`,
    hint: "A dict comprehension can swap key and value: `{v: k for k, v in d.items()}`.",
    solution:
`\`\`\`python
{v: k for k, v in d.items()}
\`\`\`

**Bonus:** if two original keys map to the same value, the inverted dict can only keep one of them (the last one wins), because dict keys must be unique. To keep all, invert into lists:

\`\`\`python
from collections import defaultdict
inv = defaultdict(list)
for k, v in d.items():
    inv[v].append(k)
\`\`\``,
  },
  {
    id: "py-counter", topic: "python", title: "Most common words",
    difficulty: "easy", minutes: 6,
    prompt:
`Given a string \`text\`, return the 3 most common words (case-insensitive), as \`(word, count)\` pairs, using the standard library.`,
    hint: "`collections.Counter` has a `.most_common(n)` method.",
    solution:
`\`\`\`python
from collections import Counter
def top3(text):
    words = text.lower().split()
    return Counter(words).most_common(3)
\`\`\`

\`Counter\` is a \`dict\` subclass built for tallying. \`most_common(n)\` returns the \`n\` highest-count pairs, sorted descending. For real text you'd also strip punctuation, e.g. \`re.findall(r"[a-z']+", text.lower())\`.`,
  },
  {
    id: "py-dec-1", topic: "python", series: "Decorators", part: [1, 3],
    title: "What is a decorator?", difficulty: "medium", minutes: 8,
    prompt:
`A decorator wraps a function to add behavior. Write \`@logged\` that prints the function name before calling it:

\`\`\`python
@logged
def add(a, b):
    return a + b

add(2, 3)   # prints "calling add" then returns 5
\`\`\``,
    hint: "A decorator is a function that takes a function and returns a new function. Use `*args, **kwargs` so it works for any signature.",
    solution:
`\`\`\`python
def logged(fn):
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper
\`\`\`

\`@logged\` above \`add\` is exactly \`add = logged(add)\`. The returned \`wrapper\` replaces \`add\`; it forwards all arguments and the return value so callers can't tell the difference — except for the added log line.`,
  },
  {
    id: "py-dec-2", topic: "python", series: "Decorators", part: [2, 3],
    title: "Preserve metadata with functools.wraps", difficulty: "medium", minutes: 6,
    prompt:
`After decorating \`add\` from yesterday, \`add.__name__\` is \`"wrapper"\` and its docstring is gone. Fix the decorator so the wrapped function keeps its identity.`,
    hint: "`functools.wraps` copies `__name__`, `__doc__`, etc. from the original onto the wrapper.",
    solution:
`\`\`\`python
import functools

def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper
\`\`\`

\`@functools.wraps(fn)\` copies \`__name__\`, \`__doc__\`, \`__module__\`, and \`__wrapped__\` from \`fn\` onto \`wrapper\`. Without it, tooling (help text, debuggers, some frameworks) sees "wrapper" everywhere. Always add it to decorators you write.`,
  },
  {
    id: "py-dec-3", topic: "python", series: "Decorators", part: [3, 3],
    title: "A decorator that takes arguments", difficulty: "hard", minutes: 10,
    prompt:
`Write \`@retry(times=3)\` that re-runs a function if it raises, up to \`times\` attempts, then re-raises the last error.

\`\`\`python
@retry(times=3)
def flaky():
    ...
\`\`\``,
    hint: "A decorator *with arguments* is a function returning a decorator returning a wrapper — three nested layers.",
    solution:
`\`\`\`python
import functools

def retry(times=3):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            last = None
            for _ in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last = e
            raise last
        return wrapper
    return decorator
\`\`\`

Three layers: \`retry(times=3)\` runs first and returns \`decorator\`; \`decorator(flaky)\` returns \`wrapper\`; \`wrapper\` is what runs on each call. The extra layer exists purely to capture the \`times\` argument.`,
  },
  {
    id: "py-ctx", topic: "python", title: "Context manager with contextlib",
    difficulty: "medium", minutes: 7,
    prompt:
`Write a context manager \`timer()\` that prints how long the \`with\` block took:

\`\`\`python
with timer():
    do_work()   # prints e.g. "elapsed 0.42s"
\`\`\`

Use \`contextlib\`.`,
    hint: "`@contextlib.contextmanager` turns a generator into a context manager: code before `yield` is setup, after is teardown.",
    solution:
`\`\`\`python
import time, contextlib

@contextlib.contextmanager
def timer():
    start = time.perf_counter()
    try:
        yield
    finally:
        print(f"elapsed {time.perf_counter() - start:.2f}s")
\`\`\`

Everything before \`yield\` runs on \`__enter__\`; everything after runs on \`__exit__\`. Wrapping in \`try/finally\` guarantees the elapsed time prints even if the block raises.`,
  },
  {
    id: "py-dataclass", topic: "python", title: "dataclass for a value object",
    difficulty: "easy", minutes: 6,
    prompt:
`Create an immutable \`Point\` with \`x\` and \`y\` floats that supports \`==\` and a nice \`repr\`, without writing \`__init__\`, \`__eq__\`, or \`__repr__\` yourself.`,
    hint: "`@dataclass` generates those methods. `frozen=True` makes instances immutable and hashable.",
    solution:
`\`\`\`python
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float
\`\`\`

\`@dataclass\` auto-generates \`__init__\`, \`__repr__\`, and \`__eq__\` from the annotated fields. \`frozen=True\` blocks attribute assignment (making it immutable) and gives you a \`__hash__\`, so \`Point\` can be a dict key or go in a set.`,
  },
  {
    id: "py-mutable-default", topic: "python", title: "The mutable default argument trap",
    difficulty: "medium", minutes: 7,
    prompt:
`This function misbehaves. Why, and how do you fix it?

\`\`\`python
def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item(1))  # [1]
print(add_item(2))  # expected [2] ... but?
\`\`\``,
    hint: "Default argument values are evaluated once, when the function is defined — not on each call.",
    solution:
`The second call prints \`[1, 2]\`. The default list is created **once** at definition time and shared across every call that uses the default, so it accumulates.

Fix with the \`None\` sentinel:

\`\`\`python
def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
\`\`\`

Now a fresh list is made on each call. This applies to any mutable default (\`[]\`, \`{}\`, \`set()\`).`,
  },
  {
    id: "py-itertools-groupby", topic: "python", title: "itertools.groupby gotcha",
    difficulty: "hard", minutes: 9,
    prompt:
`Group \`data = [("a",1),("a",2),("b",3),("a",4)]\` by the first element into \`{"a": [...], "b": [...]}\`.

There's a classic bug if you reach for \`itertools.groupby\`. What is it, and what's the robust fix?`,
    hint: "`itertools.groupby` only groups *consecutive* equal keys — it does not sort first.",
    solution:
`\`itertools.groupby\` groups **consecutive** runs, so on unsorted data \`"a"\` would appear as two separate groups. You'd have to sort by the key first — or just use a \`defaultdict\`, which doesn't care about order:

\`\`\`python
from collections import defaultdict
groups = defaultdict(list)
for k, v in data:
    groups[k].append(v)
# {"a": [1, 2, 4], "b": [3]}
\`\`\`

For interviews, \`groupby\` is a trap unless the data is already sorted; \`defaultdict(list)\` is the safe default.`,
  },

  /* ============================== SQL ============================== */
  {
    id: "sql-win-1", topic: "sql", series: "Aggregation → Windows", part: [1, 5],
    title: "GROUP BY basics", difficulty: "easy", minutes: 6,
    prompt:
`Table \`sales(region, amount)\`. Write SQL for **total amount per region**, highest total first.`,
    hint: "One row per region: `GROUP BY region`, aggregate with `SUM`, then `ORDER BY` the aggregate.",
    solution:
`\`\`\`sql
SELECT region, SUM(amount) AS total
FROM sales
GROUP BY region
ORDER BY total DESC;
\`\`\`

\`GROUP BY region\` collapses all rows of a region into one; \`SUM(amount)\` aggregates within each group. You can \`ORDER BY\` an aggregate or its alias.`,
  },
  {
    id: "sql-win-2", topic: "sql", series: "Aggregation → Windows", part: [2, 5],
    title: "WHERE vs HAVING", difficulty: "easy", minutes: 6,
    prompt:
`Using \`sales(region, amount)\`, return only regions whose **total** amount exceeds 1000. Then: why can't you put that condition in \`WHERE\`?`,
    hint: "`WHERE` filters rows *before* grouping; `HAVING` filters groups *after* aggregation.",
    solution:
`\`\`\`sql
SELECT region, SUM(amount) AS total
FROM sales
GROUP BY region
HAVING SUM(amount) > 1000;
\`\`\`

\`WHERE\` runs before rows are grouped, so aggregates like \`SUM(amount)\` don't exist yet — referencing them there is an error. \`HAVING\` runs after grouping, when the aggregate is defined. Filter raw rows with \`WHERE\`, filter groups with \`HAVING\`.`,
  },
  {
    id: "sql-win-3", topic: "sql", series: "Aggregation → Windows", part: [3, 5],
    title: "Your first window function", difficulty: "medium", minutes: 8,
    prompt:
`\`sales(region, amount)\`. For **each row**, show the region's total alongside the individual amount — *without* collapsing rows.

\`\`\`
region  amount  region_total
east    100     300
east    200     300
west    50      50
\`\`\``,
    hint: "A window function with `OVER (PARTITION BY ...)` aggregates without collapsing rows.",
    solution:
`\`\`\`sql
SELECT region, amount,
       SUM(amount) OVER (PARTITION BY region) AS region_total
FROM sales;
\`\`\`

Unlike \`GROUP BY\`, a **window function** keeps every original row and computes the aggregate over a "window" of related rows. \`PARTITION BY region\` defines the window as "rows sharing this region." No \`GROUP BY\` needed.`,
  },
  {
    id: "sql-win-4", topic: "sql", series: "Aggregation → Windows", part: [4, 5],
    title: "ROW_NUMBER vs RANK vs DENSE_RANK", difficulty: "medium", minutes: 9,
    prompt:
`\`scores(player, points)\`. Rank players by points, highest first. Explain how \`ROW_NUMBER\`, \`RANK\`, and \`DENSE_RANK\` differ when two players **tie**.`,
    hint: "All three number rows within an ordering; they differ only on how they treat ties and what number comes next.",
    solution:
`\`\`\`sql
SELECT player, points,
       ROW_NUMBER() OVER (ORDER BY points DESC) AS rn,
       RANK()       OVER (ORDER BY points DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY points DESC) AS dense
FROM scores;
\`\`\`

For points \`100, 100, 90\`:
- \`ROW_NUMBER\` → \`1, 2, 3\` (arbitrary tiebreak, always unique).
- \`RANK\` → \`1, 1, 3\` (ties share a rank, then it **skips**).
- \`DENSE_RANK\` → \`1, 1, 2\` (ties share, **no gap**).

Use \`ROW_NUMBER\` for "one row per group" (e.g. latest record); \`DENSE_RANK\` for "top N distinct values."`,
  },
  {
    id: "sql-win-5", topic: "sql", series: "Aggregation → Windows", part: [5, 5],
    title: "Running total & moving average", difficulty: "hard", minutes: 10,
    prompt:
`\`daily(dt, revenue)\`. Produce a **running total** of revenue ordered by date, and a **3-day moving average**.`,
    hint: "Add a frame clause: `ROWS BETWEEN ... AND CURRENT ROW` defines which rows the window covers.",
    solution:
`\`\`\`sql
SELECT dt, revenue,
       SUM(revenue) OVER (ORDER BY dt
             ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
       AVG(revenue) OVER (ORDER BY dt
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_3d
FROM daily;
\`\`\`

The **frame clause** picks which rows the aggregate covers. \`UNBOUNDED PRECEDING → CURRENT ROW\` = everything up to now (a running total). \`2 PRECEDING → CURRENT ROW\` = this row plus the previous two (a 3-row moving average). Without a frame, an \`ORDER BY\` window defaults to \`RANGE UNBOUNDED PRECEDING\`.`,
  },
  {
    id: "sql-joins", topic: "sql", title: "INNER vs LEFT JOIN",
    difficulty: "easy", minutes: 7,
    prompt:
`\`users(id, name)\` and \`orders(user_id, total)\`. Write a query listing **every** user with their number of orders, including users with **zero** orders (showing 0). Which join type, and why not INNER?`,
    hint: "INNER JOIN drops users with no matching orders. LEFT JOIN keeps all left-table rows, filling NULLs.",
    solution:
`\`\`\`sql
SELECT u.id, u.name, COUNT(o.user_id) AS n_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;
\`\`\`

\`INNER JOIN\` only keeps rows that match on both sides, so users with no orders vanish. \`LEFT JOIN\` keeps every user and fills \`NULL\` for missing orders. Key detail: count \`o.user_id\` (the joined column), **not** \`COUNT(*)\` — \`COUNT\` ignores NULLs, so a user with no orders correctly gets 0.`,
  },
  {
    id: "sql-second-highest", topic: "sql", title: "Second highest salary",
    difficulty: "medium", minutes: 8,
    prompt:
`\`employees(id, salary)\`. Return the **second highest distinct** salary. It must return \`NULL\` if there's no second value. (Classic interview question.)`,
    hint: "Handle duplicates (DISTINCT) and the empty case. `OFFSET`/`LIMIT` or a subquery both work.",
    solution:
`\`\`\`sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
\`\`\`

The inner query finds the top salary; the outer takes the max of everything below it. Wrapping in \`MAX\` guarantees a single row with \`NULL\` when no such salary exists (instead of returning no rows). A \`DENSE_RANK() = 2\` window solution also works and generalizes to Nth.`,
  },
  {
    id: "sql-dedupe", topic: "sql", title: "Keep the latest row per key",
    difficulty: "hard", minutes: 10,
    prompt:
`\`events(user_id, event_time, status)\` may have many rows per user. Return only the **most recent** row per \`user_id\`.`,
    hint: "Number rows within each user by descending time, then keep number 1.",
    solution:
`\`\`\`sql
SELECT user_id, event_time, status
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY user_id
                            ORDER BY event_time DESC) AS rn
  FROM events
) t
WHERE rn = 1;
\`\`\`

\`ROW_NUMBER()\` numbers each user's rows newest-first; \`rn = 1\` keeps only the latest. You must filter in an outer query (or CTE) because window functions can't appear in \`WHERE\` — they're computed after \`WHERE\` runs.`,
  },
  {
    id: "sql-cte", topic: "sql", title: "Readable queries with CTEs",
    difficulty: "medium", minutes: 7,
    prompt:
`Rewrite this nested query using a **CTE** (\`WITH\`) so it reads top-to-bottom:

\`\`\`sql
SELECT region, avg_amt FROM
  (SELECT region, AVG(amount) AS avg_amt FROM sales GROUP BY region) s
WHERE avg_amt > 100;
\`\`\``,
    hint: "`WITH name AS (...)` defines a named subquery you can select from below.",
    solution:
`\`\`\`sql
WITH region_avg AS (
    SELECT region, AVG(amount) AS avg_amt
    FROM sales
    GROUP BY region
)
SELECT region, avg_amt
FROM region_avg
WHERE avg_amt > 100;
\`\`\`

A **CTE** (Common Table Expression) names an intermediate result so the query reads linearly instead of inside-out. It's purely readability here, but CTEs also let you reference the same subquery multiple times and write recursive queries.`,
  },

  /* ========================= DATA SCIENCE ========================= */
  {
    id: "ds-stat-1", topic: "ds", series: "Inference", part: [1, 4],
    title: "Mean, variance, std — intuition", difficulty: "easy", minutes: 6,
    prompt:
`In plain words: what does the **standard deviation** tell you that the **mean** doesn't? And why do we square deviations for variance instead of just averaging them?`,
    hint: "Deviations from the mean sum to zero. Think about what squaring fixes.",
    solution:
`The **mean** is the center; the **standard deviation** is the typical distance of points from that center — the spread. Two datasets can share a mean but one is tightly clustered and the other wildly scattered.

We square deviations because raw deviations \`(x − mean)\` **sum to exactly zero** (positives cancel negatives), so their average is useless. Squaring makes them all positive and penalizes large deviations more. Variance is the mean squared deviation; **std = √variance** brings the units back to the original scale.`,
  },
  {
    id: "ds-stat-2", topic: "ds", series: "Inference", part: [2, 4],
    title: "The Central Limit Theorem", difficulty: "medium", minutes: 8,
    prompt:
`State the **Central Limit Theorem** in your own words. If a population is heavily skewed, what does the distribution of the **sample mean** look like as sample size grows, and what's its standard deviation?`,
    hint: "The CLT is about the distribution of the *mean of samples*, not the raw data.",
    solution:
`The **CLT** says that the distribution of the **sample mean** approaches a normal (bell) distribution as sample size \`n\` grows, **regardless of the population's shape** — even if the raw data is heavily skewed.

- Its center equals the population mean.
- Its spread is the **standard error** = \`σ / √n\`, which shrinks as \`n\` grows.

This is why we can use normal-based confidence intervals and z/t-tests on averages even when individual data isn't normal. It kicks in surprisingly fast (often \`n ≈ 30\` for mild skew).`,
  },
  {
    id: "ds-stat-3", topic: "ds", series: "Inference", part: [3, 4],
    title: "Confidence intervals", difficulty: "medium", minutes: 8,
    prompt:
`You measure a sample mean of 50 with standard error 2. Give an approximate **95% confidence interval**. Then answer: is it correct to say "there's a 95% probability the true mean is in this interval"?`,
    hint: "≈95% of a normal sits within about ±1.96 standard errors of the mean. Watch the interpretation.",
    solution:
`95% CI ≈ \`50 ± 1.96 × 2\` = \`50 ± 3.92\` → roughly **(46.1, 53.9)**.

**Interpretation:** the tempting statement is subtly wrong. The true mean is fixed, not random — for a given interval it's either in or out. The correct frequentist reading: "if we repeated the sampling many times, about 95% of the intervals we build this way would contain the true mean." The 95% describes the *procedure*, not this one interval.`,
  },
  {
    id: "ds-stat-4", topic: "ds", series: "Inference", part: [4, 4],
    title: "p-values and hypothesis testing", difficulty: "hard", minutes: 10,
    prompt:
`Define a **p-value** precisely. If \`p = 0.03\` at significance level \`α = 0.05\`, what do you conclude? Name one common **misinterpretation**.`,
    hint: "A p-value is a probability computed *assuming the null hypothesis is true*.",
    solution:
`A **p-value** is the probability of observing data *at least as extreme* as what you saw, **assuming the null hypothesis is true**.

With \`p = 0.03 < α = 0.05\`, you **reject the null** — the result is "statistically significant" at the 5% level.

**Common misinterpretation:** p is NOT the probability that the null hypothesis is true, and \`1 − p\` is NOT the probability the alternative is true. It also says nothing about **effect size** — a tiny, meaningless effect can be highly significant with enough data. Report effect sizes and CIs alongside p.`,
  },
  {
    id: "ds-ml-bias-var", topic: "ds", series: "ML foundations", part: [1, 4],
    title: "Bias–variance tradeoff", difficulty: "medium", minutes: 8,
    prompt:
`Explain **bias** and **variance** as sources of model error. Which one dominates for (a) a linear model on complex data, and (b) a deep decision tree with no pruning?`,
    hint: "Bias = wrong assumptions (too simple). Variance = sensitivity to the particular training set (too complex).",
    solution:
`- **Bias**: error from overly simple assumptions — the model can't capture the true pattern (**underfitting**). High bias = wrong on training *and* test.
- **Variance**: error from over-sensitivity to the specific training data — the model memorizes noise (**overfitting**). High variance = great on training, poor on test.

(a) A **linear model on complex data** → high **bias** (too simple).
(b) A **deep unpruned tree** → high **variance** (fits noise, unstable across samples).

Total error ≈ bias² + variance + irreducible noise. Lowering one often raises the other; you tune complexity to minimize the sum.`,
  },
  {
    id: "ds-ml-reg", topic: "ds", series: "ML foundations", part: [2, 4],
    title: "L1 vs L2 regularization", difficulty: "medium", minutes: 8,
    prompt:
`Regularization fights overfitting by penalizing large weights. How do **L1 (Lasso)** and **L2 (Ridge)** differ in their effect on the weights, and when would you pick L1?`,
    hint: "One penalizes the sum of absolute weights, the other the sum of squared weights. What does that do at zero?",
    solution:
`- **L2 (Ridge)** adds \`λ Σ wᵢ²\`. It shrinks all weights smoothly toward zero but rarely makes them exactly zero.
- **L1 (Lasso)** adds \`λ Σ |wᵢ|\`. Its gradient doesn't vanish near zero, so it drives many weights **exactly to zero** — performing automatic **feature selection**.

Pick **L1** when you suspect many features are irrelevant and want a sparse, interpretable model. Pick **L2** when most features matter a little and you want stability (especially with correlated features). **Elastic Net** combines both.`,
  },
  {
    id: "ds-ml-cv", topic: "ds", series: "ML foundations", part: [3, 4],
    title: "Why k-fold cross-validation", difficulty: "medium", minutes: 7,
    prompt:
`Explain **k-fold cross-validation**. Why is it better than a single train/test split for estimating model performance? Name one pitfall that leaks information.`,
    hint: "A single split gives one noisy estimate that depends on which rows landed in test.",
    solution:
`**k-fold CV** splits data into \`k\` folds; you train on \`k−1\` and validate on the held-out fold, rotating so every fold is validated once, then average the \`k\` scores.

It beats a single split because the estimate uses **all** data for both training and validation and **averages out** the luck of any one split — giving a lower-variance performance estimate.

**Leakage pitfall:** doing preprocessing (scaling, feature selection, imputation) on the *whole* dataset before splitting lets test information seep into training. Fit all transforms **inside** each fold's training portion only (e.g. via a \`Pipeline\`).`,
  },
  {
    id: "ds-ml-metrics", topic: "ds", series: "ML foundations", part: [4, 4],
    title: "Precision, recall, F1", difficulty: "medium", minutes: 9,
    prompt:
`For a **fraud detector** where fraud is 0.5% of transactions: define **precision** and **recall**, explain why **accuracy** is a bad metric here, and say which of precision/recall you'd prioritize and why.`,
    hint: "A model that predicts 'never fraud' is 99.5% accurate. Precision = of flagged, how many real. Recall = of real, how many caught.",
    solution:
`- **Precision** = TP / (TP + FP): of the transactions flagged as fraud, how many really are.
- **Recall** = TP / (TP + FN): of all actual fraud, how much you caught.

**Accuracy is useless** here: predicting "never fraud" scores 99.5% while catching zero fraud. With a 0.5% positive rate, accuracy is dominated by the majority class.

Usually you prioritize **recall** — missing fraud (a false negative) is costly — while watching precision so you don't drown investigators in false alarms. **F1** = harmonic mean of the two, useful when you need a single balanced number. The real answer depends on the cost of FP vs FN.`,
  },
  {
    id: "ds-bayes", topic: "ds", title: "Bayes' theorem — the classic test problem",
    difficulty: "hard", minutes: 10,
    prompt:
`A disease affects **1%** of people. A test is **99%** sensitive (true positive rate) and **95%** specific (so 5% false positive rate). You test positive. What's the probability you actually have the disease? (Intuition says ~99%. Compute it.)`,
    hint: "P(disease | positive) = P(pos|disease)P(disease) / P(pos). Compute P(pos) from both groups.",
    solution:
`\`\`\`
P(pos) = P(pos|D)P(D) + P(pos|¬D)P(¬D)
       = 0.99 × 0.01 + 0.05 × 0.99
       = 0.0099 + 0.0495 = 0.0594

P(D|pos) = 0.0099 / 0.0594 ≈ 0.167
\`\`\`

Only about **17%** — not 99%. Because the disease is rare, the large healthy population produces many false positives (0.0495) that swamp the true positives (0.0099). This "base rate neglect" is why a single positive on a screening test for a rare condition usually warrants a confirmatory test.`,
  },
  {
    id: "ds-grad-descent", topic: "ds", title: "Gradient descent intuition",
    difficulty: "medium", minutes: 7,
    prompt:
`Explain **gradient descent** to someone non-technical using an analogy, then state the update rule. What goes wrong if the **learning rate** is too big or too small?`,
    hint: "Think of walking downhill in fog. The gradient points uphill.",
    solution:
`**Analogy:** you're on a foggy hillside trying to reach the bottom. You feel which way is steepest downhill and take a step that way; repeat until the ground is flat.

**Update rule:** \`w ← w − η · ∇L(w)\`, where \`∇L\` is the gradient (points uphill, so we subtract it) and \`η\` is the learning rate (step size).

- **Too big**: you overshoot the minimum and can bounce around or diverge.
- **Too small**: you creep along and training takes forever, and can get stuck in flat/plateau regions.

Adaptive optimizers (Adam) and learning-rate schedules exist to manage this.`,
  },

  /* =========================== AI CODING =========================== */
  {
    id: "ai-dnn-1", topic: "ai", series: "DNN from scratch", part: [1, 5],
    title: "A single neuron's forward pass", difficulty: "easy", minutes: 7,
    prompt:
`A neuron computes \`z = w·x + b\` then an activation. In NumPy, implement the **linear part** for one neuron:

\`\`\`python
import numpy as np
def neuron(x, w, b):
    # x, w are 1-D arrays; b is a float
    ...
neuron(np.array([1.,2.]), np.array([0.5,-1.]), 0.1)  # -> -1.4
\`\`\``,
    hint: "The weighted sum `w·x` is a dot product: `np.dot(w, x)`.",
    solution:
`\`\`\`python
import numpy as np
def neuron(x, w, b):
    return np.dot(w, x) + b
\`\`\`

\`np.dot(w, x)\` = \`0.5·1 + (−1)·2 = −1.5\`, plus \`b = 0.1\` → \`−1.4\`. This weighted sum plus bias is the linear pre-activation \`z\`; the activation function (next part) makes it nonlinear. A full layer just stacks many neurons: \`W @ x + b\` with \`W\` a matrix.`,
  },
  {
    id: "ai-dnn-2", topic: "ai", series: "DNN from scratch", part: [2, 5],
    title: "Activation functions", difficulty: "easy", minutes: 7,
    prompt:
`Implement \`sigmoid(z)\` and \`relu(z)\` in NumPy (vectorized). Then: why do we need a **nonlinear** activation at all — what happens to a deep network without one?`,
    hint: "sigmoid(z) = 1/(1+e^-z). relu(z) = max(0, z), vectorized with np.maximum.",
    solution:
`\`\`\`python
import numpy as np
def sigmoid(z):
    return 1 / (1 + np.exp(-z))
def relu(z):
    return np.maximum(0, z)
\`\`\`

**Why nonlinearity:** stacking linear layers collapses to a single linear layer — \`W₂(W₁x) = (W₂W₁)x\`. Without a nonlinear activation between them, a 100-layer net can only represent a straight-line mapping. Nonlinearities let the network approximate arbitrary functions. ReLU is the default (cheap, no vanishing gradient for z>0); sigmoid is mostly for output probabilities now.`,
  },
  {
    id: "ai-dnn-3", topic: "ai", series: "DNN from scratch", part: [3, 5],
    title: "MSE loss and its gradient", difficulty: "medium", minutes: 9,
    prompt:
`For predictions \`y_pred\` and targets \`y\`, implement **mean squared error** and its gradient w.r.t. \`y_pred\` in NumPy.

\`\`\`python
def mse(y_pred, y): ...
def mse_grad(y_pred, y): ...   # d(MSE)/d(y_pred)
\`\`\``,
    hint: "MSE = mean((y_pred - y)^2). Differentiate: d/dŷ of (ŷ-y)^2 is 2(ŷ-y), then the 1/n from the mean.",
    solution:
`\`\`\`python
import numpy as np
def mse(y_pred, y):
    return np.mean((y_pred - y) ** 2)
def mse_grad(y_pred, y):
    n = y_pred.shape[0]
    return 2 * (y_pred - y) / n
\`\`\`

The loss measures average squared error. Its gradient \`2(ŷ − y)/n\` points in the direction that *increases* loss, so training subtracts it. Notice the gradient is proportional to the error — big misses push weights harder. This vector is what you feed backward into backprop.`,
  },
  {
    id: "ai-dnn-4", topic: "ai", series: "DNN from scratch", part: [4, 5],
    title: "Backprop through one layer (chain rule)", difficulty: "hard", minutes: 10,
    prompt:
`One linear layer: \`z = W·x + b\`, loss \`L\`, and you're given \`dL/dz\` (call it \`dz\`). Write the gradients \`dW\`, \`db\`, and \`dx\` in NumPy. Assume \`x\` shape \`(n,)\`, \`W\` shape \`(m, n)\`.`,
    hint: "Chain rule: dW = dz ⊗ x (outer product), db = dz, dx = Wᵀ · dz.",
    solution:
`\`\`\`python
import numpy as np
def linear_backward(dz, x, W):
    dW = np.outer(dz, x)     # (m, n)
    db = dz                  # (m,)
    dx = W.T @ dz            # (n,)
    return dW, db, dx
\`\`\`

Chain rule on \`z = Wx + b\`:
- \`∂z/∂W\` gives \`dW = dz · xᵀ\` (outer product) — each weight's gradient scales with its input.
- \`∂z/∂b = 1\`, so \`db = dz\`.
- \`∂z/∂x = W\`, so \`dx = Wᵀ · dz\` propagates the signal to the previous layer.

\`dx\` becomes the next layer's \`dz\` — that's backprop: applying the chain rule layer by layer, right to left.`,
  },
  {
    id: "ai-dnn-5", topic: "ai", series: "DNN from scratch", part: [5, 5],
    title: "A minimal training loop", difficulty: "hard", minutes: 10,
    prompt:
`Tie it together. Fit \`y = 2x\` with a single weight \`w\` (no bias), MSE loss, and gradient descent, over a few iterations. Write the loop in NumPy and describe what each iteration does.`,
    hint: "pred = w*x; loss grad wrt w is mean(2*(pred-y)*x); then w -= lr*grad.",
    solution:
`\`\`\`python
import numpy as np
x = np.array([1., 2., 3., 4.])
y = 2 * x
w = 0.0
lr = 0.01
for _ in range(200):
    pred = w * x
    grad = np.mean(2 * (pred - y) * x)   # dMSE/dw
    w -= lr * grad                       # gradient step
print(round(w, 3))   # -> ~2.0
\`\`\`

Each iteration: (1) **forward** — compute predictions, (2) compute the **gradient** of the loss w.r.t. \`w\` via the chain rule (\`2(pred−y)\` from MSE times \`x\` from \`pred=wx\`), (3) **step** \`w\` downhill. Repeat and \`w\` converges to 2. That's the whole essence of training, scaled up to millions of parameters.`,
  },
  {
    id: "ai-softmax", topic: "ai", title: "Numerically stable softmax",
    difficulty: "medium", minutes: 8,
    prompt:
`Implement \`softmax(z)\` in NumPy for a 1-D logit vector. Then fix the **numerical stability** issue that arises with large logits like \`[1000, 1001, 1002]\`.`,
    hint: "exp(1000) overflows to inf. Subtracting max(z) from z leaves softmax unchanged but bounds the exponent.",
    solution:
`\`\`\`python
import numpy as np
def softmax(z):
    z = z - np.max(z)        # stability: shift so max is 0
    e = np.exp(z)
    return e / e.sum()
\`\`\`

Naively, \`np.exp(1002)\` overflows to \`inf\` and you get \`nan\`. Subtracting \`max(z)\` shifts all logits so the largest is 0 — \`exp\` inputs are now ≤ 0, safely in (0, 1]. Softmax is **invariant** to adding a constant to every logit (it cancels in numerator and denominator), so the result is identical but stable. This shift is standard in every framework.`,
  },
  {
    id: "ai-cosine", topic: "ai", title: "Cosine similarity for embeddings",
    difficulty: "easy", minutes: 6,
    prompt:
`Embeddings are compared by **cosine similarity**. Implement \`cosine(a, b)\` in NumPy for two 1-D vectors. Why is cosine often preferred over Euclidean distance for text embeddings?`,
    hint: "cosine = (a·b) / (‖a‖ ‖b‖).",
    solution:
`\`\`\`python
import numpy as np
def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
\`\`\`

Cosine measures the **angle** between vectors, ignoring their magnitude — it ranges from −1 (opposite) to 1 (identical direction). For text embeddings, magnitude often reflects things like document length or word frequency rather than meaning; direction captures semantic content. Two documents about the same topic point the same way regardless of length, so cosine is the standard choice for retrieval / RAG.`,
  },
  {
    id: "ai-agent-1", topic: "ai", series: "Agentic AI", part: [1, 4],
    title: "The agent loop", difficulty: "medium", minutes: 8,
    prompt:
`An "agent" is an LLM in a loop that can act, not just answer. Sketch the core **agent loop** in pseudocode: what are the repeating steps, and what makes it stop?`,
    hint: "Think: model proposes an action → you execute a tool → feed the result back → repeat until done.",
    solution:
`\`\`\`python
messages = [system_prompt, user_task]
while True:
    response = llm(messages, tools=TOOLS)
    if response.is_final_answer:
        return response.text
    for call in response.tool_calls:
        result = run_tool(call.name, call.args)
        messages.append(tool_result(call.id, result))
    messages.append(response)   # keep the model's turn in history
\`\`\`

The loop is: **model reasons → requests tool(s) → you execute them → append results → model reasons again**. It stops when the model returns a final answer instead of a tool call (or you hit a max-iterations / budget guard). The LLM is the "brain"; tools are its hands. Everything else (ReAct, planning) is structure layered on this loop.`,
  },
  {
    id: "ai-agent-2", topic: "ai", series: "Agentic AI", part: [2, 4],
    title: "Defining a tool schema", difficulty: "medium", minutes: 8,
    prompt:
`Tools are exposed to an LLM as a JSON schema. Write the schema for a \`get_weather(city: str, units: str)\` tool the way a modern function-calling API expects it. What fields does the model rely on to decide *when* and *how* to call it?`,
    hint: "name, a clear description, and a JSON-Schema `parameters` object with typed, described properties and a `required` list.",
    solution:
`\`\`\`json
{
  "name": "get_weather",
  "description": "Get the current weather for a city. Use when the user asks about weather or temperature.",
  "parameters": {
    "type": "object",
    "properties": {
      "city":  { "type": "string", "description": "City name, e.g. 'Austin'" },
      "units": { "type": "string", "enum": ["celsius", "fahrenheit"],
                 "description": "Temperature units" }
    },
    "required": ["city"]
  }
}
\`\`\`

The model leans hardest on the **description** (to decide *when* to call) and the per-parameter **descriptions + types + enums** (to fill arguments correctly). \`required\` tells it which it must supply. Vague descriptions are the #1 cause of wrong or missed tool calls — write them like docstrings for the model.`,
  },
  {
    id: "ai-agent-3", topic: "ai", series: "Agentic AI", part: [3, 4],
    title: "The ReAct pattern", difficulty: "medium", minutes: 8,
    prompt:
`**ReAct** = Reasoning + Acting. Explain the Thought → Action → Observation cycle and why interleaving explicit reasoning with tool calls helps over just calling tools directly.`,
    hint: "The model writes a 'Thought' (plan), takes an 'Action' (tool call), reads the 'Observation' (result), then thinks again.",
    solution:
`**ReAct** structures each step as:

- **Thought**: the model reasons about what it knows and what to do next.
- **Action**: it calls a tool with specific arguments.
- **Observation**: the tool's result is fed back in.

…then it loops with a new Thought informed by the observation.

Why it helps: forcing an explicit **Thought** before acting makes the model plan, decompose multi-step problems, and self-correct when an observation contradicts its expectation. It also makes the trace **debuggable** — you can see *why* it chose each action. Modern function-calling APIs bake this in, but the Thought/Action/Observation mental model still explains agent behavior.`,
  },
  {
    id: "ai-agent-4", topic: "ai", series: "Agentic AI", part: [4, 4],
    title: "Minimal RAG: retrieve then generate", difficulty: "hard", minutes: 10,
    prompt:
`Sketch a minimal **RAG** (Retrieval-Augmented Generation) flow in pseudocode: given a user question and a set of document embeddings, how do you ground the LLM's answer in your documents? Name the one failure mode RAG is designed to reduce.`,
    hint: "Embed the query → find nearest document chunks by cosine similarity → put them in the prompt → ask the model to answer from them.",
    solution:
`\`\`\`python
def rag_answer(question, chunks, embed, llm, k=4):
    q_vec = embed(question)
    # rank chunks by cosine similarity to the question
    top = sorted(chunks,
                 key=lambda c: cosine(q_vec, c.vector),
                 reverse=True)[:k]
    context = "\\n\\n".join(c.text for c in top)
    prompt = (f"Answer using ONLY this context.\\n\\n"
              f"Context:\\n{context}\\n\\nQuestion: {question}")
    return llm(prompt)
\`\`\`

Steps: **embed the query → retrieve the top-k most similar chunks → stuff them into the prompt → generate an answer grounded in them.** RAG primarily reduces **hallucination** (and staleness): instead of answering from parametric memory, the model cites retrieved, up-to-date source text. Quality hinges on retrieval — good chunking and embeddings matter more than the prompt.`,
  },
];
