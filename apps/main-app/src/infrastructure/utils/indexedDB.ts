/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IndexedDB 工具类
 * 提供对 IndexedDB 数据库的常用操作封装
 */

// 使用实例
// 创建 IndexedDB 工具类实例
// const dbHelper = new IndexedDBHelper('myDatabase', 1, [
//   {
//     name: 'users',
//     keyPath: 'id',
//     indexes: [
//       { name: 'name', keyPath: 'name' },
//       { name: 'email', keyPath: 'email', unique: true }
//     ]
//   }
// ]);

// 打开数据库连接
// await dbHelper.open();

// 添加数据
// await dbHelper.add('users', { id: 1, name: '张三', email: 'zhangsan@example.com' });

// 查询数据
// const user = await dbHelper.getByKey('users', 1);

// 更新数据
// await dbHelper.update('users', { id: 1, name: '张三', email: 'new-email@example.com' });

// 关闭连接
// dbHelper.close();

import { PageQuery, StoreConfig } from '@kynance/types'

/**
 * 获取浏览器支持的 IndexedDB 对象
 */
function getIndexedDB(): IDBFactory {
  return (
    window.indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB
  )
}

/**
 * 打开数据库
 * @param dbName 数据库名称
 * @param version 数据库版本号
 * @param storeConfigs 存储对象配置数组，用于数据库升级时创建存储对象
 * @returns Promise 包含数据库实例
 */
export function openDB(
  dbName: string,
  version: number = 1,
  storeConfigs?: StoreConfig[],
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const indexedDB = getIndexedDB()

    if (!indexedDB) {
      reject(new Error('您的浏览器不支持 IndexedDB'))
      return
    }

    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version)

    // 数据库打开成功回调
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    // 数据库打开失败的回调
    request.onerror = () => {
      reject(new Error('数据库打开失败'))
    }

    // 数据库有更新时候的回调
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // 如果提供了存储对象配置，则创建存储对象
      if (storeConfigs && storeConfigs.length > 0) {
        storeConfigs.forEach((config) => {
          // 如果存储对象已存在，则删除
          if (db.objectStoreNames.contains(config.name)) {
            db.deleteObjectStore(config.name)
          }

          // 创建存储对象
          const objectStore = db.createObjectStore(config.name, {
            keyPath: config.keyPath,
            autoIncrement: config.autoIncrement || false,
          })

          // 创建索引
          if (config.indexes && config.indexes.length > 0) {
            config.indexes.forEach((indexConfig) => {
              objectStore.createIndex(indexConfig.name, indexConfig.keyPath, {
                unique: indexConfig.unique || false,
              })
            })
          }
        })
      } else {
        // 默认创建 signalChat 存储对象（兼容旧版本）
        if (!db.objectStoreNames.contains('signalChat')) {
          const objectStore = db.createObjectStore('signalChat', {
            keyPath: 'sequenceId',
          })

          objectStore.createIndex('link', 'link', { unique: false })
          objectStore.createIndex('sequenceId', 'sequenceId', { unique: false })
          objectStore.createIndex('messageType', 'messageType', { unique: false })
        }
      }
    }
  })
}

/**
 * 新增数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param data 要添加的数据
 * @returns Promise 操作结果
 */
export function addData<T>(db: IDBDatabase, storeName: string, data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => {
        resolve(data)
      }

      request.onerror = () => {
        reject(new Error('数据写入失败'))
      }

      // 事务完成监听
      transaction.oncomplete = () => {}

      transaction.onerror = () => {
        reject(new Error('事务错误'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 批量添加数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param dataList 数据列表
 * @returns Promise 操作结果
 */
export function addBatchData<T>(db: IDBDatabase, storeName: string, dataList: T[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      if (!dataList || dataList.length === 0) {
        resolve([])
        return
      }

      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      let completed = 0
      const errors: Error[] = []

      dataList.forEach((data) => {
        const request = store.add(data)

        request.onsuccess = () => {
          completed++
          if (completed === dataList.length) {
            if (errors.length > 0) {
              reject(new Error(`批量添加数据部分失败: ${errors.length}个错误`))
            } else {
              resolve(dataList)
            }
          }
        }

        request.onerror = () => {
          errors.push(new Error('批量添加数据项失败'))
          completed++
          if (completed === dataList.length) {
            reject(new Error(`批量添加数据部分失败: ${errors.length}个错误`))
          }
        }
      })

      transaction.onerror = () => {
        reject(new Error('批量添加事务错误'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过主键读取数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param key 主键值
 * @returns Promise 查询结果
 */
export function getDataByKey<T>(
  db: IDBDatabase,
  storeName: string,
  key: string | number,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result as T)
      }

      request.onerror = () => {
        reject(new Error('通过主键查询失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取存储对象中的所有数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @returns Promise 查询结果列表
 */
export function getAllData<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result as T[])
      }

      request.onerror = () => {
        reject(new Error('获取所有数据失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过游标读取数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @returns Promise 查询结果列表
 */
export function cursorGetData<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const list: T[] = []
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.openCursor()

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue
        if (cursor) {
          list.push(cursor.value as T)
          cursor.continue()
        } else {
          resolve(list)
        }
      }

      request.onerror = () => {
        reject(new Error('游标读取失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过索引读取数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param indexName 索引名称
 * @param indexValue 索引值
 * @returns Promise 查询结果
 */
export function getDataByIndex<T>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string | number,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.get(indexValue)

      request.onsuccess = () => {
        resolve(request.result as T)
      }

      request.onerror = () => {
        reject(new Error('通过索引查询失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过索引获取所有匹配的数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param indexName 索引名称
 * @param indexValue 索引值
 * @returns Promise 查询结果列表
 */
export function getAllDataByIndex<T>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string | number,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(indexValue)

      request.onsuccess = () => {
        resolve(request.result as T[])
      }

      request.onerror = () => {
        reject(new Error('通过索引获取所有数据失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过索引和游标查询记录
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param indexName 索引名称
 * @param indexValue 索引值
 * @returns Promise 查询结果列表
 */
export function cursorGetDataByIndex<T>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string | number,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const list: T[] = []
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.openCursor(IDBKeyRange.only(indexValue))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue
        if (cursor) {
          list.push(cursor.value as T)
          cursor.continue()
        } else {
          resolve(list)
        }
      }

      request.onerror = () => {
        reject(new Error('索引游标读取失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过索引和游标分页查询记录
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param indexName 索引名称
 * @param indexValue 索引值
 * @param pageQuery 分页查询参数
 * @returns Promise 查询结果列表
 */
export function cursorGetDataByIndexAndPage<T>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string | number,
  pageQuery: PageQuery,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const { page, pageSize } = pageQuery
      const list: T[] = []
      let counter = 0
      let advanced = true

      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.openCursor(IDBKeyRange.only(indexValue))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue

        // 跳过前面的记录，实现分页
        if (page > 1 && advanced) {
          advanced = false
          cursor.advance((page - 1) * pageSize)
          return
        }

        if (cursor) {
          list.push(cursor.value as T)
          counter++

          if (counter < pageSize) {
            cursor.continue()
          } else {
            resolve(list)
          }
        } else {
          resolve(list)
        }
      }

      request.onerror = () => {
        reject(new Error('分页查询失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 更新数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param data 要更新的数据
 * @returns Promise 操作结果
 */
export function updateData<T>(db: IDBDatabase, storeName: string, data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => {
        resolve(data)
      }

      request.onerror = () => {
        reject(new Error('数据更新失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过主键删除数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param key 主键值
 * @returns Promise 操作结果
 */
export function deleteData(
  db: IDBDatabase,
  storeName: string,
  key: string | number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('数据删除失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 通过索引和游标删除指定的数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @param indexName 索引名称
 * @param indexValue 索引值
 * @returns Promise 操作结果
 */
export function deleteDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string | number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let deleteCount = 1
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.openCursor(IDBKeyRange.only(indexValue))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue

        if (cursor) {
          const deleteRequest = cursor.delete()
          deleteCount++

          deleteRequest.onsuccess = () => {}

          deleteRequest.onerror = () => {}

          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => {
        reject(new Error('索引游标删除失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 清空存储对象中的所有数据
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @returns Promise 操作结果
 */
export function clearStore(db: IDBDatabase, storeName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('清空存储对象失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取存储对象中的记录数量
 * @param db 数据库实例
 * @param storeName 存储对象名称
 * @returns Promise 记录数量
 */
export function countRecords(db: IDBDatabase, storeName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error('获取记录数量失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 关闭数据库
 * @param db 数据库实例
 */
export function closeDB(db: IDBDatabase): void {
  if (db) {
    db.close()
  }
}

/**
 * 删除数据库
 * @param dbName 数据库名称
 * @returns Promise 操作结果
 */
export function deleteDatabase(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const indexedDB = getIndexedDB()

    if (!indexedDB) {
      reject(new Error('您的浏览器不支持 IndexedDB'))
      return
    }

    const request = indexedDB.deleteDatabase(dbName)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(new Error(`删除数据库 ${dbName} 失败`))
    }
  })
}

/**
 * 检查数据库是否存在
 * @param dbName 数据库名称
 * @returns Promise 是否存在
 */
export function checkDatabaseExists(dbName: string): Promise<boolean> {
  return new Promise((resolve) => {
    const indexedDB = getIndexedDB()

    if (!indexedDB) {
      resolve(false)
      return
    }

    // 尝试打开数据库，不指定版本号，如果存在则会打开成功
    const request = indexedDB.open(dbName)
    let exists = true

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.close()
      resolve(exists)
    }

    request.onupgradeneeded = () => {
      // 如果触发升级事件，说明数据库不存在
      exists = false
    }

    request.onerror = () => {
      resolve(false)
    }
  })
}

/**
 * 创建 IndexedDB 工具类实例
 * 提供更面向对象的使用方式
 */
export class IndexedDBHelper {
  private db: IDBDatabase | null = null
  private dbName: string
  private version: number
  private storeConfigs: StoreConfig[]

  /**
   * 构造函数
   * @param dbName 数据库名称
   * @param version 数据库版本
   * @param storeConfigs 存储对象配置
   */
  constructor(dbName: string, version: number = 1, storeConfigs: StoreConfig[] = []) {
    this.dbName = dbName
    this.version = version
    this.storeConfigs = storeConfigs
  }

  /**
   * 打开数据库连接
   * @returns Promise 数据库实例
   */
  async open(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    this.db = await openDB(this.dbName, this.version, this.storeConfigs)
    return this.db
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      closeDB(this.db)
      this.db = null
    }
  }

  /**
   * 添加数据
   * @param storeName 存储对象名称
   * @param data 数据
   * @returns Promise 操作结果
   */
  async add<T>(storeName: string, data: T): Promise<T> {
    const db = await this.ensureOpen()
    return addData<T>(db, storeName, data)
  }

  /**
   * 批量添加数据
   * @param storeName 存储对象名称
   * @param dataList 数据列表
   * @returns Promise 操作结果
   */
  async addBatch<T>(storeName: string, dataList: T[]): Promise<T[]> {
    const db = await this.ensureOpen()
    return addBatchData<T>(db, storeName, dataList)
  }

  /**
   * 通过主键获取数据
   * @param storeName 存储对象名称
   * @param key 主键值
   * @returns Promise 查询结果
   */
  async getByKey<T>(storeName: string, key: string | number): Promise<T | undefined> {
    const db = await this.ensureOpen()
    return getDataByKey<T>(db, storeName, key)
  }

  /**
   * 获取所有数据
   * @param storeName 存储对象名称
   * @returns Promise 查询结果列表
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ensureOpen()
    return getAllData<T>(db, storeName)
  }

  /**
   * 通过索引获取数据
   * @param storeName 存储对象名称
   * @param indexName 索引名称
   * @param indexValue 索引值
   * @returns Promise 查询结果
   */
  async getByIndex<T>(
    storeName: string,
    indexName: string,
    indexValue: string | number,
  ): Promise<T | undefined> {
    const db = await this.ensureOpen()
    return getDataByIndex<T>(db, storeName, indexName, indexValue)
  }

  /**
   * 通过索引获取所有匹配的数据
   * @param storeName 存储对象名称
   * @param indexName 索引名称
   * @param indexValue 索引值
   * @returns Promise 查询结果列表
   */
  async getAllByIndex<T>(
    storeName: string,
    indexName: string,
    indexValue: string | number,
  ): Promise<T[]> {
    const db = await this.ensureOpen()
    return getAllDataByIndex<T>(db, storeName, indexName, indexValue)
  }

  /**
   * 分页查询
   * @param storeName 存储对象名称
   * @param indexName 索引名称
   * @param indexValue 索引值
   * @param pageQuery 分页参数
   * @returns Promise 查询结果列表
   */
  async getByPage<T>(
    storeName: string,
    indexName: string,
    indexValue: string | number,
    pageQuery: PageQuery,
  ): Promise<T[]> {
    const db = await this.ensureOpen()
    return cursorGetDataByIndexAndPage<T>(db, storeName, indexName, indexValue, pageQuery)
  }

  /**
   * 更新数据
   * @param storeName 存储对象名称
   * @param data 数据
   * @returns Promise 操作结果
   */
  async update<T>(storeName: string, data: T): Promise<T> {
    const db = await this.ensureOpen()
    return updateData<T>(db, storeName, data)
  }

  /**
   * 删除数据
   * @param storeName 存储对象名称
   * @param key 主键值
   * @returns Promise 操作结果
   */
  async delete(storeName: string, key: string | number): Promise<void> {
    const db = await this.ensureOpen()
    return deleteData(db, storeName, key)
  }

  /**
   * 通过索引删除数据
   * @param storeName 存储对象名称
   * @param indexName 索引名称
   * @param indexValue 索引值
   * @returns Promise 操作结果
   */
  async deleteByIndex(
    storeName: string,
    indexName: string,
    indexValue: string | number,
  ): Promise<void> {
    const db = await this.ensureOpen()
    return deleteDataByIndex(db, storeName, indexName, indexValue)
  }

  /**
   * 确保数据库已打开
   * @returns Promise 数据库实例
   * @private
   */
  private async ensureOpen(): Promise<IDBDatabase> {
    if (!this.db) {
      this.db = await openDB(this.dbName, this.version, this.storeConfigs)
    }
    return this.db
  }

  /**
   * 清空存储对象
   * @param storeName 存储对象名称
   * @returns Promise 操作结果
   */
  async clear(storeName: string): Promise<void> {
    const db = await this.ensureOpen()
    return clearStore(db, storeName)
  }

  /**
   * 获取记录数量
   * @param storeName 存储对象名称
   * @returns Promise 记录数量
   */
  async count(storeName: string): Promise<number> {
    const db = await this.ensureOpen()
    return countRecords(db, storeName)
  }

  /**
   * 删除数据库
   * @returns Promise 操作结果
   */
  async deleteDatabase(): Promise<void> {
    this.close()
    return deleteDatabase(this.dbName)
  }
}
