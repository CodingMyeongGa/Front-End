import { useMemo, useState } from "react";
import StepItem from "./StepItem";
import Button from "./Button";
import "./StepList.css";
import { useNavigate } from "react-router-dom";

const StepsList = ({ data }) => {
  const nav = useNavigate();
  const [sortType, setSortType] = useState("latest"); // latest | oldest
  const [dateFilter, setDateFilter] = useState("");

  const onChangeSortType = (e) => setSortType(e.target.value);
  const onChangeDate = (e) => setDateFilter(e.target.value);

  const filtered = useMemo(() => {
    if (!dateFilter) return data;
    return data.filter((it) => it.date === dateFilter);
  }, [data, dateFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortType === "oldest" ? da - db : db - da;
    });
    return arr;
  }, [filtered, sortType]);

  return (
    <div className="StepsList">
      <div className="menu_bar">
        <select onChange={onChangeSortType} value={sortType}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={onChangeDate}
          className="date_filter"
        />
        {/* <Button onClick={() => setDateFilter("")} text="날짜 필터 해제" /> */}
        <Button onClick={() => nav("/steps/new")} text="새 기록 작성" type="POSITIVE" />
      </div>

      <div className="list_wrapper">
        {sorted.length === 0 ? (
          <div className="empty">표시할 데이터가 없어요.</div>
        ) : (
          sorted.map((item) => <StepItem key={item.id} {...item} />)
        )}
      </div>
    </div>
  );
};

export default StepsList;
