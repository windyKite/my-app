import "./index.css";
import logo from "../../assets/logo.png";
import arrowDown from "../../assets/public-arrow-down.png";
import arrowUp from "../../assets/public-arrow-up.png";
import { ListFields } from "../../types/common";
import { useCallback, useEffect, useState } from "react";

const weekMap: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

interface NoteListFields {
  createTime: string;
  notes: ListFields[];
}

interface SideBarProps {
  noteList: NoteListFields[];
}

const SideBar: React.FC<SideBarProps> = ({ noteList }) => {
  const [list, setList] = useState<
    (NoteListFields & { isExpanded: boolean })[]
  >([]);

  useEffect(() => {
    const list = noteList.map((item) => ({
      ...item,
      isExpanded: true,
    }));
    setList(list);
  }, [noteList]);

  const changeExpandStatus = useCallback(
    (i: number) => {
      const newList = list.map((item, index) => {
        return index === i
          ? {
              ...item,
              isExpanded: !item.isExpanded,
            }
          : {
              ...item,
            };
      });
      setList(newList);
    },
    [list]
  );

  return (
    <div className="sideBar">
      <div className="side">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="sideButtonGroups">
          <div className="top">
            <div className="button active"></div>
            <div className="button"></div>
            <div className="button"></div>
            <div className="button"></div>
            <div className="button"></div>
            <div className="button"></div>
          </div>
          <div className="bottom">
            <div className="button"></div>
            <div className="button"></div>
            <div className="button"></div>
          </div>
        </div>
      </div>
      <div className="menuContain">
        <h2 className="title">Metting Notes</h2>
        <div className="menus">
          {list.map((item, index) => {
            const date = new Date(item.createTime);
            return (
              <div className="menu" key={index}>
                <div
                  className="createTime"
                  onClick={() => changeExpandStatus(index)}
                >
                  {item.isExpanded && <img src={arrowUp} alt="" />}
                  {!item.isExpanded && <img src={arrowDown} alt="" />}
                  {weekMap[date.getDay()] + "，" + date.toString().slice(4, 10)}
                </div>
                {item.isExpanded &&
                  item.notes.map((note) => {
                    const hours = new Date(note.create_time).getHours();
                    const endTime = new Date(
                      new Date(note.create_time).getTime() +
                        note.duration * 1000
                    );
                    const endTimeHours = endTime.getHours();
                    const startTimeText =
                      hours <= 11
                        ? `${new Date(note.create_time)
                            .toString()
                            .slice(16, 21)} am`
                        : `${hours - 12}:${new Date(note.create_time)
                            .toString()
                            .slice(19, 21)} pm`;
                    // 这里还有一个边界情况： 跨日期的时间如何展示
                    const endTimeText =
                      endTimeHours <= 11
                        ? `${endTime.toString().slice(16, 21)} am`
                        : `${endTimeHours - 12}:${endTime
                            .toString()
                            .slice(19, 21)} pm`;
                    const durationText = startTimeText + " - " + endTimeText;
                    return (
                      <div className="notes" key={note.id}>
                        {/* <div>{note.id}</div>
                        <div>{endTimeHours}</div>
                        <div>{endTimeHours -12}</div> */}
                        <h3 className="title" title={note.title}>
                          {note.title}
                        </h3>
                        <div className="duration">{durationText}</div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
