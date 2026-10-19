import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accessLogs from './accessLogs.slice';
import auditLogs from './auditLogs.slice';
import auth, { login, logout, sessionExpired } from './auth.slice';
import dashboard from './dashboard.slice';
import gates from './gates.slice';
import ui from './ui.slice';
import users from './users.slice';
import vehicles from './vehicles.slice';

const appReducer = combineReducers({ auth, ui, users, vehicles, gates, accessLogs, auditLogs, dashboard });

/** Actions that start or end a session: cached data of the previous user must not survive. */
const SESSION_BOUNDARY = [login.fulfilled.type, logout.fulfilled.type, logout.rejected.type, sessionExpired.type];

/** Keeps only `auth` (session) and `ui` (preferences); every resource slice returns to its initial state. */
const rootReducer = (state, action) => {
  if (state && SESSION_BOUNDARY.includes(action.type)) {
    return appReducer({ auth: state.auth, ui: state.ui }, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({ reducer: rootReducer });
