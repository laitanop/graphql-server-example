# Auto-fill Movie Details with OpenRouter AI

When a user types only the **movie name** and clicks a button (e.g. "Fetch with AI"), call an LLM through [OpenRouter](https://openrouter.ai/) to fill in `director`, `year_of_publication`, `genre`, `description`, `rating`, and `image`.

This document is an **explanation only** — no code changes.

---

## Suggested file layout

Before you start, here's where each new piece should live in your existing project. You don't have to follow this exactly, but keeping the AI logic out of `AddMovie.js` makes it much easier to test and re-use later.

```
graphql-server-example/
├── .env                          ← (1) your API key (not committed)
├── .env.example                  ← (2) template showing the var name (committed)
├── .gitignore                    ← make sure `.env` is listed here
└── src/
    ├── AddMovie.js               ← (5) imports + calls the helper, adds the button
    ├── MovieList.js
    └── ai/                       ← new folder for AI-related code
        ├── moviePrompt.js        ← (3) the system prompt string
        └── fetchMovieInfo.js     ← (4) the OpenRouter HTTP call
```

**Why split it this way:**
- `moviePrompt.js` holds *only* the prompt text. If you want to tweak how the AI responds, you change one file and nothing else.
- `fetchMovieInfo.js` holds the network call. If you switch from OpenRouter to a backend endpoint later, only this file changes.
- `AddMovie.js` stays focused on the form — it just imports `fetchMovieInfo` and calls it.

Naming conventions used here:
- camelCase filenames for plain JS modules (matches your existing `AddMovie.js` style).
- The folder `src/ai/` groups all AI features. If you add more later (e.g. summarize reviews), they go in the same folder.

---

## 1. How OpenRouter works

OpenRouter is a single HTTP API that proxies many LLM providers (OpenAI, Anthropic, Google, Meta, etc.). You send the same OpenAI-style request to one URL and pick the model via a string like `openai/gpt-4o-mini` or `anthropic/claude-haiku-4-5`.

- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Auth:** `Authorization: Bearer <OPENROUTER_API_KEY>` header
- **Body:** standard OpenAI chat-completions shape (`model`, `messages`, optional `response_format`)

---

## 2. Get and store an API key

### 2a. Create the key

1. Sign up at https://openrouter.ai.
2. Top-right menu → **Keys** → **Create Key**.
3. Copy the value (starts with `sk-or-v1-...`). You can't see it again after closing the dialog.

### 2b. Create `.env` in the project root

The file must be named exactly `.env` (with the leading dot, no extension) and live in the **project root** — the same folder as `package.json`, NOT inside `src/`.

```
graphql-server-example/.env
```

Contents:

```
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-paste-your-key-here
```

Rules to remember:
- Create React App **only** exposes env vars that start with `REACT_APP_`. Naming it `OPENROUTER_API_KEY` (without the prefix) will silently give you `undefined` in the browser.
- No quotes around the value, no spaces around `=`.
- After editing `.env`, **stop and restart** `npm start` — CRA only reads env vars at server boot.

### 2c. Create `.env.example` (committed)

This is the template other developers (or future-you) use. Same name as `.env` but with `.example` appended:

```
graphql-server-example/.env.example
```

Contents:

```
REACT_APP_OPENROUTER_API_KEY=
```

Commit this one so the variable name is documented. Never commit the real `.env`.

### 2d. Update `.gitignore`

Open `.gitignore` in the project root and make sure it has a line:

```
.env
```

CRA's default `.gitignore` already includes this, but double-check.

> Security note: any key in a React app ships to the browser and can be stolen by anyone who opens devtools. For learning that's fine. For production, move the call to a backend route (or a Supabase Edge Function) and keep the key server-side.

---

## 3. Design the prompt — where it lives

**Create:** `src/ai/moviePrompt.js`

The prompt is just a long string, but giving it its own file is worth it because:
- You can iterate on the wording without touching form code.
- The string is long enough that inlining it in `AddMovie.js` would clutter the component.

What goes inside the file:

- One exported constant, e.g. `export const MOVIE_LOOKUP_SYSTEM_PROMPT = \`...\``;
- Optionally, an exported `MODEL_NAME` constant (e.g. `"openai/gpt-4o-mini"`) so the model choice lives next to the prompt that was tuned for it.

### What the prompt should say

You want **structured JSON back**, not prose. Two pieces:

- **System message** — set the role and the exact JSON shape (lives in `moviePrompt.js`).
- **User message** — just the movie name (passed in at call time).

Example system prompt content:

```
You are a movie metadata lookup. Given a movie title, respond with ONLY a JSON
object matching this shape — no markdown, no commentary:

{
  "director": string,
  "year_of_publication": number,
  "genre": string[],
  "description": string,         // 1–2 sentences
  "rating": string,              // IMDb-style, e.g. "8.8"
  "image": string                // URL to a poster, or "" if unknown
}

If you don't know a field, use null (or [] for genre, "" for image).
```

Force JSON with `response_format: { type: "json_object" }` so the model can't wrap it in backticks.

### Naming tips

- Constant name: SCREAMING_SNAKE_CASE for prompts (`MOVIE_LOOKUP_SYSTEM_PROMPT`) — they're effectively configuration.
- If you add more prompts later, suffix with the purpose: `MOVIE_LOOKUP_SYSTEM_PROMPT`, `REVIEW_SUMMARY_SYSTEM_PROMPT`, etc.

---

## 4. The HTTP call — where it lives

**Create:** `src/ai/fetchMovieInfo.js`

This file exports one async function, e.g. `fetchMovieInfo(title)`, that:
1. Reads the API key from `process.env.REACT_APP_OPENROUTER_API_KEY`.
2. Imports the prompt from `./moviePrompt`.
3. POSTs to OpenRouter.
4. Parses `choices[0].message.content` (which is a JSON string) and returns the resulting object.

### Conceptual request

```
POST https://openrouter.ai/api/v1/chat/completions
Authorization: Bearer $REACT_APP_OPENROUTER_API_KEY
Content-Type: application/json

{
  "model": "openai/gpt-4o-mini",
  "response_format": { "type": "json_object" },
  "messages": [
    { "role": "system", "content": "<imported from moviePrompt.js>" },
    { "role": "user",   "content": "Inception" }
  ]
}
```

### Response shape (truncated)

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "{\"director\":\"Christopher Nolan\",\"year_of_publication\":2010, ...}"
      }
    }
  ]
}
```

`choices[0].message.content` is a **JSON string** — you need to `JSON.parse` it.

### Pseudocode for `fetchMovieInfo.js`

```js
import { MOVIE_LOOKUP_SYSTEM_PROMPT, MODEL_NAME } from "./moviePrompt";

export async function fetchMovieInfo(title) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: MOVIE_LOOKUP_SYSTEM_PROMPT },
        { role: "user", content: title },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}
```

### Naming tips

- Function name reads like a verb phrase: `fetchMovieInfo`, not `movieInfo` or `getMovie` (which already collides with your GraphQL query naming).
- Filename matches the default export, in camelCase: `fetchMovieInfo.js`.

---

## 5. Wire it into `AddMovie.js`

You don't create a new file here — you edit your existing `src/AddMovie.js`. The changes are:

1. **Import** the helper:
   ```js
   import { fetchMovieInfo } from "./ai/fetchMovieInfo";
   ```
2. **Add a loading state** for the AI call (separate from the mutation loading state):
   ```js
   const [aiLoading, setAiLoading] = useState(false);
   ```
3. **Add a button** next to the Movie Name input — for example a small `<Button>` inside the `Form.Item`'s `suffix` or right after it. Label: "✨ Fetch with AI".
4. **Click handler:**
   - Read the current `movieName` from form state.
   - Set `aiLoading` to true.
   - Call `fetchMovieInfo(name)`.
   - On success, call `form.setFieldsValue({ ... })` (Ant Design) — or `setForm({ ...form, ... })` for your local state — with the returned fields.
   - On error, show an Ant `message.error(...)`.
   - In `finally`, set `aiLoading` back to false.
5. **Don't change** `onFinish` or the GraphQL mutation. The AI just pre-fills the form; submission still goes through your existing `addMovie` mutation.

---

## 6. Picking a model

Cheap + fast (good default for this kind of lookup):
- `openai/gpt-4o-mini`
- `anthropic/claude-haiku-4-5`
- `google/gemini-2.0-flash`

Pricing is on the model page at https://openrouter.ai/models. For one short JSON response, expect well under a cent per call.

Put the chosen model string in `src/ai/moviePrompt.js` as a `MODEL_NAME` constant so it lives next to the prompt it was tested with.

---

## 7. Things that will bite you

- **Hallucinated facts.** LLMs invent directors, years, and especially poster URLs. Always let the user review before submitting. The `image` field in particular: the model often returns a plausible-looking URL that 404s. Consider leaving `image` blank and letting the user paste a real link.
- **Ambiguous titles** ("Joker" — 2019? 1989?). Either include a year in the prompt, or ask the model to return a list of candidates and let the user pick.
- **Rate limits / cost.** Debounce the button; don't auto-fire on every keystroke.
- **CORS.** OpenRouter allows browser calls, but if you later proxy through your own backend, you'll need to handle CORS there.
- **Genre as array.** The model usually returns `["Sci-Fi", "Action"]`, which matches your Supabase column type — but validate it's actually an array before calling `setFieldsValue`.
- **`response_format` support.** Not every model on OpenRouter supports `json_object` mode. If you switch models and parsing breaks, strip code fences from the content before `JSON.parse`.
- **Env var is `undefined`.** Three usual causes: (a) missing `REACT_APP_` prefix, (b) `.env` not in project root, (c) you didn't restart `npm start` after editing `.env`.

---

## 8. Suggested UI

- Put a small **"✨ Fetch with AI"** button next to the **Movie name** input.
- Disable it while the name is empty or while `aiLoading` is true.
- Show a spinner on the button while the request is in flight (`<Button loading={aiLoading}>`).
- On success, fill the other form fields and focus the **Description** so the user can review.
- On error, show an Ant Design `message.error("Couldn't fetch movie info")`.

---

## 9. Order of operations (checklist)

1. [ ] Create OpenRouter account, generate key.
2. [ ] Create `.env` in project root with `REACT_APP_OPENROUTER_API_KEY=...`.
3. [ ] Create `.env.example` with the empty variable, commit it.
4. [ ] Confirm `.env` is in `.gitignore`.
5. [ ] Create folder `src/ai/`.
6. [ ] Create `src/ai/moviePrompt.js` with the system prompt + model name constants.
7. [ ] Create `src/ai/fetchMovieInfo.js` with the async fetch function.
8. [ ] Edit `src/AddMovie.js`: import the helper, add `aiLoading` state, add the "Fetch with AI" button, wire its click handler.
9. [ ] Restart `npm start` (required after creating `.env`).
10. [ ] Type a movie name, click the button, watch the other fields fill in.
