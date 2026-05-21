# How to Add a Movie

This guide walks through wiring up the **Add Movie** button so it actually inserts a new movie into the Supabase `movies` table via Apollo Client.

The current `src/AddMovie.js` is a placeholder — it renders a modal with `username` / `password` fields. The steps below replace it with a real movie form and a GraphQL mutation.

---

## 1. Open the form component

Edit `src/AddMovie.js`. This is the file rendered by the **Add Movie** button in `src/MovieList.js`.

## 2. Replace the form fields to match the movie schema

A movie row (see `GET_MOVIES_LIST` in `src/MovieList.js:11`) has:

| Field | Type | Notes |
|---|---|---|
| `name` | string | required |
| `year_of_publication` | number | e.g. `2024` |
| `is_in_theaters` | boolean | toggle |
| `image` | string | URL to a poster |
| `description` | string | long text |
| `director` | string | |
| `genre` | string[] | array of tags |
| `rating` | number | 0–10 |
| `likes` | number | usually starts at `0` |

Swap the `Username` / `Password` `Form.Item`s for inputs that match these fields. Use Ant Design components:

- `<Input />` for `name`, `image`, `director`
- `<InputNumber />` for `year_of_publication`, `rating`, `likes`
- `<Switch />` for `is_in_theaters`
- `<Input.TextArea />` for `description`
- `<Select mode="tags" />` for `genre`

## 3. Add the GraphQL mutation

At the top of `AddMovie.js`, import `gql` and `useMutation`, then define the mutation. Supabase's pg_graphql exposes inserts as `insertInto<Table>Collection`:

```js
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const ADD_MOVIE = gql`
  mutation AddMovie($movie: moviesInsertInput!) {
    insertIntomoviesCollection(objects: [$movie]) {
      records {
        id
        name
      }
    }
  }
`;
```

## 4. Call the mutation on submit

Inside the component, get the mutation hook and call it from `onFinish`:

```js
const [addMovie, { loading }] = useMutation(ADD_MOVIE, {
  refetchQueries: ["GetMovies"],
});

const onFinish = async (values) => {
  await addMovie({ variables: { movie: { ...values, likes: 0 } } });
  setOpen(false);
};
```

`refetchQueries: ["GetMovies"]` re-runs the list query in `MovieList.js` so the new movie shows up immediately.

## 5. Wire the modal OK button to the form

The `<Modal>` currently has its own `onOk` that just runs a fake 2-second timer. Replace `handleOk` with a submit trigger for the form, and use `loading` from step 4 for `confirmLoading`:

```js
const [form] = Form.useForm();

<Modal
  title="Add a movie"
  open={open}
  onOk={() => form.submit()}
  confirmLoading={loading}
  onCancel={() => setOpen(false)}
>
  <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off">
    {/* movie fields here */}
  </Form>
</Modal>
```

## 6. Reset the form on close

After a successful insert, call `form.resetFields()` so the next time the modal opens it's empty.

## 7. Try it

```sh
npm start
```

Open the app, click **Add Movie**, fill the form, submit. The new card should appear in the movie list without a page reload.

---

## Troubleshooting

- **"Field 'moviesInsertInput' is not defined"** — check the exact input type name in your Supabase GraphiQL explorer; pg_graphql sometimes generates `MoviesInsertInput` (capitalized).
- **Insert succeeds but list doesn't update** — make sure the operation name on `GET_MOVIES_LIST` is exactly `GetMovies` and matches the string in `refetchQueries`.
- **Permission denied** — check the Supabase RLS policy on the `movies` table allows inserts for your role.
