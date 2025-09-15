import { reactive } from 'vue'

export const CATEGORIES = reactive([
  { value: 'all', label: '全部' },
  { value: 'account', label: '账户与登录' },
  { value: 'usage', label: '功能与操作' },
  { value: 'security', label: '隐私与安全' },
  { value: 'troubleshooting', label: '常见故障排查' },
  { value: 'other', label: '其他问题' },
])

export const FAQ_DATA = reactive([
  {
    id: '0',
    question: 'Kynance是什么？',
    answer: `Kynance 是一个专业级股票数据可视化分析平台，旨在帮助用户进行股票数据的深入分析和可视化。
我是网站的作者，KieNoe，希望你喜欢这个平台（玫瑰）`,
    category: 'other',
    views: 1250,
  },
  {
    id: '1',
    question: '如何修改我的个人信息？',
    answer: `在"个人中心"页面里，"个人信息"卡片的右上角有"编辑"按钮，点击即可修改个人信息
(至于为什么只能改几个，因为KieNoe很懒，就是这样（思考脸）)`,
    category: 'account',
    views: 1250,
  },
  {
    id: '2',
    question: '为什么切换语言后有的文字没有改变？',
    answer: `Kynance会在第一次登录时初始化语言设置，正常来说，用户是不会半途切换语言的
所以，KieNoe也自然不会优先考虑这种非正常情况，请见谅（无奈脸）`,
    category: 'usage',
    views: 986,
  },
  {
    id: '3',
    question: '如何使用回测功能？',
    answer: `回测功能可以帮助您评估策略的历史表现，使用方法如下：
1. 进入"策略回测"页面
2. 选择或创建您要回测的策略
3. 设置回测参数，包括回测时间范围、初始资金等
4. 点击"开始回测"按钮
5. 系统会生成回测报告并将结果存入本地数据库，您可以查看详细的回测结果和图表分析`,
    category: 'usage',
    views: 2340,
  },
  {
    id: '5',
    question: 'Kynance是开源项目吗？',
    answer: `是的，Kynance是一个完全开源免费的项目，源代码托管在GitHub上：https://github.com/example-company/kynance
您可以访问该仓库，了解其内部结构和实现原理，并为项目贡献代码`,
    category: 'other',
    views: 3210,
  },
  {
    id: '7',
    question: '交易数据会自动存储到本地数据库里，这样会不会占用很多内存？',
    answer: `您可以按照以下操作清空数据库：
1.按下F12 或者 右键 + "检查" 打开控制台
2.打开"应用"
3.打开左侧"存储"的"IndexDB"
4.点击"删除数据库"
当然，您也可以使用浏览器的清空缓存`,
    category: 'security',
    views: 1420,
  },
  {
    id: '8',
    question: '忘记密码怎么办？',
    answer: `凉拌，我压根就没设置登录/注册限制
(在上一个项目里，有个小丑已经戴上红鼻子了（小丑脸）)`,
    category: 'account',
    views: 4560,
  },
  {
    id: '9',
    question: '如何联系客服？',
    answer: `您可以通过以下方式联系我们的客服团队(其实就一个人)：
1. 电子邮件：发送邮件至 3388155024@qq.com
2. 电话热线：+86 10086（工作时间：周一至周五 9:00-18:00）
3. 社交媒体：关注我们的官方微信公众号"RT今日俄罗斯"并留言`,
    category: 'other',
    views: 2890,
  },
  {
    id: '10',
    question: '为什么"技术分析"页面的数据每次都不一样？',
    answer: `因为KieNoe实在是找不到合适的股票API，所以就用MockJS+数据函数模拟了API
好吧，其实就是KieNoe没钱（无奈耸肩），所以网站的所有数据都是前后不一的 :(`,
    category: 'usage',
    views: 1680,
  },
  {
    id: '11',
    question: '有好多专业术语看不懂',
    answer: `其实KieNoe也不懂，KieNoe只是根据需求做功能
一般输入框都是有注释的，不过网站的目标用户也不是小白就是了（思考脸）`,
    category: 'usage',
    views: 3120,
  },
  {
    id: '12',
    question: '页面加载很慢怎么办？',
    answer: `您可以尝试以下方法：
1. 检查您的网络连接
2. 清理浏览器缓存并重新登录
3. 建议使用最新版的 Chrome 或 Edge 浏览器
4. 如果仍未解决，请联系技术支持，提供您的网络环境信息`,
    category: 'troubleshooting',
    views: 890,
  },
  {
    id: '13',
    question: '为什么新建回测页面的策略总是报错？',
    answer: `在示例代码的底部有要求注释，您需要根据要求编写相应代码
示例代码是通过测试的最低要求版本，如果是示例代码的报错，请联系我们并提供相关信息`,
    category: 'troubleshooting',
    views: 2010,
  },
  {
    id: '14',
    question: '介绍一下你自己',
    answer: `我是KieNoe，一个脱离了高级趣味的人。`,
    category: 'other',
    views: 1740,
  },
  {
    id: '15',
    question: '网站还会更新吗？',
    answer: `至少今年KieNoe会一直维护这个网站，但不会频繁更新
除非有重大Bug修复或者新功能开发，否则网站不会有太大的变化`,
    category: 'other',
    views: 1320,
  },
])
