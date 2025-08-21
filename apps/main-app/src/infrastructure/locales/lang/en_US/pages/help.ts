export default {
  title: 'Frequently Asked Questions',
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
    usage: 'Features & Operations', // Feature usage
    security: 'Privacy & Security',
    troubleshooting: 'Common Issues', // Won't open, data not syncing
    other: 'Other Questions', // Avoid users having nowhere to go
  },
  faq: {
    0: {
      question: 'What is Kynance?',
      answer:
        "Kynance is a professional-grade stock data visualization and analysis platform designed to help users conduct in-depth analysis and visualization of stock data.<br>I'm the creator of this website, KieNoe, hope you like this platform 🌹",
    },
    1: {
      question: 'How to modify my personal information?',
      answer:
        'On the "Personal Center" page, there\'s an "Edit" button in the upper right corner of the "Personal Information" card. Click it to modify your information<br>(As for why only a few fields can be changed, it\'s because KieNoe is lazy, that\'s all 🧐)',
    },
    2: {
      question: "Why some texts don't change after switching language?",
      answer:
        "Kynance initializes language settings upon first login. Normally, users wouldn't switch languages midway<br>So naturally, KieNoe wouldn't prioritize this abnormal situation. Please understand ૮ ºﻌºა",
    },
    3: {
      question: 'How to use the backtesting feature?',
      answer:
        'The backtesting feature helps you evaluate historical performance of strategies. Here\'s how to use it:<br>1. Go to the "Strategy Backtesting" page<br>2. Select or create the strategy you want to backtest<br>3. Set backtesting parameters including time range, initial capital, etc.<br>4. Click the "Start Backtest" button<br>5. The system will generate a backtest report and save results to local database. You can view detailed results and chart analysis',
    },
    5: {
      question: 'Is Kynance an open-source project?',
      answer:
        'Yes, Kynance is a completely open-source and free project. The source code is hosted on GitHub: <t-link href="https://github.com/example-company/kynance">https://github.com/example-company/kynance</t-link><br>You can visit the repository to understand its internal structure and implementation, and contribute code to the project',
    },
    7: {
      question: 'Will transaction data automatically stored in local database take up much memory?',
      answer:
        'You can clear the database by following these steps:<br>1. Press F12 or right-click + "Inspect" to open console<br>2. Open "Application"<br>3. Open "IndexDB" under "Storage" on the left<br>4. Click "Delete Database"<br>Alternatively, you can use browser\'s clear cache function',
    },
    8: {
      question: 'What if I forgot my password?',
      answer:
        "Too bad, I didn't even set up login/registration restrictions<br>(In the previous project, a clown already put on a red nose 🤡)",
    },
    9: {
      question: 'How to contact customer service?',
      answer:
        'You can reach our customer service team (actually just one person) through:<br>1. Email: Send to 3388155024@qq.com<br>2. Hotline: +86 10086 (Working hours: Mon-Fri 9:00-18:00)<br>3. Social media: Follow our official WeChat account "RT今日俄罗斯" and leave a message (',
    },
    10: {
      question: 'Why does data on the "Technical Analysis" page change every time?',
      answer:
        "Because KieNoe couldn't find a suitable stock API, so MockJS + data functions were used to simulate an API<br>Well, truth is KieNoe is broke（；´д｀）ゞ, so all data on this website is inconsistent :(",
    },
    11: {
      question: "There are many professional terms I don't understand",
      answer:
        "Actually KieNoe doesn't understand them either, KieNoe just builds features based on requirements<br>Generally input fields have annotations, but the target users of this website aren't beginners anyway 🤔",
    },
    12: {
      question: 'What to do if pages load slowly?',
      answer:
        'You can try:<br>1. Check your network connection<br>2. Clear browser cache and log in again<br>3. Use latest version of Chrome or Edge<br>4. If still unresolved, contact technical support and provide your network environment information',
    },
    13: {
      question: 'Why does the strategy in new backtest page always report errors?',
      answer:
        "There are requirement comments at the bottom of example code. You need to write corresponding code according to requirements<br>The example code is the minimum requirement version that passed tests. If it's the example code reporting errors, contact us and provide relevant information",
    },
    14: {
      question: 'Introduce yourself',
      answer: "I'm KieNoe, a person who has abandoned sophisticated tastes.",
    },
    15: {
      question: 'Will the website continue to update?',
      answer:
        "At least KieNoe will maintain this website this year, but updates won't be frequent<br>Unless there are major bug fixes or new feature development, the website won't change much",
    },
  },
}
