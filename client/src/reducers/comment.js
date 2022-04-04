import {
  ADD_COMMENT,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_SUCCESS,
} from './actions';

export default function commentReducer(state, action) {
  switch (action.type) {
    case ADD_COMMENT:
    case REMOVE_COMMENT:
      return {
        ...state,
        isLoading: false,
        isError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        comments: [...state.comments, action.comment],
      };
    case REMOVE_COMMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        comments: state.comments.map(comment =>
          comment.id === action.id
            ? { ...comment, deletedAt: action.deletedAt }
            : comment
        ),
      };
    case ADD_COMMENT_FAILURE:
    case REMOVE_COMMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
