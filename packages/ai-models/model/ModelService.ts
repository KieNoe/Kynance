import type { IBehaviorPredictor } from '@kynance/types';
import * as tf from '@tensorflow/tfjs';
import { injectable } from 'inversify';
import 'reflect-metadata';

interface IPredictionResult {
  currentAction: number;
  predictedAction: number;
  probabilities: number[];
  confidence: number;
}

@injectable()
export class BehaviorPredictionService implements IBehaviorPredictor {
  private model: tf.LayersModel | null = null;
  private numClasses: number = 0;

  /**
   * 初始化并加载模型
   * @param modelPath 模型路径 (默认使用本地下载的模型)
   */
  public async initialize(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(`https://api.kynance.cn:3000/api/model`);
      this.numClasses = 4;
      console.log(`✅ 行为预测模型加载成功，类别数: ${this.numClasses}`);
    } catch (error) {
      console.error('❌ 模型加载失败:', error);
      throw new Error('Failed to load behavior prediction model');
    }
  }

  /**
   * 预测下一个行为
   * @param currentAction 当前行为 (1-based)
   * @returns 预测结果
   */
  public async predictNextAction(currentAction: number): Promise<IPredictionResult> {
    this.validateInput(currentAction);

    // 准备输入张量
    const inputTensor = tf.tidy(() => {
      return tf.oneHot(tf.tensor1d([currentAction - 1], 'int32'), this.numClasses);
    });

    try {
      // 进行预测
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const predictedClass = tf.tidy(() => prediction.argMax(-1).dataSync()[0] + 1);
      const probabilities = await prediction.array();

      return {
        currentAction,
        predictedAction: predictedClass,
        probabilities: probabilities[0],
        confidence: Math.max(...probabilities[0]),
      };
    } finally {
      // 清理内存
      inputTensor.dispose();
    }
  }

  /**
   * 批量预测
   * @param actions 行为序列
   * @returns 预测结果数组
   */
  public async predictSequence(actions: number[]): Promise<IPredictionResult[]> {
    const results: IPredictionResult[] = [];
    for (const action of actions) {
      results.push(await this.predictNextAction(action));
    }
    return results;
  }

  /**
   * 获取模型信息
   */
  public getModelInfo() {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    return {
      inputShape: this.model.layers[0].inputSpec[0].shape,
      numClasses: this.numClasses,
      layers: this.model.layers.map((layer) => ({
        name: layer.name,
        config: layer.getConfig(),
      })),
    };
  }

  /**
   * 验证输入是否有效
   * @param action 输入行为
   */
  private validateInput(action: number): void {
    if (!Number.isInteger(action) || action < 1 || action > this.numClasses) {
      throw new Error(`Invalid input: action must be integer between 1 and ${this.numClasses}`);
    }
  }

  /**
   * 释放模型资源
   */
  public dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}
