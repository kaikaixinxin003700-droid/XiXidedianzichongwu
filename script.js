// 1. 初始化数据：尝试从浏览器本地存储读取
const SAVE_KEY = 'son_pet_data';
let data = JSON.parse(localStorage.getItem(SAVE_KEY)) || {
    hunger: 70,
    mood: 70,
    lastTime: Date.now()
};

const petEmoji = document.getElementById('pet-emoji');
const petSpeech = document.getElementById('pet-speech');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');

function updateSystem() {
    const now = new Date();
    const day = now.getDay(); // 0是周日，1-6是周一至周六
    const hour = now.getHours();
    
    // 计算离线时间导致的数值下降（每过1小时下降2点）
    const hoursPassed = (Date.now() - data.lastTime) / (1000 * 60 * 60);
    data.hunger = Math.max(10, data.hunger - hoursPassed * 2);
    data.mood = Math.max(10, data.mood - hoursPassed * 2);
    data.lastTime = Date.now();

    // 判断是否为周末（周五17点后 到 周日21点前）
    const isWeekend = (day === 5 && hour >= 17) || (day === 6) || (day === 0 && hour <= 21);

    if (isWeekend) {
        // 周末模式：活跃状态
        petEmoji.innerText = "( >▽< )";
        petSpeech.innerText = "耶！你终于回来陪我啦！";
        feedBtn.disabled = false;
        playBtn.disabled = false;
    } else {
        // 周中模式：休眠/想念状态
        petEmoji.innerText = "( -.- ) zZ";
        petSpeech.innerText = "我在学校陪你一起加油，周末见！";
        feedBtn.disabled = true;
        playBtn.disabled = true;
    }

    document.getElementById('hunger').innerText = Math.floor(data.hunger);
    document.getElementById('mood').innerText = Math.floor(data.mood);
    save();
}

function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// 互动逻辑
feedBtn.onclick = () => {
    data.hunger = Math.min(100, data.hunger + 20);
    petEmoji.innerText = "( 'O' )";
    petSpeech.innerText = "真好吃！谢谢小主人！";
    setTimeout(updateSystem, 1500);
};

playBtn.onclick = () => {
    data.mood = Math.min(100, data.mood + 30);
    petEmoji.innerText = "( *^^* )";
    petSpeech.innerText = "哈哈，太好玩了！";
    setTimeout(updateSystem, 1500);
};

// 启动执行
updateSystem();
// 每分钟自动刷新一次状态
setInterval(updateSystem, 60000);
