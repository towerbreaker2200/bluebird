import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [flying, setFlying] = useState("");
  const [flyings, setFlyings] = useState([]);
  const getFlyings = async () => {
    const dbFlyings = await dbService.collection("flyings").get();
    dbFlyings.forEach((document) => {
      const flyingObject = {
        ...document.data(),
        id: document.id,
      };
      setFlyings((prev) => [flyingObject, ...prev]);
    });
  };
  useEffect(() => {
    getFlyings();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("flyings").add({
      flying,
      createdAt: Date.now(),
    });
    setFlying("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFlying(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={flying}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="flying" />
      </form>
      <div>
        {flyings.map((flying) => (
          <div key={flying.id}>
            <h4>{flying.flying}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
