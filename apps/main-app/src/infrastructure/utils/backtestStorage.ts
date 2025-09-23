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

    this.dbHelper = new IndexedDBHelper(dbName, 1, storeConfigs)
  }

  /**
   * 初始化数据库连接
   * @returns Promise 操作结果
   */
  async init(): Promise<void> {
    await this.dbHelper.open()
  }

  /**
   * 保存回测记录
   * @param record 回测记录
   * @returns Promise 保存的记录（包含ID）
   */
  async saveBacktestRecord(record: BacktestRecord): Promise<BacktestRecord> {
    if (!record.date) {
      record.date = new Date().toLocaleString('zh-CN')
    }

    const savedRecord = await this.dbHelper.add<BacktestRecord>(this.STORE_NAME, record)
    return savedRecord
  }

  /**
   * 获取所有回测记录
   * @returns Promise 回测记录列表
   */
  async getAllBacktestRecords(): Promise<BacktestRecord[]> {
    return await this.dbHelper.getAll<BacktestRecord>(this.STORE_NAME)
  }

  /**
   * 根据ID获取回测记录
   * @param id 记录ID
   * @returns Promise 回测记录
   */
  async getBacktestRecordById(id: number): Promise<BacktestRecord | undefined> {
    return await this.dbHelper.getByKey<BacktestRecord>(this.STORE_NAME, id)
  }

  /**
   * 根据策略名称获取回测记录
   * @param strategy 策略名称
   * @returns Promise 回测记录列表
   */
  async getBacktestRecordsByStrategy(strategy: string): Promise<BacktestRecord[]> {
    return await this.dbHelper.getAllByIndex<BacktestRecord>(this.STORE_NAME, 'strategy', strategy)
  }

  /**
   * 根据股票代码获取回测记录
   * @param symbol 股票代码
   * @returns Promise 回测记录列表
   */
  async getBacktestRecordsBySymbol(symbol: string): Promise<BacktestRecord[]> {
    return await this.dbHelper.getAllByIndex<BacktestRecord>(this.STORE_NAME, 'symbol', symbol)
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

    return await this.dbHelper.update<BacktestRecord>(this.STORE_NAME, record)
  }

  /**
   * 删除回测记录
   * @param id 记录ID
   * @returns Promise 操作结果
   */
  async deleteBacktestRecord(id: number): Promise<void> {
    await this.dbHelper.delete(this.STORE_NAME, id)
  }

  /**
   * 清空所有回测记录
   * @returns Promise 操作结果
   */
  async clearAllBacktestRecords(): Promise<void> {
    await this.dbHelper.clear(this.STORE_NAME)
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    this.dbHelper.close()
  }
}

export const backtestStorage = new BacktestStorage()
