const puppeteer = require('puppeteer');
const fs = require('fs');
const departments = require('../departments.json');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('https://for-s.seoultech.ac.kr/html/pub/schedule.jsp', {
    waitUntil: 'networkidle2'
  });

  // 언어를 영어로 설정
  await page.select('#cbo_lang', 'en');
  await new Promise(resolve => setTimeout(resolve, 500));

  // 1학기 선택
  await page.select('#cbo_Smst', '1');
  await new Promise(resolve => setTimeout(resolve, 300));

  const timetableData = [];

  for (const { college, department } of departments) {
    console.log(`🔍 Fetching for: ${college} - ${department}`);

    await page.reload({ waitUntil: 'networkidle2' });
    await page.select('#cbo_lang', 'en');
    await page.select('#cbo_Smst', '1');
    await new Promise(resolve => setTimeout(resolve, 300));

    let selectedValue = null;

    // department가 "value:"로 시작하면 직접 지정
    if (department.startsWith('value:')) {
      selectedValue = department.replace('value:', '');
    } else {
      // 🔍 <option>에서 text 기반 매칭
      const departmentOptions = await page.$$eval('#cbo_Less option', options =>
        options.map(o => ({ value: o.value, text: o.textContent.trim() }))
      );
      const matched = departmentOptions.find(opt => opt.text === department);
      if (!matched) {
        console.warn(`⚠️ Department not found: ${department}`);
        continue;
      }
      selectedValue = matched.value;
    }

    await page.select('#cbo_Less', selectedValue);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 조회 버튼 클릭 및 테이블 대기
    try {
      await Promise.all([
        page.click('#btn_ReportSearch'),
        page.waitForSelector('#grd_ScheduleMain tbody tr', { timeout: 10000 })
      ]);
    } catch (e) {
      console.warn(`⚠️ No data for: ${department}, skipping...`);
      continue;
    }

    // 데이터 추출 (열 번호 확인 필요시 수정)
    const rows = await page.$$eval('#grd_ScheduleMain tbody tr', trs => {
      return trs.map(tr => {
        const tds = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
        return {
          subject: tds[2],   // Course Name
          time: tds[9],      // Class Hours
          room: tds[18]      // Classroom
        };
      });
    });

    timetableData.push({ college, department, lectures: rows });
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await browser.close();
  fs.writeFileSync('timetables.json', JSON.stringify(timetableData, null, 2), 'utf-8');
  console.log('✅ Timetable scraping completed. Data saved to timetables.json');
})();
