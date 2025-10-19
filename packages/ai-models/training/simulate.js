function generateUserBehavior() {
  // 行为编码：1='查看商品', 2='加入购物车', 3='开始结算', 4='离开页面'
  const patterns = [
    // === 正常用户流程 ===
    [1, 2, 3, 4],                    // 基础流程：查看→加购→结算→离开
    [1, 1, 2, 3, 4],                 // 多次查看后购买
    [1, 2, 1, 2, 3, 4],              // 比较商品后购买
    [1, 2, 3, 3, 4],                 // 结算页面停留

    // === 轻度异常流程 ===
    [1, 4],                          // 只看不买
    [1, 1, 1, 4],                    // 深度浏览后离开
    [1, 2, 4],                       // 加购但未结算

    // ===重度异常流程===
    [2],                             // 直接加购（未查看商品）
    [3],                             // 直接结算（空购物车）
    [1, 3],                          // 跳过加购直接结算
    [2, 4],                          // 加购后直接离开
    [3, 4],                          // 结算后直接离开
  ];

  // 增加正常模式的权重
  const normalPatterns = patterns.slice(0, 4);
  const mildAnomalies = patterns.slice(4, 7);
  const severeAnomalies = patterns.slice(7);

  // 选择基础模式（正常模式占90%，轻微异常占6%，严重异常占4%）
  let selectedPatterns;
  const rand = Math.random();
  let isNormal = false;

  if (rand < 0.9) {
    selectedPatterns = normalPatterns;
    isNormal = true;
  } else if (rand < 0.96) {
    selectedPatterns = mildAnomalies;
  } else {
    selectedPatterns = severeAnomalies;
  }

  let basePattern = selectedPatterns[Math.floor(Math.random() * selectedPatterns.length)];

  // 只有对于异常模式，才应用模式组合和随机插入
  if (!isNormal) {
    // 降低模式组合的概率（从3%降到1.5%）
    if (Math.random() < 0.015) {
      const secondPattern = patterns[Math.floor(Math.random() * patterns.length)];
      basePattern = [...basePattern.slice(0, -1), ...secondPattern];
    }

    // 降低随机插入的概率（从4%降到2%）
    if (Math.random() < 0.02) {
      const insertIndex = Math.floor(Math.random() * basePattern.length);
      const randomOp = Math.floor(Math.random() * 4) + 1;
      basePattern.splice(insertIndex, 0, randomOp);
    }
  }

  // 对于正常模式，不进行截取，直接返回
  if (isNormal) {
    return basePattern;
  }

  // 对于异常模式，进行截取
  const maxLength = Math.min(basePattern.length, 15);
  const minLength = Math.max(3, Math.floor(maxLength * 0.6));
  const finalLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  return basePattern.slice(0, finalLength);
}

function generateMultipleUserBehaviors(count = 10, options = {}) {
  const behaviors = [];
  for (let i = 0; i < count; i++) {
    behaviors.push(generateUserBehavior());
  }
  return behaviors;
}

// 生成20000个用户行为序列并下载为JSON
console.log('\n=== 批量生成用户行为 ===');
const allSequences = generateMultipleUserBehaviors(20000);
const jsonString = JSON.stringify(allSequences, null, 2);

const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
const link = document.createElement("a");
const url = URL.createObjectURL(blob);
link.setAttribute("href", url);
link.setAttribute("download", "extracted_data.json");
link.style.visibility = 'hidden';

// link.click();
