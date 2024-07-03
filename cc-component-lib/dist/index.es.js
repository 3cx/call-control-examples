(function(){"use strict";try{if(typeof document<"u"){var t=document.createElement("style");t.appendChild(document.createTextNode('*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.btn-dialer{display:flex;flex-direction:column;align-items:center;justify-content:center}.btn-dialer:hover:enabled{--tw-bg-opacity: 1;background-color:rgb(64 63 63 / var(--tw-bg-opacity))}.btn-dialer:disabled{opacity:.15}.absolute{position:absolute}.relative{position:relative}.left-0{left:0}.mx-auto{margin-left:auto;margin-right:auto}.my-4{margin-top:1rem;margin-bottom:1rem}.-mr-1{margin-right:-.25rem}.ml-2{margin-left:.5rem}.mr-3{margin-right:.75rem}.mr-4{margin-right:1rem}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.h-1\\/6{height:16.666667%}.h-2\\/5{height:40%}.h-3\\/5{height:60%}.h-4{height:1rem}.h-5{height:1.25rem}.h-\\[12px\\]{height:12px}.h-\\[25px\\]{height:25px}.h-\\[30px\\]{height:30px}.h-\\[34px\\]{height:34px}.h-\\[35px\\]{height:35px}.h-\\[45px\\]{height:45px}.h-\\[600px\\]{height:600px}.h-full{height:100%}.w-4{width:1rem}.w-5{width:1.25rem}.w-\\[12px\\]{width:12px}.w-\\[150px\\]{width:150px}.w-\\[25px\\]{width:25px}.w-\\[30px\\]{width:30px}.w-\\[35px\\]{width:35px}.w-\\[400px\\]{width:400px}.w-full{width:100%}.max-w-lg{max-width:32rem}.origin-top-left{transform-origin:top left}.rotate-\\[133deg\\]{--tw-rotate: 133deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes pulse{50%{opacity:.5}}.animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-pointer{cursor:pointer}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-rows-2{grid-template-rows:repeat(2,minmax(0,1fr))}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.divide-gray-100>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(243 244 246 / var(--tw-divide-opacity))}.rounded{border-radius:.25rem}.rounded-md{border-radius:.375rem}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-t-2{border-top-width:2px}.border-none{border-style:none}.border-darklight{--tw-border-opacity: 1;border-color:rgb(64 63 63 / var(--tw-border-opacity))}.bg-darkBg{--tw-bg-opacity: 1;background-color:rgb(33 33 33 / var(--tw-bg-opacity))}.bg-darklight{--tw-bg-opacity: 1;background-color:rgb(64 63 63 / var(--tw-bg-opacity))}.bg-gray-800{--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}.bg-green-500{--tw-bg-opacity: 1;background-color:rgb(34 197 94 / var(--tw-bg-opacity))}.bg-red-200{--tw-bg-opacity: 1;background-color:rgb(254 202 202 / var(--tw-bg-opacity))}.bg-red-500{--tw-bg-opacity: 1;background-color:rgb(239 68 68 / var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.fill-green-500{fill:#22c55e}.fill-white{fill:#fff}.fill-yellow-400{fill:#facc15}.stroke-gray-500{stroke:#6b7280}.p-2{padding:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-5{padding-top:1.25rem;padding-bottom:1.25rem}.text-left{text-align:left}.text-center{text-align:center}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.text-green-500{--tw-text-opacity: 1;color:rgb(34 197 94 / var(--tw-text-opacity))}.text-red-600{--tw-text-opacity: 1;color:rgb(220 38 38 / var(--tw-text-opacity))}.text-red-800{--tw-text-opacity: 1;color:rgb(153 27 27 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.text-yellow-400{--tw-text-opacity: 1;color:rgb(250 204 21 / var(--tw-text-opacity))}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.hover\\:bg-bghover:hover{--tw-bg-opacity: 1;background-color:rgb(102 101 101 / var(--tw-bg-opacity))}.hover\\:bg-gray-700:hover{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}.hover\\:bg-green-700:hover{--tw-bg-opacity: 1;background-color:rgb(21 128 61 / var(--tw-bg-opacity))}.hover\\:bg-red-700:hover{--tw-bg-opacity: 1;background-color:rgb(185 28 28 / var(--tw-bg-opacity))}.hover\\:fill-gray-400:hover{fill:#9ca3af}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.active\\:scale-105:active{--tw-scale-x: 1.05;--tw-scale-y: 1.05;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.disabled\\:bg-gray-400:disabled{--tw-bg-opacity: 1;background-color:rgb(156 163 175 / var(--tw-bg-opacity))}.disabled\\:text-gray-600:disabled{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}@media (min-width: 640px){.sm\\:h-5{height:1.25rem}.sm\\:w-5{width:1.25rem}}')),document.head.appendChild(t)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}})();
import { jsx as e, jsxs as h } from "react/jsx-runtime";
import { useEffect as C, useState as v, useRef as V, useReducer as Y, useMemo as z, useCallback as T } from "react";
function ee(t, n) {
  n === void 0 && (n = {}), n.insertAt;
}
var te = "";
ee(te, { insertAt: "top" });
const ne = "drop", ie = "answer", le = "divert", G = "transferto", W = "Connected", re = "Dialing", F = "Ringing", ce = ({ ref: t, handler: n }) => {
  C(() => {
    const a = (u) => {
      t.current && !t.current.contains(u.target) && n();
    };
    return document.addEventListener("mousedown", a), () => {
      document.removeEventListener("mousedown", a);
    };
  }, [t, n]);
}, se = ({
  title: t = "Select",
  data: n,
  selectedId: a,
  onSelect: u
}) => {
  const [g, b] = v(!1), w = V(null);
  ce({
    ref: w,
    handler: () => b(!1)
  });
  const [r, k] = v(
    a ? n.find((s) => s.device_id === a) : void 0
  ), L = (s) => {
    k(s), u && u(s.device_id), b(!1);
  };
  return C(() => {
    if (a && n) {
      const s = n.find((x) => x.device_id === a);
      s && k(s);
    } else
      k(void 0);
  }, [a, n]), /* @__PURE__ */ e(
    "div",
    {
      ref: w,
      className: "w-full relative inline-block text-left bg-darklight",
      children: /* @__PURE__ */ h("div", { className: "group", children: [
        /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            className: "inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white",
            onClick: () => b(!g),
            children: [
              /* @__PURE__ */ e("span", { children: (r == null ? void 0 : r.user_agent) || t }),
              /* @__PURE__ */ e(
                "svg",
                {
                  className: "w-4 h-4 ml-2 -mr-1",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  children: /* @__PURE__ */ e("path", { fillRule: "evenodd", d: "M10 12l-5-5h10l-5 5z" })
                }
              )
            ]
          }
        ),
        g && /* @__PURE__ */ e("ul", { className: "absolute w-full left-0 origin-top-left bg-darklight text-white divide-y divide-gray-100 shadow-lg", children: n == null ? void 0 : n.map((s) => /* @__PURE__ */ e(
          "li",
          {
            onClick: () => L(s),
            className: "block px-4 py-2 text-sm text-white-600 cursor-pointer border-none hover:bg-bghover",
            children: s.user_agent
          },
          s.device_id
        )) })
      ] })
    }
  );
}, ae = ({
  onCallAction: t,
  state: n,
  initializing: a
}) => /* @__PURE__ */ h("div", { className: "h-3/5 border-t-2 border-b-2 border-darklight grid grid-cols-3 text-white text-center font-bold text-lg", children: [
  /* @__PURE__ */ h(
    "button",
    {
      className: "btn-dialer",
      disabled: n !== j.Ringing || a,
      onClick: () => t(le),
      children: [
        /* @__PURE__ */ e(
          "svg",
          {
            className: "h-[35px] w-[35px]",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 640 512",
            children: /* @__PURE__ */ e(
              "path",
              {
                fill: "white",
                d: "M232 0c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-39 39 58.7 58.7C282.3 152.4 300.8 160 320 160s37.7-7.6 51.3-21.3L503 7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L405.3 172.7C382.6 195.3 352 208 320 208s-62.6-12.7-85.3-35.3L176 113.9l-39 39c-6.9 6.9-17.2 8.9-26.2 5.2s-14.8-12.5-14.8-22.2V24c0-13.3 10.7-24 24-24H232zM51.4 489.9l-35.4-62c-9.7-16.9-8.3-38.1 5.5-51.7C72.6 325.9 178.1 256 320 256s247.4 69.9 298.5 120.2c13.9 13.6 15.2 34.8 5.5 51.7l-35.4 62c-7.4 12.9-22.7 19.1-37 14.8L438.8 470.8c-13.5-4.1-22.8-16.5-22.8-30.6V384c-62.3-20.8-129.7-20.8-192 0v56.2c0 14.1-9.3 26.6-22.8 30.6L88.4 504.7c-14.3 4.3-29.6-1.8-37-14.8z"
              }
            )
          }
        ),
        /* @__PURE__ */ e("span", { children: "Divert" })
      ]
    }
  ),
  /* @__PURE__ */ h(
    "button",
    {
      onClick: () => t(G),
      className: "btn-dialer",
      disabled: n !== j.Connected || a,
      children: [
        /* @__PURE__ */ e(
          "svg",
          {
            className: "h-[35px] w-[35px]",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 32 32",
            children: /* @__PURE__ */ e(
              "path",
              {
                d: "M26.74 10.6c-1.35-1.44-2.73-2.84-4.11-4.25-.42-.42-.95-.4-1.45-.2-.51.21-.67.65-.67 1.18v2.01c-.81 0-.79.05-1.5-.02-.75-.07-1.26.23-1.76.78-3.37 3.76-6.77 7.48-10.13 11.24-.37.41-.75.59-1.29.57-1.03-.04.29-.02-.75-.01-.87.02-.95.1-.96 1.02-.01.77-.01 1.54 0 2.3.02.83.1.93.9.93 1.67 0 .98-.02 2.65.01.5.01.84-.16 1.18-.53 3.41-3.8 6.87-7.58 10.26-11.4.66-.74.58-.69 1.41-.56 0 .66.01 1.29 0 1.91-.01.56.18 1.01.71 1.23.52.22 1.03.18 1.44-.24 1.35-1.37 2.69-2.74 4.02-4.14.46-.5.5-1.34.05-1.83zM5.03 13.14c1.17-.04-.19.03.98-.03.66-.03 1.12.16 1.55.69.75.91 1.58 1.76 2.41 2.69 1.05-1.19 2.02-2.28 3.06-3.45-1.35-1.49-2.61-2.91-3.91-4.3-.18-.19-.53-.3-.81-.3-1.97-.03-1.4-.01-3.38-.02-.56 0-.83.24-.83.82.01 1.01.01 2.01 0 3.01-.01.67.3.91.93.89z",
                fill: "white"
              }
            )
          }
        ),
        /* @__PURE__ */ e("span", { children: "Transfer" })
      ]
    }
  ),
  /* @__PURE__ */ e("div", {}),
  /* @__PURE__ */ e("div", {}),
  /* @__PURE__ */ e("div", {}),
  /* @__PURE__ */ e("div", {}),
  /* @__PURE__ */ e("div", {}),
  /* @__PURE__ */ e("div", {}),
  /* @__PURE__ */ e("div", {})
] }), H = ({ onClickBS: t }) => /* @__PURE__ */ e(
  "button",
  {
    type: "button",
    onClick: () => t(),
    className: "w-[30px] h-[30px] mr-4 active:scale-105",
    children: /* @__PURE__ */ e(
      "svg",
      {
        className: "w-25 h-25 fill-white hover:fill-gray-400",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 576 512",
        children: /* @__PURE__ */ e("path", { d: "M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" })
      }
    )
  }
), E = ({ color: t }) => /* @__PURE__ */ e(
  "div",
  {
    "aria-label": "Loading...",
    role: "status",
    className: "flex items-center space-x-2",
    children: /* @__PURE__ */ h(
      "svg",
      {
        className: `h-[30px] w-[30px] animate-spin ${t ? "color" : "stroke-gray-500"}`,
        viewBox: "0 0 256 256",
        children: [
          /* @__PURE__ */ e(
            "line",
            {
              x1: "128",
              y1: "32",
              x2: "128",
              y2: "64",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "195.9",
              y1: "60.1",
              x2: "173.3",
              y2: "82.7",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "224",
              y1: "128",
              x2: "192",
              y2: "128",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "195.9",
              y1: "195.9",
              x2: "173.3",
              y2: "173.3",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "128",
              y1: "224",
              x2: "128",
              y2: "192",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "60.1",
              y1: "195.9",
              x2: "82.7",
              y2: "173.3",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "32",
              y1: "128",
              x2: "64",
              y2: "128",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: "60.1",
              y1: "60.1",
              x2: "82.7",
              y2: "82.7",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "24"
            }
          )
        ]
      }
    )
  }
), oe = ({
  onPerformingOperation: t,
  onOperation: n,
  inputRef: a,
  destinationNumber: u,
  setDestinationNumber: g,
  label: b
}) => /* @__PURE__ */ h("div", { className: "flex gap-2 items-center justify-center text-sm py-5", children: [
  /* @__PURE__ */ e("label", { htmlFor: "tranferField", className: "text-sm", children: b }),
  /* @__PURE__ */ e(
    "input",
    {
      id: "transferField",
      ref: a,
      className: "focus:outline-none text-center h-[34px] bg-transparent border-b border-darklight",
      value: u,
      onChange: (w) => g(w.target.value)
    }
  ),
  /* @__PURE__ */ e(
    H,
    {
      onClickBS: () => g(
        u.substring(0, u.length - 1)
      )
    }
  ),
  /* @__PURE__ */ e(
    "button",
    {
      disabled: u.length < 1 || t,
      className: "bg-green-500 p-2 rounded-md disabled:bg-gray-400",
      onClick: () => n(),
      children: t ? /* @__PURE__ */ e(E, {}) : "Proceed"
    }
  )
] });
var j = /* @__PURE__ */ ((t) => (t[t.Idle = 0] = "Idle", t[t.Dialing = 1] = "Dialing", t[t.Ringing = 2] = "Ringing", t[t.Connected = 3] = "Connected", t))(j || {});
function de(t, n) {
  switch (n.type) {
    case "full_update":
      return n.newState !== void 0 ? {
        ...n.newState,
        attachedData: {
          ...n.newState.attachedData,
          ...(t == null ? void 0 : t.attachedData) || []
          // we keep old attached data because it can contain hubspot data
        }
      } : void 0;
    case "attach_data":
      return n.attachedData !== void 0 && t !== void 0 ? {
        ...t,
        attachedData: n.attachedData
      } : t;
  }
}
const ge = ({
  eventSourceUrl: t,
  onDeviceSelect: n,
  devices: a,
  onMakeCall: u,
  onCallControlParticipant: g,
  activeDeviceId: b,
  phoneNumber: w,
  extensions: r,
  sourceCallerId: k,
  engagementId: L
}) => {
  const [s, x] = v(w), [c, p] = v(
    0
    /* Idle */
  ), [f, P] = v([]), [i, y] = Y(
    de,
    void 0
  ), [N, A] = v(void 0), [S, I] = v(""), [U, O] = v(!1), [Z, R] = v(!1), [B, D] = v(!1), _ = V(null);
  C(() => {
    const l = new EventSource(t);
    return l.onopen = () => {
      console.log("EventSource Connected"), r == null || r.initialized({
        isLoggedIn: !0,
        sizeInfo: { width: 400, height: 600 },
        engagementId: L
      });
    }, l.onerror = console.error, l.onmessage = function(o) {
      try {
        const d = JSON.parse(o.data);
        P(d.currentCalls);
      } catch {
        r == null || r.sendError({
          message: "Failed to parse JSON from EventSource"
        });
      }
    }, () => l.close();
  }, []), C(() => {
    c === 0 && w.length > 0 && M(w);
  }, [w]), C(() => {
    y({
      type: "attach_data",
      attachedData: { engagementId: L }
    });
  }, [L]), C(() => {
    const l = f == null ? void 0 : f.find(
      (m) => m.status === W
    ), o = f == null ? void 0 : f.find(
      (m) => m.status === F
    ), d = f == null ? void 0 : f.find(
      (m) => m.status === re
    );
    if (l && c !== 3 && (c === 1 && (r == null || r.callAnswered()), p(
      3
      /* Connected */
    ), y({ type: "full_update", newState: l })), d && !i && (y({ type: "full_update", newState: d }), c !== 1 && p(
      1
      /* Dialing */
    ), r == null || r.outgoingCall({
      //hubspot outgoing call notify
      toNumber: d.party || "",
      createEngagement: !0,
      fromNumber: k
    })), o && !i && c === 0 && (p(
      2
      /* Ringing */
    ), y({ type: "full_update", newState: o })), (f == null ? void 0 : f.length) === 0 && i !== void 0 && c !== 0) {
      const m = i.status === W ? "COMPLETED" : "CANCELED";
      r == null || r.callEnded({
        callEndStatus: m
      }), r == null || r.callCompleted({
        engagementId: i.attachedData.engagementId,
        engagementProperties: {
          hs_call_status: m
        }
      }), p(
        0
        /* Idle */
      ), y({ type: "full_update", newState: void 0 });
    }
  }, [
    c,
    p,
    y,
    i,
    f,
    P,
    r
  ]);
  const $ = z(() => {
    const l = [];
    for (let o = 1; o <= 12; o++) {
      let d = "";
      o < 10 ? d = o : o === 10 ? d = "*" : o === 11 ? d = 0 : o === 12 && (d = "#"), l.push(
        /* @__PURE__ */ e(
          "button",
          {
            onClick: () => x((m) => m + d),
            className: "btn-dialer",
            children: d
          },
          o
        )
      );
    }
    return l;
  }, []), J = T(
    (l) => {
      I(""), A(N ? void 0 : l);
    },
    [I, N, A]
  ), q = T(async () => {
    if (N) {
      O(!0);
      try {
        await g(
          N,
          i == null ? void 0 : i.participantId,
          S
        );
      } catch {
      } finally {
        A(void 0), O(!1);
      }
    }
  }, [
    N,
    A,
    O,
    g
  ]), K = T(
    async (l) => {
      D(!0);
      try {
        await n(l);
      } catch {
      } finally {
        D(!1), p(
          0
          /* Idle */
        ), y({ type: "full_update", newState: void 0 });
      }
    },
    [D, n, p, y]
  ), Q = async () => {
    try {
      await g(
        ne,
        i == null ? void 0 : i.participantId
      );
    } catch {
    }
  }, M = T(
    async (l) => {
      if ((i == null ? void 0 : i.status) === F && i.directControll) {
        R(!0);
        try {
          await g(
            ie,
            i.participantId
          );
        } catch {
        } finally {
          R(!1);
        }
      } else if (l != null && l.length || s.length)
        try {
          await u(l || s), x(""), c !== 1 && p(
            1
            /* Dialing */
          );
        } catch {
          p(
            0
            /* Idle */
          );
        }
    },
    [
      s,
      x,
      i,
      c,
      p,
      R,
      g
    ]
  ), X = z(() => {
    switch (c) {
      case 0:
        return /* @__PURE__ */ e("div", { className: "flex justify-center items-end", children: /* @__PURE__ */ e(
          "input",
          {
            ref: _,
            className: "bg-transparent focus:outline-none text-center",
            value: s,
            onChange: (l) => x(l.target.value)
          }
        ) });
      case 1:
      case 3:
      case 2:
        return /* @__PURE__ */ h("div", { className: "flex flex-col items-center justify-end", children: [
          /* @__PURE__ */ e("span", { children: i != null && i.party ? /* @__PURE__ */ h("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ e("span", { className: "text-center", children: i.party }),
            /* @__PURE__ */ h(
              "span",
              {
                className: `flex items-center gap-1 font-bold text-sm animate-pulse ${c === 3 ? "text-green-500" : "text-yellow-400"}`,
                children: [
                  /* @__PURE__ */ e(
                    "svg",
                    {
                      className: `w-[12px] h-[12px] ${c === 3 ? "fill-green-500" : "fill-yellow-400"}`,
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 512 512",
                      children: /* @__PURE__ */ e("path", { d: "M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" })
                    }
                  ),
                  c === 3 ? "Conencted" : "Dialing"
                ]
              }
            )
          ] }) : /* @__PURE__ */ h("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ e("span", { className: "animate-pulse font-bold text-sm text-white" }),
            /* @__PURE__ */ e(E, {})
          ] }) }),
          (i == null ? void 0 : i.name) && /* @__PURE__ */ e("span", { children: i.name })
        ] });
    }
  }, [c, _, s, x, i]);
  return /* @__PURE__ */ h("div", { className: "w-[400px] h-[600px] bg-darkBg flex flex-col", children: [
    /* @__PURE__ */ e("div", { children: a && /* @__PURE__ */ e(
      se,
      {
        data: a,
        selectedId: b,
        onSelect: K
      }
    ) }),
    /* @__PURE__ */ h(
      "div",
      {
        className: "h-2/5 text-white font-bold text-xl grid grid-rows-2",
        onClick: () => {
          var l;
          return (l = _.current) == null ? void 0 : l.focus();
        },
        children: [
          X,
          c === 0 && /* @__PURE__ */ e("div", { className: "flex justify-end items-center", children: /* @__PURE__ */ e(
            H,
            {
              onClickBS: () => x(s.substring(0, s.length - 1))
            }
          ) }),
          c !== 0 && N !== void 0 && /* @__PURE__ */ e(
            oe,
            {
              inputRef: _,
              onOperation: q,
              onPerformingOperation: U,
              destinationNumber: S,
              setDestinationNumber: I,
              label: N === G ? "Transfer to:" : "Divert to:"
            }
          )
        ]
      }
    ),
    c === 0 ? /* @__PURE__ */ e("div", { className: "h-3/5 border-t-2 border-b-2 border-darklight grid grid-cols-3 text-white text-center font-bold text-lg", children: $ }) : /* @__PURE__ */ e(
      ae,
      {
        onCallAction: J,
        state: c,
        initializing: !i
      }
    ),
    /* @__PURE__ */ h("div", { className: "h-1/6 flex flex-row", children: [
      (c === 0 || c === 2) && /* @__PURE__ */ e("div", { className: "flex justify-center items-center w-full", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: B || Z || (i !== void 0 ? i.directControll !== !0 : !1),
          onClick: () => M(),
          className: "flex justify-center items-center w-full h-full bg-green-500 hover:bg-green-700 disabled:bg-gray-400",
          children: /* @__PURE__ */ e(
            "svg",
            {
              fill: "white",
              className: "w-[25px] h-[25px]",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 512 512",
              children: /* @__PURE__ */ e("path", { d: "M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" })
            }
          )
        }
      ) }),
      c !== 0 && /* @__PURE__ */ e("div", { className: "flex justify-center items-center w-full", children: /* @__PURE__ */ e(
        "button",
        {
          disabled: B || c === 1 && i === void 0,
          onClick: () => Q(),
          className: "flex justify-center items-center w-full h-full bg-red-500 hover:bg-red-700 disabled:bg-gray-400",
          children: /* @__PURE__ */ e(
            "svg",
            {
              fill: "white",
              className: "w-[25px] h-[25px] rotate-[133deg]",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 512 512",
              children: /* @__PURE__ */ e("path", { d: "M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" })
            }
          )
        }
      ) })
    ] })
  ] });
}, fe = ({
  type: t,
  disabled: n,
  label: a,
  isLoading: u,
  onBtnClick: g
}) => /* @__PURE__ */ e(
  "button",
  {
    disabled: n,
    onClick: g,
    type: t,
    className: "flex justify-center items-center rounded w-[150px] h-[45px] bg-gray-800 hover:bg-gray-700 text-white disabled:bg-gray-400 disabled:text-gray-600",
    children: u ? /* @__PURE__ */ e(E, {}) : a
  }
), pe = ({ message: t }) => /* @__PURE__ */ h("div", { className: "bg-red-200 px-6 py-4 my-4 rounded-md flex items-center mx-auto max-w-lg", children: [
  /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 24 24",
      className: "text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3",
      children: /* @__PURE__ */ e(
        "path",
        {
          fill: "currentColor",
          d: "M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
        }
      )
    }
  ),
  /* @__PURE__ */ e("span", { className: "text-red-800", children: t })
] });
export {
  H as BackSpaceBtn,
  fe as ButtonForms,
  ae as CallActions,
  ge as Dialer,
  pe as Error,
  se as Select,
  E as Spinner,
  oe as TransferComponent
};
//# sourceMappingURL=index.es.js.map