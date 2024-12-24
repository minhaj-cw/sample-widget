import { useState, useEffect, useContext } from 'react';
import CartIcon from '../src/images/addCart.png';
import dayjs from 'dayjs';
import { CartList } from './Widget';
const CartBtn = ({ onAdd, details, addBack, service_group, defaultCartIcon }) => {
  const {cartItems, handleShow, setCurrentCartItem } = useContext(CartList);
  const [clickValue, setClickValue] = useState(true);
  const { is_group, is_course, start_date, enroll_date, group_type, occurrences,frequency} = service_group || {};
  const isEnrollDateValid = enroll_date && dayjs(enroll_date).isAfter(dayjs());
const isStartDateValid = start_date && dayjs(start_date).isAfter(dayjs());
const isCourseVallidToAdd = is_course && (isEnrollDateValid || isStartDateValid);
const isGroupVallidToAdd = is_group && !is_course && isStartDateValid;
  
  const ServiceAdd = () => {
    setCurrentCartItem(
      {...details , 
        is_group:is_group, 
        is_course: is_course, 
        group_type: group_type,
        available_occur: 0,
        occurrences: 0,
        frequency:frequency,
      })
  }
  useEffect(() => {
    if (addBack) {
      if (details.id === addBack) {
        setClickValue(true);
      }
    }
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        if (item.id === details.id) {
          setClickValue(false);
        }
      }
    }
    if (cartItems.length === 0) {
      setClickValue(true);
    }
  }, [addBack, cartItems, details.id])
  return (
    <>{ defaultCartIcon ? 
      <span className={clickValue ? "d-inline-block" : "d-none"}>
        <span className="CartIcon" onClick={() => { 
          ServiceAdd(); 
          handleShow() }} >
          <img src={CartIcon} alt="icon" />
        </span>
      </span>:
      isCourseVallidToAdd ? 
      <span className={clickValue ? "d-inline-block" : "d-none"}>
        <span className="CartIcon" onClick={() => { 
          ServiceAdd(); 
          handleShow() }} >
          <img src={CartIcon} alt="icon" />
        </span>
      </span>: 
      isGroupVallidToAdd ? 
      <span className={clickValue ? "d-inline-block" : "d-none"}>
        <span className="CartIcon" onClick={() => { 
          ServiceAdd(); 
          handleShow() }} >
          <img src={CartIcon} alt="icon" />
        </span>
      </span>:
      null
      }
    </>
  )
}
export default CartBtn;