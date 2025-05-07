import { useEffect, useState } from "react";
import "./CreateTrip.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PlacesAutocomplete from "react-places-autocomplete";
import { IoCloseCircleOutline } from "react-icons/io5";
import { createTrip, getTrips, updateTrip } from "../../api";
import { ErrorBlock } from "../ErrorBlock/ErrorBlock";
import { formatDateToISO } from "../../functions/dateManager";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";

export const CreateTrip = () => {
  const [tripToEdit, setTripToEdit] = useState<
    | {
        id: number;
        destination: string;
        startDate: string;
        endDate: string;
        startPoint: string;
        endPoint: string;
        additionalPoints: string[];
      }
    | undefined
  >();
  const { id } = useParams();

  useEffect(() => {
    getTrips().then((response) =>
      setTripToEdit(
        response.filter((t: { id: number }) => (id ? t.id === +id : 0))[0]
      )
    );
  }, [id]);

  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [startPoint, setStartPoint] = useState("");
  const [finishPoint, setFinishPoint] = useState("");
  const [additionalPoint, setAdditionalPoint] = useState("");
  const [aditionalPointsArray, setAdditionalPointsArray] = useState<string[]>(
    []
  );
  const [error, setError] = useState("");
  const [isErorr, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {t} = useTranslation();

  useEffect(() => {
    setTripName(tripToEdit ? tripToEdit.destination : "");
    setStartDate(tripToEdit ? new Date(tripToEdit.startDate) : new Date());
    setFinishDate(tripToEdit ? new Date(tripToEdit.endDate) : null);
    setStartPoint(tripToEdit ? tripToEdit.startPoint : "");
    setFinishPoint(tripToEdit ? tripToEdit.endPoint : "");
    setAdditionalPointsArray(tripToEdit ? tripToEdit.additionalPoints : []);
  }, [tripToEdit]);

  useEffect(() => {
    if (startDate === null) {
      setStartDate(new Date());
    }
  }, [startDate]);

  async function onCreateTrip() {
    if (!startPoint.length) {
      setError("Please select start point");
    } else if (!finishPoint.length) {
      setError("Please select finish point");
    } else if (finishDate === null) {
      setError("Please select finish date");
    } else if (startDate === null) {
      setError("Please select start date");
    } else if (!tripName.length) {
      setTripName(`Trip to ${finishPoint}`);
    } else {
      if (tripToEdit) {
        updateTrip({
          id: tripToEdit.id,
          destination: tripName,
          startDate: formatDateToISO(startDate),
          endDate: formatDateToISO(finishDate),
          startPoint: startPoint,
          endPoint: finishPoint,
          additionalPoints: aditionalPointsArray,
        }).then((response) => {
          if (response && response.id) {
            navigate(`../../tripDetails/${response.id}/map`);
          }
        });
      } else {
        createTrip({
          destination: tripName,
          startDate: formatDateToISO(startDate),
          endDate: formatDateToISO(finishDate),
          startPoint: startPoint,
          endPoint: finishPoint,
          additionalPoints: aditionalPointsArray,
        })
          .then((data) => {
            if (data && data.id) {
              navigate(`../../tripDetails/${data.id}/map`);
            } else {
              console.error("Trip creation failed: Missing data ID");
            }
          })
          .catch((error) => {
            console.error("Error creating trip:", error);
          });
      }
    }
  }

  const onButtonClick = () => {
    setIsLoading(true);
    onCreateTrip().finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (error.length > 0) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [error]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(aditionalPointsArray);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAdditionalPointsArray(items);
  };

  if (isLoading) {
    return <main className="loading">
      <Loader />
    </main>
  }

  return (
    <main className="createTrip">
      {isErorr && <ErrorBlock error={error} setError={setError} />}

      <h1 className="createTrip__header">{tripToEdit ? 'Edit your trip!' : 'Create a new trip!'}</h1>

      <div className="createTrip__block">
        <label htmlFor="name" className="createTrip__block--label">
          {t("trip_name")}
        </label>
        <input
          type="text"
          className="createTrip__block--input"
          placeholder={t("create_name_placeholder")}
          id="name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>

      <div className="createTrip__block double--block date">
        <div className="createTrip__block--doubleBlock">
          <label htmlFor="date" className="createTrip__block--label">
            {t("start_date")}
          </label>

          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText={t("create_start_date_placeholder")}
          />
        </div>

        <div className="createTrip__block--doubleBlock">
          <label htmlFor="date" className="createTrip__block--label">
            {t("finish_date")}
          </label>

          <DatePicker
            selected={finishDate}
            onChange={(date: Date | null) => setFinishDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText={t("create_finish_date_placeholder")}
          />
        </div>
      </div>

      <div className="createTrip__block double--block">
        <div className="createTrip__block--doubleBlock">
          <label htmlFor="startPoint" className="createTrip__block--label">
            {t("start_point")}
          </label>

          <PlacesAutocomplete
            value={startPoint}
            onChange={setStartPoint}
            onSelect={(v) => setStartPoint(v)}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  id="startPoint"
                  {...getInputProps({
                    placeholder: t('create_start_point_placeholder'),
                  })}
                />
                <div
                  className="suggestions"
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  {loading ? <div>Loading...</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = suggestion.active
                      ? {
                          width: "100%",
                          backgroundColor: "#ECF9EF",
                          cursor: "pointer",
                          padding: "8px 12px",
                          borderRadius: "20px",
                        }
                      : {
                          width: "100%",
                          cursor: "pointer",
                          padding: "8px 12px",
                          backgroundColor: "white",
                        };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, { style })}
                        key={suggestion.placeId}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        <div className="createTrip__block--doubleBlock">
          <label htmlFor="finishPoint" className="createTrip__block--label">
            {t("finish_point")}
          </label>

          <PlacesAutocomplete
            value={finishPoint}
            onChange={setFinishPoint}
            onSelect={(v) => setFinishPoint(v)}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  id="finishPoint"
                  {...getInputProps({
                    placeholder: t('create_finish_point_placeholder'),
                  })}
                />
                <div
                  className="suggestions"
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  {loading ? <div>Loading...</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = suggestion.active
                      ? {
                          width: "100%",
                          backgroundColor: "#ECF9EF",
                          cursor: "pointer",
                          padding: "8px 12px",
                          borderRadius: "20px",
                        }
                      : {
                          width: "100%",
                          cursor: "pointer",
                          padding: "8px 12px",
                          backgroundColor: "white",
                        };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, { style })}
                        key={suggestion.placeId}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      </div>

      <div className="createTrip__block additinal-block">
        <label htmlFor="additionalPoints" className="createTrip__block--label">
          {t("additional_points")}
        </label>

        <PlacesAutocomplete
          value={additionalPoint}
          onChange={setAdditionalPoint}
          onSelect={(v) => {
            setAdditionalPointsArray((prev) => [...prev, v]);
            setAdditionalPoint("");
          }}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="additional-search">
              <input
                id="additionalPoints"
                {...getInputProps({
                  placeholder: t("create_add_points_placeholder"),
                })}
              />
              <div
                className="suggestions"
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                {loading ? <div>Loading...</div> : null}

                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? {
                        width: "100%",
                        backgroundColor: "#ECF9EF",
                        cursor: "pointer",
                        padding: "8px 12px",
                        borderRadius: "20px",
                      }
                    : {
                        width: "100%",
                        cursor: "pointer",
                        padding: "8px 12px",
                        backgroundColor: "white",
                      };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, { style })}
                      key={suggestion.placeId}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="additional-block"
                style={
                  additionalPoint.length > 0
                    ? { zIndex: "-1" }
                    : { zIndex: "3" }
                }
              >
                {aditionalPointsArray.map((value, index) => (
                  <Draggable draggableId={value} index={index} key={value}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="additional-block-element"
                        key={value.length}
                      >
                        <p className="additional-block-element--text">
                          {`${index + 1}.   ${value}`}
                        </p>
                        <p
                          className="additional-block-element--button"
                          onClick={() => {
                            setAdditionalPointsArray((prev) =>
                              prev.filter((v) => v !== value)
                            );
                          }}
                        >
                          <IoCloseCircleOutline />
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <button className="createTrip__button" onClick={onButtonClick}>
        {tripToEdit ? t('update_trip') : t('create_trip')}
      </button>
    </main>
  );
};
