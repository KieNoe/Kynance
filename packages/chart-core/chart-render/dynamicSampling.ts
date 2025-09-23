// sampling.ts

/**
 * 动态采样工具
 * 支持：固定数量采样、按比例采样、权重采样
 */
export class Sampler<T> {
  private reservoir: T[] = [];
  private seen: number = 0;

  constructor(private sampleSize: number) {}

  /**
   * 动态插入数据（适用于流式数据）
   * 使用 Reservoir Sampling 算法
   */
  add(item: T): void {
    this.seen++;
    if (this.reservoir.length < this.sampleSize) {
      this.reservoir.push(item);
    } else {
      const rand = Math.floor(Math.random() * this.seen);
      if (rand < this.sampleSize) {
        this.reservoir[rand] = item;
      }
    }
  }

  /**
   * 获取当前样本
   */
  getSamples(): T[] {
    return [...this.reservoir];
  }

  /**
   * 按比例采样（适合一次性数据集）
   */
  static sampleByRatio<U>(data: U[], ratio: number): U[] {
    return data.filter(() => Math.random() < ratio);
  }

  /**
   * 按权重采样（一次性数据集）
   * weights 和 data 长度相同
   */
  static sampleByWeight<U>(data: U[], weights: number[], sampleSize: number): U[] {
    const total = weights.reduce((a, b) => a + b, 0);
    const result: U[] = [];

    for (let i = 0; i < sampleSize; i++) {
      let r = Math.random() * total;
      for (let j = 0; j < data.length; j++) {
        r -= weights[j];
        if (r <= 0) {
          result.push(data[j]);
          break;
        }
      }
    }
    return result;
  }
}

// 使用示例
/*
import { Sampler } from './dynamicSampling.ts';

// 动态采样
const sampler = new Sampler<number>(5);
[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n => sampler.add(n));
console.log('Reservoir samples:', sampler.getSamples());

// 按比例采样
const arr = [1, 2, 3, 4, 5];
console.log('Ratio samples:', Sampler.sampleByRatio(arr, 0.4));

// 按权重采样
const weights = [0.1, 0.2, 0.7]; // 越大越容易被选中
console.log('Weight samples:', Sampler.sampleByWeight(['A', 'B', 'C'], weights, 5));
*/
