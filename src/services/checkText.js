export const checkForNoSQLInjection = (...texts) => {
    const patterns = [
      /\$where/i,
      /\$gt/i,
      /\$ne/i,
      /\$regex/i,
      /\$or/i,
      /\$and/i,
      /\$not/i,
      /\$nor/i,
      /\$exists/i,
      /\$type/i,
      /\$expr/i,
      /\$in/i,
      /\$nin/i,
      /\$all/i,
      /\$size/i,
      /\$text/i,
      /\$mod/i,
      /\$bitsAllSet/i,
      /\$bitsAnySet/i,
      /\$bitsAllClear/i,
      /\$bitsAnyClear/i,
      /\$comment/i,
    ];
  
    for (let text of texts) {
      for (let pattern of patterns) {
        if (pattern.test(text)) {
          return true; // NoSQL injection pattern found
        }
      }
    }
  
    return false; // No NoSQL injection pattern detected
};