let isRefreshing = false;
const pendingQueue = [];

export const getIsRefreshing = () => isRefreshing;

export const setIsRefreshing = (val) => {
  isRefreshing = val;
};

export const enqueueRequest = (resolve, reject) => {
  pendingQueue.push({ resolve, reject });
};

export const resolveQueue = (token) => {
  pendingQueue.forEach(({ resolve }) => {
    resolve(token);
  });
  pendingQueue.length = 0;
};

export const rejectQueue = (error) => {
  pendingQueue.forEach(({ reject }) => {
    reject(error);
  });
  pendingQueue.length = 0;
};
