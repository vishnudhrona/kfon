import { sampleApi } from '@/features/public/common/rtk';

const apiStores = [sampleApi]; // get this Array from Project

const reducers = {};
const middlewareList = [];

for (const api of apiStores) {
    reducers[api.reducerPath] = api.reducer;
    middlewareList.push(api.middleware);
}

export { middlewareList,reducers }