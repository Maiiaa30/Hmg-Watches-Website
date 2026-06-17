/* @ds-bundle: {"format":3,"namespace":"HMGWatchesDesignSystem_1cb2d0","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Overline","sourcePath":"components/core/Overline.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"WatchCard","sourcePath":"components/product/WatchCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"41ab3b7d8772","components/core/Button.jsx":"7b86f9d98348","components/core/Card.jsx":"4b52efc3e0fe","components/core/Overline.jsx":"99d30956df1c","components/forms/Checkbox.jsx":"da08cab70c18","components/forms/Input.jsx":"f78996380894","components/forms/Select.jsx":"dd2e18499739","components/product/WatchCard.jsx":"6d279e2b3116","ui_kits/admin/AdminScreens.jsx":"6f99cfcd28d5","ui_kits/admin/AdminShell.jsx":"f3c3d2321aa5","ui_kits/admin/data.js":"603c0136f0a9","ui_kits/website/BlogScreens.jsx":"976ec765a26e","ui_kits/website/CatalogDetail.jsx":"fd1fe7e9f250","ui_kits/website/Chrome.jsx":"15fbe75f1828","ui_kits/website/HomeAbout.jsx":"597972a8eb86","ui_kits/website/Icon.jsx":"7751db1432ec","ui_kits/website/MarketContact.jsx":"8e4c42a0fae5","ui_kits/website/WatchVisual.jsx":"40e7c19b255f","ui_kits/website/data.js":"f55d307d10a7","ui_kits/website/responsive.js":"68144fd28f83"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HMGWatchesDesignSystem_1cb2d0 = window.HMGWatchesDesignSystem_1cb2d0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Badge
 * Discreet status pills: availability and market trend.
 */
function Badge({
  variant = "available",
  children,
  style = {},
  ...rest
}) {
  const variants = {
    available: {
      background: "var(--status-available-bg)",
      color: "var(--status-available-fg)",
      label: "Disponível"
    },
    sold: {
      background: "var(--status-sold-bg)",
      color: "var(--status-sold-fg)",
      label: "Vendido"
    },
    gold: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid var(--accent)",
      label: ""
    },
    up: {
      background: "rgba(125, 184, 125, 0.12)",
      color: "var(--trend-up)",
      label: ""
    },
    down: {
      background: "rgba(201, 122, 106, 0.12)",
      color: "var(--trend-down)",
      label: ""
    }
  };
  const v = variants[variant] || variants.available;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 11px",
      fontFamily: "var(--font-ui)",
      fontSize: "11px",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "var(--ls-wide)",
      textTransform: "uppercase",
      borderRadius: "var(--radius-pill)",
      background: v.background,
      color: v.color,
      border: v.border || "none",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), variant === "available" && /*#__PURE__*/React.createElement(Dot, {
    color: "var(--status-available-fg)"
  }), children || v.label);
}
function Dot({
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: color,
      display: "inline-block"
    }
  });
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Button
 * Public site uses GHOST buttons only: thin border, transparent fill,
 * fills with the border colour on hover. Solid variant is reserved for
 * the admin panel where operational clarity matters.
 */
function Button({
  children,
  variant = "ghost-gold",
  size = "md",
  as = "button",
  href,
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "10px 20px",
      fontSize: "12px"
    },
    md: {
      padding: "15px 32px",
      fontSize: "13px"
    },
    lg: {
      padding: "19px 44px",
      fontSize: "14px"
    }
  };
  const variants = {
    "ghost-gold": {
      color: "var(--accent)",
      border: "1px solid var(--accent)",
      background: "transparent",
      "--hover-bg": "var(--accent)",
      "--hover-fg": "var(--text-on-gold)"
    },
    "ghost-light": {
      color: "var(--text-primary)",
      border: "1px solid var(--border-on-dark)",
      background: "transparent",
      "--hover-bg": "var(--text-primary)",
      "--hover-fg": "var(--bg-page)"
    },
    // Admin only — solid fill for operational clarity
    solid: {
      color: "var(--text-on-gold)",
      border: "1px solid var(--accent)",
      background: "var(--accent)",
      "--hover-bg": "var(--accent-hover)",
      "--hover-fg": "var(--text-on-gold)"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-ui)",
    fontWeight: "var(--fw-medium)",
    letterSpacing: "var(--ls-wide)",
    textTransform: "uppercase",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
    whiteSpace: "nowrap",
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const onEnter = e => {
    if (disabled) return;
    const v = variants[variant];
    e.currentTarget.style.background = v["--hover-bg"];
    e.currentTarget.style.color = v["--hover-fg"];
    e.currentTarget.style.borderColor = v["--hover-bg"];
  };
  const onLeave = e => {
    if (disabled) return;
    const v = variants[variant];
    e.currentTarget.style.background = v.background;
    e.currentTarget.style.color = v.color;
    e.currentTarget.style.borderColor = v.border.split(" ").pop();
  };
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: base,
    disabled: disabled && !href ? true : undefined,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Card surface.
 * A quiet charcoal surface with a hairline border. The showcase, not the show.
 */
function Card({
  children,
  padding = "var(--pad-card)",
  interactive = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderColor: hover ? "var(--accent)" : "var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      padding,
      transition: "border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
      transform: hover ? "translateY(-4px)" : "none",
      cursor: interactive ? "pointer" : "default",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Overline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Overline / eyebrow label.
 * Small uppercase gold label with generous tracking. Used above headings.
 */
function Overline({
  children,
  color = "var(--accent)",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-block",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--fs-overline)",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "var(--ls-wider)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Overline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Overline.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Checkbox.
 * Square hairline box that fills gold when checked. Used in catalogue filters.
 */
function Checkbox({
  label,
  checked,
  onChange,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: "14px",
      color: "var(--text-secondary)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: "16px",
      height: "16px",
      flexShrink: 0,
      border: `1px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
      background: checked ? "var(--accent)" : "transparent",
      borderRadius: "var(--radius-sm)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--dur-fast) var(--ease-out)",
      color: "var(--text-on-gold)",
      fontSize: "11px"
    }
  }, checked && "✓"), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Input (text field).
 * Quiet underline-on-dark field with a gold focus state.
 */
function Input({
  label,
  hint,
  type = "text",
  style = {},
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || `in-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "block",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: "8px",
      fontFamily: "var(--font-ui)",
      fontSize: "11px",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "var(--ls-wider)",
      textTransform: "uppercase",
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      padding: "13px 0",
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${focus ? "var(--accent)" : "var(--border-strong)"}`,
      color: "var(--text-primary)",
      fontFamily: "var(--font-ui)",
      fontSize: "16px",
      outline: "none",
      transition: "border-color var(--dur-base) var(--ease-out)"
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: "6px",
      fontSize: "12px",
      color: "var(--text-tertiary)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HMG Watches — Select.
 * Matches the underline field aesthetic.
 */
function Select({
  label,
  options = [],
  style = {},
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || `sel-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      display: "block",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: "8px",
      fontFamily: "var(--font-ui)",
      fontSize: "11px",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "var(--ls-wider)",
      textTransform: "uppercase",
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      padding: "13px 28px 13px 0",
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${focus ? "var(--accent)" : "var(--border-strong)"}`,
      color: "var(--text-primary)",
      fontFamily: "var(--font-ui)",
      fontSize: "16px",
      outline: "none",
      appearance: "none",
      cursor: "pointer",
      transition: "border-color var(--dur-base) var(--ease-out)"
    }
  }, rest), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o,
    style: {
      background: "var(--surface-raised)"
    }
  }, o.label ?? o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: "2px",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--accent)",
      fontSize: "12px"
    }
  }, "\u25BE")));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/product/WatchCard.jsx
try { (() => {
/**
 * HMG Watches — WatchCard
 * The signature product card. The watch floats on a quiet surface with
 * generous space around it. Brand + model in clear hierarchy, reference in
 * smaller text, price in EUR, discreet availability badge.
 */
function WatchCard({
  image,
  brand = "Marca",
  model = "Modelo",
  reference = "",
  price = "",
  status = "available",
  // "available" | "sold"
  appreciation = "",
  // e.g. "+23% em 6 meses" — shows a gold trend badge
  visual = null,
  // optional ReactNode rendered in the image bay (placeholder art)
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const sold = status === "sold";
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "1px solid",
      borderColor: hover ? "var(--accent)" : "var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      transition: "border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
      transform: hover ? "translateY(-6px)" : "none",
      boxShadow: hover ? "var(--shadow-card)" : "var(--shadow-soft)",
      display: "flex",
      flexDirection: "column",
      ...style
    }
  }, image ?
  /*#__PURE__*/
  /* Real photo — clean full-bleed image */
  React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 5",
      overflow: "hidden",
      background: "var(--surface-sunken)"
    }
  }, appreciation && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "16px",
      left: "16px",
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "gold"
  }, appreciation)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "16px",
      right: "16px",
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: sold ? "sold" : "available"
  })), /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: `${brand} ${model}`,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      filter: sold ? "grayscale(0.55) opacity(0.82)" : "none",
      transform: hover ? "scale(1.04)" : "scale(1)",
      transition: "transform var(--dur-slow) var(--ease-out)"
    }
  })) :
  /*#__PURE__*/
  /* No photo yet — watch sits inside a gold-lined display arch */
  React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 5",
      background: "var(--surface-raised)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      padding: "12% 14% 0",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "14%",
      right: "14%",
      bottom: 0,
      top: "10%",
      background: "linear-gradient(180deg, #FFFFFF 0%, #F6F0E4 100%)",
      borderRadius: "999px 999px 6px 6px",
      border: "1px solid var(--border-subtle)",
      borderBottom: "none",
      boxShadow: "inset 0 2px 14px rgba(40,33,20,0.04)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "17%",
      right: "17%",
      bottom: 0,
      top: "14%",
      borderRadius: "999px 999px 4px 4px",
      border: "1px solid",
      borderColor: hover ? "var(--accent)" : "rgba(182,138,46,0.28)",
      borderBottom: "none",
      transition: "border-color var(--dur-base) var(--ease-out)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "16px",
      right: "16px",
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: sold ? "sold" : "available"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: "16%",
      transform: hover ? "translateY(-6px)" : "none",
      transition: "transform var(--dur-slow) var(--ease-out)"
    }
  }, visual ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: "70%",
      display: "flex",
      justifyContent: "center"
    }
  }, visual) : /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-tertiary)",
      fontSize: "12px",
      letterSpacing: "var(--ls-wide)",
      textTransform: "uppercase",
      paddingBottom: "30%"
    }
  }, "Fotografia"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--sp-5) var(--sp-5) var(--sp-6)",
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "11px",
      letterSpacing: "var(--ls-wider)",
      textTransform: "uppercase",
      color: "var(--text-secondary)"
    }
  }, brand), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "21px",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-primary)",
      lineHeight: 1.2
    }
  }, model), reference && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
      color: "var(--text-tertiary)"
    }
  }, "Ref. ", reference), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "12px",
      fontFamily: "var(--font-ui)",
      fontSize: "18px",
      color: sold ? "var(--text-tertiary)" : "var(--text-primary)"
    }
  }, price)));
}
Object.assign(__ds_scope, { WatchCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/WatchCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminScreens.jsx
try { (() => {
/* HMG Watches — Admin screens. */
(function () {
  const {
    Button,
    Badge,
    Card,
    Input,
    Select
  } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon,
    A = window.ADMINDATA,
    WatchVisual = window.WatchVisual;
  const PAD = {
    padding: "32px 40px 64px"
  };
  function Dashboard() {
    const Table = window.AdminTable,
      Row = window.AdminRow;
    const cols = [{
      label: "Relógio",
      w: "1.6fr"
    }, {
      label: "Referência",
      w: "1fr"
    }, {
      label: "Visualizações",
      w: "0.7fr",
      align: "right"
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: PAD
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 18,
        marginBottom: 32
      }
    }, A.metrics.map(m => /*#__PURE__*/React.createElement(Card, {
      key: m.label,
      padding: "22px 24px",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--accent)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: m.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: m.up ? "var(--trend-up)" : "var(--accent)"
      }
    }, m.delta)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 32,
        fontFamily: "var(--font-display)",
        color: "var(--text-primary)",
        lineHeight: 1
      }
    }, m.value), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)",
        marginTop: 8
      }
    }, m.label))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: 24
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "26px 28px"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18
      }
    }, "Visitas \xB7 \xFAltimos 30 dias"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-tertiary)"
      }
    }, "Total 6.214")), /*#__PURE__*/React.createElement(window.AdminLineChart, {
      data: A.visits30,
      height: 230
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "26px 28px"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18,
        marginBottom: 20
      }
    }, "Atividade recente"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 18
      }
    }, A.activity.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 14,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 2,
        color: "var(--accent)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)",
        lineHeight: 1.5
      }
    }, a.text), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-tertiary)",
        marginTop: 3
      }
    }, a.time))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18,
        marginBottom: 18
      }
    }, "Rel\xF3gios mais vistos"), /*#__PURE__*/React.createElement(Table, {
      columns: cols
    }, A.topWatches.map((w, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      columns: cols,
      last: i === A.topWatches.length - 1,
      cells: [/*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-primary)"
        }
      }, w.brand, " \xB7 ", w.model), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--text-tertiary)"
        }
      }, w.ref), /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-primary)"
        }
      }, w.views.toLocaleString("pt-PT"))]
    })))));
  }
  function Thumb({
    hue,
    sold
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 4,
        background: "linear-gradient(180deg, #FFFFFF, #F4EEE1)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement(WatchVisual, {
      hue: hue,
      sold: sold,
      size: "100%"
    })));
  }
  function WatchesScreen() {
    const Table = window.AdminTable,
      Row = window.AdminRow;
    const cols = [{
      label: "",
      w: "60px"
    }, {
      label: "Marca / Modelo",
      w: "1.6fr"
    }, {
      label: "Referência",
      w: "1fr"
    }, {
      label: "Preço",
      w: "0.8fr"
    }, {
      label: "Estado",
      w: "0.8fr"
    }, {
      label: "Adicionado",
      w: "0.9fr"
    }, {
      label: "Ações",
      w: "120px",
      align: "right"
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: PAD
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 24,
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: 1,
        maxWidth: 340
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 17
    })), /*#__PURE__*/React.createElement("input", {
      placeholder: "Pesquisar no stock\u2026",
      style: {
        width: "100%",
        padding: "10px 0 10px 28px",
        background: "transparent",
        border: "none",
        borderBottom: "1px solid var(--border-strong)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-ui)",
        fontSize: 14,
        outline: "none"
      }
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "solid",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      })
    }, "Adicionar Rel\xF3gio")), /*#__PURE__*/React.createElement(Table, {
      columns: cols
    }, A.stock.map((w, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      columns: cols,
      last: i === A.stock.length - 1,
      cells: [/*#__PURE__*/React.createElement(Thumb, {
        hue: w.hue,
        sold: w.status === "sold"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          color: "var(--text-primary)"
        }
      }, w.model), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: "var(--text-tertiary)"
        }
      }, w.brand)), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font-mono)",
          fontSize: 13
        }
      }, w.ref), /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-primary)"
        }
      }, w.price), /*#__PURE__*/React.createElement(Badge, {
        variant: w.status === "sold" ? "sold" : "available"
      }), /*#__PURE__*/React.createElement("span", null, w.added), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
          color: "var(--text-tertiary)"
        }
      }, /*#__PURE__*/React.createElement("a", {
        title: "Editar",
        style: {
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "pencil",
        size: 16
      })), /*#__PURE__*/React.createElement("a", {
        title: "Marcar vendido",
        style: {
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16
      })), /*#__PURE__*/React.createElement("a", {
        title: "Arquivar",
        style: {
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "archive",
        size: 16
      })))]
    }))));
  }
  function BlogScreen() {
    const Table = window.AdminTable,
      Row = window.AdminRow,
      Pill = window.AdminStatusPill;
    const cols = [{
      label: "Título",
      w: "2fr"
    }, {
      label: "Categoria",
      w: "1fr"
    }, {
      label: "Estado",
      w: "1fr"
    }, {
      label: "Data",
      w: "1fr"
    }, {
      label: "Ações",
      w: "140px",
      align: "right"
    }];
    const pending = A.posts.filter(p => p.status === "Pendente").length;
    return /*#__PURE__*/React.createElement("div", {
      style: PAD
    }, pending > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 22px",
        border: "1px solid var(--accent)",
        borderRadius: 6,
        background: "rgba(184,152,106,0.08)",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 18,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--text-primary)"
      }
    }, pending, " artigos pendentes de aprova\xE7\xE3o"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "solid",
      size: "sm"
    }, "Rever pendentes")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "solid",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      })
    }, "Novo Artigo")), /*#__PURE__*/React.createElement(Table, {
      columns: cols
    }, A.posts.map((p, i) => {
      const pend = p.status === "Pendente";
      return /*#__PURE__*/React.createElement(Row, {
        key: i,
        columns: cols,
        last: i === A.posts.length - 1,
        cells: [/*#__PURE__*/React.createElement("span", {
          style: {
            color: "var(--text-primary)",
            borderLeft: pend ? "2px solid var(--accent)" : "none",
            paddingLeft: pend ? 12 : 0
          }
        }, p.title), /*#__PURE__*/React.createElement("span", null, p.category), /*#__PURE__*/React.createElement(Pill, {
          status: p.status
        }), /*#__PURE__*/React.createElement("span", null, p.date), /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            color: "var(--text-tertiary)"
          }
        }, pend && /*#__PURE__*/React.createElement("a", {
          title: "Aprovar",
          style: {
            cursor: "pointer",
            color: "var(--trend-up)"
          }
        }, /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 16
        })), /*#__PURE__*/React.createElement("a", {
          title: "Editar",
          style: {
            cursor: "pointer"
          }
        }, /*#__PURE__*/React.createElement(Icon, {
          name: "pencil",
          size: 16
        })), /*#__PURE__*/React.createElement("a", {
          title: "Eliminar",
          style: {
            cursor: "pointer"
          }
        }, /*#__PURE__*/React.createElement(Icon, {
          name: "trash",
          size: 16
        })))]
      });
    })));
  }
  function AnalyticsScreen() {
    const [period, setPeriod] = React.useState("30 dias");
    const Table = window.AdminTable,
      Row = window.AdminRow;
    const cols = [{
      label: "Página",
      w: "1.4fr"
    }, {
      label: "Visualizações",
      w: "0.8fr",
      align: "right"
    }, {
      label: "",
      w: "1.4fr"
    }];
    const data = period === "7 dias" ? A.visits7 : A.visits30;
    return /*#__PURE__*/React.createElement("div", {
      style: PAD
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginBottom: 24
      }
    }, ["7 dias", "30 dias", "90 dias"].map(p => {
      const on = p === period;
      return /*#__PURE__*/React.createElement("button", {
        key: p,
        onClick: () => setPeriod(p),
        style: {
          cursor: "pointer",
          padding: "8px 18px",
          borderRadius: 999,
          background: on ? "var(--surface-raised)" : "transparent",
          border: `1px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
          color: on ? "var(--accent)" : "var(--text-secondary)",
          fontSize: 12,
          letterSpacing: "0.04em",
          textTransform: "uppercase"
        }
      }, p);
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "26px 28px",
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18,
        marginBottom: 20
      }
    }, "Visitas \xB7 ", period), /*#__PURE__*/React.createElement(window.AdminLineChart, {
      data: data,
      height: 250
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18,
        marginBottom: 18
      }
    }, "P\xE1ginas mais vistas"), /*#__PURE__*/React.createElement(Table, {
      columns: cols
    }, A.topPages.map((p, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      columns: cols,
      last: i === A.topPages.length - 1,
      cells: [/*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: 13
        }
      }, p.page), /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-primary)"
        }
      }, p.views), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 6,
          background: "var(--bg-page-alt)",
          borderRadius: 999,
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${p.pct}%`,
          height: "100%",
          background: "var(--accent)"
        }
      }))]
    })))), /*#__PURE__*/React.createElement(Card, {
      padding: "26px 28px"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18,
        marginBottom: 22
      }
    }, "Dispositivos"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        padding: "20px 0"
      }
    }, /*#__PURE__*/React.createElement(Donut, {
      pct: 68
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Legend, {
      color: "var(--accent)",
      label: "Desktop",
      value: "68%"
    }), /*#__PURE__*/React.createElement(Legend, {
      color: "var(--border-strong)",
      label: "Mobile",
      value: "32%"
    }))))));
  }
  function Donut({
    pct
  }) {
    const r = 52,
      c = 2 * Math.PI * r;
    return /*#__PURE__*/React.createElement("svg", {
      width: "130",
      height: "130",
      viewBox: "0 0 130 130"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "65",
      cy: "65",
      r: r,
      fill: "none",
      stroke: "var(--border-strong)",
      strokeWidth: "14"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "65",
      cy: "65",
      r: r,
      fill: "none",
      stroke: "var(--accent)",
      strokeWidth: "14",
      strokeLinecap: "round",
      strokeDasharray: `${pct / 100 * c} ${c}`,
      transform: "rotate(-90 65 65)"
    }), /*#__PURE__*/React.createElement("text", {
      x: "65",
      y: "71",
      textAnchor: "middle",
      fontFamily: "var(--font-display)",
      fontSize: "24",
      fill: "var(--text-primary)"
    }, pct, "%"));
  }
  function Legend({
    color,
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 12,
        height: 12,
        borderRadius: 3,
        background: color
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--text-secondary)"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--text-primary)",
        marginLeft: 6
      }
    }, value));
  }
  function SettingsScreen() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...PAD,
        maxWidth: 680
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "36px 38px",
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 20,
        marginBottom: 6
      }
    }, "Informa\xE7\xF5es do site"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: "var(--text-secondary)",
        marginBottom: 30
      }
    }, "Dados p\xFAblicos apresentados no site."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 26
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Nome do site",
      defaultValue: "HMG Watches"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Email de contacto",
      type: "email",
      defaultValue: "ola@hmgwatches.pt"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "solid",
      size: "sm"
    }, "Guardar altera\xE7\xF5es"))), /*#__PURE__*/React.createElement(Card, {
      padding: "36px 38px"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 20,
        marginBottom: 6
      }
    }, "Alterar password"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: "var(--text-secondary)",
        marginBottom: 30
      }
    }, "Recomendamos uma password forte e \xFAnica."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 26
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Password atual",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Nova password",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "solid",
      size: "sm"
    }, "Atualizar password"))));
  }
  function PlaceholderScreen({
    title,
    icon
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...PAD,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-tertiary)",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 44,
      strokeWidth: 1
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 26,
        marginBottom: 10
      }
    }, title), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text-secondary)",
        maxWidth: 380
      }
    }, "Esta sec\xE7\xE3o faz parte do painel mas n\xE3o est\xE1 inclu\xEDda neste prot\xF3tipo visual."));
  }
  window.AdminDashboard = Dashboard;
  window.AdminWatches = WatchesScreen;
  window.AdminBlog = BlogScreen;
  window.AdminAnalytics = AnalyticsScreen;
  window.AdminSettings = SettingsScreen;
  window.AdminPlaceholder = PlaceholderScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminShell.jsx
try { (() => {
/* HMG Watches — Admin shell (sidebar + topbar) and shared admin UI. */
(function () {
  const Icon = window.Icon;
  const NAV = [{
    key: "dashboard",
    label: "Dashboard",
    icon: "layout-dashboard"
  }, {
    key: "watches",
    label: "Relógios",
    icon: "watch"
  }, {
    key: "blog",
    label: "Blog",
    icon: "file-text"
  }, {
    key: "leads",
    label: "Leads",
    icon: "users"
  }, {
    key: "market",
    label: "Mercado",
    icon: "trending-up"
  }, {
    key: "analytics",
    label: "Analytics",
    icon: "bar-chart"
  }, {
    key: "settings",
    label: "Definições",
    icon: "settings"
  }];
  function Sidebar({
    route,
    go
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 248,
        flexShrink: 0,
        background: "var(--bg-page-alt)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "22px 22px 24px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo.png",
      alt: "HMG",
      style: {
        height: 40,
        width: "auto",
        mixBlendMode: "multiply"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        flexDirection: "column",
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 19,
        fontWeight: 600
      }
    }, "HMG"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 9,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
        marginTop: 3
      }
    }, "Admin"))), /*#__PURE__*/React.createElement("nav", {
      style: {
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flex: 1
      }
    }, NAV.map(n => {
      const on = route === n.key;
      const badge = n.key === "leads" ? 9 : null;
      return /*#__PURE__*/React.createElement("a", {
        key: n.key,
        onClick: () => go(n.key),
        style: {
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 13,
          padding: "11px 14px",
          borderRadius: 4,
          color: on ? "var(--text-primary)" : "var(--text-secondary)",
          background: on ? "var(--surface-card)" : "transparent",
          borderLeft: `2px solid ${on ? "var(--accent)" : "transparent"}`,
          fontSize: 14,
          transition: "all var(--dur-fast) var(--ease-out)"
        },
        onMouseEnter: e => {
          if (!on) e.currentTarget.style.background = "rgba(26,24,20,0.04)";
        },
        onMouseLeave: e => {
          if (!on) e.currentTarget.style.background = "transparent";
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: n.icon,
        size: 18,
        color: on ? "var(--accent)" : "currentColor"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, n.label), badge && /*#__PURE__*/React.createElement("span", {
        style: {
          background: "var(--accent)",
          color: "var(--text-on-gold)",
          fontSize: 11,
          fontWeight: 600,
          minWidth: 18,
          height: 18,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 5px"
        }
      }, badge));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "16px 22px",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "var(--surface-raised)",
        border: "1px solid var(--border-strong)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: 14,
        color: "var(--accent)"
      }
    }, "M"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-primary)"
      }
    }, "Maia"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text-tertiary)"
      }
    }, "Administradora")), /*#__PURE__*/React.createElement("a", {
      style: {
        cursor: "pointer",
        color: "var(--text-tertiary)"
      },
      title: "Sair"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 16
    }))));
  }
  function Topbar({
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "26px 40px",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        background: "rgba(242,234,219,0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: 0
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        color: "var(--text-secondary)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -2,
        right: -2,
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "var(--accent)"
      }
    })), action));
  }

  // Lightweight admin table
  function Table({
    columns,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: "1px solid var(--border-subtle)",
        borderRadius: 6,
        overflow: "hidden",
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: columns.map(c => c.w).join(" "),
        padding: "14px 22px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-page-alt)"
      }
    }, columns.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.label,
      style: {
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)",
        textAlign: c.align || "left"
      }
    }, c.label))), children);
  }
  function Row({
    columns,
    cells,
    last
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        display: "grid",
        gridTemplateColumns: columns.map(c => c.w).join(" "),
        padding: "16px 22px",
        borderBottom: last ? "none" : "1px solid var(--border-subtle)",
        alignItems: "center",
        background: h ? "rgba(26,24,20,0.025)" : "transparent",
        transition: "background var(--dur-fast)"
      }
    }, cells.map((cell, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: columns[i].align || "left",
        fontSize: 14,
        color: "var(--text-secondary)",
        minWidth: 0
      }
    }, cell)));
  }
  function StatusPill({
    status
  }) {
    const map = {
      Publicado: {
        bg: "var(--status-available-bg)",
        fg: "var(--status-available-fg)"
      },
      Pendente: {
        bg: "rgba(184,152,106,0.15)",
        fg: "var(--accent)"
      },
      Rascunho: {
        bg: "var(--status-sold-bg)",
        fg: "var(--status-sold-fg)"
      }
    };
    const c = map[status] || map.Rascunho;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        padding: "5px 11px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: c.bg,
        color: c.fg
      }
    }, status);
  }

  // Line chart
  function LineChart({
    data,
    height = 240,
    label
  }) {
    const w = 760,
      pad = 28;
    const max = Math.max(...data),
      min = Math.min(...data);
    const x = i => pad + i / (data.length - 1) * (w - pad * 2);
    const y = v => pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
    const line = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const area = `${pad},${height - pad} ${line} ${w - pad},${height - pad}`;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${w} ${height}`,
      style: {
        width: "100%",
        height: "auto",
        display: "block"
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "aFill",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0%",
      stopColor: "rgba(184,152,106,0.22)"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "100%",
      stopColor: "rgba(184,152,106,0)"
    }))), [0, 0.25, 0.5, 0.75, 1].map(g => /*#__PURE__*/React.createElement("line", {
      key: g,
      x1: pad,
      x2: w - pad,
      y1: pad + g * (height - pad * 2),
      y2: pad + g * (height - pad * 2),
      stroke: "var(--border-subtle)",
      strokeWidth: "1"
    })), /*#__PURE__*/React.createElement("polygon", {
      points: area,
      fill: "url(#aFill)"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: line,
      fill: "none",
      stroke: "var(--accent)",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), data.map((v, i) => (i % 4 === 0 || i === data.length - 1) && /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x(i),
      cy: y(v),
      r: "2.5",
      fill: "var(--accent)"
    })));
  }
  window.AdminSidebar = Sidebar;
  window.AdminTopbar = Topbar;
  window.AdminTable = Table;
  window.AdminRow = Row;
  window.AdminStatusPill = StatusPill;
  window.AdminLineChart = LineChart;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/data.js
try { (() => {
/* HMG Watches — Admin sample data + chart helpers. Exposes window.ADMINDATA. */
(function () {
  const visits30 = [120, 138, 131, 150, 162, 144, 158, 171, 165, 180, 176, 190, 205, 198, 212, 206, 225, 219, 234, 228, 246, 240, 255, 262, 251, 268, 274, 281, 290, 305];
  const visits7 = [228, 246, 240, 255, 262, 251, 268];
  const visits90label = "Últimos 30 dias";
  const metrics = [{
    label: "Visitas hoje",
    value: "1.284",
    delta: "+8,2%",
    up: true,
    icon: "eye"
  }, {
    label: "Relógios em stock",
    value: "37",
    delta: "+3",
    up: true,
    icon: "watch"
  }, {
    label: "Relógios vendidos",
    value: "112",
    delta: "+5 este mês",
    up: true,
    icon: "check"
  }, {
    label: "Artigos publicados",
    value: "48",
    delta: "+2",
    up: true,
    icon: "file-text"
  }, {
    label: "Leads não lidos",
    value: "9",
    delta: "carece atenção",
    up: false,
    icon: "bell"
  }];
  const topWatches = [{
    brand: "Patek Philippe",
    model: "Nautilus",
    ref: "5711/1A",
    views: 4820
  }, {
    brand: "Rolex",
    model: "Submariner Date",
    ref: "126610LN",
    views: 3915
  }, {
    brand: "Audemars Piguet",
    model: "Royal Oak",
    ref: "15500ST",
    views: 3240
  }, {
    brand: "Omega",
    model: "Speedmaster Professional",
    ref: "310.30.42",
    views: 2680
  }, {
    brand: "Cartier",
    model: "Santos de Cartier",
    ref: "WSSA0018",
    views: 2114
  }];
  const activity = [{
    icon: "watch",
    text: "Relógio adicionado — Vacheron Overseas 4500V",
    time: "há 12 min"
  }, {
    icon: "check",
    text: "Marcado como vendido — Royal Oak 15500ST",
    time: "há 1 h"
  }, {
    icon: "file-text",
    text: "Artigo publicado — «O regresso do Nautilus»",
    time: "há 3 h"
  }, {
    icon: "bell",
    text: "Novo lead — interesse no Submariner 126610LN",
    time: "há 4 h"
  }, {
    icon: "pencil",
    text: "Preço actualizado — Speedmaster 310.30.42",
    time: "ontem"
  }];
  const stock = [{
    brand: "Rolex",
    model: "Submariner Date",
    ref: "126610LN",
    price: "€ 14.500",
    status: "available",
    added: "10 Jun 2026",
    hue: 205
  }, {
    brand: "Omega",
    model: "Speedmaster Professional",
    ref: "310.30.42",
    price: "€ 6.200",
    status: "available",
    added: "8 Jun 2026",
    hue: 30
  }, {
    brand: "Patek Philippe",
    model: "Nautilus",
    ref: "5711/1A",
    price: "€ 132.000",
    status: "available",
    added: "2 Jun 2026",
    hue: 215
  }, {
    brand: "Audemars Piguet",
    model: "Royal Oak",
    ref: "15500ST",
    price: "€ 48.900",
    status: "sold",
    added: "28 Mai 2026",
    hue: 220
  }, {
    brand: "Cartier",
    model: "Santos de Cartier",
    ref: "WSSA0018",
    price: "€ 7.450",
    status: "available",
    added: "24 Mai 2026",
    hue: 38
  }, {
    brand: "Tudor",
    model: "Black Bay Fifty-Eight",
    ref: "M79030N",
    price: "€ 3.300",
    status: "available",
    added: "20 Mai 2026",
    hue: 0
  }, {
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    ref: "Q3858520",
    price: "€ 8.900",
    status: "sold",
    added: "12 Mai 2026",
    hue: 35
  }];
  const posts = [{
    title: "Como escolher o seu primeiro Rolex",
    category: "Guias",
    status: "Publicado",
    date: "12 Jun 2026"
  }, {
    title: "O regresso do Nautilus ao seu valor justo",
    category: "Mercado",
    status: "Publicado",
    date: "5 Jun 2026"
  }, {
    title: "Pátina tropical: defeito ou tesouro?",
    category: "Curiosidades",
    status: "Pendente",
    date: "—"
  }, {
    title: "Watches & Wonders 2026: o que chegou",
    category: "Novidades",
    status: "Pendente",
    date: "—"
  }, {
    title: "Caixa e papéis: quanto valem mesmo?",
    category: "Guias",
    status: "Rascunho",
    date: "—"
  }];
  const topPages = [{
    page: "/catalogo",
    views: "12.480",
    pct: 100
  }, {
    page: "/relogio/nautilus-5711",
    views: "4.820",
    pct: 39
  }, {
    page: "/ (homepage)",
    views: "4.210",
    pct: 34
  }, {
    page: "/mercado",
    views: "3.140",
    pct: 25
  }, {
    page: "/diario-de-bordo",
    views: "2.060",
    pct: 17
  }];
  window.ADMINDATA = {
    visits30,
    visits7,
    visits90label,
    metrics,
    topWatches,
    activity,
    stock,
    posts,
    topPages
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/BlogScreens.jsx
try { (() => {
/* HMG Watches — Blog list & article screens + ArticleCard (responsive). */
(function () {
  const {
    Button,
    Badge,
    Overline,
    Card
  } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon,
    D = window.HMGDATA;
  const pad = vp => vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px";
  const WRAP = vp => ({
    maxWidth: 1320,
    margin: "0 auto",
    padding: pad(vp)
  });
  const NARROW = vp => ({
    maxWidth: 760,
    margin: "0 auto",
    padding: vp.mobile ? "0 20px" : "0 24px"
  });
  const gx = vp => pad(vp).split(" ")[1];
  const CATS = ["Todos", "Novidades", "Curiosidades", "Guias", "Mercado"];
  function CoverArt({
    hue,
    ratio = "16 / 10",
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: ratio,
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(140deg, hsl(${hue} 26% 93%) 0%, hsl(${hue} 20% 84%) 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "42%",
        filter: "drop-shadow(0 18px 30px rgba(40,33,20,0.16))"
      }
    }, /*#__PURE__*/React.createElement(window.WatchVisual, {
      hue: hue,
      size: "100%"
    })), label && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        bottom: 12,
        right: 14,
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)"
      }
    }, label));
  }
  function ArticleCard({
    a,
    go
  }) {
    const [hover, setHover] = React.useState(false);
    return /*#__PURE__*/React.createElement("article", {
      onClick: go,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: hover ? "translateY(-4px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out)",
        boxShadow: hover ? "var(--shadow-card)" : "none",
        borderRadius: 6
      }
    }, /*#__PURE__*/React.createElement(CoverArt, {
      hue: a.hue
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--accent-press)"
      }
    }, a.category), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: "var(--text-tertiary)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-tertiary)"
      }
    }, a.read, " de leitura")), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 23,
        lineHeight: 1.25,
        color: hover ? "var(--accent-press)" : "var(--text-primary)",
        transition: "color var(--dur-base) var(--ease-out)"
      }
    }, a.title), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        lineHeight: 1.7,
        color: "var(--text-secondary)"
      }
    }, a.excerpt), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-tertiary)"
      }
    }, a.date));
  }
  function BlogScreen({
    go
  }) {
    const vp = window.useVP();
    const [cat, setCat] = React.useState("Todos");
    const list = cat === "Todos" ? D.articles : D.articles.filter(a => a.category === cat);
    const cols = vp.desktop ? "repeat(3, 1fr)" : vp.tablet ? "repeat(2, 1fr)" : "1fr";
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "110px"} ${gx(vp)} 56px`,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement(Overline, null, "Di\xE1rio de Bordo"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 42 : 60,
        marginTop: 20
      }
    }, "Notas de relojoaria"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: vp.mobile ? 17 : 19,
        lineHeight: 1.7,
        color: "var(--text-secondary)",
        marginTop: 18,
        maxWidth: 560,
        marginLeft: "auto",
        marginRight: "auto"
      }
    }, "Guias, leituras de mercado e curiosidades \u2014 escrito por quem vive o of\xEDcio.")), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `0 ${gx(vp)} 24px`,
        display: "flex",
        justifyContent: vp.mobile ? "flex-start" : "center",
        gap: 12,
        flexWrap: vp.mobile ? "nowrap" : "wrap",
        overflowX: vp.mobile ? "auto" : "visible"
      }
    }, CATS.map(c => {
      const on = c === cat;
      return /*#__PURE__*/React.createElement("button", {
        key: c,
        onClick: () => setCat(c),
        style: {
          cursor: "pointer",
          padding: "9px 20px",
          borderRadius: 999,
          background: "transparent",
          whiteSpace: "nowrap",
          border: `1px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
          color: on ? "var(--accent-press)" : "var(--text-secondary)",
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          transition: "all var(--dur-base) var(--ease-out)"
        }
      }, c);
    })), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `48px ${gx(vp)} 80px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: cols,
        gap: 28,
        rowGap: vp.mobile ? 48 : 64
      }
    }, list.map(a => /*#__PURE__*/React.createElement(ArticleCard, {
      key: a.id,
      a: a,
      go: () => go("article", a.id)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        marginTop: 72
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-light",
      size: "lg"
    }, "Carregar mais"))));
  }
  function ArticleScreen({
    go,
    articleId
  }) {
    const vp = window.useVP();
    const a = D.articles.find(x => x.id === articleId) || D.articles[0];
    const related = D.articles.filter(x => x.id !== a.id).slice(0, 3);
    const [copied, setCopied] = React.useState(false);
    const relCols = vp.desktop ? "repeat(3, 1fr)" : vp.tablet ? "repeat(2, 1fr)" : "1fr";
    const paras = ["Há um instante particular em que um relógio deixa de ser um objecto e passa a ser uma decisão. Acontece, quase sempre, antes de olharmos para o preço — quando o pulso reconhece o peso certo e o olho se prende a um detalhe que não sabíamos procurar.", "É esse instante que tentamos proteger. Não vendemos pressa, vendemos clareza: a informação que precisa para decidir bem, apresentada sem ruído."];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      style: {
        position: "relative",
        height: vp.mobile ? 360 : 520,
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: `linear-gradient(140deg, hsl(${a.hue} 30% 91%) 0%, hsl(${a.hue} 22% 80%) 100%)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "var(--scrim-bottom)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...NARROW(vp),
        position: "relative",
        paddingBottom: vp.mobile ? 36 : 56,
        maxWidth: 820
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 20,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "gold"
    }, a.category), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)"
      }
    }, a.date), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: "var(--text-tertiary)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)"
      }
    }, a.read, " de leitura")), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 34 : 56,
        lineHeight: 1.1
      }
    }, a.title))), /*#__PURE__*/React.createElement("article", {
      style: {
        ...NARROW(vp),
        padding: `${vp.mobile ? "48px" : "72px"} ${vp.mobile ? "20px" : "24px"} 40px`
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: vp.mobile ? 19 : 21,
        lineHeight: 1.7,
        color: "var(--text-primary)",
        marginBottom: 32,
        fontFamily: "var(--font-display)",
        fontWeight: 400
      }
    }, a.excerpt), paras.map((p, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        fontSize: vp.mobile ? 17 : 19,
        lineHeight: 1.85,
        color: "var(--text-secondary)",
        marginBottom: 28
      }
    }, p)), /*#__PURE__*/React.createElement("blockquote", {
      style: {
        borderLeft: "2px solid var(--accent)",
        paddingLeft: 28,
        margin: "44px 0",
        fontFamily: "var(--font-display)",
        fontSize: vp.mobile ? 24 : 28,
        lineHeight: 1.4,
        color: "var(--text-primary)"
      }
    }, "\u201CUm bom rel\xF3gio n\xE3o se compra duas vezes. Compra-se com tempo.\u201D"), ["A diferença entre uma peça boa e uma peça certa está, quase sempre, nos detalhes invisíveis: a integridade da caixa, a honestidade do mostrador, a história documentada.", "É por isso que insistimos em mostrar tudo. Caixa, papéis, estado de conservação — a transparência é a nossa forma de respeito por quem compra."].map((p, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        fontSize: vp.mobile ? 17 : 19,
        lineHeight: 1.85,
        color: "var(--text-secondary)",
        marginBottom: 28
      }
    }, p)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginTop: 48,
        paddingTop: 32,
        borderTop: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-light",
      size: "sm",
      onClick: () => setCopied(true),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: copied ? "check" : "link",
        size: 15
      })
    }, copied ? "Link copiado" : "Partilhar"))), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `80px ${gx(vp)} 110px`,
        borderTop: "1px solid var(--border-subtle)",
        marginTop: 60
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 26 : 30,
        marginBottom: 40
      }
    }, "Continuar a ler"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: relCols,
        gap: 28,
        rowGap: 48
      }
    }, related.map(r => /*#__PURE__*/React.createElement(ArticleCard, {
      key: r.id,
      a: r,
      go: () => go("article", r.id)
    })))));
  }
  window.ArticleCard = ArticleCard;
  window.BlogScreen = BlogScreen;
  window.ArticleScreen = ArticleScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/BlogScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CatalogDetail.jsx
try { (() => {
/* HMG Watches — Catalog & Detail screens (responsive, real photos). */
(function () {
  const {
    Button,
    Badge,
    WatchCard,
    Overline,
    Checkbox,
    Select
  } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon,
    WatchVisual = window.WatchVisual,
    D = window.HMGDATA;
  const pad = vp => vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px";
  const WRAP = vp => ({
    maxWidth: 1320,
    margin: "0 auto",
    padding: pad(vp)
  });
  const gx = vp => pad(vp).split(" ")[1];
  const BRANDS = [...new Set(D.watches.map(w => w.brand))];
  const MOVES = ["Automático", "Manual", "Quartzo"];
  function FilterGroup({
    title,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 26,
        marginBottom: 26,
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
        marginBottom: 18
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, children));
  }
  function CatalogScreen({
    openWatch
  }) {
    const vp = window.useVP();
    const [brands, setBrands] = React.useState([]);
    const [status, setStatus] = React.useState("Todos");
    const [moves, setMoves] = React.useState([]);
    const [sort, setSort] = React.useState("Mais recentes");
    const [q, setQ] = React.useState("");
    const [filtersOpen, setFiltersOpen] = React.useState(false);
    const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    let list = D.watches.filter(w => {
      if (brands.length && !brands.includes(w.brand)) return false;
      if (status === "Disponível" && w.status !== "available") return false;
      if (status === "Vendido" && w.status !== "sold") return false;
      if (moves.length && !moves.includes(w.movement)) return false;
      if (q && !`${w.brand} ${w.model} ${w.ref}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "Preço crescente") list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "Preço decrescente") list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    const gridCols = vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
    const showFilters = vp.desktop || filtersOpen;
    const Filters = /*#__PURE__*/React.createElement("aside", null, vp.desktop && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 28,
        color: "var(--text-primary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sliders-horizontal",
      size: 18
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        letterSpacing: "0.1em",
        textTransform: "uppercase"
      }
    }, "Filtros")), /*#__PURE__*/React.createElement(FilterGroup, {
      title: "Marca"
    }, BRANDS.map(b => /*#__PURE__*/React.createElement(Checkbox, {
      key: b,
      label: b,
      checked: brands.includes(b),
      onChange: () => toggle(brands, setBrands, b)
    }))), /*#__PURE__*/React.createElement(FilterGroup, {
      title: "Estado"
    }, ["Todos", "Disponível", "Vendido"].map(s => /*#__PURE__*/React.createElement("label", {
      key: s,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        fontSize: 14,
        color: "var(--text-secondary)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: `1px solid ${status === s ? "var(--accent)" : "var(--border-strong)"}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, status === s && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "var(--accent)"
      }
    })), /*#__PURE__*/React.createElement("input", {
      type: "radio",
      checked: status === s,
      onChange: () => setStatus(s),
      style: {
        position: "absolute",
        opacity: 0
      }
    }), s))), /*#__PURE__*/React.createElement(FilterGroup, {
      title: "Movimento"
    }, MOVES.map(m => /*#__PURE__*/React.createElement(Checkbox, {
      key: m,
      label: m,
      checked: moves.includes(m),
      onChange: () => toggle(moves, setMoves, m)
    }))));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "100px"} ${gx(vp)} ${vp.mobile ? "80px" : "120px"}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: vp.mobile ? 32 : 48
      }
    }, /*#__PURE__*/React.createElement(Overline, null, "Cat\xE1logo"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 38 : 52,
        marginTop: 16
      }
    }, "A cole\xE7\xE3o")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: vp.desktop ? "260px 1fr" : "1fr",
        gap: vp.desktop ? 56 : 0,
        alignItems: "start"
      }
    }, vp.desktop ? Filters : /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setFiltersOpen(o => !o),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        background: "var(--surface-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: 4,
        cursor: "pointer",
        color: "var(--text-primary)",
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sliders-horizontal",
      size: 17
    }), " Filtros"), /*#__PURE__*/React.createElement(Icon, {
      name: filtersOpen ? "chevron-down" : "chevron-right",
      size: 16
    })), showFilters && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, Filters)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: vp.mobile ? "stretch" : "center",
        marginBottom: 28,
        gap: 16,
        flexDirection: vp.mobile ? "column" : "row"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: 1,
        maxWidth: vp.mobile ? "none" : 360
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    })), /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      placeholder: "Pesquisar marca, modelo, refer\xEAncia\u2026",
      style: {
        width: "100%",
        padding: "12px 0 12px 30px",
        background: "transparent",
        border: "none",
        borderBottom: "1px solid var(--border-strong)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-ui)",
        fontSize: 15,
        outline: "none"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: vp.mobile ? "auto" : 200
      }
    }, /*#__PURE__*/React.createElement(Select, {
      value: sort,
      onChange: e => setSort(e.target.value),
      options: ["Mais recentes", "Preço crescente", "Preço decrescente"]
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-tertiary)",
        marginBottom: 28
      }
    }, list.length, " ", list.length === 1 ? "relógio" : "relógios"), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "80px 20px",
        textAlign: "center",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: "var(--text-tertiary)",
        display: "flex",
        justifyContent: "center",
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 40,
      strokeWidth: 1
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 26,
        marginBottom: 12
      }
    }, "Nada encontrado"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text-secondary)",
        maxWidth: 360,
        margin: "0 auto 28px"
      }
    }, "N\xE3o h\xE1 pe\xE7as que correspondam a estes filtros. Experimente alargar a procura."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-gold",
      onClick: () => {
        setBrands([]);
        setMoves([]);
        setStatus("Todos");
        setQ("");
      }
    }, "Limpar filtros"))) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: gridCols,
        gap: 28
      }
    }, list.map(w => /*#__PURE__*/React.createElement(WatchCard, {
      key: w.id,
      brand: w.brand,
      model: w.model,
      reference: w.ref,
      price: w.price,
      status: w.status,
      image: w.images && w.images[0],
      visual: /*#__PURE__*/React.createElement(WatchVisual, {
        hue: w.hue,
        sold: w.status === "sold"
      }),
      onClick: () => openWatch(w.id)
    }))))));
  }
  function Spec({
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid var(--border-subtle)",
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--text-secondary)"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--text-primary)",
        textAlign: "right"
      }
    }, value));
  }
  function Gallery({
    w,
    vp
  }) {
    const [active, setActive] = React.useState(0);
    const sold = w.status === "sold";
    const imgs = w.images || [];
    const hasPhotos = imgs.length > 0;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: "1 / 1",
        borderRadius: 8,
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-raised)",
        display: "flex",
        alignItems: hasPhotos ? "stretch" : "flex-end",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-soft)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 3
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: sold ? "sold" : "available"
    })), hasPhotos ? /*#__PURE__*/React.createElement("img", {
      src: imgs[active],
      alt: `${w.brand} ${w.model}`,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: sold ? "grayscale(0.5)" : "none"
      }
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "16%",
        right: "16%",
        bottom: 0,
        top: "10%",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)",
        borderRadius: "999px 999px 6px 6px",
        border: "1px solid rgba(182,138,46,0.3)",
        borderBottom: "none"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "52%",
        position: "relative",
        zIndex: 2,
        marginBottom: "14%",
        filter: "drop-shadow(0 26px 44px rgba(40,33,20,0.18))"
      }
    }, /*#__PURE__*/React.createElement(WatchVisual, {
      hue: w.hue,
      sold: sold,
      size: "100%"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${hasPhotos ? Math.min(imgs.length, 5) : 5}, 1fr)`,
        gap: 12,
        marginTop: 16
      }
    }, (hasPhotos ? imgs : [0, 1, 2, 3, 4]).map((it, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setActive(i),
      style: {
        aspectRatio: "1 / 1",
        borderRadius: 6,
        cursor: "pointer",
        overflow: "hidden",
        background: hasPhotos ? "var(--surface-raised)" : "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)",
        border: `1px solid ${active === i ? "var(--accent)" : "var(--border-subtle)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: hasPhotos ? 0 : "14%",
        transition: "border-color var(--dur-base) var(--ease-out)"
      }
    }, hasPhotos ? /*#__PURE__*/React.createElement("img", {
      src: it,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement(WatchVisual, {
      hue: w.hue + i * 6,
      sold: sold,
      size: "100%"
    }))))));
  }
  function DetailScreen({
    watchId,
    openWatch,
    go
  }) {
    const vp = window.useVP();
    const w = D.watches.find(x => x.id === watchId) || D.watches[0];
    const related = D.watches.filter(x => x.id !== w.id && x.status === "available").slice(0, 3);
    const sold = w.status === "sold";
    const relCols = vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "24px" : "40px"} ${gx(vp)} ${vp.mobile ? "80px" : "120px"}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        color: "var(--text-tertiary)",
        margin: "32px 0 40px",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("a", {
      onClick: () => go("home"),
      style: {
        cursor: "pointer"
      }
    }, "In\xEDcio"), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 13
    }), /*#__PURE__*/React.createElement("a", {
      onClick: () => go("catalog"),
      style: {
        cursor: "pointer"
      }
    }, "Cat\xE1logo"), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)"
      }
    }, w.brand), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-primary)"
      }
    }, w.model)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr",
        gap: vp.mobile ? 40 : 72,
        alignItems: "start"
      }
    }, /*#__PURE__*/React.createElement(Gallery, {
      w: w,
      vp: vp
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Overline, null, w.brand), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 34 : 46,
        marginTop: 14,
        lineHeight: 1.1
      }
    }, w.model), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "var(--text-tertiary)",
        marginTop: 12
      }
    }, "Ref. ", w.ref), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        margin: "32px 0",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: vp.mobile ? 30 : 34,
        fontFamily: "var(--font-display)",
        color: sold ? "var(--text-tertiary)" : "var(--text-primary)"
      }
    }, w.price), /*#__PURE__*/React.createElement(Badge, {
      variant: sold ? "sold" : "available"
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        lineHeight: 1.8,
        color: "var(--text-secondary)",
        marginBottom: 36
      }
    }, w.brand, " ", w.model, " de ", w.year, ", em ", w.caseMat.toLowerCase(), ". Pe\xE7a autenticada, revista e pronta a usar \u2014 acompanhada da documenta\xE7\xE3o dispon\xEDvel."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 44
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-gold",
      size: "lg",
      fullWidth: true,
      as: "a",
      href: `mailto:ola@hmgwatches.pt?subject=Interesse: ${w.brand} ${w.model} (Ref. ${w.ref})`,
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-up-right",
        size: 16
      }),
      disabled: sold
    }, sold ? "Peça vendida" : "Contactar sobre este relógio")), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 13,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
        marginBottom: 4
      }
    }, "Especifica\xE7\xF5es"), /*#__PURE__*/React.createElement(Spec, {
      label: "Marca",
      value: w.brand
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Modelo",
      value: w.model
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Refer\xEAncia",
      value: w.ref
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Ano de fabrico",
      value: w.year
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Movimento",
      value: w.movement
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Material da caixa",
      value: w.caseMat
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Di\xE2metro",
      value: w.diameter
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Bracelete / pulseira",
      value: w.strap
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Estado de conserva\xE7\xE3o",
      value: w.condition
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Inclui caixa original",
      value: w.box ? "Sim" : "Não"
    }), /*#__PURE__*/React.createElement(Spec, {
      label: "Inclui pap\xE9is / documenta\xE7\xE3o",
      value: w.papers ? "Sim" : "Não"
    }))), /*#__PURE__*/React.createElement("section", {
      style: {
        marginTop: vp.mobile ? 80 : 120
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 26 : 30,
        marginBottom: 40
      }
    }, "Poder\xE1 tamb\xE9m gostar"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: relCols,
        gap: 28
      }
    }, related.map(r => /*#__PURE__*/React.createElement(WatchCard, {
      key: r.id,
      brand: r.brand,
      model: r.model,
      reference: r.ref,
      price: r.price,
      status: r.status,
      image: r.images && r.images[0],
      visual: /*#__PURE__*/React.createElement(WatchVisual, {
        hue: r.hue,
        sold: r.status === "sold"
      }),
      onClick: () => openWatch(r.id)
    })))));
  }
  window.CatalogScreen = CatalogScreen;
  window.DetailScreen = DetailScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CatalogDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Chrome.jsx
try { (() => {
/* HMG Watches — site chrome: Header + Footer (light editorial, responsive). */
(function () {
  const Icon = window.Icon;
  const LOGO = "../../assets/logo.png";
  const NAV = [{
    key: "home",
    label: "Início"
  }, {
    key: "catalog",
    label: "Catálogo"
  }, {
    key: "market",
    label: "Mercado"
  }, {
    key: "blog",
    label: "Diário de Bordo"
  }, {
    key: "about",
    label: "Sobre"
  }, {
    key: "contact",
    label: "Contacto"
  }];
  function Wordmark({
    go,
    compact
  }) {
    return /*#__PURE__*/React.createElement("a", {
      onClick: () => go("home"),
      style: {
        cursor: "pointer",
        display: "flex",
        alignItems: "baseline",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: compact ? 23 : 27,
        fontWeight: 600,
        letterSpacing: "0.01em",
        color: "var(--text-primary)"
      }
    }, "HMG"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: compact ? 9 : 10,
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color: "var(--accent-press)"
      }
    }, "Watches"));
  }
  function Header({
    route,
    go
  }) {
    const vp = window.useVP();
    const [scrolled, setScrolled] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const el = document.getElementById("hmg-scroll");
      const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 16);
      const target = el || window;
      target.addEventListener("scroll", onScroll);
      return () => target.removeEventListener("scroll", onScroll);
    }, []);
    React.useEffect(() => {
      setOpen(false);
    }, [route]);
    const solid = scrolled || open;
    const isActive = k => route === k || k === "blog" && route === "article" || k === "catalog" && route === "detail";
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: solid ? "rgba(247,242,232,0.92)" : "transparent",
        backdropFilter: solid ? "blur(16px)" : "none",
        borderBottom: `1px solid ${solid ? "var(--border-subtle)" : "transparent"}`,
        transition: "all var(--dur-base) var(--ease-out)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: vp.mobile ? "0 20px" : "0 56px",
        height: vp.mobile ? 70 : 84
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      go: go,
      compact: vp.mobile
    }), vp.desktop ? /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        gap: 32,
        alignItems: "center"
      }
    }, NAV.map(n => {
      const active = isActive(n.key);
      const isContact = n.key === "contact";
      return /*#__PURE__*/React.createElement("a", {
        key: n.key,
        onClick: () => go(n.key),
        style: {
          cursor: "pointer",
          fontFamily: "var(--font-ui)",
          fontSize: 12.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: isContact ? "var(--accent-press)" : active ? "var(--text-primary)" : "var(--text-secondary)",
          position: "relative",
          paddingBottom: 5,
          transition: "color var(--dur-base) var(--ease-out)"
        },
        onMouseEnter: e => e.currentTarget.style.color = "var(--accent-press)",
        onMouseLeave: e => e.currentTarget.style.color = isContact ? "var(--accent-press)" : active ? "var(--text-primary)" : "var(--text-secondary)"
      }, n.label, /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 1.5,
          width: active ? "100%" : 0,
          background: "var(--accent)",
          transition: "width var(--dur-base) var(--ease-out)"
        }
      }));
    })) : /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(o => !o),
      "aria-label": "Menu",
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-primary)",
        padding: 8,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: open ? "x" : "menu",
      size: 24
    }))), !vp.desktop && open && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: "1px solid var(--border-subtle)",
        padding: "12px 20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
      key: n.key,
      onClick: () => go(n.key),
      style: {
        cursor: "pointer",
        padding: "13px 6px",
        fontFamily: "var(--font-ui)",
        fontSize: 15,
        letterSpacing: "0.04em",
        color: n.key === "contact" ? "var(--accent-press)" : isActive(n.key) ? "var(--accent-press)" : "var(--text-primary)",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, n.label))));
  }
  function Footer({
    go
  }) {
    const vp = window.useVP();
    const col = (title, items) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--accent-press)"
      }
    }, title), items.map(it => /*#__PURE__*/React.createElement("a", {
      key: it.label,
      onClick: it.go,
      style: {
        cursor: "pointer",
        fontSize: 14,
        color: "var(--text-secondary)"
      },
      onMouseEnter: e => e.currentTarget.style.color = "var(--text-primary)",
      onMouseLeave: e => e.currentTarget.style.color = "var(--text-secondary)"
    }, it.label)));
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        borderTop: "1px solid var(--border-strong)",
        padding: vp.mobile ? "56px 20px 36px" : "84px 56px 44px",
        background: "var(--bg-page-alt)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1320,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: vp.mobile ? "1fr 1fr" : "1.7fr 1fr 1fr 1fr",
        gap: vp.mobile ? "40px 24px" : 48
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: vp.mobile ? "1 / -1" : "auto"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO,
      alt: "HMG Watches",
      style: {
        height: 84,
        width: "auto",
        mixBlendMode: "multiply",
        marginBottom: 16
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "var(--text-secondary)",
        maxWidth: 300
      }
    }, "Rel\xF3gios de exce\xE7\xE3o. Curados, autenticados, prontos a usar."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginTop: 22
      }
    }, ["instagram", "message-circle", "mail"].map(ic => /*#__PURE__*/React.createElement("a", {
      key: ic,
      onClick: () => ic === "mail" || ic === "message-circle" ? go("contact") : null,
      style: {
        cursor: "pointer",
        width: 42,
        height: 42,
        border: "1px solid var(--border-strong)",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        transition: "all var(--dur-base) var(--ease-out)"
      },
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.color = "var(--accent-press)";
        e.currentTarget.style.background = "var(--surface-card)";
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.background = "transparent";
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 18
    }))))), col("Navegar", [{
      label: "Catálogo",
      go: () => go("catalog")
    }, {
      label: "Mercado",
      go: () => go("market")
    }, {
      label: "Diário de Bordo",
      go: () => go("blog")
    }]), col("Empresa", [{
      label: "Sobre Nós",
      go: () => go("about")
    }, {
      label: "Contacto",
      go: () => go("contact")
    }]), col("Legal", [{
      label: "Política de Privacidade",
      go: () => {}
    }, {
      label: "Termos de Utilização",
      go: () => {}
    }])), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1320,
        margin: "56px auto 0",
        paddingTop: 28,
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: vp.mobile ? "column" : "row",
        gap: 10,
        justifyContent: "space-between",
        fontSize: 12,
        color: "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 HMG Watches. Todos os direitos reservados."), /*#__PURE__*/React.createElement("span", null, "Lisboa \xB7 Portugal")));
  }
  window.Header = Header;
  window.Footer = Footer;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeAbout.jsx
try { (() => {
/* HMG Watches — Home & About screens (light editorial luxe, responsive). */
(function () {
  const {
    Button,
    Badge,
    WatchCard,
    Overline,
    Card
  } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon,
    WatchVisual = window.WatchVisual,
    D = window.HMGDATA;
  const pad = vp => vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px";
  const WRAP = vp => ({
    maxWidth: 1320,
    margin: "0 auto",
    padding: pad(vp)
  });
  const gx = vp => pad(vp).split(" ")[1];
  function NumberedHead({
    n,
    eyebrow,
    title,
    sub,
    action,
    vp
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: vp.mobile ? 40 : 56
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 15,
        color: "var(--accent)",
        fontStyle: "italic"
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 1,
        width: 44,
        background: "var(--accent)"
      }
    }), /*#__PURE__*/React.createElement(Overline, null, eyebrow)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 32 : 44,
        lineHeight: 1.1
      }
    }, title), sub && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        lineHeight: 1.7,
        color: "var(--text-secondary)",
        marginTop: 16,
        maxWidth: 520
      }
    }, sub)), action));
  }

  // Display niche (arch) — real photo when `image` given, else the drawn watch
  function ArchNiche({
    hue,
    size = 380,
    image
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: "100%",
        maxWidth: size,
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "4%",
        right: "4%",
        bottom: 0,
        top: "2%",
        background: image ? "#EFE8D7" : "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)",
        borderRadius: "999px 999px 8px 8px",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden"
      }
    }, image && /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: "Rel\xF3gio em destaque",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 38%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "9%",
        right: "9%",
        bottom: "4%",
        top: "7%",
        borderRadius: "999px 999px 6px 6px",
        border: "1px solid rgba(182,138,46,0.45)",
        pointerEvents: "none"
      }
    }), !image && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 2,
        width: "62%",
        padding: "26% 0 22%",
        filter: "drop-shadow(0 30px 50px rgba(40,33,20,0.18))"
      }
    }, /*#__PURE__*/React.createElement(WatchVisual, {
      hue: hue,
      size: "100%"
    })), image && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: "100%",
        paddingBottom: "118%"
      }
    }));
  }
  function HomeScreen({
    go,
    openWatch
  }) {
    const vp = window.useVP();
    const hero = D.watches[0];
    const featured = D.watches.slice(0, 4);
    const featCols = vp.mobile ? "1fr" : vp.tablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
    const blogCols = vp.desktop ? "repeat(3, 1fr)" : vp.tablet ? "repeat(2, 1fr)" : "1fr";
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      style: {
        position: "relative",
        minHeight: vp.mobile ? "auto" : "calc(100vh - 84px)",
        display: "flex",
        alignItems: "center",
        padding: vp.mobile ? "44px 0 56px" : "20px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        display: "grid",
        gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr",
        gap: vp.mobile ? 44 : 56,
        alignItems: "center",
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 560
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 17,
        color: "var(--accent)",
        whiteSpace: "nowrap"
      }
    }, "N\xBA 01"), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 1,
        width: 46,
        background: "var(--accent)"
      }
    }), /*#__PURE__*/React.createElement(Overline, null, "Em destaque")), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 46 : vp.tablet ? 62 : 78,
        lineHeight: 1.02,
        letterSpacing: "-0.025em"
      }
    }, "Tempo que", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontStyle: "italic",
        color: "var(--accent-press)"
      }
    }, "n\xE3o"), " se perde."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: vp.mobile ? 17 : 19,
        lineHeight: 1.7,
        color: "var(--text-secondary)",
        marginTop: 26,
        maxWidth: 400
      }
    }, "Rel\xF3gios de exce\xE7\xE3o. Curados, autenticados, prontos a usar."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        marginTop: 38,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-gold",
      size: vp.mobile ? "md" : "lg",
      onClick: () => go("catalog"),
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 16
      })
    }, "Ver Cole\xE7\xE3o"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-light",
      size: vp.mobile ? "md" : "lg",
      onClick: () => go("about")
    }, "A nossa hist\xF3ria"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: vp.desktop ? 500 : "auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => openWatch(hero.id),
      style: {
        position: vp.desktop ? "absolute" : "relative",
        right: 0,
        top: vp.desktop ? "50%" : "auto",
        transform: vp.desktop ? "translateY(-50%)" : "none",
        width: vp.desktop ? 380 : "100%",
        maxWidth: vp.desktop ? "none" : 420,
        marginLeft: vp.desktop ? 0 : "auto",
        aspectRatio: "37 / 47",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid var(--border-strong)",
        boxShadow: "var(--shadow-float)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: hero.images && hero.images[0],
      alt: `${hero.brand} ${hero.model}`,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 42%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      onClick: () => openWatch(hero.id),
      style: {
        position: "absolute",
        left: vp.desktop ? 0 : 16,
        bottom: vp.desktop ? 56 : 16,
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        padding: "16px 20px",
        boxShadow: "var(--shadow-card)",
        cursor: "pointer",
        maxWidth: 220
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-ui)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-secondary)"
      }
    }, hero.brand), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 19,
        marginTop: 4,
        lineHeight: 1.15
      }
    }, hero.model), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--accent-press)"
      }
    }, hero.price), /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up-right",
      size: 15,
      color: "var(--accent-press)"
    })))))), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)}`,
        borderTop: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement(NumberedHead, {
      vp: vp,
      n: "01",
      eyebrow: "Cole\xE7\xE3o em destaque",
      title: "Pe\xE7as selecionadas",
      sub: "Uma curadoria breve do que est\xE1 dispon\xEDvel agora \u2014 cada rel\xF3gio autenticado e pronto a usar.",
      action: !vp.mobile && /*#__PURE__*/React.createElement(Button, {
        variant: "ghost-light",
        onClick: () => go("catalog"),
        iconRight: /*#__PURE__*/React.createElement(Icon, {
          name: "arrow-right",
          size: 15
        })
      }, "Ver tudo")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: featCols,
        gap: 28
      }
    }, featured.map(w => /*#__PURE__*/React.createElement(WatchCard, {
      key: w.id,
      brand: w.brand,
      model: w.model,
      reference: w.ref,
      price: w.price,
      status: w.status,
      image: w.images && w.images[0],
      visual: /*#__PURE__*/React.createElement(WatchVisual, {
        hue: w.hue,
        sold: w.status === "sold"
      }),
      onClick: () => openWatch(w.id)
    }))), vp.mobile && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-light",
      fullWidth: true,
      onClick: () => go("catalog"),
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 15
      })
    }, "Ver tudo"))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--bg-page-alt)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "130px"} ${gx(vp)}`,
        display: "grid",
        gridTemplateColumns: vp.desktop ? "1fr 1fr" : "1fr",
        gap: vp.mobile ? 36 : 90,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 15,
        color: "var(--accent)",
        fontStyle: "italic"
      }
    }, "02"), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 1,
        width: 44,
        background: "var(--accent)"
      }
    }), /*#__PURE__*/React.createElement(Overline, null, "Sobre n\xF3s")), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 34 : 46,
        lineHeight: 1.12
      }
    }, "Uma montra limpa", /*#__PURE__*/React.createElement("br", null), "que serve as pe\xE7as.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: vp.mobile ? 17 : 19,
        lineHeight: 1.85,
        color: "var(--text-secondary)"
      }
    }, "N\xE3o vendemos tempo \u2014 devolvemos-lhe valor. Cada rel\xF3gio que chega \xE0 HMG \xE9 estudado, autenticado e avaliado com o mesmo rigor com que escolher\xEDamos para n\xF3s pr\xF3prios."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 34
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-gold",
      onClick: () => go("about"),
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 15
      })
    }, "Saber mais"))))), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)}`
      }
    }, /*#__PURE__*/React.createElement(NumberedHead, {
      vp: vp,
      n: "03",
      eyebrow: "Di\xE1rio de Bordo",
      title: "Do nosso caderno",
      action: !vp.mobile && /*#__PURE__*/React.createElement(Button, {
        variant: "ghost-light",
        onClick: () => go("blog"),
        iconRight: /*#__PURE__*/React.createElement(Icon, {
          name: "arrow-right",
          size: 15
        })
      }, "Todos os artigos")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: blogCols,
        gap: vp.mobile ? 40 : 36
      }
    }, D.articles.slice(0, 3).map(a => /*#__PURE__*/React.createElement(window.ArticleCard, {
      key: a.id,
      a: a,
      go: () => go("article", a.id)
    })))), /*#__PURE__*/React.createElement("section", {
      id: "home-contact",
      style: {
        background: "var(--bg-page-alt)",
        borderTop: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)}`
      }
    }, /*#__PURE__*/React.createElement(window.ContactBlock, null))));
  }
  function AboutScreen({
    go
  }) {
    const vp = window.useVP();
    const values = [{
      n: "01",
      icon: "search",
      title: "Curadoria",
      text: "Selecionamos poucas peças, mas certas. Cada relógio passa por um crivo apertado antes de chegar à montra."
    }, {
      n: "02",
      icon: "shield-check",
      title: "Autenticidade",
      text: "Verificação completa de número de série, movimento e proveniência. Garantia de autenticidade em todas as peças."
    }, {
      n: "03",
      icon: "clock",
      title: "Prontos a usar",
      text: "Revisados quando necessário e entregues no seu melhor estado — para começar a contar tempo desde o primeiro dia."
    }];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "120px"} ${gx(vp)} 70px`,
        textAlign: "center",
        maxWidth: 860
      }
    }, /*#__PURE__*/React.createElement(Overline, null, "Sobre a HMG Watches"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 42 : 64,
        lineHeight: 1.08,
        marginTop: 22
      }
    }, "Come\xE7ou com uma", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontStyle: "italic",
        color: "var(--accent-press)"
      }
    }, "obsess\xE3o honesta.")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: vp.mobile ? 17 : 20,
        lineHeight: 1.85,
        color: "var(--text-secondary)",
        marginTop: 26
      }
    }, "A HMG nasceu da convic\xE7\xE3o simples de que um bom rel\xF3gio n\xE3o devia ser um mist\xE9rio. Reunimos anos de procura, compara\xE7\xE3o e paix\xE3o num lugar s\xF3 \u2014 para que comprar uma pe\xE7a de exce\xE7\xE3o seja t\xE3o claro como apreci\xE1-la.")), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `20px ${gx(vp)} 80px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: vp.mobile ? "4 / 3" : "21 / 9",
        borderRadius: 8,
        border: "1px solid var(--border-subtle)",
        background: "linear-gradient(135deg, #FCFAF4 0%, #EFE8D7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-tertiary)",
        fontSize: 13,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        boxShadow: "var(--shadow-soft)"
      }
    }, "Retrato da equipa \xB7 fotografia")), /*#__PURE__*/React.createElement("section", {
      style: {
        ...WRAP(vp),
        padding: `20px ${gx(vp)} ${vp.mobile ? "72px" : "120px"}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: vp.desktop ? "repeat(3, 1fr)" : "1fr",
        gap: 28
      }
    }, values.map(v => /*#__PURE__*/React.createElement(Card, {
      key: v.title,
      padding: vp.mobile ? "34px 28px" : "44px 38px"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--accent-press)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: v.icon,
      size: 26
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontSize: 30,
        fontStyle: "italic",
        color: "var(--border-strong)"
      }
    }, v.n)), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 25,
        marginBottom: 14
      }
    }, v.title), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        lineHeight: 1.8,
        color: "var(--text-secondary)"
      }
    }, v.text))))), /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--bg-page-alt)",
        borderTop: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "110px"} ${gx(vp)}`,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 30 : 40
      }
    }, "Tem um rel\xF3gio para vender?"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        color: "var(--text-secondary)",
        marginTop: 16,
        marginBottom: 38
      }
    }, "Avaliamos a sua pe\xE7a com transpar\xEAncia e sem compromisso."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-gold",
      size: "lg",
      onClick: () => go("contact")
    }, "Falar connosco")))));
  }
  window.HomeScreen = HomeScreen;
  window.AboutScreen = AboutScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeAbout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Icon.jsx
try { (() => {
/* HMG Watches — Icon component.
   Paths copied from Lucide (lucide.dev, MIT). Stroke 1.5 for an elegant,
   restrained line. Used across both UI kits. Exposes window.Icon. */
(function () {
  const P = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    "trending-up": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    "trending-down": '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    "share-2": '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    "sliders-horizontal": '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "layout-dashboard": '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    watch: '<circle cx="12" cy="12" r="6"/><polyline points="12 10 12 12 13 13"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/>',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "bar-chart": '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
    "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  };
  function Icon({
    name,
    size = 20,
    color = "currentColor",
    strokeWidth = 1.5,
    style = {},
    ...rest
  }) {
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        display: "block",
        flexShrink: 0,
        ...style
      },
      dangerouslySetInnerHTML: {
        __html: P[name] || ""
      },
      ...rest
    });
  }
  window.Icon = Icon;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/MarketContact.jsx
try { (() => {
/* HMG Watches — Market screen + reusable Contact block (responsive). */
(function () {
  const {
    Button,
    Badge,
    WatchCard,
    Overline,
    Card,
    Input,
    Select
  } = window.HMGWatchesDesignSystem_1cb2d0;
  const Icon = window.Icon,
    WatchVisual = window.WatchVisual,
    D = window.HMGDATA;
  const pad = vp => vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px";
  const WRAP = vp => ({
    maxWidth: 1320,
    margin: "0 auto",
    padding: pad(vp)
  });
  function Spark({
    data,
    color
  }) {
    const w = 120,
      h = 36,
      max = Math.max(...data),
      min = Math.min(...data);
    const pts = data.map((v, i) => `${i / (data.length - 1) * w},${h - (v - min) / (max - min || 1) * h}`).join(" ");
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${w} ${h}`,
      preserveAspectRatio: "none",
      style: {
        display: "block",
        width: "100%",
        height: 36,
        overflow: "visible"
      }
    }, /*#__PURE__*/React.createElement("polyline", {
      points: pts,
      fill: "none",
      stroke: color,
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }
  function MetalCard({
    m
  }) {
    const up = m.change >= 0;
    return /*#__PURE__*/React.createElement(Card, {
      padding: "24px 26px",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontFamily: "var(--font-display)"
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--text-tertiary)",
        marginTop: 4
      }
    }, m.symbol)), /*#__PURE__*/React.createElement(Badge, {
      variant: up ? "up" : "down"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: up ? "trending-up" : "trending-down",
      size: 13
    }), up ? "+" : "", m.change.toFixed(2), "%"))), /*#__PURE__*/React.createElement(Spark, {
      data: m.spark,
      color: up ? "#3F6B3F" : "#B5543F"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontFamily: "var(--font-display)",
        color: "var(--text-primary)"
      }
    }, m.price));
  }
  function MarketScreen({
    openWatch
  }) {
    const vp = window.useVP();
    const metalCols = vp.mobile ? "repeat(2, 1fr)" : vp.tablet ? "repeat(3, 1fr)" : "repeat(5, 1fr)";
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP(vp),
        padding: `${vp.mobile ? "72px" : "100px"} ${pad(vp).split(" ")[1]} 110px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Overline, null, "Mercado"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: vp.mobile ? 36 : 52,
        marginTop: 16
      }
    }, "O pulso do mercado"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        lineHeight: 1.7,
        color: "var(--text-secondary)",
        marginTop: 16,
        maxWidth: 560
      }
    }, "Refer\xEAncias financeiras relevantes para o universo da relojoaria de luxo.")), /*#__PURE__*/React.createElement("section", {
      style: {
        marginTop: vp.mobile ? 44 : 64
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 24 : 28,
        marginBottom: 28
      }
    }, "Metais preciosos e diamantes"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: metalCols,
        gap: vp.mobile ? 14 : 22
      }
    }, D.metals.map(m => /*#__PURE__*/React.createElement(MetalCard, {
      key: m.symbol,
      m: m
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-tertiary)",
        marginTop: 22,
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 13
    }), " Pre\xE7os actualizados de hora em hora \xB7 Valores indicativos")), /*#__PURE__*/React.createElement("section", {
      style: {
        marginTop: vp.mobile ? 72 : 104
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 24 : 28,
        marginBottom: 8
      }
    }, "Rel\xF3gios em alta"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text-secondary)",
        marginBottom: 40,
        maxWidth: 520
      }
    }, "As refer\xEAncias que mais valorizaram no mercado secund\xE1rio nos \xFAltimos meses."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: vp.desktop ? "repeat(2, 1fr)" : "1fr",
        gap: 28
      }
    }, D.risers.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "grid",
        gridTemplateColumns: vp.mobile ? "120px 1fr" : "180px 1fr",
        gap: vp.mobile ? 18 : 28,
        alignItems: "center",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        padding: vp.mobile ? 18 : 24,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: "1 / 1",
        borderRadius: 6,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4EEE1 100%)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        filter: "drop-shadow(0 14px 24px rgba(40,33,20,0.16))"
      }
    }, /*#__PURE__*/React.createElement(WatchVisual, {
      hue: r.hue,
      size: "100%"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "gold"
    }, r.appreciation)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--text-secondary)"
      }
    }, r.brand), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 20,
        margin: "6px 0 4px"
      }
    }, r.model), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--text-tertiary)",
        marginBottom: 12
      }
    }, "Ref. ", r.ref), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        lineHeight: 1.7,
        color: "var(--text-secondary)"
      }
    }, r.note)))))));
  }

  // Reusable contact block — used on the homepage
  function ContactBlock({
    compact
  }) {
    const vp = window.useVP();
    const [sent, setSent] = React.useState(false);
    const twoCol = vp.desktop;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: twoCol ? "1fr 1fr" : "1fr",
        gap: vp.mobile ? 40 : 80,
        alignItems: "start"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Overline, null, "Contacto"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: vp.mobile ? 38 : 50,
        marginTop: 16,
        lineHeight: 1.08
      }
    }, "Vamos falar", /*#__PURE__*/React.createElement("br", null), "de rel\xF3gios."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 18,
        lineHeight: 1.8,
        color: "var(--text-secondary)",
        marginTop: 24,
        maxWidth: 420
      }
    }, "Quer comprar, quer vender, quer apenas uma opini\xE3o \u2014 escreva-nos. Respondemos em 24 a 48 horas \xFAteis."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
        marginTop: 40
      }
    }, [{
      ic: "mail",
      label: "Email",
      value: "ola@hmgwatches.pt"
    }, {
      ic: "instagram",
      label: "Instagram",
      value: "@hmgwatches"
    }, {
      ic: "message-circle",
      label: "WhatsApp",
      value: "+351 910 000 000"
    }, {
      ic: "map-pin",
      label: "Atelier",
      value: "Lisboa · visitas com marcação"
    }].map(c => /*#__PURE__*/React.createElement("div", {
      key: c.label,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        flexShrink: 0,
        border: "1px solid var(--border-strong)",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--accent-press)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.ic,
      size: 18
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)"
      }
    }, c.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        color: "var(--text-primary)",
        marginTop: 3
      }
    }, c.value)))))), /*#__PURE__*/React.createElement(Card, {
      padding: vp.mobile ? "32px 26px" : "44px 40px"
    }, sent ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "50px 10px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: "var(--accent-press)",
        display: "flex",
        justifyContent: "center",
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 44
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 26,
        marginBottom: 12
      }
    }, "Mensagem enviada"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text-secondary)"
      }
    }, "Obrigado pelo seu contacto. Respondemos em 24 a 48 horas \xFAteis.")) : /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        setSent(true);
      },
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 26
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Nome",
      placeholder: "O seu nome",
      required: true
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Email",
      type: "email",
      placeholder: "nome@email.com",
      required: true
    }), /*#__PURE__*/React.createElement(Select, {
      label: "Assunto",
      options: ["Quero comprar um relógio", "Tenho um relógio para vender", "Informação geral"]
    }), /*#__PURE__*/React.createElement("label", {
      style: {
        display: "block"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        marginBottom: 8,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-secondary)"
      }
    }, "Mensagem"), /*#__PURE__*/React.createElement("textarea", {
      rows: 4,
      placeholder: "Em que podemos ajudar?",
      style: {
        width: "100%",
        padding: "13px 0",
        background: "transparent",
        border: "none",
        borderBottom: "1px solid var(--border-strong)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-ui)",
        fontSize: 16,
        outline: "none",
        resize: "vertical"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost-gold",
      size: "lg",
      fullWidth: true,
      as: "button",
      type: "submit",
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 16
      })
    }, "Enviar")))));
  }
  window.MarketScreen = MarketScreen;
  window.ContactBlock = ContactBlock;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/MarketContact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WatchVisual.jsx
try { (() => {
/* HMG Watches — WatchVisual: a tasteful CSS placeholder standing in for real
   product photography (none supplied). Renders a floating watch face.
   Exposes window.WatchVisual. Replace with real PNGs via WatchCard's `image`. */
(function () {
  function WatchVisual({
    hue = 210,
    size = "72%",
    sold = false
  }) {
    const metal = "linear-gradient(145deg, #d9d4c8 0%, #8c887e 30%, #f2eee4 52%, #6f6c64 74%, #cfcabd 100%)";
    const dial = `radial-gradient(120% 120% at 35% 25%, hsl(${hue} 16% 20%) 0%, hsl(${hue} 18% 11%) 60%, #0c0c0c 100%)`;
    const ring = d => ({
      position: "absolute",
      borderRadius: "50%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: d,
      height: d
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: size,
        aspectRatio: "1 / 1",
        filter: sold ? "grayscale(0.7) brightness(0.85)" : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "50%",
        top: "-7%",
        transform: "translateX(-50%)",
        width: "30%",
        height: "22%",
        background: metal,
        borderRadius: "14% 14% 40% 40%"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "50%",
        bottom: "-7%",
        transform: "translateX(-50%)",
        width: "30%",
        height: "22%",
        background: metal,
        borderRadius: "40% 40% 14% 14%"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        right: "-4%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "8%",
        height: "12%",
        background: metal,
        borderRadius: "30%"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ring("100%"),
        background: metal,
        boxShadow: "0 22px 46px rgba(40,33,20,0.28)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ring("90%"),
        background: `conic-gradient(from 45deg, #6f6c64, #cfcabd, #8c887e, #f2eee4, #6f6c64)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ring("78%"),
        background: dial,
        boxShadow: "inset 0 2px 18px rgba(0,0,0,0.7)"
      }
    }), [0, 90, 180, 270].map(deg => /*#__PURE__*/React.createElement("div", {
      key: deg,
      style: {
        ...ring("78%"),
        transform: `translate(-50%,-50%) rotate(${deg}deg)`,
        pointerEvents: "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "50%",
        top: "8%",
        transform: "translateX(-50%)",
        width: "5%",
        height: "9%",
        background: "var(--accent)",
        borderRadius: "2px",
        opacity: 0.9
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ring("3%"),
        background: "var(--accent)",
        zIndex: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "2.5%",
        height: "30%",
        background: "#f5f5f0",
        transformOrigin: "bottom center",
        transform: "translate(-50%,-100%) rotate(38deg)",
        borderRadius: "3px",
        zIndex: 2
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "2%",
        height: "38%",
        background: "#d9d4c8",
        transformOrigin: "bottom center",
        transform: "translate(-50%,-100%) rotate(-95deg)",
        borderRadius: "3px",
        zIndex: 2
      }
    }));
  }
  window.WatchVisual = WatchVisual;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WatchVisual.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
/* HMG Watches — sample data for the website UI kit. Exposes window.HMGDATA. */
(function () {
  const watches = [{
    id: "tag-heuer-professional-200m",
    brand: "TAG Heuer",
    model: "Professional 200m",
    ref: "WK1112",
    price: "€ 1.250",
    priceNum: 1250,
    year: 1998,
    movement: "Quartzo",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "38 mm",
    strap: "Pulseira em aço",
    condition: "Muito bom",
    box: false,
    papers: false,
    hue: 210,
    images: ["../../assets/watches/th-pro-2.jpg", "../../assets/watches/th-pro-1.jpg", "../../assets/watches/th-pro-4.jpg", "../../assets/watches/th-pro-5.jpg", "../../assets/watches/th-pro-3.jpg"]
  }, {
    id: "tag-heuer-2000-professional",
    brand: "TAG Heuer",
    model: "2000 Professional",
    ref: "964.008",
    price: "€ 980",
    priceNum: 980,
    year: 1995,
    movement: "Quartzo",
    status: "available",
    caseMat: "Aço & ouro",
    diameter: "28 mm",
    strap: "Bicolor · aço e ouro",
    condition: "Bom",
    box: false,
    papers: false,
    hue: 42,
    images: ["../../assets/watches/th-2000-2.jpg", "../../assets/watches/th-2000-1.jpg"]
  }, {
    id: "rolex-submariner-126610ln",
    brand: "Rolex",
    model: "Submariner Date",
    ref: "126610LN",
    price: "€ 14.500",
    priceNum: 14500,
    year: 2021,
    movement: "Automático",
    status: "available",
    caseMat: "Oystersteel",
    diameter: "41 mm",
    strap: "Oyster · Oystersteel",
    condition: "Excelente",
    box: true,
    papers: true,
    hue: 205
  }, {
    id: "omega-speedmaster-310",
    brand: "Omega",
    model: "Speedmaster Professional",
    ref: "310.30.42",
    price: "€ 6.200",
    priceNum: 6200,
    year: 2020,
    movement: "Manual",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "42 mm",
    strap: "Pulseira em aço",
    condition: "Muito bom",
    box: true,
    papers: false,
    hue: 30
  }, {
    id: "patek-nautilus-5711",
    brand: "Patek Philippe",
    model: "Nautilus",
    ref: "5711/1A",
    price: "€ 132.000",
    priceNum: 132000,
    year: 2019,
    movement: "Automático",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "40 mm",
    strap: "Integrada · aço",
    condition: "Excelente",
    box: true,
    papers: true,
    hue: 215
  }, {
    id: "ap-royal-oak-15500",
    brand: "Audemars Piguet",
    model: "Royal Oak",
    ref: "15500ST",
    price: "€ 48.900",
    priceNum: 48900,
    year: 2022,
    movement: "Automático",
    status: "sold",
    caseMat: "Aço inoxidável",
    diameter: "41 mm",
    strap: "Integrada · aço",
    condition: "Excelente",
    box: true,
    papers: true,
    hue: 220
  }, {
    id: "cartier-santos-wssa0018",
    brand: "Cartier",
    model: "Santos de Cartier",
    ref: "WSSA0018",
    price: "€ 7.450",
    priceNum: 7450,
    year: 2021,
    movement: "Automático",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "39,8 mm",
    strap: "QuickSwitch · aço",
    condition: "Muito bom",
    box: true,
    papers: true,
    hue: 38
  }, {
    id: "tudor-black-bay-58",
    brand: "Tudor",
    model: "Black Bay Fifty-Eight",
    ref: "M79030N",
    price: "€ 3.300",
    priceNum: 3300,
    year: 2020,
    movement: "Automático",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "39 mm",
    strap: "Pulseira em aço",
    condition: "Bom",
    box: true,
    papers: false,
    hue: 0
  }, {
    id: "jlc-reverso-classic",
    brand: "Jaeger-LeCoultre",
    model: "Reverso Classic",
    ref: "Q3858520",
    price: "€ 8.900",
    priceNum: 8900,
    year: 2018,
    movement: "Manual",
    status: "sold",
    caseMat: "Aço inoxidável",
    diameter: "45,6 × 27,4 mm",
    strap: "Pele de bezerro",
    condition: "Muito bom",
    box: true,
    papers: true,
    hue: 35
  }, {
    id: "iwc-portugieser-chrono",
    brand: "IWC Schaffhausen",
    model: "Portugieser Chronograph",
    ref: "IW371617",
    price: "€ 7.100",
    priceNum: 7100,
    year: 2021,
    movement: "Automático",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "41 mm",
    strap: "Pele de jacaré",
    condition: "Excelente",
    box: true,
    papers: true,
    hue: 210
  }, {
    id: "vacheron-overseas-4500v",
    brand: "Vacheron Constantin",
    model: "Overseas",
    ref: "4500V/110A",
    price: "€ 24.500",
    priceNum: 24500,
    year: 2019,
    movement: "Automático",
    status: "available",
    caseMat: "Aço inoxidável",
    diameter: "41 mm",
    strap: "Integrada · aço",
    condition: "Muito bom",
    box: true,
    papers: true,
    hue: 200
  }];
  const articles = [{
    id: "guia-comprar-primeiro-rolex",
    category: "Guias",
    title: "Como escolher o seu primeiro Rolex",
    excerpt: "Um guia honesto para quem entra no universo da relojoaria — o que olhar antes do preço.",
    date: "12 Jun 2026",
    read: "8 min",
    hue: 205
  }, {
    id: "mercado-nautilus-2026",
    category: "Mercado",
    title: "O regresso do Nautilus ao seu valor justo",
    excerpt: "Depois do pico de 2022, o mercado secundário encontrou um novo equilíbrio. Analisamos porquê.",
    date: "5 Jun 2026",
    read: "6 min",
    hue: 215
  }, {
    id: "anatomia-cronografo",
    category: "Curiosidades",
    title: "Anatomia de um cronógrafo manual",
    excerpt: "Do botão ao came em coluna — o que acontece dentro da caixa quando carrega no pulsador.",
    date: "28 Mai 2026",
    read: "5 min",
    hue: 30
  }, {
    id: "novidades-watches-and-wonders",
    category: "Novidades",
    title: "Watches & Wonders 2026: o que chegou",
    excerpt: "As peças que nos fizeram parar — e as que vão chegar à montra nos próximos meses.",
    date: "20 Mai 2026",
    read: "7 min",
    hue: 38
  }, {
    id: "box-and-papers",
    category: "Guias",
    title: "Caixa e papéis: quanto valem mesmo?",
    excerpt: "O conjunto completo pesa no preço — mas nem sempre da forma que imagina.",
    date: "14 Mai 2026",
    read: "4 min",
    hue: 35
  }, {
    id: "patine-tropical",
    category: "Curiosidades",
    title: "Pátina tropical: defeito ou tesouro?",
    excerpt: "Mostradores que desbotam para tons de chocolate dividem coleccionadores há décadas.",
    date: "2 Mai 2026",
    read: "6 min",
    hue: 25
  }];
  const metals = [{
    name: "Ouro",
    symbol: "XAU",
    price: "€ 2.214/oz",
    change: 0.82,
    spark: [38, 40, 39, 42, 44, 43, 46, 48, 47, 50]
  }, {
    name: "Prata",
    symbol: "XAG",
    price: "€ 27,40/oz",
    change: -0.45,
    spark: [50, 48, 49, 47, 46, 47, 45, 44, 45, 43]
  }, {
    name: "Platina",
    symbol: "XPT",
    price: "€ 920/oz",
    change: 1.24,
    spark: [30, 32, 31, 34, 36, 35, 38, 40, 42, 44]
  }, {
    name: "Paládio",
    symbol: "XPD",
    price: "€ 980/oz",
    change: -1.10,
    spark: [55, 53, 54, 52, 50, 51, 49, 48, 46, 45]
  }, {
    name: "Diamante",
    symbol: "IDX",
    price: "118,4 pts",
    change: 0.15,
    spark: [44, 44, 45, 45, 44, 45, 46, 46, 45, 46]
  }];
  const risers = [{
    brand: "Patek Philippe",
    model: "Nautilus",
    ref: "5711/1A",
    appreciation: "+23% em 6 meses",
    note: "A descontinuação do 5711 mantém a procura muito acima da oferta no secundário.",
    hue: 215
  }, {
    brand: "Rolex",
    model: "GMT-Master II «Pepsi»",
    ref: "126710BLRO",
    appreciation: "+17% em 6 meses",
    note: "Lista de espera longa nas boutiques empurra o prémio no mercado de revenda.",
    hue: 205
  }, {
    brand: "Audemars Piguet",
    model: "Royal Oak Jumbo",
    ref: "16202ST",
    appreciation: "+15% em 6 meses",
    note: "A edição do 50.º aniversário tornou-se referência imediata de coleccionador.",
    hue: 220
  }, {
    brand: "Omega",
    model: "Speedmaster «Snoopy»",
    ref: "310.32.42",
    appreciation: "+12% em 6 meses",
    note: "Produção limitada e forte apelo temático sustentam a valorização.",
    hue: 30
  }];
  window.HMGDATA = {
    watches,
    articles,
    metals,
    risers
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/responsive.js
try { (() => {
/* HMG Watches — shared responsive viewport hook. window.useVP() */
(function () {
  function read() {
    const w = window.innerWidth || document.documentElement.clientWidth;
    return {
      w,
      mobile: w < 760,
      tablet: w >= 760 && w < 1080,
      desktop: w >= 1080
    };
  }
  window.useVP = function useVP() {
    const [vp, setVp] = React.useState(read());
    React.useEffect(() => {
      let raf;
      const on = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setVp(read()));
      };
      window.addEventListener("resize", on);
      return () => {
        window.removeEventListener("resize", on);
        cancelAnimationFrame(raf);
      };
    }, []);
    return vp;
  };
  // page gutter helper
  window.gutter = function (vp) {
    return vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px";
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/responsive.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Overline = __ds_scope.Overline;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.WatchCard = __ds_scope.WatchCard;

})();
