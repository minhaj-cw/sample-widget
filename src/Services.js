import React, { Fragment, useState } from 'react'
import T1 from '../src/images/arrowdn.png';
import T2 from '../src/images//arrowS.png';
import ArrowRight from '../src/images/arrowR.png';
import CartBtn from './CartBtn';
import { motion, AnimatePresence } from "framer-motion"
const Services = ({ content, onAdd, addBack, currency, defaultCartIcon }) => {
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);
    const handlClick = () => {
      setVisible((prev)=> !prev);
      setShow((prev)=> !prev);

    }
    return (
    <div id="shopServiceItem">
        {content?.services?.length > 0 &&
        <div
          onClick={() => handlClick()}
          className="category"
        >
          {show ? <img src={T1} alt="icon" /> : <img src={T2} alt="icon" />}
          <h5>{content?.name}</h5>
        </div>
      }
      <AnimatePresence>
      {show &&
       <motion.div
          className="service_content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {(content?.services?.length > 0 &&
            content?.services?.map((services) => {
              return (services?.service_pricings?.map((details) => (
                	<div className="row mx-0 service_content_row" key={details.id}>
                  	<div className="col-4 SubCategory ps-4">
                    	<div className="name">
                      	<img src={ArrowRight} alt="icon" /><span>{details?.service_name}</span>
                    	</div>
                  	</div>
					          <div className="col-md-2 col-1 SubCategory">
                    	{
                      	details.special_price != 0 ?
                        	<div className="price sp-price">
                          	<span>{`${currency}${details.price}`}</span>
                        	</div> :
                        	<div className="price">
                          	<span>-</span>
                        	</div>
                    	}
                  	</div>
                  	<div className="col-2 SubCategory">
                    	<div className="price">
                      	<span>{`${currency}${details.special_price != 0 ?
                        	details.special_price : details.price}`}</span>
                    	</div>
                  	</div>
                  	<div className="col-2 SubCategory">
                    	<div className="time">
                      	<span>{details.duration} min</span>
                    	</div>
                  	</div>
                    <div className="col-1 SubCategory">
                      <CartBtn 
                        onAdd={onAdd} 
                        details={{...details, special_deposit: services.special_deposit}} 
                        addBack={addBack} 
                        service_group = {services.service_group}
                        defaultCartIcon={defaultCartIcon}
                      />
                    </div>
                  	{/* {services?.description &&
                      <ToggleDescription
                      	desc={services?.description}
                      	schedule={services.service_group?.schedules ?? []}
                      	service_schedules={services.service_schedules}
                        service_group = {services.service_group}
                       />
                  	} */}
                	</div>
              	))
            	)
            })
          )}
          </motion.div>
      }
      </AnimatePresence>
    </div>
  )
}

export default Services