const prefix = "[skillsync]";

export const logger = {
  info: (...args) => console.log(prefix, ...args),
  error: (...args) => console.error(prefix, ...args),
};
