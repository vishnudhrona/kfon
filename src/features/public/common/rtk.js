import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { STATE_REDUCER_KEY } from './constants'

// Define a service using a base URL and expected endpoints
export const sampleApi = createApi({
    reducerPath: `${STATE_REDUCER_KEY}_rtk`,
    baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query({
            query: (name) => `pokemon/${name}`
        })
    })
})


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = sampleApi