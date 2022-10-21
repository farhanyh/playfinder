export type Listener<EventType> = (ev: EventType) => void;
export const createObserver = <EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} => {
  let listeners: Listener<EventType>[] = [];
  return {
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event) => {
      listeners.forEach((l) => l(event));
    },
  };
};
