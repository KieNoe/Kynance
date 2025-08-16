// apps/main-app/src/infrastructure/utils/backtestStorage.ts
import { BacktestRecord } from '@kynance/types'

import { IndexedDBHelper } from './indexedDB'

/**
 * 回测数据存储类
 * 提供回测记录的存储、查询和管理功能
 */
export class BacktestStorage {
  private dbHelper: IndexedDBHelper
  private readonly STORE_NAME = 'backtestRecords'

  /**
   * 构造函数
   * @param dbName 数据库名称，默认为 'kynanceBacktest'
   */
  constructor(dbName: string = 'kynanceBacktest') {
    // 定义存储对象配置
    const storeConfigs = [
      {
        name: this.STORE_NAME,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
          { name: 'date', keyPath: 'date' },
          { name: 'strategy', keyPath: 'backtestConfig.strategy' },
          { name: 'symbol', keyPath: 'backtestConfig.symbol' },
        ],
      },
    ]

    // 创建 IndexedDB 工具类实例
    this.dbHelper = new IndexedDBHelper(dbName, 1, storeConfigs)
  }

  /**
   * 初始化数据库连接
   * @returns Promise 操作结果
   */
  async init(): Promise<void> {
    await this.dbHelper.open()
    console.log('回测数据库初始化成功')
  }

  /**
   * 保存回测记录
   * @param record 回测记录
   * @returns Promise 保存的记录（包含ID）
   */
  async saveBacktestRecord(record: BacktestRecord): Promise<BacktestRecord> {
    // 如果没有指定日期，则使用当前时间
    if (!record.date) {
      record.date = new Date().toLocaleString('zh-CN')
    }

    try {
      const savedRecord = await this.dbHelper.add<BacktestRecord>(this.STORE_NAME, record)
      console.log('回测记录保存成功', savedRecord)
      return savedRecord
    } catch (error) {
      console.error('保存回测记录失败', error)
      throw error
    }
  }

  /**
   * 获取所有回测记录
   * @returns Promise 回测记录列表
   */
  async getAllBacktestRecords(): Promise<BacktestRecord[]> {
    try {
      return await this.dbHelper.getAll<BacktestRecord>(this.STORE_NAME)
    } catch (error) {
      console.error('获取所有回测记录失败', error)
      throw error
    }
  }

  /**
   * 根据ID获取回测记录
   * @param id 记录ID
   * @returns Promise 回测记录
   */
  async getBacktestRecordById(id: number): Promise<BacktestRecord | undefined> {
    try {
      return await this.dbHelper.getByKey<BacktestRecord>(this.STORE_NAME, id)
    } catch (error) {
      console.error(`获取ID为${id}的回测记录失败`, error)
      throw error
    }
  }

  /**
   * 根据策略名称获取回测记录
   * @param strategy 策略名称
   * @returns Promise 回测记录列表
   */
  async getBacktestRecordsByStrategy(strategy: string): Promise<BacktestRecord[]> {
    try {
      return await this.dbHelper.getAllByIndex<BacktestRecord>(
        this.STORE_NAME,
        'strategy',
        strategy,
      )
    } catch (error) {
      console.error(`获取策略为${strategy}的回测记录失败`, error)
      throw error
    }
  }

  /**
   * 根据股票代码获取回测记录
   * @param symbol 股票代码
   * @returns Promise 回测记录列表
   */
  async getBacktestRecordsBySymbol(symbol: string): Promise<BacktestRecord[]> {
    try {
      return await this.dbHelper.getAllByIndex<BacktestRecord>(this.STORE_NAME, 'symbol', symbol)
    } catch (error) {
      console.error(`获取股票代码为${symbol}的回测记录失败`, error)
      throw error
    }
  }

  /**
   * 更新回测记录
   * @param record 回测记录
   * @returns Promise 更新后的记录
   */
  async updateBacktestRecord(record: BacktestRecord): Promise<BacktestRecord> {
    if (!record.id) {
      throw new Error('更新回测记录需要指定ID')
    }

    try {
      return await this.dbHelper.update<BacktestRecord>(this.STORE_NAME, record)
    } catch (error) {
      console.error(`更新ID为${record.id}的回测记录失败`, error)
      throw error
    }
  }

  /**
   * 删除回测记录
   * @param id 记录ID
   * @returns Promise 操作结果
   */
  async deleteBacktestRecord(id: number): Promise<void> {
    try {
      await this.dbHelper.delete(this.STORE_NAME, id)
      console.log(`ID为${id}的回测记录已删除`)
    } catch (error) {
      console.error(`删除ID为${id}的回测记录失败`, error)
      throw error
    }
  }

  /**
   * 清空所有回测记录
   * @returns Promise 操作结果
   */
  async clearAllBacktestRecords(): Promise<void> {
    try {
      await this.dbHelper.clear(this.STORE_NAME)
      console.log('所有回测记录已清空')
    } catch (error) {
      console.error('清空回测记录失败', error)
      throw error
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    this.dbHelper.close()
    console.log('回测数据库连接已关闭')
  }
}

// 导出单例实例，方便在应用中使用
export const backtestStorage = new BacktestStorage()
