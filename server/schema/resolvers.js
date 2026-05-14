import { UserList, MovieList } from '../_db.js';

const resolvers = {
    Query: {
        users: () => UserList,
        user: (_, { id }) => UserList.find((user) => user.id === Number(id)),
        movies:()=>MovieList,
        movie:(_, {name })=>MovieList.find((movie) => movie.name === name),
     
    },
    Mutation: {
        createUser: (_, { input }) => {
            const newUser = {
                id: UserList.length + 1,
                ...input
            };
            UserList.push(newUser);
            return newUser;
        
    },
    updateUsername: (_, { input }) => {
        const { id, newUsername } = input;
        let userToUpdate = UserList.find((user) => user.id === Number(id));
        if (!userToUpdate) {
            throw new Error("User not found");
        }
        userToUpdate.username = newUsername;
        return userToUpdate;
    },
    deleteUser: (_, { id }) => {
        const idx = UserList.findIndex((user) => user.id === Number(id));
        if (idx === -1) {
            throw new Error('User not found');
        }
        const [removed] = UserList.splice(idx, 1);
        return removed;
    }
    }
};

export default resolvers;