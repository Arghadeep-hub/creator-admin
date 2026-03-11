import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'

// Import all API slices to ensure endpoints are registered
import './api/authApi'
import './api/adminUsersApi'
import './api/dashboardApi'
import './api/campaignsApi'
import './api/creatorsApi'
import './api/submissionsApi'
import './api/payoutsApi'
import './api/leaderboardApi'
import './api/reportsApi'
import './api/settingsApi'
import './api/auditLogApi'
import './api/notificationsApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
