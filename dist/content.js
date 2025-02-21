"use strict";
(() => {
  // content.ts
  console.log("Content script injected!");
  var getAttributes = (element) => {
    const attributes = {};
    for (const attribute of element.getAttributeNames()) {
      attributes[attribute] = element.getAttribute(attribute);
    }
    return attributes;
  };
  var generateHash = async (message) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };
  var DISABLED_ELEMENTS = /* @__PURE__ */ new Set([
    "SCRIPT",
    "NOSCRIPT",
    "STYLE",
    "LINK",
    "META",
    "HEAD",
    "SVG",
    "PATH",
    "G"
  ]);
  var crawlElement = async (element = document.querySelector("body"), traversal = "", parent = null, siblingOrder = 0) => {
    const { tagName: tag } = element;
    const path = `${traversal}${tag}[${siblingOrder}]`;
    const elementData = {
      parent,
      elementRef: element,
      path,
      uuid: await generateHash(path),
      tag,
      attributes: getAttributes(element),
      image: "",
      innerTextHash: element?.innerText ? await generateHash(element.innerText) : "",
      getBoundingClientRect: element.getBoundingClientRect(),
      isVisible: element.checkVisibility(),
      children: []
    };
    const children = element.children;
    for (let idx = 0; idx < children.length; idx++) {
      if (DISABLED_ELEMENTS.has(children[idx].tagName.toUpperCase()))
        continue;
      elementData.children.push(
        await crawlElement(
          children[idx],
          `${elementData.path}/`,
          elementData,
          idx
        )
      );
    }
    return elementData;
  };
  var pathToParent = (element, path = "") => {
    if (!element || !element.tagName)
      return `${path}/`;
    const { tagName, parentElement } = element;
    return pathToParent(parentElement, `${tagName}${path ? "/" : ""}${path}`);
  };
  var generatedCrawledData = async (event) => {
    const crawledData = {
      url: window.location.href,
      meta: {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute("content")?.split(",") || []
      },
      children: []
    };
    crawledData.children.push(
      await crawlElement(
        event.target,
        pathToParent(event.target)
      )
    );
    return crawledData;
  };
  var isChildGroupableWithParent = async (parent, childIdx) => {
    console.log(parent, childIdx);
    return true;
  };
  var bottomUpGrouping = async (node, unionData) => {
    console.log("NODE", node);
    if (!node)
      return;
    let allChildrenGroupable = true;
    for (let childIdx = 0; childIdx < node.children.length; childIdx++) {
      if (await isChildGroupableWithParent(node, childIdx)) {
        console.log("Grouping", { node, childIdx });
        continue;
      }
      allChildrenGroupable = false;
    }
    if (!allChildrenGroupable) {
      console.log("Not all children groupable", node);
      return;
    }
    for (let childIdx = 0; childIdx < node.children.length; childIdx++) {
      unionData.set(node.children[childIdx].uuid, node.uuid);
    }
    await bottomUpGrouping(node.parent, unionData);
  };
  document.addEventListener(
    "click",
    async (event) => {
      const crawledData = await generatedCrawledData(event);
      console.log(crawledData);
      const unionData = /* @__PURE__ */ new Map();
      await bottomUpGrouping(crawledData.children[0], unionData);
      console.log(unionData);
    },
    true
  );
})();
