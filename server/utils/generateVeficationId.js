exports.generateVerificationId = ((isLive) => {
  const used = new Set();
  const MAX_ATTEMPTS = 10;

  return () => {
    let id;
    let attempts = 0;
    
    console.log(`🔑 Starting verification ID generation...`);
    
    do {
      // Generate a prefix that's guaranteed to not start with 1,2,3
      const prefix = isLive ? 
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) : // A-Z
        '';
        
      const timestampPart = Date.now().toString(36).slice(-4);
      const randomPart = Math.random().toString(36).slice(2, 5);
      id = (prefix + timestampPart + randomPart).toUpperCase().slice(0, 9);
      attempts++;
      
      console.log(`📋 Attempt ${attempts}:`);
      console.log(`├── Prefix: ${prefix}`);
      console.log(`├── Timestamp: ${timestampPart}`);
      console.log(`├── Random: ${randomPart}`);
      console.log(`└── Generated ID: ${id}`);
      
      if (used.has(id)) {
        console.log(`⚠️ ID ${id} already used, generating new one...`);
      }
      if (isLive && /^[123]/.test(id)) {
        console.log(`⚠️ ID ${id} starts with 1,2,3 in live mode, generating new one...`);
      }      // Break the loop if we've tried too many times
      if (attempts >= MAX_ATTEMPTS) {
        console.log(`⚠️ Maximum attempts (${MAX_ATTEMPTS}) reached, using last generated ID`);
        break;
      }
    } while (used.has(id));

    used.add(id);
    console.log(`✅ Final verification ID: ${id}`);
    console.log(`📊 Total IDs generated: ${used.size}`);
    return id;
  };
})(true);