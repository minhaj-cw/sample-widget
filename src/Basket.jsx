import React, { useState, useEffect } from "react";
import CloseIcon from "../src/assets/images/close.png";
import { motion } from "framer-motion";
export default function Basket({ content, onRemove, inc, dec, currency }) {
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (content) {
      setQty(content.qty);
    }
  }, [content]);
  return (
    <>
      {content && (
        <motion.div
          className="service_content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {content.__typename === "ServicePricing" ? (
            <div key={content.id} className="Category">
              <div className="row">
                <div className="col-7">
                  <div className="cartName">{content?.service_name}</div>
                </div>
                <div className="col-3">
                  <div className="dolar vatamonunt">
                    <span className="text-dark">{`${currency}${
                      content?.special_price != 0
                        ? content?.special_price
                        : content?.price
                    }`}</span>
                  </div>
                </div>
                {/* remove service */}
                <div className="col-2" onClick={() => onRemove(content)}>
                  <div className="remove">
                    <div className="closeIcon">
                      <img src={CloseIcon} alt="icon" />
                    </div>
                  </div>
                </div>
                <div className="col-12 text-left">
                  <p className="text-dark show-appt-date text-left">
                    Appointment on {content.date}, at {content.time}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div key={content.id} className="Category position-relative">
                <div className="row">
                  <div className="col-5">
                    <div className="cartName">{content?.name}</div>
                  </div>
                  <div className="col-3">
                    <div className="dolar vatamonunt">
                      <span className="text-dark">
                        {currency}
                        {content?.retail}
                      </span>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="dolar qty-inc-dec d-flex justify-content-between">
                      <i
                        className="fas fa-minus closeIcon px-2"
                        onClick={() => dec(content.id, content?.name)}
                      />
                      <input
                        type="text"
                        className="mt-1 form-control"
                        value={qty}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setQty(parseInt(e.target.value));
                          } else {
                            setQty(e.target.value);
                          }
                        }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onBlur={() => {
                          if (qty === "" || qty === 0) {
                            onRemove(content);
                          }
                        }}
                      />
                      {content?.limit_number_of_sales === -999 ? (
                        <i
                          className="mt-2 fas fa-plus closeIcon px-2"
                          onClick={() => inc(content.id, content?.name)}
                        />
                      ) : (
                        content?.limit_number_of_sales - content?.total_sale >
                          qty && (
                          <i
                            className="mt-2 fas fa-plus closeIcon px-2"
                            onClick={() => inc(content.id, content?.name)}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="col-1">
                    <div className="remove">
                      <div
                        className="closeIcon"
                        onClick={() => onRemove(content)}
                      >
                        <img src={CloseIcon} alt="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </>
  );
}
