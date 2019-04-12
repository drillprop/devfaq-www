import { Actions, ActionTypes } from '../actions';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { LevelKey } from '../../constants/level';
import { ApiResponse } from '../../services/Api';

export interface Question {
  id: number;
  question: string;
  _categoryId: TechnologyKey;
  _levelId: LevelKey;
  acceptedAt?: string;
}

const intialState: {
  error?: Error;
  data?: ApiResponse<Question[]>;
  isLoading: boolean;
  abortController?: AbortController;
} = { isLoading: false, data: undefined, error: undefined };

export const questions = (response = intialState, action: Actions): typeof intialState => {
  switch (action.type) {
    case ActionTypes.FETCH_QUESTIONS:
      const wasAborted = 'error' in action.payload && action.payload.error.name === 'AbortError';
      if (wasAborted) {
        return response;
      }

      return {
        ...response,
        ...action.payload,
        isLoading: !('error' in action.payload) && !('data' in action.payload),
      };
    case ActionTypes.DELETE_QUESTION:
      const id = 'id' in action.payload ? action.payload.id : undefined;

      const newResponse: undefined | ApiResponse<Question[]> = response.data
        ? {
            data: response.data.data.filter(q => q.id !== id),
            meta: response.data.meta
              ? {
                  total: response.data.meta.total - 1,
                }
              : undefined,
          }
        : undefined;

      return {
        data: newResponse,
        error: 'error' in action.payload ? action.payload.error : undefined,
        isLoading: response.isLoading,
        abortController: response.abortController,
      };
    case ActionTypes.UPDATE_ROUTE_STARTED:
      return {
        data: { data: [] },
        isLoading: false,
        abortController: response.abortController,
      };
    default:
      return response;
  }
};
