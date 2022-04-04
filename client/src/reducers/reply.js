import {
  ADD_REPLY,
  ADD_REPLY_SUCCESS,
  ADD_REPLY_FAILURE,
  REMOVE_REPLY,
  REMOVE_REPLY_SUCCESS,
  REMOVE_REPLY_FAILURE,
} from './actions';

export default function replyReducer(state, action) {
  switch (action.type) {
    case ADD_REPLY:
    case REMOVE_REPLY:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case ADD_REPLY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        replies: [...state.replies, action.reply],
      };
    case REMOVE_REPLY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        replies: state.replies.map(reply =>
          reply.id === action.id
            ? { ...reply, deletedAt: action.deletedAt }
            : reply
        ),
      };
    case ADD_REPLY_FAILURE:
    case REMOVE_REPLY_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
