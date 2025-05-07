import { useParams } from "react-router-dom";
import "./VoteComponent.scss";
import { useEffect, useState} from "react";
import { User } from "../../../../../types/User";
import { getAllusersInTrip, getTrips, updateTrip } from "../../../../../api";
import { Trip } from "../../../../../types/Trip";
import { useTranslation } from "react-i18next";

type Params = {
  voteId: number;
};

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

export const VoteComponent: React.FC<Params> = ({ voteId }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [vote, setVote] = useState<Vote>({
    id: 0,
    tripId: 0,
    title: "",
    voteOptions: [
      {
        id: 0,
        optionText: "Yes",
        count: 0,
      },
      {
        id: 1,
        optionText: "No",
        count: 0,
      },
    ],
    ifFinished: false,
  });

  const [totalCount, setTotalCount] = useState(
    vote.voteOptions.reduce((sum, option) => sum + option.count, 0)
  );

  const [countYes, setCountYes] = useState(
    vote.voteOptions.filter((option) => option.optionText === "Yes")[0].count
  );
  const [countNo, setCountNo] = useState(
    vote.voteOptions.filter((option) => option.optionText === "No")[0].count
  );

  useEffect(() => {
    setTotalCount(
      vote.voteOptions.reduce((sum, option) => sum + option.count, 0)
    );
    setCountYes(
      vote.voteOptions.filter((option) => option.optionText === "Yes")[0].count
    );
    setCountNo(
      vote.voteOptions.filter((option) => option.optionText === "No")[0].count
    );
  }, [vote]);

  useEffect(() => {
    const getVote = async (): Promise<Vote> => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(`https://tripsters.up.railway.app/votes/${voteId}`, {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log(response.status);
          return {
            id: 0,
            tripId: 0,
            title: "",
            voteOptions: [],
            ifFinished: false,
          };
        }

        const data: Vote = await response.json();

        return data;
      } catch (error) {
        console.log(error);
      }

      return {
        id: 0,
        tripId: 0,
        title: "",
        voteOptions: [],
        ifFinished: false,
      };
    };

    getVote().then((response) => setVote(response));
  }, [voteId, countNo, countYes]);

  const [users, setUsers] = useState<User[]>([]);

  const [trip, setTrip] = useState<Trip>();

  useEffect(() => {
    setTotalCount(countNo + countYes);
  }, [countNo, countYes]);

  useEffect(() => {
    getAllusersInTrip(id ? id : "0").then((response) => setUsers(response));
  }, [id]);

  useEffect(() => {
    getTrips().then((response: Trip[]) =>
      setTrip(response.filter((t) => t.id === (id ? +id : 0))[0])
    );
  }, [id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isFinished = async () => {
    if (trip) {
      for (let i = 0; i < vote.voteOptions.length; i++) {
        if (vote.voteOptions[i].count > users.length / 2 && !vote.ifFinished) {
          const finishVote = async () => {
            const token = localStorage.getItem("authToken");
  
            try {
              const response = await fetch(
                `https://tripsters.up.railway.app/votes/finish/${vote.id}`,
                {
                  method: "PUT",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
  
              if (!response.ok) {
                console.error(`Error: ${response.status}`);
                throw new Error(`Failed to finish: ${response.status}`);
              }
  
              console.log(response.status);
  
              const responseBody = await response.json();
  
              return responseBody;
            } catch (error) {
              console.error("Error while updating trip:", error);
              throw error;
            }
          };
  
          if (vote.voteOptions[i].optionText === "Yes") {
            await sendVote();
            await finishVote();
          } else {
            await finishVote();
          }
        }
      }
  
      if (
        totalCount === users.length &&
        vote.voteOptions[0].count === vote.voteOptions[1].count &&
        !vote.ifFinished
      ) {
        if (Math.random() < 0.5) {
          await sendVote();
        }
      }
    }
  };

  const sendVote = async () => {
    if (trip) {
      const updatedTrip = {
        id: trip.id,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        startPoint: trip.startPoint,
        endPoint: trip.endPoint,
        additionalPoints: trip.additionalPoints.includes(vote.title)
          ? trip.additionalPoints
          : [...trip.additionalPoints, vote.title],
      };

      await updateTrip(updatedTrip).then((response) => console.log(response));
    }
  };

  const voteForOption = async (optionID: number) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `https://tripsters.up.railway.app/votes/${vote.id}/options/${optionID}/vote`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.status}`);
        throw new Error(`Failed to vote: ${response.status}`);
      }

      const responseBody = await response.json();

      if (
        optionID ===
        vote.voteOptions.filter((option) => option.optionText === "Yes")[0].id
      ) {
        setCountYes((prev) => prev + 1);
      } else {
        setCountNo((prev) => prev + 1);
      }

      return responseBody;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  };

  useEffect(() => {
    isFinished();
  }, [trip, vote, countNo, countYes, isFinished]);

  const getStyle = () => {
    if (!vote.ifFinished) {
      return { borderColor: "#8C8C8C" };
    } else if (vote.ifFinished && trip?.additionalPoints.includes(vote.title)) {
      return { borderColor: "#309C4D" };
    } else if (
      vote.ifFinished &&
      !trip?.additionalPoints.includes(vote.title)
    ) {
      return { borderColor: "#9C304E" };
    } else {
      return { borderColor: "#8C8C8C" };
    }
  };

  return (
    <div className="vote" style={getStyle()}>
      <p className="vote__title">{`${t("vote_component_question_prefix")} ${vote.title}${t("vote_component_question_end")}`}</p>

      <div className="vote__options">
        {vote.voteOptions.map((voteOption) => (
          <div
            className="vote__options--option"
            onClick={() => voteForOption(voteOption.id)}
            key={voteOption.id}
          >
            <p className="vote__options--option--title">
              {voteOption.optionText}
            </p>

            <div className="vote__options--option--line">
              <div
                className="vote__options--option--line--color"
                style={{
                  width:
                    totalCount !== 0
                      ? `${(
                          (voteOption.optionText === "Yes"
                            ? countYes
                            : countNo / totalCount) * 100
                        ).toString()}%`
                      : 0,
                }}
              >
                {""}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="vote__total">{`${totalCount} ${t("vote_component_voted")}`}</p>
    </div>
  );
};
