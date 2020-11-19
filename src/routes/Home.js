import Flying from "components/Flying";
import { dbService, storageSurvice } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [flying, setFlying] = useState("");
  const [flyings, setFlyings] = useState([]);
  const [attachment, setAttachment] = useState("");
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
    let attachmentURL = "";
    if (attachment != "") {
      const attachmentRef = storageSurvice
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }
    const flyingObj = {
      text: flying,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    };
    await dbService.collection("flyings").add(flyingObj);
    setFlying("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFlying(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFiles = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFiles);
  };
  const onClearAttachment = () => setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="flying" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
