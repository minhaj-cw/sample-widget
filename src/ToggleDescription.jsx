import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import InfoIcon from "../src/assets/images/info.png";

const ToggleDescription = ({
  desc,
  schedule,
  service_group,
  service_schedules,
}) => {
  const { is_group, is_course, start_date, enroll_date } = service_group || {};
  const [showDesc, setShowDesc] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleShow = () =>{
    setShowDesc((prev)=> !prev);
    setVisible((prev)=> !prev);
  }
  return (
    <>
      <div className="col-1 SubCategory">
        <button
          className="btn"
          onClick={() => {
            handleShow();
          }}
        >
          <img className="info-img" src={InfoIcon} alt="icon" />
        </button>
      </div>
      <AnimatePresence>
        {desc && showDesc && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="col-12 ps-4">
              <p className="shadow-sm bg-light p-2">{desc}</p>

              {is_group ? (
                <Fragment>
                  <p>Start Date: {dayjs(start_date).format("DD-MM-YYYY")}</p>
                  {is_course && (
                    <p>
                      Entrolment Last Date:{" "}
                      {dayjs(enroll_date).format("DD-MM-YYYY")}
                    </p>
                  )}
                  {is_group && !is_course ? (
                    <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0">
                      <thead>
                        <tr className="fw-bolder bg-light text-muted">
                          <th className="ps-2">
                            Date<span>(dd-mm-yyyy)</span>
                          </th>
                          <th className="ps-2">Time</th>
                          <th className="ps-2">Day</th>
                          <th className="pe-2 text-end rounded-end"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {service_schedules.map((dayTime, index) => {
                          return (
                            <tr key={index}>
                              <td className="ps-2 text-dark fw-bolder fs-8">
                                {dayjs
                                  .unix(dayTime.date_time)
                                  .format("DD-MM-YYYY")}
                              </td>
                              <td className="p-2 text-dark fw-bolder fs-8">
                                {dayjs
                                  .unix(dayTime.date_time)
                                  .format("hh:mm A")}
                              </td>
                              <td className="p-2 text-dark fw-bolder fs-8">
                                {dayjs.unix(dayTime.date_time).format("dddd")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : null}

                  {is_course && !!schedule?.length ? (
                    <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0">
                      <thead>
                        <tr className="fw-bolder bg-light text-muted">
                          <th className="ps-2">
                            Date<span>(dd-mm-yyyy)</span>
                          </th>
                          <th className="ps-2">Time</th>
                          <th className="ps-2">Day</th>
                          <th className="pe-2 text-end rounded-end"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {service_schedules.map((dayTime, index) => {
                          return (
                            <tr key={index}>
                              <td className="ps-2 text-dark fw-bolder fs-8">
                                {dayjs
                                  .unix(dayTime?.date_time)
                                  .format("DD-MM-YYYY")}
                              </td>
                              <td className="p-2 text-dark fw-bolder fs-8">
                                {dayjs
                                  .unix(dayTime?.date_time)
                                  .format("hh:mm A")}
                              </td>
                              <td className="p-2 text-dark fw-bolder fs-8">
                                {dayjs.unix(dayTime?.date_time).format("dddd")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : null}
                </Fragment>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ToggleDescription;
