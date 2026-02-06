
export const timeoutHandler = async (
  fn: () => Promise<any>,
  timeout = 5000,
) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request Timeout"));
    }, timeout);

    fn()
      .then((result) => {
        clearTimeout(timer);
        console.log("Request completed before timeout");
        resolve(result);
        
      })
      .catch((error) => {
        clearTimeout(timer);
        console.error("Error:",error);
        reject(error);
      });
  });
};
