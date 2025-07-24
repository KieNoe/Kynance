import { marketStates, marketEvents } from './types.ts';

// 全局市场状态跟踪
let marketStateTracker = {
  currentState: 'NORMAL',
  remainingDays: getRandomDuration('NORMAL'),
  previousClose: 500,
  trend: 0, // 当前市场趋势 (-1 下跌, 0 中性, 1 上涨)
};

/**
 * 更新市场状态
 */
export function updateMarketState() {
  marketStateTracker.remainingDays--;

  if (marketStateTracker.remainingDays <= 0) {
    // 决定下一个状态 (考虑当前趋势)
    const rand = Math.random();
    let newState;

    if (marketStateTracker.trend > 0.3) {
      // 上涨趋势更可能保持或转为RALLY
      newState = rand < 0.6 ? 'RALLY' : rand < 0.8 ? 'NORMAL' : rand < 0.95 ? 'VOLATILE' : 'CRASH';
    } else if (marketStateTracker.trend < -0.3) {
      // 下跌趋势更可能保持或转为CRASH
      newState = rand < 0.5 ? 'CRASH' : rand < 0.8 ? 'VOLATILE' : rand < 0.95 ? 'NORMAL' : 'RALLY';
    } else {
      // 中性趋势
      newState = rand < 0.7 ? 'NORMAL' : rand < 0.9 ? 'VOLATILE' : rand < 0.95 ? 'CRASH' : 'RALLY';
    }

    marketStateTracker.currentState = newState;
    marketStateTracker.remainingDays = getRandomDuration(newState);
  }
}

/**
 * 获取随机事件
 * @returns {Object} 市场事件
 */
export function getRandomEvent() {
  const rand = Math.random();
  let cumulativeProb = 0;

  for (const event of marketEvents) {
    cumulativeProb += event.probability;
    if (rand <= cumulativeProb) {
      return event;
    }
  }

  return marketEvents[0]; // 默认返回无事件
}

/**
 * 获取状态持续时间
 * @param {string} state - 市场状态
 * @returns {number} 持续时间(天)
 */
export function getRandomDuration(state) {
  const [min, max] = marketStates[state].duration;
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function getMarketStateTracker() {
  return marketStateTracker;
}

export function resetMarketStateTracker(options) {
  marketStateTracker = {
    currentState: 'NORMAL',
    remainingDays: getRandomDuration('NORMAL'),
    previousClose: options.basePrice || 500,
    trend: 0,
  };
}
