import { useEffect, useState } from "react";
import { VoteComponent } from "./VoteComponent/VoteComponent";
import { useParams } from "react-router-dom";

type Vote = {
  id: number;
  tripId: number;
  title: string;
  voteOptions: {
    id: number;
    optionText: string;
    count: number;
  }[];
  ifFinished: boolean;
};

export const VotePage = () => {
  const { id } = useParams();
    const [votes, setVotes] = useState<Vote[]>([]);

    useEffect(() => {
        const getAllVotes = async () => {
          const token = localStorage.getItem("authToken");
    
          try {
            const response = await fetch(`https://tripsters.up.railway.app/votes/all/${id}`, {
              method: "GET",
              mode: "cors",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            const data: Vote[] = await response.json();
    
            return data;
          } catch (error) {
            console.log(error);
          }
        };
    
        getAllVotes().then((data) => {
          if (data) {
            setVotes(data);
          }
        });
      }, [id]);
    
  return (
    <div className="chat__chat">
        <div className="chat__chat--list">
          {votes.map((vote) => (
            <VoteComponent voteId={vote.id} key={vote.id} />
          ))}
        </div>
      </div>
  )
}