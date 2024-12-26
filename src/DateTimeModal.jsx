import React, { Fragment, useContext, useEffect, useState } from 'react'
import {
  FormGroup,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@apollo/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence, motion } from 'framer-motion';
import { CartList } from './Widget';
import dayjs from 'dayjs';
import { AVAIABLE_OCCURENCES, TIME_SLOT } from './gql/Query';
import { occurrence } from './utils';
const DateTimeModal = ({ bID, onAdd, checkAuth, closeDays, closeDate, blockedTime,
    canList, vetting, getVetDateTime, notification, shopSlotDuration }) => {
      console.log("🚀 ~ blockedTime:", blockedTime)
      const { cartItems, person, currentCartItem, setCurrentCartItem, date, setDate, time, setTime } = useContext(CartList);
      const today = new Date();
      const [selectedDate, setSelectedDate] = useState(
        dayjs().format("YYYY-MM-DD")
      );
      const [closeDateIndex, setCloseDateIndex] = useState([]);
      const [weekday, setWeekday] = useState(dayjs(today).format("YYYY-MM-DD"));
      const [timeshow, setTimeshow] = useState("");
      const [tempDate, setTempDate] = useState("");
      const [timeAPI, setTimeAPI] = useState([{}]);
      const [groupDates, setGroupDates] = useState([{}]);
      const [block, setBlock] = useState({});
      const [waiting, setWaiting] = useState(false);
      
      //---------------------------select time--------------------------
      const timeSlotPayload = {
        business_id: parseInt(bID),
        date: weekday,
        service_pricing_id: currentCartItem ? parseInt(currentCartItem.id) : 0,
      };
      const { data, loading, refetch } = useQuery(TIME_SLOT, {
        variables: timeSlotPayload,
        fetchPolicy: "network-only",
      });
      // available occurrences query

      const {
        data: availableOccurrences,
        refetch: availableOccurrencesRefetch,
      } = useQuery(AVAIABLE_OCCURENCES);
      //--------------filter all the closed weekday---------------
      const isWeekday = (val) => {
        var active;
        if (closeDate?.length > 0) {
          for (let cd of closeDate) {
            if (
              dayjs.unix(cd.date).format("YYYY/MM/DD") ===
              dayjs(val).format("YYYY/MM/DD")
            ) {
              active = false;
              break;
            } else {
              if (closeDateIndex.length === 0) {
                active = true;
              } else {
                const day = new Date(val).getDay();
                for (let cDate of closeDateIndex) {
                  if (cDate === day) {
                    active = false;
                    break;
                  } else {
                    active = true;
                  }
                }
              }
            }
          }
        } else {
          if (closeDateIndex.length === 0) {
            active = true;
          } else {
            const day = new Date(val).getDay();
            for (let cDate of closeDateIndex) {
              if (cDate === day) {
                active = false;
                break;
              } else {
                active = true;
              }
            }
          }
        }
        return active;
      };
      //------------------service date time in local storage---------------
      const setWithExpiry = (key, value) => {
        const now = new Date();
        const item = {
          value: value,
          expiry: now.getTime() + 60 * 60 * 1000,
        };
        localStorage.setItem(key, JSON.stringify(item));
      };
      const getWithExpiry = (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
          return null;
        }
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
      };

      //-----------select date---------------------
      const selectDate = (val) => {
        setDate(dayjs(val).format("YYYY-MM-DD"));
        setSelectedDate(dayjs(val).format("YYYY-MM-DD"));
        // console.log(dayjs(val).format('YYYY-MM-DD'), getWithExpiry("serviceDate"))
        // console.log("vetting", dayjs(dayjs(val).format('YYYY-MM-DD')).isAfter(getWithExpiry("serviceDate")))
        if (vetting) {
          setTempDate(val);
          if (
            dayjs(dayjs(val).format("YYYY-MM-DD")).isAfter(
              getWithExpiry("serviceDate")
            )
          ) {
            // toast.error("You must have to select consultation call time before the time you have selected for the services!");
            setTimeAPI();
          } else {
            setWeekday(dayjs(val).format("YYYY-MM-DD"));
            setTimeout(() => {
              refetch();
            }, 1000);
          }
        } else {
          setWeekday(dayjs(val).format("YYYY-MM-DD"));
          setWithExpiry("serviceDate", val);
          setTimeout(() => {
            refetch();
          }, 1000);
        }

        //-------------for close dates-------------------
        for (let bDate of blockedTime) {
          if (
            dayjs.unix(bDate.date).format("YYYY/MM/DD") ===
            dayjs(val).format("YYYY/MM/DD")
          ) {
            setWaiting(true);
            break;
          } else {
            setWaiting(false);
          }
        }
      };

      //--------------------select time-------------------
      const changeTime = (val) => {
        if (notification) {
          let t = dayjs.unix(val).format("hh:mm a");
          setTime(t);
        } else {
          if (vetting) {
            const x = parseInt(getWithExpiry("serviceTime"));
            const y = val;
            // console.log(x, y)
            if (
              dayjs(dayjs(tempDate).format("YYYY-MM-DD")).isSame(
                getWithExpiry("serviceDate")
              )
            ) {
              if (y >= x) {
                // toast.error(
                //   "You must have to select vetting call time before the time you have selected for the services!"
                // );
              } else {
                let t = dayjs.unix(val).format("hh:mm a");
                setTime(t);
                getVetDateTime(t, date);
              }
            } else {
              let t = dayjs.unix(val).format("hh:mm a");
              getVetDateTime(t, date);
            }
          } else {
            setTime(dayjs.unix(val).format("hh:mm a"));
            setWithExpiry("serviceTime", val);
          }
        }
      };
      useEffect(() => {
        const weekDay = ["sunday", "monday", "tuesday", "wednesday",
            "thursday", "friday", "saturday"];
        var dayArr = []
        if (data) {
            setTimeshow(true)
            // setTimeAPI(data.business_time_slot)
             if (cartItems?.length > 0) {
                console.log('slot calculation need')
                // 1. Filter booked slots for the selected date
                const bookedSlots = cartItems
                    .filter((item) => item.date === selectedDate)
                    .map((item) => ({ s_time: dayjs(item.time, "hh:mm a").unix(), duration: item.duration }));

                // 2. Calculate booked slots based on service duration and shopSlotDuration
                const bookedSlotsArray = bookedSlots.reduce((slots, bookedService) => {
                    const { s_time, duration } = bookedService;

                    // Validate service duration
                    if (duration <= 0) {
                        return slots;
                    }

                    // Add objects for each slot needed for the booked service
                    const slotsForService = Array.from(
                        { length: Math.ceil(duration / shopSlotDuration) },
                        (_, index) => ({ s_time: s_time + index * shopSlotDuration * 60 })
                    );
                    console.log("slot ~ bookedSlotsArray ~ slotsForService:", slotsForService)

                    // Concatenate the new slots to the existing array
                    return slots.concat(slotsForService);
                }, []);
                // console.log("slot ~ bookedSlotsArray ~ slotsForService:", bookedSlotsArray)

                // 3. Filter available time slots
                let availableTimeSlots = data.business_time_slot?.time_slots.filter((slot) => {
                    // Check if the s_time is not present in the second array
                     const booked = bookedSlotsArray.map((bookedSlot) => dayjs(bookedSlot.s_time).format("hh:mm a")).includes(dayjs(slot.s_time).format("hh:mm a"));
                    console.log('booked', booked)
                     return booked ? null: slot;
                });
               
                setTimeAPI(availableTimeSlots)
                // If needed, you can extract the formatted time for logging or display purposes
                if(currentCartItem?.is_group == true){
                    setGroupDates(data.business_time_slot?.date_slots?.map(itm => new Date(dayjs.unix(itm.s_date))))
                }
            }else{
                console.log('slot calculation not need')
                setTimeAPI(data.business_time_slot?.time_slots)
                setGroupDates(data.business_time_slot?.date_slots?.map(itm => new Date(dayjs.unix(itm.s_date))))
            }
        }
        if (loading) {
            setTimeshow(false)
        }
        if (closeDays) {
            closeDays.map((x) => (
                dayArr.push(weekDay.indexOf(x.weekday))
            ))
            setCloseDateIndex(dayArr);
        }
        
        if (blockedTime) {
            setBlock(blockedTime.map(itm => new Date(dayjs.unix(itm.date))))
        }
    }, [data, loading, closeDays, closeDate, blockedTime,selectedDate, cartItems, shopSlotDuration])
    // avaible occurrence
    useEffect(() => {
        if (currentCartItem?.is_group === true && time ) {
            // Refetch the query when the date or time changes
            availableOccurrencesRefetch({
                business_id: parseInt(bID),
                date: selectedDate,
                service_id: currentCartItem.service_id,
                time: time,
            })
        }
        if(availableOccurrences){
            const {available_occurrences} = availableOccurrences.group_service_available_occurrences
             setCurrentCartItem({ ...currentCartItem, available_occur: available_occurrences })
        }
    }, [currentCartItem?.is_group, selectedDate, time, availableOccurrences]);
      return (
        <Fragment>
          <Modal.Body>
            <div className="d-flex justify-content-center custom-datepicker mx-auto">
              {currentCartItem?.is_group === true ? (
                <DatePicker
                  inline
                  dateFormat="yyyy/MM/dd"
                  selected={today}
                  onChange={selectDate}
                  minDate={today}
                  includeDates={groupDates}
                  highlightDates={block}
                />
              ) : (
                <DatePicker
                  inline
                  dateFormat="yyyy/MM/dd"
                  selected={today}
                  onChange={selectDate}
                  minDate={today}
                  filterDate={isWeekday}
                  highlightDates={block}
                />
              )}
              <div>
                <div className="text-center font-chzday chuzy-time react-datepicker__header">
                  Time
                </div>
                <div className="available-time">
                  {loading && (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" />
                    </div>
                  )}
                  <AnimatePresence>
                    {timeshow && timeAPI?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        {timeAPI.map((x) => (
                          <div
                            key={x.s_time}
                            className="d-flex align-items-center"
                          >
                            <input
                              className="form-check-input"
                              type="radio"
                              id={x.s_time}
                              name="time"
                              onChange={() => {
                                changeTime(x.s_time);
                              }}
                            />
                            <label htmlFor={x.s_time}>
                              {dayjs
                                .unix(x.s_time)
                                .format("hh:mm a")}
                            </label>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="repeat_group mt-4 mx-auto">
              {currentCartItem?.group_type === "repeated" && !vetting ? (
                <FormGroup>
                  <FormLabel>Frequency</FormLabel>
                  <FormSelect
                    className="mb-3"
                    defaultValue={currentCartItem?.frequency}
                    onChange={() => console.log("frequency")}
                  >
                    <option>{currentCartItem?.frequency}</option>
                  </FormSelect>
                  <FormLabel>Occurrence</FormLabel>
                  <FormSelect
                    defaultValue={currentCartItem?.available_occur}
                    onChange={(e) => {
                      setCurrentCartItem({
                        ...currentCartItem,
                        occurrences: +e.target.value,
                      });
                    }}
                  >
                    <option selected value={0}>
                      select occurrence
                    </option>
                    {occurrence &&
                      occurrence
                        .filter(
                          (item) =>
                            item.value <= currentCartItem?.available_occur
                        )
                        .map((occurrenceItem) => (
                          <option
                            key={occurrenceItem.id}
                            value={occurrenceItem.value}
                          >
                            {occurrenceItem.value}
                          </option>
                        ))}
                  </FormSelect>
                </FormGroup>
              ) : null}
            </div>
          </Modal.Body>
          <div className="select-time-btn-wrap venuItem pb-2">
            <button
              className="btn primaryBtn"
              onClick={() => {
                onAdd(currentCartItem);
              }}
              disabled={
                (currentCartItem.group_type === "repeated" &&
                  (currentCartItem.available_occur == 0 ||
                    currentCartItem.available_occur == "" ||
                    currentCartItem.occurrences == 0)) ||
                !date ||
                !time
              }
            >
              Next <i className="arrow fa fa-angle-right" />
            </button>
          </div>
        </Fragment>
      );
    }

export default DateTimeModal