# 缘 Yuan

一个以东方因缘文化为核心的 Web3 互动网站，包含钱包连接、代币持有验证、今日缘签和项目白皮书。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## Vercel 部署

1. 在 Vercel 中导入 GitHub 仓库。
2. Framework Preset 选择 **Next.js**。
3. Build Command 使用 `npm run build`。
4. 根据需要配置以下环境变量：

```text
NEXT_PUBLIC_TOKEN_CONTRACT=ERC-20合约地址
NEXT_PUBLIC_CHAIN_ID=链ID，例如 1 或 0x1
NEXT_PUBLIC_X_URL=X官方账号链接
```

未配置代币合约时抽签入口保持锁定；配置合约与网络后，系统仅允许正确持有指定 ERC-20 代币的钱包抽签。

## 页面

- `/`：项目首页与缘签体验
- `/whitepaper`：项目白皮书

## 说明

缘签内容仅用于文化娱乐和自我观照，不构成投资、医疗、法律或其他专业建议。
