// export const produtoCache = {};
export const produtoCache = {
  /*
  [id]: {
    data: produto,
    timestamp: Date.now()
  }
  */
};

export const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

export function isCacheValido(id) {
  const item = produtoCache[id];
  if (!item) return false;

  return Date.now() - item.timestamp < CACHE_TTL;
}


