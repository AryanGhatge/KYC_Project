exports.generateVerificationId = (() => {
  const used = new Set();

  return () => {
    let id;
    do {
      const timestampPart = Date.now().toString(36).slice(-5); // Base-36 gives shorter strings
      const randomPart = Math.random().toString(36).slice(2, 6); // 4 random characters
      id = (timestampPart + randomPart).toUpperCase().slice(0, 9);
    } while (used.has(id));

    used.add(id);
    return id;
  };
})();