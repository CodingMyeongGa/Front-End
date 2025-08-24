// 실행: npm run test:date
import { getFormattedDate } from './date.js'

console.assert(getFormattedDate(new Date('2025-01-02')) === '2025년 1월 2일 (목)')
// console.assert(getFormattedDate(new Date('2024-02-29')) === '2024년 2월 29일 (목)')
console.log('[date.test] OK')