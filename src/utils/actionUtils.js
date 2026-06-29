export const getActionTypes = (key) => [`${key}_REQUEST`, `${key}_SUCCESS`, `${key}_FAILURE`];

export const generateActionTypeVariants = (actionTypes = {}) => {    
  const apiActionType = {};
  Object.values(actionTypes).forEach((action) => {
    apiActionType[action] = getActionTypes(action);
  });
  return apiActionType;
};