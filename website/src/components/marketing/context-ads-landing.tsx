"use client";

import { useEffect } from "react";

const CSS = `
  :root{
    --parchment:#fefffc;--paper:#ffffff;--linen:#f9faf7;
    --ink:#171717;--graphite:#2c2c2c;--charcoal:#444141;--ash:#646464;
    --fog:#b4b8b4;--mist:#dee2de;--twilight:#282834;--dusk:#1f1f29;
    --signal:#41a1cf;--cerulean:#0081c0;--mit:#a31f34;
    --serif:'Fraunces','Recoleta',ui-serif,'New York',Georgia,'Times New Roman',serif;
    --sans-ctx:'Inter',ui-sans-serif,-apple-system,system-ui,'Segoe UI',Roboto,sans-serif;
    --shadow-nav:rgba(0,0,0,.15) 0px 2px 6px 0px;
    --shadow-card:rgba(0,0,0,.08) 0px 1px 1px 0px, rgba(0,0,0,.08) 0px 4px 5px 0px;
    --shadow-diagram:rgba(0,0,0,.05) 0px 1px 8px 0px;
    --maxw:1120px;--gut:clamp(20px,5vw,40px);
  }
  html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
  body{margin:0;background:var(--parchment);color:var(--graphite);font-family:var(--sans-ctx);font-weight:400;letter-spacing:-.011em;line-height:1.5;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
  .ctx *{box-sizing:border-box}
  .ctx ::selection{background:rgba(65,161,207,.18)}
  .ctx a{color:inherit;text-decoration:none}
  .ctx .wrap{max-width:var(--maxw);margin:0 auto;padding-inline:var(--gut)}
  .ctx h1,.ctx h2,.ctx h3{font-family:var(--serif);font-weight:400;margin:0;font-feature-settings:"liga" 0}
  .ctx .serif{font-family:var(--serif);font-weight:400;font-feature-settings:"liga" 0}
  .ctx .heading-lg{font-size:clamp(32px,4.8vw,48px);line-height:1.1;letter-spacing:-.02em}
  .ctx .heading{font-size:clamp(27px,3.6vw,40px);line-height:1.1;letter-spacing:-.02em}
  .ctx .eyebrow{font-size:13px;font-weight:500;letter-spacing:.02em;text-transform:uppercase;color:var(--ash);display:inline-flex;align-items:center;gap:10px}
  .ctx .eyebrow::before{content:"";width:22px;height:1px;background:var(--fog)}
  .ctx .lede{font-size:clamp(16px,1.5vw,18px);line-height:1.55;color:var(--ash);max-width:44ch}
  .ctx em{font-style:italic}

  .ctx-header{position:fixed;top:16px;left:0;right:0;z-index:60;display:flex;justify-content:center;pointer-events:none;opacity:0;transform:translateY(-10px);transition:opacity .4s ease,transform .4s ease}
  .ctx-header.show{opacity:1;transform:none;pointer-events:auto}
  .ctx .pill{pointer-events:auto;display:flex;align-items:center;padding:6px 6px 6px 16px;background:rgba(255,255,255,.7);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);border:1px solid var(--mist);border-radius:50px;box-shadow:var(--shadow-nav)}
  .ctx .pill .nm{font-family:var(--serif);font-size:16px;color:var(--graphite);margin-right:16px;white-space:nowrap}
  .ctx .pill a.l{font-size:14px;font-weight:500;color:var(--charcoal);padding:6px 11px;border-radius:50px}
  .ctx .pill a.l:hover{background:var(--linen)}
  .ctx .pill .cta{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:500;color:var(--signal);border:1px solid var(--signal);border-radius:8px;padding:5px 7px 5px 12px}
  .ctx .arrowc{width:17px;height:17px;border:1px solid currentColor;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px}
  @media(max-width:640px){.ctx .pill a.l{display:none}}

  .ctx .btn{display:inline-flex;align-items:center;gap:9px;font-size:15px;font-weight:500;border-radius:8px;padding:8px 10px 8px 16px;transition:background .25s,border-color .25s,color .25s;cursor:pointer}
  .ctx .btn .arrowc{width:20px;height:20px;font-size:12px;transition:transform .3s}
  .ctx .btn:hover .arrowc{transform:translateX(2px)}
  .ctx .btn-signal{color:var(--signal);border:1px solid var(--signal);background:transparent}
  .ctx .btn-signal:hover{background:rgba(65,161,207,.08)}
  .ctx .btn-outline{color:var(--twilight);border:1px solid var(--twilight);background:transparent}
  .ctx .btn-outline:hover{background:rgba(40,40,52,.05)}
  .ctx .btn-dark{color:#fff;background:var(--dusk);border:1px solid var(--twilight)}
  .ctx .btn-dark:hover{background:#15151d}
  .ctx .actions{display:flex;gap:12px;flex-wrap:wrap}

  .ctx .hero{position:relative;min-height:100svh;display:flex;padding:14px 0 0;overflow:hidden}
  .ctx .frame{position:relative;z-index:2;width:min(var(--maxw),calc(100vw - 40px));margin:0 auto;display:flex;flex-direction:column;flex:1;min-height:calc(100svh - 14px)}
  .ctx .frame-nav{display:flex;justify-content:center;align-items:center;gap:8px;padding:12px 20px 16px;flex-wrap:wrap}
  .ctx .frame-nav a{font-size:15px;font-weight:500;color:var(--charcoal);padding:6px 12px;border-radius:50px;transition:background .2s}
  .ctx .frame-nav a:hover{background:var(--linen)}
  .ctx .frame-nav .sep{color:var(--fog);font-size:13px}
  .ctx .frame-nav .cta{display:inline-flex;align-items:center;gap:7px;color:var(--signal);border:1px solid var(--signal);border-radius:8px;padding:5px 7px 5px 12px}
  .ctx .frame-nav .cta:hover{background:rgba(65,161,207,.08)}

  .ctx .band-mid{position:relative;flex:1;min-height:340px;overflow:hidden;display:flex;align-items:center;justify-content:center}
  .ctx .collage{position:absolute;inset:0;z-index:0}
  .ctx .collage::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(44% 50% at 50% 50%,rgba(254,255,252,.7) 0%,rgba(254,255,252,.24) 48%,rgba(254,255,252,0) 74%)}
  .ctx .frame-hero{position:relative;z-index:1;text-align:center;padding:10px 24px;max-width:840px}
  .ctx .frame-hero::before{content:"";position:absolute;inset:-46% -16%;z-index:-1;background:radial-gradient(52% 66% at 50% 50%,rgba(254,255,252,.94) 0%,rgba(254,255,252,.62) 40%,rgba(254,255,252,0) 72%)}
  .ctx .brand{font-size:clamp(46px,8vw,90px);line-height:.98;letter-spacing:-.03em;color:var(--graphite)}
  .ctx .tagline{font-size:clamp(24px,4.4vw,46px);line-height:1.05;letter-spacing:-.02em;color:var(--graphite);margin-top:10px}
  .ctx .tagline em{font-style:italic}
  .ctx .builtby{margin-top:22px;font-size:14px;color:var(--ash);display:inline-flex;align-items:center;gap:8px}
  .ctx .mitmark{font-weight:700;letter-spacing:.06em;color:var(--mit);font-size:13px}
  .ctx .frame-hero .actions{margin-top:30px;justify-content:center}

  .ctx .frame-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--twilight)}
  .ctx .frame-stats .cell{padding:20px 16px;border-left:1px solid var(--mist);text-align:center}
  .ctx .frame-stats .cell:first-child{border-left:none}
  .ctx .frame-stats .fig{font-family:var(--serif);font-size:clamp(24px,2.6vw,32px);line-height:1;letter-spacing:-.02em;color:var(--graphite);font-variant-numeric:tabular-nums}
  .ctx .frame-stats .lab{margin-top:8px;font-size:12.5px;color:var(--ash);line-height:1.35}
  .ctx .frame-niche{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--twilight)}
  .ctx .frame-niche .cell{padding:15px 12px;border-left:1px solid var(--mist);text-align:center;font-size:13px;font-weight:500;color:var(--charcoal)}
  .ctx .frame-niche .cell:first-child{border-left:none}
  @media(max-width:760px){
    .ctx .frame-stats{grid-template-columns:repeat(2,1fr)}
    .ctx .frame-stats .cell:nth-child(3){border-left:none}
    .ctx .frame-stats .cell:nth-child(3),.ctx .frame-stats .cell:nth-child(4){border-top:1px solid var(--mist)}
    .ctx .frame-niche{grid-template-columns:repeat(2,1fr)}
    .ctx .frame-niche .cell{border-top:1px solid var(--mist)}
    .ctx .frame-niche .cell:nth-child(odd){border-left:none}
  }

  .ctx .ad{position:absolute;background:var(--paper);border:1px solid var(--mist);border-radius:12px;box-shadow:var(--shadow-card);padding:12px;width:232px;font-size:11.5px;line-height:1.35;color:var(--charcoal);will-change:transform}
  .ctx .ad .tag{font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--ash);margin-bottom:9px;display:flex;align-items:center;gap:6px}
  .ctx .ad .tag::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--signal)}
  .ctx .pn{font-weight:600;color:var(--graphite)}
  .ctx .pm{color:var(--ash);font-size:10.5px}
  .ctx .spons{color:var(--signal);font-weight:600;font-size:10px;letter-spacing:.03em}
  .ctx .bubble{border-radius:10px;padding:7px 10px;margin-bottom:6px;max-width:88%}
  .ctx .bubble.user{background:var(--linen);border:1px solid var(--mist);color:var(--graphite);margin-left:auto}
  .ctx .bubble.ai{background:#fff;color:var(--charcoal)}
  .ctx .mini-prod{display:flex;gap:8px;align-items:center;border:1px solid var(--mist);border-radius:8px;padding:7px;margin-top:6px}
  .ctx .mini-prod .thumb{width:30px;height:30px;border-radius:6px;flex:none;background:linear-gradient(135deg,#e9dcc8,#cfe1d9)}
  .ctx .wave{display:flex;align-items:center;gap:2px;height:26px;margin:8px 0}
  .ctx .wave span{flex:1;background:var(--signal);opacity:.5;border-radius:2px}
  .ctx .audio-ctrl{display:flex;align-items:center;gap:8px;margin-top:6px}
  .ctx .audio-ctrl .play{width:22px;height:22px;border-radius:50%;background:var(--twilight);color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;flex:none}
  .ctx .audio-ctrl .rail{flex:1;height:3px;border-radius:3px;background:var(--mist);position:relative}
  .ctx .audio-ctrl .rail::after{content:"";position:absolute;left:0;top:0;bottom:0;width:38%;background:var(--signal);border-radius:3px}
  .ctx .ad-web .wt{color:var(--signal);font-weight:600;font-size:13px;margin:4px 0 3px;line-height:1.2}
  .ctx .ad-web .url{font-size:10.5px;color:var(--ash)}
  .ctx .ad-web .wd{color:var(--charcoal)}
  .ctx .shot{height:78px;border-radius:8px;background:linear-gradient(140deg,#f0e4d2,#d7e4de 55%,#e7dcef);margin-bottom:9px}
  .ctx .ad-voice .mic{width:34px;height:34px;border-radius:50%;background:var(--linen);border:1px solid var(--mist);display:flex;align-items:center;justify-content:center;margin-bottom:8px}
  .ctx .cmp{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-top:1px solid var(--mist)}
  .ctx .cmp:first-of-type{border-top:none}
  .ctx .cmp.win{color:var(--graphite);font-weight:600}
  .ctx .dot{width:14px;height:14px;border-radius:4px;background:var(--linen);border:1px solid var(--mist);flex:none}
  .ctx .cmp.win .dot{background:var(--signal);border-color:var(--signal)}
  @media(max-width:900px){.ctx .ad{display:none}.ctx .ad.keep{display:block;opacity:.55}}

  .ctx section.band{padding-block:clamp(72px,11vh,120px)}
  .ctx .band.paper{background:var(--paper);border-block:1px solid var(--mist)}
  .ctx .split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,7vw,88px);align-items:start}
  @media(max-width:840px){.ctx .split{grid-template-columns:1fr;gap:32px}}
  .ctx .mt-s{margin-top:20px}.ctx .mt-m{margin-top:28px}.ctx .mt-l{margin-top:40px}
  .ctx .steplist{margin-top:8px}
  .ctx .steprow{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:20px 0;border-top:1px solid var(--mist);align-items:baseline}
  .ctx .steprow:last-child{border-bottom:1px solid var(--mist)}
  .ctx .steprow .n{font-size:13px;font-weight:500;color:var(--signal);font-variant-numeric:tabular-nums}
  .ctx .steprow h3{font-size:20px;letter-spacing:-.02em;color:var(--graphite);margin-bottom:4px}
  .ctx .steprow p{font-size:15px;color:var(--ash);line-height:1.5;margin:0;max-width:40ch}
  .ctx .vivid{position:relative;overflow:hidden;border-radius:24px;background:var(--cerulean);color:#fff;padding:clamp(44px,7vw,88px)}
  .ctx .vivid canvas{position:absolute;inset:0;width:100%;height:100%}
  .ctx .vivid .v-inner{position:relative;z-index:2}
  .ctx .vivid h2{color:#fff;max-width:16ch}
  .ctx .vivid p{margin-top:20px;color:rgba(255,255,255,.9);font-size:17px;line-height:1.5;max-width:42ch}
  .ctx .vivid .btn-glass{color:#fff;border:1px solid rgba(255,255,255,.6);background:transparent}
  .ctx .vivid .btn-glass:hover{background:rgba(255,255,255,.12)}
  .ctx-footer{background:var(--paper);border-top:1px solid var(--mist);padding-block:clamp(56px,8vh,80px) 36px}
  .ctx .foot-state{font-family:var(--serif);font-size:clamp(27px,4vw,42px);line-height:1.12;letter-spacing:-.02em;color:var(--graphite);max-width:18ch}
  .ctx .foot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:32px;margin-top:52px}
  @media(max-width:720px){.ctx .foot-grid{grid-template-columns:1fr 1fr}}
  .ctx .colophon .foot-name{font-family:var(--serif);font-size:20px;color:var(--graphite);display:flex;align-items:center;gap:8px;margin-bottom:12px}
  .ctx .colophon p{font-size:15px;color:var(--ash);line-height:1.5;margin:0 0 18px;max-width:30ch}
  .ctx .foot-col h4{font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:.02em;color:var(--ash);margin:0 0 14px}
  .ctx .foot-col a{display:block;font-size:16px;color:var(--charcoal);padding:5px 0;transition:color .2s}
  .ctx .foot-col a:hover{color:var(--twilight)}
  .ctx .foot-bottom{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-top:52px;padding-top:22px;border-top:1px solid var(--mist);font-size:13px;color:var(--ash)}
  .ctx .reveal{opacity:0;transform:translateY(16px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}
  .ctx .reveal.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){.ctx .reveal{opacity:1;transform:none;transition:none}}
`;

const MARKUP = `
<header class="ctx-header" id="pill">
  <nav class="pill" aria-label="Primary">
    <span class="nm serif">Context&nbsp;Ads</span>
    <a class="l" href="#approach">Approach</a>
    <a class="l" href="#model">The&nbsp;Model</a>
    <a class="cta" href="#contact">Book a demo <span class="arrowc">&rarr;</span></a>
  </nav>
</header>

<section class="hero" id="top">
  <div class="frame">
    <div class="frame-nav">
      <a href="#approach">Approach</a><span class="sep">&middot;</span>
      <a href="#model">The Model</a><span class="sep">&middot;</span>
      <a href="#contact" class="cta">Book a demo <span class="arrowc">&rarr;</span></a>
    </div>

    <div class="band-mid">
      <div class="collage" aria-hidden="true">
        <div class="ad keep" data-rot="-3" data-speed="0.06" style="left:8%;top:3%;width:230px;transform:rotate(-3deg)">
          <div class="tag">ChatGPT</div>
          <div class="bubble user">best creatine for a beginner?</div>
          <div class="bubble ai">Monohydrate is the most studied. A clean, third-party tested pick:</div>
          <div class="mini-prod"><div class="thumb"></div><div><div class="pn">Thorne Creatine</div><div class="pm"><span class="spons">Sponsored</span> &middot; $32</div></div></div>
        </div>
        <div class="ad ad-web" data-rot="3" data-speed="0.13" style="left:62%;top:2%;width:226px;transform:rotate(3deg)">
          <div class="spons">Ad</div>
          <div class="wt">The vitamin C serum dermatologists reach for</div>
          <div class="url">glowlabs.com/serum</div>
          <div class="wd" style="margin-top:5px">Clinically tested brightening serum. Free shipping over $40.</div>
        </div>
        <div class="ad" data-rot="-2" data-speed="0.20" style="left:71%;top:26%;width:190px;transform:rotate(-2deg)">
          <div class="shot" style="height:66px"></div>
          <div class="pn">@northtrail</div>
          <div class="pm" style="margin-top:3px"><span class="spons">Sponsored</span> &middot; Shop the look</div>
        </div>
        <div class="ad" data-rot="2" data-speed="0.09" style="left:5.5%;top:29%;width:204px;transform:rotate(2deg)">
          <div class="tag">Answer</div>
          <div class="pm" style="color:var(--charcoal)">Top pick for sensitive skin, from recent reviews:</div>
          <div class="mini-prod"><div class="thumb"></div><div><div class="pn">Vela Cleanser</div><div class="pm"><span class="spons">Sponsored</span> &middot; 4.8&#9733;</div></div></div>
        </div>
        <div class="ad" data-rot="1" data-speed="0.16" style="left:9%;top:52%;width:172px;transform:rotate(1deg)">
          <div class="tag">Chat</div>
          <div class="bubble ai">Try a gel SPF. A top-rated one:</div>
          <div class="pm" style="margin-top:6px"><span class="spons">Sponsored</span> &middot; Bloom SPF 46</div>
        </div>
        <div class="ad" data-rot="-1" data-speed="0.19" style="left:69.5%;top:47%;width:176px;transform:rotate(-1deg)">
          <div class="shot" style="height:60px"></div>
          <div class="pn">Kestrel Runners</div>
          <div class="pm" style="margin-top:3px">&#9733;&#9733;&#9733;&#9733;&#9734; &middot; $120 &middot; <span class="spons">Sponsored</span></div>
        </div>
        <div class="ad keep" data-rot="2" data-speed="0.24" style="left:10.5%;top:66%;width:230px;transform:rotate(2deg)">
          <div class="tag">Audio</div>
          <div class="pn" style="margin-bottom:2px">Sponsored message</div>
          <div class="pm">&ldquo;This episode is brought to you by Oura.&rdquo;</div>
          <div class="wave"><span style="height:40%"></span><span style="height:70%"></span><span style="height:100%"></span><span style="height:55%"></span><span style="height:85%"></span><span style="height:35%"></span><span style="height:65%"></span><span style="height:95%"></span><span style="height:45%"></span><span style="height:75%"></span><span style="height:50%"></span><span style="height:30%"></span></div>
          <div class="audio-ctrl"><span class="play">&#9654;</span><span class="rail"></span><span class="pm">0:15</span></div>
        </div>
        <div class="ad" data-rot="-3" data-speed="0.16" style="left:72.5%;top:60%;width:186px;transform:rotate(-3deg)">
          <div class="shot"></div>
          <div class="pn">Aere Daily Moisturizer</div>
          <div class="pm" style="margin-top:3px">&#9733;&#9733;&#9733;&#9733;&#9733; &middot; $48 &middot; <span class="spons">Sponsored</span></div>
        </div>
        <div class="ad" data-rot="-2" data-speed="0.12" style="left:6.5%;top:84%;width:210px;transform:rotate(-2deg)">
          <div class="tag">Answer</div>
          <div class="cmp win"><span><span class="dot" style="display:inline-block;vertical-align:-2px;margin-right:6px"></span>Nord Mattress</span><span class="pm" style="color:var(--signal)">Ad</span></div>
          <div class="cmp"><span><span class="dot" style="display:inline-block;vertical-align:-2px;margin-right:6px"></span>Option B</span><span class="pm">4.4&#9733;</span></div>
          <div class="cmp"><span><span class="dot" style="display:inline-block;vertical-align:-2px;margin-right:6px"></span>Option C</span><span class="pm">4.2&#9733;</span></div>
        </div>
        <div class="ad ad-voice" data-rot="3" data-speed="0.28" style="left:57%;top:82%;width:206px;transform:rotate(3deg)">
          <div class="tag">Voice</div>
          <div class="mic" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#41a1cf" stroke-width="1.6" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3"/></svg>
          </div>
          <div class="pn">&ldquo;Recommend a light daily moisturizer.&rdquo;</div>
          <div class="pm" style="margin-top:4px"><span class="spons">Sponsored</span> result read aloud</div>
        </div>
        <div class="ad ad-web" data-rot="1.5" data-speed="0.07" style="left:38%;top:-3%;width:196px;transform:rotate(1.5deg)">
          <div class="spons">Ad</div>
          <div class="wt">Meal kits, ready in 15 minutes</div>
          <div class="url">freshcrate.com</div>
        </div>
        <div class="ad" data-rot="-2" data-speed="0.22" style="left:41%;top:88%;width:188px;transform:rotate(-2deg)">
          <div class="shot" style="height:58px"></div>
          <div class="pn">Lumen Desk Lamp</div>
          <div class="pm" style="margin-top:3px">$89 &middot; <span class="spons">Sponsored</span></div>
        </div>
      </div>

      <div class="frame-hero">
        <h1 class="brand serif">Context Ads</h1>
        <p class="tagline serif">Ads for the <em>AI Era</em></p>
        <p class="builtby">Built by creators from <span class="mitmark">MIT</span></p>
        <div class="actions">
          <a href="#contact" class="btn btn-signal">Book a demo <span class="arrowc">&rarr;</span></a>
          <a href="#approach" class="btn btn-outline">See how it works</a>
        </div>
      </div>
    </div>

    <div class="frame-stats">
      <div class="cell"><div class="fig">900M</div><div class="lab">Weekly AI users</div></div>
      <div class="cell"><div class="fig">$100M</div><div class="lab">Ad revenue in 6 weeks</div></div>
      <div class="cell"><div class="fig">44%</div><div class="lab">Retail-intent impressions</div></div>
      <div class="cell"><div class="fig">$0</div><div class="lab">Upfront. Pay on profit.</div></div>
    </div>
    <div class="frame-niche">
      <div class="cell">Beauty &amp; Skincare</div>
      <div class="cell">Supplements</div>
      <div class="cell">DTC Fashion</div>
      <div class="cell">Home &amp; Lifestyle</div>
      <div class="cell">Food &amp; Beverage</div>
    </div>
  </div>
</section>

<section class="band paper" id="shift">
  <div class="wrap split">
    <div>
      <span class="eyebrow reveal">The shift</span>
      <h2 class="heading-lg mt-m reveal">Search learned to <em>talk back.</em></h2>
    </div>
    <div>
      <p class="lede reveal">900 million people a week now ask instead of search. The answer is the new storefront. We put your brand beside it.</p>
    </div>
  </div>
</section>

<section class="band" id="approach">
  <div class="wrap split">
    <div>
      <span class="eyebrow reveal">What we do</span>
      <h2 class="heading mt-m reveal">One team, from brief to profit.</h2>
      <p class="lede mt-s reveal">We run the whole loop, so you don't have to.</p>
    </div>
    <div class="reveal">
      <div class="steplist">
        <div class="steprow"><span class="n">01</span><div><h3 class="serif">Place</h3><p>We launch and run your ads on ChatGPT Ads.</p></div></div>
        <div class="steprow"><span class="n">02</span><div><h3 class="serif">Track</h3><p>Every dollar tied to real orders and real margin.</p></div></div>
        <div class="steprow"><span class="n">03</span><div><h3 class="serif">Optimize</h3><p>Our AI tunes creative and bids around the clock.</p></div></div>
        <div class="steprow"><span class="n">04</span><div><h3 class="serif">Compound</h3><p>Winners scale. The next customer costs less to reach.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="band paper" id="model">
  <div class="wrap">
    <div class="vivid reveal">
      <canvas id="wash" aria-hidden="true"></canvas>
      <div class="v-inner">
        <span class="eyebrow" style="color:rgba(255,255,255,.85)">The model</span>
        <h2 class="heading-lg mt-m">We only earn when <em>you profit.</em></h2>
        <p>We take a share of the upside we create. If it doesn't work, we don't get paid.</p>
        <div class="mt-l"><a href="#contact" class="btn btn-glass">Talk terms <span class="arrowc">&rarr;</span></a></div>
      </div>
    </div>
  </div>
</section>

<section class="band" id="contact">
  <div class="wrap split">
    <div>
      <span class="eyebrow reveal">Early access</span>
      <h2 class="heading-lg mt-m reveal">Be the first <em>in the room.</em></h2>
    </div>
    <div>
      <p class="lede reveal">Tell us what you sell. We'll show you what the AI surfaces can do for it.</p>
      <div class="actions mt-l reveal">
        <a href="mailto:hello@getcontextads.com?subject=Book%20a%20demo" class="btn btn-signal">Book a demo <span class="arrowc">&rarr;</span></a>
        <a href="mailto:hello@getcontextads.com?subject=Early%20access" class="btn btn-outline">Apply for early access <span class="arrowc">&rarr;</span></a>
      </div>
    </div>
  </div>
</section>

<footer class="ctx-footer">
  <div class="wrap">
    <p class="foot-state serif">The next advertising surface is a conversation.</p>
    <div class="foot-grid">
      <div class="colophon">
        <div class="foot-name serif">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#282834" stroke-width="1.3" stroke-linecap="round"><circle cx="12" cy="10" r="3.4"/><path d="M12 2.6v2.2M12 15.2v2.2M4.6 10h2.2M17.2 10h2.2M2.5 20.5h19"/></svg>
          Context&nbsp;Ads
        </div>
        <p>Ads for the AI era. Built out of MIT.</p>
        <a href="mailto:hello@getcontextads.com" class="btn btn-dark">hello@getcontextads.com</a>
      </div>
      <div class="foot-col"><h4>Company</h4><a href="#approach">Approach</a><a href="#model">The Model</a><a href="#contact">Early access</a></div>
      <div class="foot-col"><h4>Get started</h4><a href="#contact">Book a demo</a><a href="mailto:hello@getcontextads.com">Contact</a></div>
    </div>
    <div class="foot-bottom"><span>&copy; 2026 Context Ads. getcontextads.com</span><span>Cambridge, Massachusetts</span></div>
  </div>
</footer>
`;

export function ContextAdsLanding() {
  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(".ctx .reveal")
    );
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && !reduce) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      revealEls.forEach((el) => io?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }

    const pill = document.getElementById("pill");
    const ads = Array.from(
      document.querySelectorAll<HTMLElement>(".ctx .collage .ad")
    );
    let ticking = false;
    const frame = () => {
      const y = window.scrollY;
      if (pill) pill.classList.toggle("show", y > window.innerHeight * 0.72);
      if (!reduce) {
        for (const el of ads) {
          const sp = parseFloat(el.getAttribute("data-speed") || "0") || 0;
          const rot = el.getAttribute("data-rot") || "0";
          el.style.transform = `rotate(${rot}deg) translate3d(0,${(y * sp).toFixed(1)}px,0)`;
        }
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const washCv = document.getElementById("wash") as HTMLCanvasElement | null;
    const paintWash = () => {
      if (!washCv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = washCv.getBoundingClientRect();
      washCv.width = Math.max(1, Math.floor(rect.width * dpr));
      washCv.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = washCv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#1a94ce");
      grad.addColorStop(0.5, "#0081c0");
      grad.addColorStop(1, "#00669c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const blob = (x: number, y: number, r: number, rgb: string, a: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };
      blob(w * 0.16, h * 0.2, Math.max(w, h) * 0.6, "120,205,240", 0.3);
      blob(w * 0.9, h * 0.95, Math.max(w, h) * 0.5, "0,70,120", 0.35);
    };
    paintWash();
    window.addEventListener("resize", paintWash);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", paintWash);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <div className="ctx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </div>
  );
}
