import ZooplaScraper from '../Popup/scrapers/ZooplaScraper';

window.pageWindow = window;

const pageWindowHandler = async (window) => {
  if (window.location.href.includes('rightmove')) {
    return { location: window.location, PAGE_MODEL: window.PAGE_MODEL };
  } else if (window.location.href.includes('zoopla')) {
    return {
      location: { href: window.location.href },
      zooplaObject: await ZooplaScraper(window, 'inject'),
    };
  } else if (window.location.href.includes('onthemarket')) {
    return { location: window.location, __OTM__: window.__OTM__ };
  } else {
    return false;
  }
};

const pageWindow = await pageWindowHandler(window.pageWindow);

const cloneWindow = async () => {
  try {
    const messageObj = {
      message: 'windowObject',
      windowObject: pageWindow,
    };

    var postMessageTemp = window.postMessage;
    window.postMessage = function (message, targetOrigin, transfer) {
      function cloneObject(obj) {
        if (Array.isArray(obj) || typeof obj === 'object') {
          var clone = Array.isArray(obj) ? [] : {};
          for (var i in obj) {
            if (typeof obj[i] == 'object' && obj[i] != null) {
              if ('' + obj[i] === '[object Window]') {
                delete obj[i];
                continue;
              }

              clone[i] = cloneObject(obj[i]);
            } else {
              clone[i] = obj[i];
            }
          }
          return clone;
        } else {
          return obj;
        }
      }

      // to avoid weird error causing by window object by JSON.stringify() execution.
      var clone = cloneObject(messageObj);

      postMessageTemp(
        JSON.parse(JSON.stringify(clone)),
        targetOrigin,
        transfer
      );
      // const clone = JSON.parse(JSON.stringify(messageObj));
      console.log('Window object cloned', clone);
      window.postMessage(messageObj, '*');
    };
  } catch (e) {
    console.log('Error: Unable to clone window object.');
    console.error(e);
  }
};

console.log();
cloneWindow();
