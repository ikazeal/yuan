"use client";

import { useEffect, useState } from "react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global { interface Window { ethereum?: EthereumProvider } }

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT?.trim() || "";
const REQUIRED_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID?.trim() || "";
const X_URL = process.env.NEXT_PUBLIC_X_URL?.trim() || "https://x.com/";
const fortunes = [
  "山水有相逢，来日皆可期。",
  "心有微光，终会照见远方。",
  "所念皆有回响，所遇皆为序章。",
  "花开有时，好运正循光而来。",
];

const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

export default function Home() {
  const [fortune, setFortune] = useState("连接钱包并持有缘代币，即可开启今日缘签。");
  const [menuOpen, setMenuOpen] = useState(false);
  const [account, setAccount] = useState("");
  const [eligible, setEligible] = useState(false);
  const [walletState, setWalletState] = useState<"idle" | "checking" | "ready" | "empty" | "unconfigured" | "wrong-chain">("idle");
  const [showFortune, setShowFortune] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const checkEligibility = async (address: string) => {
    if (!window.ethereum) return;
    if (!TOKEN_CONTRACT) { setWalletState("unconfigured"); setEligible(true); return; }
    setWalletState("checking");
    try {
      const chainId = String(await window.ethereum.request({ method: "eth_chainId" }));
      if (REQUIRED_CHAIN_ID && BigInt(chainId) !== BigInt(REQUIRED_CHAIN_ID)) {
        setWalletState("wrong-chain"); setEligible(false); return;
      }
      const data = `0x70a08231${address.slice(2).padStart(64, "0")}`;
      const result = String(await window.ethereum.request({ method: "eth_call", params: [{ to: TOKEN_CONTRACT, data }, "latest"] }));
      const hasToken = BigInt(result || "0x0") > 0n;
      setEligible(hasToken);
      setWalletState(hasToken ? "ready" : "empty");
    } catch {
      setEligible(false); setWalletState("empty");
    }
  };

  const revealFortune = () => {
    setIsDrawing(true); setShowFortune(true);
    window.setTimeout(() => {
      const next = fortunes[Math.floor(Math.random() * fortunes.length)];
      setFortune(next); setIsDrawing(false);
      localStorage.setItem("yuan-last-fortune", JSON.stringify({ date: new Date().toDateString(), text: next }));
    }, 1100);
  };

  const connectWallet = async (drawAfterConnect = false) => {
    if (!window.ethereum) { alert("未检测到钱包，请先安装 MetaMask 或其他兼容钱包。"); return; }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0] || "";
      setAccount(address);
      if (address) await checkEligibility(address);
      if (address && drawAfterConnect && !TOKEN_CONTRACT) revealFortune();
    } catch { alert("钱包连接未完成，请在钱包中确认授权。"); }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      const address = accounts?.[0] || "";
      setAccount(address); setEligible(false); setWalletState(address ? "checking" : "idle");
      if (address) void checkEligibility(address);
    };
    const handleChain = () => { if (account) void checkEligibility(account); };
    window.ethereum.on?.("accountsChanged", handleAccounts);
    window.ethereum.on?.("chainChanged", handleChain);
    return () => { window.ethereum?.removeListener?.("accountsChanged", handleAccounts); window.ethereum?.removeListener?.("chainChanged", handleChain); };
  }, [account]);

  const drawFortune = async () => {
    if (!account) { await connectWallet(true); return; }
    if (TOKEN_CONTRACT && !eligible) { alert(walletState === "wrong-chain" ? "请切换到指定网络后再试。" : "当前钱包未持有缘代币，暂时无法抽签。"); return; }
    revealFortune();
  };

  const walletLabel = account ? shortAddress(account) : "连接钱包";
  const accessText = walletState === "ready" ? "已验证持币资格 · 可抽签" : walletState === "empty" ? "未持有缘代币" : walletState === "checking" ? "正在验证持币资格…" : walletState === "wrong-chain" ? "请切换至指定网络" : walletState === "unconfigured" ? "体验模式已开放 · 可抽签" : "连接钱包开启今日缘签";

  return (
    <main>
      <section className="hero" id="home">
        <div className="stars" aria-hidden="true" />
        <nav className="nav" aria-label="主导航">
          <a className="brand" href="#home" aria-label="缘首页"><span className="lotus">缘</span></a>
          <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开导航" aria-expanded={menuOpen}>☰</button>
          <div className={`links ${menuOpen ? "open" : ""}`}>
            <a className="active" href="#home">首页</a><a href="#fortune">缘签</a><a href="#pool">缘池</a><a href="#wheel">因缘轮</a><a href="/whitepaper">白皮书</a><a href={X_URL} target="_blank" rel="noreferrer">𝕏</a>
          </div>
          <p className="nav-motto">因缘而聚 · 链接众生</p>
          <button className={`wallet ${account ? "connected" : ""}`} onClick={() => connectWallet()}>▣　{walletLabel}</button>
        </nav>

        <div className="hero-copy">
          <span className="eyebrow">ORIGIN · CONNECTION · DESTINY</span>
          <h1>缘起</h1><p className="en">No meeting is accidental.</p><div className="rule" />
          <p className="intro">众生相遇，皆有因缘。<br />链上相逢，皆是缘起。</p>
          <div className="actions">
            <button className="primary" onClick={drawFortune}>求取缘签 <span>→</span></button>
            <button className="secondary" onClick={() => connectWallet()}>▣　{walletLabel}</button>
          </div>
          <p className={`token-status ${eligible ? "verified" : ""}`}><i />{accessText}</p>
          <p className="micro">KARMA CONNECTS US<br />ONCHAIN AND BEYOND</p>
        </div>

        <div className="mandala" aria-hidden="true">
          <img className="guardians" src="/six-guardians.png" alt="" />
          <div className="orbit orbit-one"><i /><i /><i /></div><div className="orbit orbit-two"><i /><i /><i /><i /></div>
          <div className="petals">✦</div><div className="core"><span>缘</span><small>Y U A N</small></div>
          <b className="tag tag-a">一念一缘</b><b className="tag tag-b">万法相连</b>
        </div>
        <div className="side-poem" aria-hidden="true"><span>一花一世界</span><span>一链一众生</span></div>
        <div className="scroll-mark"><span>SCROLL TO EXPLORE</span><i /></div>
      </section>

      <section className="cards" aria-label="缘起功能">
        <article className="feature" id="fortune">
          <div className="feature-icon seal">签</div><div><span className="index">01 / TOKEN GATED</span><h2>今日缘签</h2><p>{fortune}</p></div>
          <button onClick={drawFortune} aria-label="抽取缘签">↗</button>
        </article>
        <article className="feature" id="pool">
          <div className="feature-icon">❀</div><div><span className="index">02 / CONNECTION</span><h2>缘池</h2><p>汇聚善念，共建缘分之池</p></div>
          <button onClick={() => alert("你的善念已投入缘池")} aria-label="进入缘池">↗</button>
        </article>
        <article className="feature" id="wheel">
          <div className="feature-icon wheel">☸</div><div><span className="index">03 / KARMA</span><h2>因缘轮</h2><p>每一次相遇，都是因果的回响</p></div>
          <button onClick={() => alert("因缘之轮，正在转动")} aria-label="转动因缘轮">↗</button>
        </article>
      </section>
      <section className="about" id="about"><span>缘 · 数字东方美学</span><h2>山河有信，万物有缘</h2><p>这是一个关于相遇、善念与连接的数字栖居地。</p></section>
      <footer className="footer"><a className="brand footer-brand" href="#home"><span className="lotus">缘</span></a><p>因缘而聚，链接众生</p><div><a href="/whitepaper">阅读白皮书</a><a href={X_URL} target="_blank" rel="noreferrer">关注 𝕏</a></div></footer>

      {showFortune && (
        <div className="fortune-overlay" role="dialog" aria-modal="true" aria-label="今日缘签" onClick={() => !isDrawing && setShowFortune(false)}>
          <div className={`fortune-modal ${isDrawing ? "drawing" : "revealed"}`} onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setShowFortune(false)} aria-label="关闭缘签">×</button>
            <div className="fortune-rays" aria-hidden="true" />
            <p className="fortune-kicker">今日缘签 · DAILY KARMA</p>
            <div className="fortune-token"><span>{isDrawing ? "缘" : "上吉"}</span></div>
            {isDrawing ? <><h2>静心一念</h2><p className="drawing-copy">缘分正在循光而来……</p></> : <><h2>{fortune}</h2><p className="fortune-note">心诚则灵，守念而行。愿此签为你照见前路的一点微光。</p><div className="fortune-actions"><button onClick={() => { setShowFortune(false); document.querySelector("#fortune")?.scrollIntoView({ behavior: "smooth" }); }}>收下此签</button><button onClick={drawFortune}>再求一签</button></div></>}
          </div>
        </div>
      )}
    </main>
  );
}
