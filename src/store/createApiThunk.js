import { createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/utils/apiError';

/**
 * Wraps an api call so failures always reject with the backend message (a string).
 * Callers can `await dispatch(thunk(arg)).unwrap()` and catch that message.
 * @param {string} type
 * @param {(arg: any) => Promise<any>} request
 * @param {import('@reduxjs/toolkit').AsyncThunkOptions} [options]
 */
export const createApiThunk = (type, request, options) =>
  createAsyncThunk(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        return await request(arg);
      } catch (error) {
        return rejectWithValue(getErrorMessage(error));
      }
    },
    options,
  );
