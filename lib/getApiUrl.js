exports.getApiUrl = () => {
    if (process.env.NODE_ENV === "prod") {
      return `https://api.pluginsthatknock.com`;
    } else {
      return `http://127.0.0.1:4500`;
    }
}