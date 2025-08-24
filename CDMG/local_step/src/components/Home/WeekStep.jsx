import './WeekStep.css'

const files = import.meta.glob('../../assets/WeekStep_Checklist_btn/*.png', { eager: true });
const byName = Object.fromEntries(
  Object.entries(files).map(([k, v]) => [k.split('/').pop(), v.default])
);

const format = (n) => n.toLocaleString(); //포멧해서 자동 콤마

const ICON = {
  clear: byName['clear.png'],
  false: byName['false.png'],
  not_yet: byName['not_yet.png'],
  today: byName['today.png'],
};

export default function WeekStep({ week_step_total, weekStatuses, todayIdx: propTodayIdx }) {
    const days = ['월','화','수','목','금','토','일'];

    const jsDay = new Date().getDay();        // 0(일) - 6(토)
    const todayIdx = (jsDay + 6) % 7;         // 0(월) - 6(일)
    const tIdx = typeof propTodayIdx === 'number' ? propTodayIdx : todayIdx;

    // 기본 규칙 적용 + (향후)DB값 고려
    //today: 'today'
    //after today: 'not_yet'
    //before today: 기본 'clear' (나중에 DB에서 clear/false로 대체)

    // 규칙:
    // - i===tIdx: today
    // - i>tIdx : not_yet
    // - i<tIdx : 과거 → DB 값이 'false'면 false, 아니면 clear
    const resolved = days.map((_, i) => {
        if (i === tIdx) return 'today';
        if (i > tIdx) return 'not_yet';
        const db = Array.isArray(weekStatuses) ? weekStatuses[i] : null;
        return db === 'false' ? 'false' : 'clear';
    });

    return (
        <div id='week_step'>
            <div id='week_steps total'>
                <span id='txt-gj'>금주</span>
                <span id='week_steps_total'>{format(week_step_total)}</span>
                <span id='txt-g'>걸음</span>
            </div>
            <div id='week_step_checklist'>
                <div id='day'>
                    {days.map(d => <span key={d}>{d}</span>)}
                </div>
                <div id="checklist">
                {resolved.map((s, i) => (
                    <div className="check-item" key={i}>
                    <img src={ICON[s]} alt={s} className="base-icon" />
                    {s === 'today' && (
                        <img
                        src={byName['today_marking.png']}
                        alt="today-marking"
                        className="today-mark"
                        />
                    )}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}