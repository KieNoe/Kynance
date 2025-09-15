export default {
  title: 'FAQ',
  search: 'Search questions',
  question: 'Was this answer helpful?',
  helpful: 'Helpful',
  unhelpful: 'Not helpful',
  thank: {
    feedback: 'Thank you for your feedback',
    good: ", we're glad we could help",
    bad: ", we'll continue to improve",
  },
  categories: {
    all: 'All',
    account: 'Account & Login', // Login, registration, password recovery
    usage: 'Features & Usage', // Feature usage
    security: 'Privacy & Security',
    troubleshooting: 'Troubleshooting', // Won't open, data not syncing
    other: 'Other', // Catch-all for users
  },
  faq: {
    0: {
      question: 'What is Kynance?',
      answer: `Kynance is a professional stock data visualization and analysis platform designed to help users conduct in-depth analysis and visualization of stock data.
I'm the creator of this website, KieNoe, hope you like it (rose)`,
    },
    1: {
      question: 'How to edit my personal information?',
      answer: `In the "Profile" page, there's an "Edit" button on the top-right corner of the "Personal Info" card
(As for why only a few fields can be edited - because KieNoe is lazy, that's why (thinking face))`,
    },
    2: {
      question: "Why some text doesn't change after switching language?",
      answer: `Kynance initializes language settings during first login. Normally, users wouldn't switch languages midway
So naturally, KieNoe didn't prioritize this edge case. Sorry about that (shrug face)`,
    },
    3: {
      question: 'How to use backtesting feature?',
      answer: `The backtesting feature helps you evaluate strategy performance historically. Usage steps:
1. Go to "Strategy Backtesting" page
2. Select or create the strategy to backtest
3. Set parameters including time range, initial capital, etc.
4. Click "Start Backtest" button
5. System will generate a report and save results to local database for detailed analysis`,
    },
    5: {
      question: 'Is Kynance an open-source project?',
      answer: `Yes, Kynance is completely open-source and free. Source code is hosted on GitHub: https://github.com/example-company/kynance
You can visit the repo to understand its architecture and contribute code`,
    },
    7: {
      question: 'Transaction data is stored locally - will this consume much memory?',
      answer: `You can clear the database by:
1. Press F12 or right-click + "Inspect" to open console
2. Open "Application" tab
3. Navigate to "Storage" > "IndexedDB"
4. Click "Delete database"
Alternatively, you can clear browser cache`,
    },
    8: {
      question: 'Forgot password?',
      answer: `Too bad, I didn't even implement login/registration restrictions
(In my last project, someone already put on the clown nose (clown face))`,
    },
    9: {
      question: 'How to contact support?',
      answer: `You can reach our support team (which is just one person) via:
1. Email: 3388155024@qq.com
2. Hotline: +86 10086 (Mon-Fri 9:00-18:00)
3. Social: Follow our official WeChat account "RT Russia Today" and message us`,
    },
    10: {
      question: 'Why does "Technical Analysis" show different data each time?',
      answer: `Because KieNoe couldn't find a proper stock API, so MockJS + data functions were used to simulate it
Okay fine, the truth is KieNoe is broke (shrugs), so all data on the site is inconsistent :(`,
    },
    11: {
      question: "Too many technical terms I don't understand",
      answer: `Honestly KieNoe doesn't understand them either, just building features as required
Input fields usually have hints, though the target users aren't beginners anyway (thinking face)`,
    },
    12: {
      question: 'What to do if pages load slowly?',
      answer: `You can try:
1. Check your network connection
2. Clear browser cache and relogin
3. Use latest Chrome or Edge browser
4. If persists, contact support with your network environment info`,
    },
    13: {
      question: 'Why does new backtest strategy keep failing?',
      answer: `There are requirement comments at the bottom of sample code that you need to follow
The sample code represents the minimum working version - if it fails, contact us with details`,
    },
    14: {
      question: 'Introduce yourself',
      answer: `I'm KieNoe, a person devoid of sophisticated tastes.`,
    },
    15: {
      question: 'Will the website be updated?',
      answer: `At least this year KieNoe will maintain it, but updates won't be frequent
Unless there are critical bug fixes or new features, the site won't change much`,
    },
  },
}
