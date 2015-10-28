export default function prefetch(store, routerState) {
  const { routes } = routerState;
  let handlers = routes
    .map(route => route.component)
    .filter(handler => handler && handler.fetchData);
  let promises = handlers.map(handler => handler.fetchData(store, routerState));
  return Promise.all(promises);
}
