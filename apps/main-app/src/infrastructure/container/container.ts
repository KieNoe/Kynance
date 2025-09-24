import { EChartsService } from '@kynance/chart-core'
import type { IChartService } from '@kynance/types'
import { TYPES } from '@kynance/types'
import { Container } from 'inversify'
import 'reflect-metadata'

const container = new Container()

container.bind<IChartService>(TYPES.IChartService).to(EChartsService).inSingletonScope()

export { container }
