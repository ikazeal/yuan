const sections = [
  { id:"vision", number:"壹", title:"缘起与愿景", text:["缘是一个以东方因缘观为精神内核的链上文化与社交实验。我们相信，每次相遇并非孤立事件，而是由共同兴趣、善意行为与持续参与编织而成。", "项目以‘一花一世界，一链一众生’为叙事原点，将传统东方审美、轻量链上身份和可验证的社区参与结合，构建一个更温和、更有仪式感的数字栖居地。"] },
  { id:"product", number:"贰", title:"产品体系", text:["今日缘签是项目的第一项链上仪式。用户连接钱包并通过资格验证后，可抽取当日签文，形成属于自己的数字缘分记录。", "缘池用于沉淀社区善念、提案与共同记忆；因缘轮则把用户的参与轨迹转化为可探索的关系网络。未来各模块会逐步开放，不以高频投机为目标，而以长期文化共建为核心。"] },
  { id:"token", number:"叁", title:"缘代币与用途", text:["缘代币是生态的访问凭证与参与媒介。持有者可获得缘签资格、特定内容访问权、社区提案与投票权，以及未来文化活动和数字纪念品的优先参与权。", "代币不代表公司股权、收益承诺或固定回报。合约地址、网络、总量、分配方案与锁仓安排将在正式部署和安全审计完成后公开，白皮书不会预先填写未经确认的数据。"] },
  { id:"fortune", number:"肆", title:"缘签机制", text:["用户授权钱包后，系统通过标准 ERC-20 balanceOf 方法读取指定代币余额。只有正确网络中余额大于零的钱包才能进入抽签流程；产品只请求完成验证所需的最少钱包权限。", "在正式合约地址完成配置前，抽签入口保持锁定。任何签文仅用于文化娱乐与自我观照，不构成投资、医疗、法律或人生决策建议。"] },
  { id:"tech", number:"伍", title:"技术与安全", text:["前端采用现代响应式架构，直接调用兼容 EIP-1193 的钱包接口完成账户授权、网络识别与余额查询。持币验证通过标准 ERC-20 balanceOf 方法执行，不托管用户资产，不请求助记词或私钥。", "合约上线前将完成权限边界检查、测试网验证与第三方安全审计。项目会坚持最小授权、公开合约、可验证规则和渐进式发布原则。"] },
  { id:"roadmap", number:"陆", title:"路线图", text:["第一阶段：完成品牌世界观、钱包连接、缘签体验与社区入口。第二阶段：部署并审计缘代币合约，启用真实持币门槛与链上凭证。", "第三阶段：开放缘池、社区共创与因缘轮；第四阶段：连接更多东方文化创作者，形成跨社区的数字文化网络。路线图会依据安全审计、社区反馈与实际资源动态调整。"] },
  { id:"governance", number:"柒", title:"治理与原则", text:["社区治理围绕文化内容、公益共创、产品提案和生态合作展开。治理权不等于对他人资产的控制权，核心安全参数不会通过未经审计的临时提案修改。", "缘坚持善意、透明、克制与长期主义：尊重文化来源，不制造虚假稀缺，不承诺不现实的回报，也不以复杂机制掩盖风险。"] },
  { id:"risk", number:"捌", title:"风险说明", text:["区块链应用可能面临智能合约漏洞、网络拥堵、钱包兼容、监管变化和数字资产价格波动等风险。参与者应独立判断并承担相应风险。", "本白皮书是当前产品方向的说明，不构成证券发行文件、投资建议或收益保证。最终规则以正式上线的合约代码、审计报告与官方公告为准。"] },
];

export default function Whitepaper(){
  return <main className="paper-page">
    <header className="paper-nav"><a className="brand" href="/"><span className="lotus">缘</span></a><nav><a href="/">返回首页</a><a href="#vision">愿景</a><a href="#token">代币</a><a href="#roadmap">路线图</a></nav><a className="paper-x" href={process.env.NEXT_PUBLIC_X_URL || "https://x.com/RBYuanQi"} target="_blank" rel="noreferrer">关注 𝕏</a></header>
    <section className="paper-hero"><p>YUAN PROTOCOL · WHITEPAPER</p><h1>缘 · 白皮书</h1><span>版本 1.0　·　东方因缘文化的链上表达</span><div className="paper-seal">缘</div></section>
    <div className="paper-layout"><aside><span>目录</span>{sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.number}　{s.title}</a>)}</aside><article>{sections.map(s=><section key={s.id} id={s.id} className="paper-section"><div className="chapter">{s.number}</div><div><p className="section-en">CHAPTER {s.number}</p><h2>{s.title}</h2>{s.text.map((p,i)=><p key={i}>{p}</p>)}</div></section>)}</article></div>
    <footer className="paper-footer"><span>缘 YUAN</span><p>山河有信，万物有缘</p><a href="/">返回缘境 ↑</a></footer>
  </main>
}
