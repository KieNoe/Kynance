// 数据集地址 https://www.kaggle.com/datasets/waqi786/e-commerce-clickstream-and-transaction-dataset/data
//     <script src="https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js"></script>
dfd.readCSV('./e-shop clothing 2008.csv').then((df) => {
  const yearSeries = df['page 1 (main category)'];

  // 直接使用Series的values（数组）
  const resultData = yearSeries.values;

  // 转换为JSON字符串
  const jsonString = JSON.stringify(resultData, null, 2); // 缩进2格美化格式

  // 下载JSON文件
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'extracted_years.json');
  link.style.visibility = 'hidden';

  link.click();
});
