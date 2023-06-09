import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IUser } from '@/types/IUser'

import { RegisterInput } from '@/components/pages/auth/Register'
import { RegisterInputModal } from '@/components/pages/profile/ProfileEditModal'
import { setUser } from '@/store/reducer/userSlice'

const BASE_URL = 'http://localhost:4000/'

export const userAPI = createApi({
	reducerPath: 'userAPI',
	baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
	tagTypes: ['User'],
	endpoints: builder => ({
		fetchUserById: builder.query<IUser, null>({
			query() {
				const cookie = document.cookie
				const accessToken = cookie.split('=')[1]
				return {
					url: 'users/me',
					credentials: 'include',
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			},
			// transformResponse: (result: { data: { user: IUser } }) =>
			// 	result.data.user,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(setUser(data))
				} catch (error) {
					console.log('error', error)
				}
			}
		}),
		updateUser: builder.mutation<IUser, RegisterInputModal>({
			query(user) {
				const cookie = document.cookie
				const accessToken = cookie.split('=')[1]
				return {
					url: 'users/update',
					method: 'POST',
					credentials: 'include',
					headers: {
						Authorization: `Bearer ${accessToken}`
					},
					body: user
				}
			},
			invalidatesTags: ['User']
		})
	})
})
