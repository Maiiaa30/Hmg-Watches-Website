/* HMG Watches — shared responsive viewport hook. window.useVP() */
(function () {
  function read() {
    const w = window.innerWidth || document.documentElement.clientWidth;
    return { w, mobile: w < 760, tablet: w >= 760 && w < 1080, desktop: w >= 1080 };
  }
  window.useVP = function useVP() {
    const [vp, setVp] = React.useState(read());
    React.useEffect(() => {
      let raf;
      const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setVp(read())); };
      window.addEventListener("resize", on);
      return () => { window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
    }, []);
    return vp;
  };
  // page gutter helper
  window.gutter = function (vp) { return vp.mobile ? "0 20px" : vp.tablet ? "0 36px" : "0 56px"; };
})();
