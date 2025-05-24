const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const departments = require('../departments.json');
const Timetable = require('../models/Timetable');

dotenv.config();

(async () => {
  // ✅ MongoDB 연결
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ Connected to MongoDB');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('https://for-s.seoultech.ac.kr/html/pub/schedule.jsp', {
    waitUntil: 'networkidle2'
  });

  await page.select('#cbo_lang', 'en');
  await new Promise(resolve => setTimeout(resolve, 500));

  await page.select('#cbo_Smst', '1');
  await new Promise(resolve => setTimeout(resolve, 300));

  for (const { college, department } of departments) {
    console.log(`🔍 Fetching for: ${college} - ${department}`);

    await page.reload({ waitUntil: 'networkidle2' });
    await page.select('#cbo_lang', 'en');
    await page.select('#cbo_Smst', '1');
    await new Promise(resolve => setTimeout(resolve, 300));

    let selectedValue = null;

    if (department.startsWith('value:')) {
      selectedValue = department.replace('value:', '');
    } else {
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

    try {
      await Promise.all([
        page.click('#btn_ReportSearch'),
        page.waitForSelector('#grd_ScheduleMain tbody tr', { timeout: 10000 })
      ]);
    } catch (e) {
      console.warn(`⚠️ No data for: ${department}, skipping...`);
      continue;
    }

    const rows = await page.$$eval('#grd_ScheduleMain tbody tr', trs => {
      return trs.map(tr => {
        const tds = Array.from(tr.querySelectorAll('td'));
        return {
          subject: tds[3]?.getAttribute('title')?.trim() || '',
          time: tds[10]?.getAttribute('title')?.trim() || '',
          room: tds[19]?.getAttribute('title')?.trim() || ''
        };
      });
    });

    await Timetable.create({ college, department, lectures: rows });
    console.log(`✅ Saved: ${department}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await browser.close();
  await mongoose.disconnect();
  console.log('🏁 Scraping complete & MongoDB disconnected');
})();
