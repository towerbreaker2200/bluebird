import Flying from "components/Flying";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [flying, setFlying] = useState("");
  const [flyings, setFlyings] = useState([]);
  useEffect(() => {
    dbService.collection("flyings").onSnapshot((snapshot) => {
      const flyingArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFlyings(flyingArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("flyings").add({
      text: flying,
      createdAt: Date.now(),
      creatorId: userObj.uid,
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
          <Flying
            key={flying.id}
            flyingObj={flying}
            isOwner={flying.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
