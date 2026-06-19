/**
 * site-helper.js – 页面提示卡片、关键词徽章与访问说明生成器
 * 使用场景：展示“爱游戏”平台引导信息，不依赖任何第三方库
 */

(function () {
  "use strict";

  // ---------- 配置数据 ----------
  const CONFIG = {
    portalUrl: "https://portalmain-i-game.com.cn",
    keyword: "爱游戏",
    seed: "4629d15ecd73531c", // 仅用于变化
  };

  // ---------- 工具函数 ----------
  /**
   * 生成一个简单的哈希值（用于产生视觉差异）
   * @param {string} str
   * @returns {number}
   */
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // 转为32位整数
    }
    return Math.abs(hash);
  }

  /**
   * 基于种子和标签生成一个颜色字符串
   * @param {string} tag
   * @returns {string}
   */
  function colorFromTag(tag) {
    const hash = simpleHash(tag + CONFIG.seed);
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    // 确保颜色不至于太浅或太暗
    const clamp = (v) => Math.min(220, Math.max(40, v));
    return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
  }

  /**
   * 安全转义 HTML
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // ---------- DOM 元素构建 ----------

  /**
   * 创建一个关键词徽章
   * @param {string} label
   * @returns {HTMLElement}
   */
  function createBadge(label) {
    const badge = document.createElement("span");
    badge.className = "helper-badge";
    badge.textContent = label;
    badge.style.backgroundColor = colorFromTag(label);
    badge.style.color = "#fff";
    badge.style.padding = "4px 12px";
    badge.style.borderRadius = "16px";
    badge.style.fontSize = "14px";
    badge.style.fontWeight = "600";
    badge.style.display = "inline-block";
    badge.style.margin = "4px 6px 4px 0";
    badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
    return badge;
  }

  /**
   * 创建一个提示卡片
   * @param {object} options
   * @param {string} options.title
   * @param {string} options.content
   * @param {string} options.link
   * @returns {HTMLElement}
   */
  function createTipCard({ title, content, link }) {
    const card = document.createElement("div");
    card.className = "helper-card";
    card.style.border = "1px solid #e0e0e0";
    card.style.borderRadius = "12px";
    card.style.padding = "18px 22px";
    card.style.margin = "14px 0";
    card.style.backgroundColor = "#fafafa";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
    card.style.transition = "box-shadow 0.2s";

    const titleEl = document.createElement("h4");
    titleEl.textContent = title;
    titleEl.style.margin = "0 0 10px 0";
    titleEl.style.fontSize = "20px";
    titleEl.style.color = "#333";

    const contentEl = document.createElement("p");
    contentEl.innerHTML = escapeHtml(content).replace(/\n/g, "<br>");
    contentEl.style.margin = "0 0 10px 0";
    contentEl.style.fontSize = "15px";
    contentEl.style.lineHeight = "1.5";
    contentEl.style.color = "#555";

    const linkEl = document.createElement("a");
    linkEl.href = link;
    linkEl.textContent = "了解更多 →";
    linkEl.target = "_blank";
    linkEl.rel = "noopener noreferrer";
    linkEl.style.color = "#1a73e8";
    linkEl.style.textDecoration = "none";
    linkEl.style.fontWeight = "500";
    linkEl.addEventListener("mouseenter", () => {
      linkEl.style.textDecoration = "underline";
    });
    linkEl.addEventListener("mouseleave", () => {
      linkEl.style.textDecoration = "none";
    });

    card.appendChild(titleEl);
    card.appendChild(contentEl);
    card.appendChild(linkEl);

    // 悬停效果
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
    });

    return card;
  }

  /**
   * 创建访问说明区域
   * @returns {HTMLElement}
   */
  function createAccessInfo() {
    const container = document.createElement("div");
    container.className = "helper-access-info";
    container.style.marginTop = "24px";
    container.style.padding = "16px 20px";
    container.style.borderLeft = "4px solid #1a73e8";
    container.style.backgroundColor = "#f0f6ff";
    container.style.borderRadius = "6px";

    const heading = document.createElement("p");
    heading.innerHTML = `<strong>访问说明：</strong> 推荐使用最新版 Chrome / Firefox / Edge 浏览器访问该平台。`;
    heading.style.margin = "0 0 6px 0";
    heading.style.fontSize = "15px";
    heading.style.color = "#222";

    const linkPara = document.createElement("p");
    linkPara.style.margin = "0";
    linkPara.style.fontSize = "14px";
    linkPara.style.color = "#444";

    const link = document.createElement("a");
    link.href = CONFIG.portalUrl;
    link.textContent = CONFIG.portalUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.wordBreak = "break-all";

    linkPara.appendChild(document.createTextNode("官方入口："));
    linkPara.appendChild(link);

    container.appendChild(heading);
    container.appendChild(linkPara);

    return container;
  }

  // ---------- 主渲染函数 ----------
  /**
   * 将帮助组件挂载到指定容器（或 body）
   * @param {string|HTMLElement} [container] 选择器字符串或元素
   */
  function renderHelper(container) {
    let root;
    if (typeof container === "string") {
      root = document.querySelector(container);
    } else if (container instanceof HTMLElement) {
      root = container;
    } else {
      root = document.body;
    }

    if (!root) {
      console.warn("[site-helper] 未找到挂载点，使用 body");
      root = document.body;
    }

    // 如果已经有 helper 容器，不再重复插入
    if (root.querySelector(".helper-container")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "helper-container";
    wrapper.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    // ---- 提示卡片 ----
    const card = createTipCard({
      title: `欢迎来到「${CONFIG.keyword}」`,
      content: `这里汇集了最新游戏资讯与社区动态。点击下方链接可直达官方页面。`,
      link: CONFIG.portalUrl,
    });
    wrapper.appendChild(card);

    // ---- 关键词徽章 ----
    const badgeWrapper = document.createElement("div");
    badgeWrapper.style.margin = "10px 0";
    badgeWrapper.appendChild(createBadge(CONFIG.keyword));
    badgeWrapper.appendChild(createBadge("游戏"));
    badgeWrapper.appendChild(createBadge("社区"));
    badgeWrapper.appendChild(createBadge("资讯"));
    wrapper.appendChild(badgeWrapper);

    // ---- 访问说明 ----
    wrapper.appendChild(createAccessInfo());

    root.appendChild(wrapper);
  }

  // 暴露接口（支持 AMD / CommonJS / 全局）
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return { render: renderHelper };
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = { render: renderHelper };
  } else {
    window.siteHelper = { render: renderHelper };
  }

  // 自动挂载（除非指定 data-auto="false"）
  const scriptEl = document.currentScript;
  if (!scriptEl || scriptEl.getAttribute("data-auto") !== "false") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        renderHelper();
      });
    } else {
      renderHelper();
    }
  }
})();