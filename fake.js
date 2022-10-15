export default function fakeWait(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }