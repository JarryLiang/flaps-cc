
export const getByPath = (p, o, defaultValue) => {
  const def = (defaultValue !== undefined) ? defaultValue : null;
  return p.reduce((xs, x) => {
    return (xs && xs[x]) ? xs[x] : def;
  }, o);
};

