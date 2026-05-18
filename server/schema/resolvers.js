import { supabase } from "../supabaseClient.js";

// Column lists with aliases for snake_case -> camelCase mapping
const USER_COLUMNS = "id, name, username, age, nationality";
const MOVIE_COLUMNS = `
  id,
  name,
  yearOfPublication:year_of_publication,
  isInTheaters:is_in_theaters,
  image,
  description,
  director,
  genre,
  rating,
  likes
`;

const resolvers = {
  Query: {
    users: async () => {
      const { data, error } = await supabase.from("users").select(USER_COLUMNS);
      console.log("users:", data);
      if (error) throw new Error(error.message);
      return data;
    },

    user: async (_, { id }) => {
      const { data, error } = await supabase
        .from("users")
        .select(USER_COLUMNS)
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },

    movies: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select(MOVIE_COLUMNS);
      if (error) throw new Error(error.message);
      return data;
    },

    movie: async (_, { name }) => {
      const { data, error } = await supabase
        .from("movies")
        .select(MOVIE_COLUMNS)
        .eq("name", name)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  },

  // Field resolver: when GraphQL asks for User.friends, fetch from user_friends
  User: {
    friends: async (parent) => {
      const { data, error } = await supabase
        .from("user_friends")
        .select(`friend:users!user_friends_friend_id_fkey(${USER_COLUMNS})`)
        .eq("user_id", parent.id);
      if (error) throw new Error(error.message);
      return data.map((row) => row.friend);
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { data, error } = await supabase
        .from("users")
        .insert(input)
        .select(USER_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },

    updateUsername: async (_, { input }) => {
      const { id, newUsername } = input;
      const { data, error } = await supabase
        .from("users")
        .update({ username: newUsername })
        .eq("id", id)
        .select(USER_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },

    deleteUser: async (_, { id }) => {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select(USER_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  },
};

export default resolvers;
