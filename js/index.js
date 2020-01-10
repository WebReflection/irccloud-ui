/*!
 * Copyright 2020 Andrea Giammarchi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// RegExp to search for, and its replacement
const re = /ui#(\d+)/g;
const place = '<a target="_blank" href="https://gitlab.com/eyeo/adblockplus/abpui/adblockplusui/issues/$1">ui#$1</a>';

// irccloud-ui related constants
const parsedPrefix = 'irccloud-ui';

// irccloud page related constants
const container = '.buffermainwrapper';
const inner = '.messageRow';

// for internal use, do not change
const parsedClass = `.${parsedPrefix}-parsed`;
const qs = `${container} ${inner}:not(${parsedClass})`;

replaceAuto(re, place);

function replace(re, place) {
  function $(childNodes) {
    for (var i = childNodes.length; i--;) {
      var child = childNodes[i];
      switch (child.nodeType) {
        case 3:
          var template = document.createElement('template');
          template.innerHTML = child.textContent.replace(re, place);
          var parentNode = child.parentNode;
          parentNode.replaceChild(
            template.content || template,
            child
          );
          parentNode.closest(inner).classList.add(parsedClass.slice(1));
          break;
        case 1:
          $(child.childNodes);
      }
    }
  }
  return function (el) {
    $(el.childNodes);
  };
}

function replaceAuto(re, place) {
  new MutationObserver(
    function (mutationList) {
      mutationList.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          document.querySelectorAll(qs).forEach(replace(re, place));
        }
      });
    }
  ).observe(document, {childList: true, subtree: true});
}
