exports.generateVerificationId = ((isLive) => {
  const used = new Set();

  return () => {
    let id;
    do {
      const timestampPart = Date.now().toString(36).slice(-5); // Base-36 gives shorter strings
      const randomPart = Math.random().toString(36).slice(2, 6); // 4 random characters
      id = (timestampPart + randomPart).toUpperCase().slice(0, 9);
    } while (
      used.has(id) ||
      (isLive && /^[123]/.test(id)) // Disallow if starts with 1, 2, or 3 and isLive is true
    );

    used.add(id);
    return id;
  };
})(true); // Set to true if in live mode
