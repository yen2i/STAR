// scripts/scrapeDepartments.js
const puppeteer = require('puppeteer');
const fs = require('fs');

const TARGET_URL = 'https://for-s.seoultech.ac.kr/html/pub/schedule.jsp';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
    // 언어를 English로 설정 (언어 선택 셀렉트박스)
    await page.select('#cbo_lang', 'en');
    //await page.waitForTimeout(500); // 언어가 바뀌는 걸 기다림
    await new Promise(resolve => setTimeout(resolve, 500));

  // Select box 안의 <option> 요소 추출
  const departments = await page.evaluate(() => {
    const select = document.querySelector('#cbo_Less');
    if (!select) return [];

    const result = [];
    let currentCollege = null;

    Array.from(select.options).forEach(option => {
      const value = option.value;
      const text = option.text.trim();

      if (!value || text === '= All =') return;

      if (text.startsWith('-----')) {
        currentCollege = text.replace(/[-=]/g, '').trim();
      } else {
        result.push({
          college: currentCollege,
          department: text
        });
      }
    });

    return result;
  });

  await browser.close();

  // JSON으로 저장
  fs.writeFileSync('departments.json', JSON.stringify(departments, null, 2), 'utf-8');
  console.log('✅ Department list saved successfully → departments.json');
})();
