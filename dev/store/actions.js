import types from './mutation-types';

export default {
    addTodo({commit}, {id, text}) {
        commit(types.ADD_TODO, {
            id,
            text,
        });
    },
};
