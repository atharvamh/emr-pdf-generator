const oneMB = 1024 * 1024;

export function getLocalStorageUsage() {
    const totalSpace = 10 * (oneMB) // Assuming a 10MB limit for localStorage
    let usedSpace = 0;
  
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        const item = localStorage.getItem(key);
        usedSpace += item?.length || 0;
      }
    }
  
    return {
      usedSpace: usedSpace/oneMB,
      remainingSpace: (totalSpace/oneMB) - (usedSpace/oneMB),
      totalSpace: totalSpace/oneMB
    };
}