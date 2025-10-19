export interface IBehaviorPredictor {
  initialize(): Promise<void>;
  predictNextAction(currentAction: number): Promise<IPredictionResult>;
  predictSequence(actions: number[]): Promise<IPredictionResult[]>;
  getModelInfo(): any;
  dispose(): void;
}
interface IPredictionResult {
  currentAction: number;
  predictedAction: number;
  probabilities: number[];
  confidence: number;
}
