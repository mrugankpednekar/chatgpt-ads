"use client";

import { useEffect } from "react";
import Script from "next/script";
import { track } from "@vercel/analytics";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_BOOK_DEMO_URL ??
  "https://calendly.com/hi-getcontextads/30min";

const CSS = `
  .demo-page{
    --parchment:#fefffc;--ink:#171717;--graphite:#2c2c2c;--ash:#646464;
    --fog:#b4b8b4;--mist:#dee2de;--signal:#41a1cf;--cerulean:#0081c0;
    --serif:'Fraunces','Recoleta',ui-serif,'New York',Georgia,'Times New Roman',serif;
    --sans:'Inter',ui-sans-serif,-apple-system,system-ui,'Segoe UI',Roboto,sans-serif;
    min-height:100vh;background:var(--parchment);color:var(--graphite);
    font-family:var(--sans);letter-spacing:-.011em;line-height:1.5;
    -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
    display:flex;flex-direction:column;align-items:center;
    padding:clamp(20px,5vw,48px);box-sizing:border-box;
  }
  .demo-page *{box-sizing:border-box}
  .demo-page a{color:inherit;text-decoration:none}
  .demo-wrap{width:100%;max-width:900px}
  .demo-back{display:inline-flex;align-items:center;gap:8px;font-size:14px;
    color:var(--ash);margin-bottom:clamp(24px,5vw,40px);transition:color .2s}
  .demo-back:hover{color:var(--signal)}
  .demo-head{text-align:center;margin-bottom:clamp(20px,4vw,32px)}
  .demo-eyebrow{font-size:13px;font-weight:500;letter-spacing:.02em;
    text-transform:uppercase;color:var(--ash);margin-bottom:14px}
  .demo-title{font-family:var(--serif);font-weight:400;font-feature-settings:"liga" 0;
    font-size:clamp(30px,4.4vw,46px);line-height:1.1;letter-spacing:-.02em;margin:0}
  .demo-title em{font-style:italic;color:var(--cerulean)}
  .demo-lede{font-size:clamp(15px,1.5vw,17px);line-height:1.55;color:var(--ash);
    max-width:46ch;margin:14px auto 0}
  .calendly-inline-widget{width:100%;min-width:320px;height:720px;
    border-radius:16px;overflow:hidden;
    box-shadow:rgba(0,0,0,.08) 0px 1px 1px 0px, rgba(0,0,0,.08) 0px 4px 5px 0px}
  @media(max-width:640px){.calendly-inline-widget{height:1000px}}
`;

export function DemoBooking() {
  useEffect(() => {
    track("demo_page_view");

    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (
        typeof data !== "object" ||
        data === null ||
        typeof data.event !== "string" ||
        !data.event.startsWith("calendly.")
      ) {
        return;
      }
      if (data.event === "calendly.event_scheduled") {
        track("demo_booked");
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <main className="demo-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="demo-wrap">
        <a className="demo-back" href="/">
          <span aria-hidden="true">&larr;</span> Back to Context Ads
        </a>
        <div className="demo-head">
          <div className="demo-eyebrow">Book a demo</div>
          <h1 className="demo-title">
            See what the AI surfaces can do for <em>your brand.</em>
          </h1>
          <p className="demo-lede">
            Grab 30 minutes with the team. Tell us what you sell, and we&rsquo;ll
            show you how it shows up in ChatGPT and the AI surfaces replacing search.
          </p>
        </div>
        <div
          className="calendly-inline-widget"
          data-url={CALENDLY_URL}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      </div>
    </main>
  );
}
