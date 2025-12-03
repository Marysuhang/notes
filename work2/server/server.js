const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// 配置 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 存储投票数据
let votes = {
  option1: 0,
  option2: 0,
  option3: 0,
  option4: 0
};

// 创建HTTP服务器
const server = http.createServer(app);

// 配置Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// 中间件：允许所有跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 提供静态文件（如果public文件夹存在）
app.use(express.static(path.join(__dirname, '..', 'public')));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    votes: votes 
  });
});

// API: 获取当前票数
app.get('/api/votes', (req, res) => {
  console.log('[API] GET /api/votes');
  res.json(votes);
});

// API: 投票
app.post('/api/vote', (req, res) => {
  const { option } = req.body;
  console.log('[API] POST /api/vote:', option);
  
  if (votes[option] !== undefined) {
    votes[option]++;
    
    // 计算排名
    const ranking = calculateRanking();
    
    // 广播更新
    io.emit('voteUpdate', votes);
    io.emit('rankingUpdate', ranking);
    
    console.log('[API] 投票成功，当前票数:', votes);
    res.json({ success: true, votes, ranking });
  } else {
    console.log('[API] 无效选项:', option);
    res.status(400).json({ error: '无效的选项' });
  }
});

// API: 重置投票
app.post('/api/reset', (req, res) => {
  console.log('[API] POST /api/reset');
  
  votes = {
    option1: 0,
    option2: 0,
    option3: 0,
    option4: 0
  };
  
  const ranking = calculateRanking();
  
  // 广播重置
  io.emit('voteUpdate', votes);
  io.emit('rankingUpdate', ranking);
  
  res.json({ success: true, votes, ranking });
});

// 计算排名函数
function calculateRanking() {
  return Object.entries(votes)
    .sort(([, a], [, b]) => b - a)
    .map(([optionId, count], index) => ({
      rank: index + 1,
      optionId,
      count
    }));
}

// WebSocket连接处理
io.on('connection', (socket) => {
  console.log('[WebSocket] 用户连接:', socket.id);
  
  // 发送当前投票数据
  socket.emit('currentVotes', votes);
  socket.emit('rankingUpdate', calculateRanking());
  
  // 接收投票
  socket.on('vote', (option) => {
    console.log('[WebSocket] 收到投票:', option);
    
    if (votes[option] !== undefined) {
      votes[option]++;
      
      // 计算排名
      const ranking = calculateRanking();
      
      // 广播给所有客户端
      io.emit('voteUpdate', votes);
      io.emit('rankingUpdate', ranking);
      
      console.log('[WebSocket] 投票成功，当前票数:', votes);
    }
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    console.log('[WebSocket] 用户断开:', socket.id);
  });
});

// 默认路由（可选）
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>实时投票系统</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .status { background: #4CAF50; color: white; padding: 10px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>实时投票系统服务器</h1>
        <div class="status">✅ 服务器运行正常</div>
        <p>端口: 8080</p>
        <p>测试接口:</p>
        <ul>
            <li><a href="/api/votes" target="_blank">/api/votes</a> - 获取当前票数</li>
            <li><a href="/health" target="_blank">/health</a> - 健康检查</li>
        </ul>
        <p>前端页面: <a href="/index.html" target="_blank">/index.html</a></p>
    </body>
    </html>
  `);
});

// 错误处理
server.on('error', (err) => {
  console.error('服务器错误:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 8080 被占用，请关闭占用该端口的程序`);
  }
});

// 启动服务器
const PORT = 8080;
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('✅ 实时投票系统服务器启动成功！');
  console.log(`📡 本地访问: http://localhost:${PORT}`);
  console.log(`📡 网络访问: http://你的IP地址:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('\n可用接口:');
  console.log(`  GET  /api/votes     - 获取当前票数`);
  console.log(`  POST /api/vote      - 投票`);
  console.log(`  POST /api/reset     - 重置投票`);
  console.log(`  GET  /health        - 健康检查`);
  console.log(`  GET  /              - 服务器状态`);
  console.log(`  GET  /index.html    - 投票页面`);
  console.log('\n💡 提示: 打开浏览器访问 http://localhost:8080');
});