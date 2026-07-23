import Script from "next/script";

// OpenAI ads pixel (oaiq). The base pixel is installed site-wide so OpenAI can
// attribute the full funnel; conversion events are fired at the point of action
// via `oaiqMeasure` (see the demo booking flow).
const OAIQ_PIXEL_ID =
  process.env.NEXT_PUBLIC_OAIQ_PIXEL_ID ?? "2aTEMb97yQ71D3Cp7qeiCn";

// The global queue function the SDK installs on `window`.
type OaiqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    oaiq?: OaiqFn;
  }
}

export function OaiqPixel() {
  return (
    <Script id="oaiq-pixel" strategy="afterInteractive">
      {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OAIQ_PIXEL_ID}",debug:true});`}
    </Script>
  );
}

// Safely record an OpenAI ads conversion event from client code. No-ops if the
// pixel hasn't loaded (e.g. blocked by an ad blocker) so callers never throw.
export function oaiqMeasure(
  event: string,
  data?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return;
  window.oaiq("measure", event, data);
}
