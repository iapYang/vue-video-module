import types from './mutation-types';

export default {
    [types.ADD_TODO](state, {id, text}) {
        state.todos.push({
            id,
            text,
        });
    },
};
