// 数据格式：数组的数组，例如:
// [[1,2,3,4],[1,2,4],[3],[1,2,3,2,3,4],[1,2,1,2,3,4]]
// 目标：从每个序列中抽取 (x -> y) 对，x 为单个数字（行为），y 为其下一步行为（数字）
// 输入使用 one-hot 向量，输出为 softmax 概率（4 类或根据数据自动确定类别数）

async function run() {
  console.log('🚀 开始执行程序...');

  const response = await fetch('./extracted_data.json');
  const data = await response.json();

  console.log(`📦 加载了 ${data.length} 条原始行为序列`);

  computeTransitionBaseline(data)

  // 将数据转换成 (input, label) 对并得到张量
  const tensorData = convertToTensor(data);
  const { trainInputs, trainOutputs, testInputs, testOutputs, numClasses } = tensorData;

  console.log('📐 输入张量形状:', trainInputs.shape, '输出张量形状:', trainOutputs.shape, '类别数:', numClasses);

  const model = createModel(numClasses);
  tfvis.show.modelSummary({ name: 'Model Summary' }, model);

  console.log('🏋️‍♂️ 开始训练模型...');
  const history = await trainModel(model, trainInputs, trainOutputs);

  console.log('✅ 训练完成！');
  console.log('📉 最后一个 epoch 的 loss:', history.history.loss.at(-1).toFixed(4));
  console.log('📈 最后一个 epoch 的 accuracy:', history.history.acc?.at(-1)?.toFixed(4) ?? 'N/A');

  console.log('🧪 正在评估模型...');
  const evalResult = model.evaluate(testInputs, testOutputs, { batchSize: 32 });
  // evalResult 可能是单个 tensor 或 tensor 数组 (loss, acc)
  const evalTensors = Array.isArray(evalResult) ? evalResult : [evalResult];
  const evalDatas = await Promise.all(evalTensors.map(t => t.data()));
  if (evalDatas.length >= 2) {
    console.log(`📊 测试集评估结果: loss=${evalDatas[0][0].toFixed(4)}, acc=${evalDatas[1][0].toFixed(4)}`);
  } else {
    console.log(`📊 测试集评估结果: ${evalDatas.map(a => a[0].toFixed(4)).join(', ')}`);
  }

  // 检测预测分布（前 10 个测试样本）
  const takeN = Math.min(10, testInputs.shape[0]);
  if (takeN > 0) {
    const testPred = model.predict(testInputs.slice([0, 0], [takeN, numClasses]));
    const predArray = await testPred.array();
    const avgDist = predArray.reduce((sum, p) => {
      p.forEach((v, i) => (sum[i] = (sum[i] || 0) + v));
      return sum;
    }, []);
    console.log('🔍 前' + takeN + '个样本预测平均分布:', avgDist.map(v => (v / takeN).toFixed(3)));
  }

  // 测试一个样例预测（传入行为数字，例如 1）
  const inputBehavior = 1; // <- 你可以改成任何 1..numClasses 的数
  const idx = inputBehavior - 1;
  if (idx < 0 || idx >= numClasses) {
    console.warn('❗ 示例输入超出类别范围，跳过示例预测');
  } else {
    const sampleInput = tf.oneHot(tf.tensor1d([idx], 'int32'), numClasses); // shape [1, numClasses]
    console.log('🧮 预测样例（行为）:', inputBehavior);
    const prediction = model.predict(sampleInput);
    prediction.print();
    const predictedClass = prediction.argMax(-1).dataSync()[0] + 1;
    console.log(`🧠 预测的下一步行为是: ${predictedClass}`);
  }
  await model.save('downloads://my-model');
  console.log('✅ 已保存模型');
}

function createModel(numClasses) {
  console.log('🧩 正在创建模型（Dense one-hot 输入）...');
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [numClasses],
    units: 32,
    activation: 'relu'
  }));

  model.add(tf.layers.dropout({ rate: 0.2 }));

  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));

  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax'
  }));

model.compile({
  optimizer: tf.train.adam(0.0005),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

  console.log('✅ 模型创建完成');
  return model;
}

function convertToTensor(data, options = {}) {
  const {
    trainSplit = 0.8,
    shuffle = true,
    providedNumClasses = null
  } = options;

  console.log('🔧 开始将序列数据转换为 (x->y) 对...');

  if (!Array.isArray(data)) throw new Error('数据格式错误：期待数组');

  const inputs = [];
  const labels = [];
  const flatValues = [];

  for (let seq of data) {
    if (!Array.isArray(seq)) continue; // 忽略非数组项
    for (let v of seq) {
      if (typeof v === 'number' && Number.isFinite(v)) flatValues.push(v);
    }
    // 从序列中提取相邻对 (a -> b)
    for (let i = 0; i < seq.length - 1; i++) {
      const a = seq[i];
      const b = seq[i + 1];
      if (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a) && Number.isFinite(b)) {
        inputs.push(a);
        labels.push(b);
      }
    }
  }

  if (inputs.length === 0) {
    throw new Error('❌ 没有从序列中提取到 (x->y) 对。请确保序列长度 >= 2。');
  }

  // 自动推断类别数（假定行为以 1..K 编号），或者使用外部提供的 numClasses
  const inferredMax = Math.max(...flatValues);
  const numClasses = providedNumClasses || inferredMax;
  if (!Number.isInteger(numClasses) || numClasses <= 0) {
    throw new Error('❌ 无法推断类别数，请在 options 中提供 providedNumClasses。');
  }

  console.log(`📊 生成了 ${inputs.length} 个训练样本，类别数=${numClasses}`);

  // 将 label/value 转为 0-based 索引
  const inputIdx = inputs.map(x => Math.round(x) - 1);
  const labelIdx = labels.map(x => Math.round(x) - 1);

  // 构建 one-hot 张量
  const inputTensor = tf.oneHot(tf.tensor1d(inputIdx, 'int32'), numClasses); // shape [N, numClasses]
  const labelTensor = tf.oneHot(tf.tensor1d(labelIdx, 'int32'), numClasses); // shape [N, numClasses]

  // 划分训练/测试集（先打包为对，再打乱/切分）
  const pairs = inputIdx.map((_, i) => ({ inIdx: inputIdx[i], labIdx: labelIdx[i] }));
  if (shuffle) {
    console.log('🃏 正在洗牌数据...');
    tf.util.shuffle(pairs);
  }
  const splitIndex = Math.floor(pairs.length * trainSplit);
  const trainPairs = pairs.slice(0, splitIndex);
  const testPairs = pairs.slice(splitIndex);

  // 从 pairs 重建 one-hot 张量（按分割重建，避免复杂的 slice 操作）
  const trainInIdx = trainPairs.map(p => p.inIdx);
  const trainLabIdx = trainPairs.map(p => p.labIdx);
  const testInIdx = testPairs.map(p => p.inIdx);
  const testLabIdx = testPairs.map(p => p.labIdx);

  const trainInputs = tf.oneHot(tf.tensor1d(trainInIdx, 'int32'), numClasses);
  const trainOutputs = tf.oneHot(tf.tensor1d(trainLabIdx, 'int32'), numClasses);
  const testInputs = tf.oneHot(tf.tensor1d(testInIdx, 'int32'), numClasses);
  const testOutputs = tf.oneHot(tf.tensor1d(testLabIdx, 'int32'), numClasses);

  console.log(`📁 数据集划分: 训练集 ${trainInIdx.length}, 测试集 ${testInIdx.length}`);
  console.log('🔢 示例样本:', `输入=${inputs[0]} -> 标签=${labels[0]}`);

  return { trainInputs, trainOutputs, testInputs, testOutputs, numClasses };
}

async function trainModel(model, inputs, labels) {
  const batchSize = 32;
  const epochs = 5;

  console.log(`📆 训练参数: batchSize=${batchSize}, epochs=${epochs}`);
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    validationSplit: 0.2,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'val_loss', 'accuracy', 'val_accuracy'],
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  });
}

// 计算转移矩阵并给出“最常见下一个动作”的基线准确率
function computeTransitionBaseline(data) {
  const counts = {}; // counts[a][b] = count
  let totalPairs = 0;
  for (const seq of data) {
    if (!Array.isArray(seq)) continue;
    for (let i = 0; i < seq.length - 1; i++) {
      const a = Math.round(seq[i]);
      const b = Math.round(seq[i+1]);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      counts[a] = counts[a] || {};
      counts[a][b] = (counts[a][b] || 0) + 1;
      totalPairs++;
    }
  }
  let correctIfPickMode = 0;
  for (const aStr of Object.keys(counts)) {
    const row = counts[aStr];
    let rowSum = 0, rowMax = 0;
    for (const bStr of Object.keys(row)) {
      rowSum += row[bStr];
      rowMax = Math.max(rowMax, row[bStr]);
    }
    correctIfPickMode += rowMax;
  }
  console.log('🧾 总样本对:', totalPairs);
  console.log('🏁 若对每个 a 始终预测最常见 b，理论上可达准确率:',
              (correctIfPickMode / totalPairs * 100).toFixed(2) + '%');
  // 输出每个 a 的分布（可选）
  //console.log(counts);
  return { totalPairs, modeCorrect: correctIfPickMode, modeAcc: correctIfPickMode/totalPairs };
}


document.addEventListener('DOMContentLoaded', run);
