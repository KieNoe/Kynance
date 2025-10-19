import { BehaviorPredictionService } from '@kynance/ai-models'
import { EChartsService } from '@kynance/chart-core'
import type { IBehaviorPredictor, IChartService } from '@kynance/types'
import { TYPES } from '@kynance/types'
import { Container } from 'inversify'
import 'reflect-metadata'

const container = new Container()

container.bind<IChartService>(TYPES.IChartService).to(EChartsService).inSingletonScope()
container
  .bind<IBehaviorPredictor>(TYPES.IBehaviorPredictor)
  .to(BehaviorPredictionService)
  .inSingletonScope()

export { container }
