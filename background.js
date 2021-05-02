"use strict";

chrome.tabs.onCreated.addListener(
  ({id, index, openerTabId, pinned, windowId}) => {

    //ignore pinned tabs since they always open on the left side.
    //tabs opened from bookmarks/history don't have openerTabId.
    if(!openerTabId || pinned) return;

    //get all tabs in the window and see if we are the last tab there
    chrome.tabs.query({windowId}, arr => {
      const last = arr[arr.length - 1];

      if(last.id === id) {
        //get the index of the opener tab that opened this tab
        chrome.tabs.get(openerTabId, opener => {
          //silent the error if the opener tab is gone
          if(!opener) return chrome.runtime.lastError;

          //check that we aren't already next to the opener tab
          const i = opener.index + 1;
          if(i < index) chrome.tabs.move(id, {index: i});
        });
      }
    });
  }
);
