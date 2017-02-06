export default ({dispatch}) => (next) => (action) => {
  if ( Array.isArray(action) ) {
    return action.map(dispatch)
  }
  return next(action);
};
