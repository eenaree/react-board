import {
  REMOVE_FILE,
  REMOVE_FILE_FAILURE,
  REMOVE_FILE_SUCCESS,
} from './actions';

export default function fileReducer(state, action) {
  switch (action.type) {
    case REMOVE_FILE:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case REMOVE_FILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        files: state.files.filter(file => file.id !== action.id),
      };
    case REMOVE_FILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
