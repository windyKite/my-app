import "./App.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { aesDecrypt } from "./utils/crypto";
import SideBar from "./components/sideBar";
import Content from "./components/content";
import { ListFields } from "./types/common";

const getDataAApi = async () => {
  const res = await axios.get<string>(
    "https://6cxx9pggi4.execute-api.us-east-1.amazonaws.com/prod/mock/meeting-a/list",
    {
      params: {
        page_size: 20,
      },
    }
  );
  return res.data;
};

const getDataBApi = async () => {
  const res = await axios.get<string>(
    "https://6cxx9pggi4.execute-api.us-east-1.amazonaws.com/prod/mock/meeting-b/list",
    {
      params: {
        page_size: 20,
      },
    }
  );
  return res.data;
};

export default function App() {
  const [listA, setListA] = useState<ListFields[]>([]);
  const [listB, setListB] = useState<ListFields[]>([]);
  const getDataA = async () => {
    const data = await getDataAApi();
    const list = aesDecrypt(data, "0000000000000000").data.list;
    setListA(list);
  };
  const getDataB = async () => {
    const data = await getDataBApi();
    const list = aesDecrypt(data, "0000000000000000").data.list;
    setListB(list);
  };

  useEffect(() => {
    getDataA();
    getDataB();
  }, []);

  const data = useMemo(() => {
    const list = [...listA, ...listB];
    const creatTimeList = [
      ...new Set(list.map((item) => item.create_time.slice(0, 10))),
    ].sort(
      (a, b) => Number(new Date(b).valueOf()) - Number(new Date(a).valueOf())
    );
    const data = creatTimeList.map((createTime) => {
      const notes = list
        .filter((item) => item.create_time.slice(0, 10) === createTime)
        .sort(
          (a, b) =>
            Number(new Date(a.create_time).valueOf()) -
            new Date(b.create_time).valueOf()
        );
      return {
        createTime,
        notes,
      };
    });
    return data;
  }, [listA, listB]);

  return (
    <div className="App">
      <SideBar noteList={data}></SideBar>
      <Content></Content>
    </div>
  );
}
