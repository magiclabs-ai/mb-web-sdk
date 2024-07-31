import {vi} from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

export const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()
