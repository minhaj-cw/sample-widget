import { useQuery } from '@apollo/client';
import React, { useState, useEffect, createContext, Fragment } from 'react';
import  Modal from 'react-bootstrap/Modal';
import { SERVICE_LIST, SINGLE_SHOP, TIME_SLOT } from './gql/Query';
import Services from './Services';
import { toast, ToastContainer } from 'react-toastify';
import './Widget.css'
import Basket from './Basket';
import DateTimeModal from './DateTimeModal';

export const CartList = createContext();

function Widget({ businessId }) { 
  // const [businessData, setBusinessData] = useState(null);
  // const [error, setError] = useState(null);
  // useEffect(() => {
  //   const fetchBusinessData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/api/businesses/${businessId}`);
  //       const data = await response.json();
  //       console.log(data);
  //       setBusinessData(data);
  //     } catch (error) {
  //       setError('Failed to fetch business data');
  //     }
  //   };

  //   fetchBusinessData();
  // }, [businessId]);

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // if (!businessData) {
  //   return <div>Loading...</div>;
  // }
  const [addBack, setAddBack] = useState(0);
  const [currency, setcurrency] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [currentCartItem, setCurrentCartItem] = useState({});
  const [serviceList, setServiceList] = useState([]);
  const [groupServices, setGroupServices] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [show, setShow] = useState(false);

  const {
    data: service_cat,
    loading: serviceLoading,
    error: serviceError,
  } = useQuery(SERVICE_LIST, {
    variables: {
      type: "business",
      business_id: parseInt(3),
    },
  });
  useEffect(() => {
    if (service_cat) {
      const genericServiceList =
        service_cat.service_categories &&
        service_cat.service_categories
          .map((service) => ({
            ...service,
            services: service.services.filter(
              (item) => item.is_group === false
            ),
          }))
          .filter((service) => service.services.length > 0);
      setServiceList(genericServiceList);
      // group services
      const filteredServiceList =
        service_cat.service_categories &&
        service_cat.service_categories
          .map((service) => ({
            ...service,
            services: service.services.filter((item) => item.is_group === true),
          }))
          .filter((service) => service.services.length > 0);
      setGroupServices(filteredServiceList);
    }
  }, [service_cat]);

  const handleClose = () => {
    setShow((prev)=> !prev);
    setTime("");
  };
  const handleShow = () => {
    setShow(true);
  };
  //---------------------------------Add to cart------------------------------
  const onAdd = (product, person) => {
    if (product?.__typename === "Voucher") {
      setCartItems([...cartItems, { ...product, qty: 1, person: person }]);
    } else {
      if (product.group_type === "repeated") {
        if (product.special_price > 0) {
          setCartItems([
            ...cartItems,
            {
              ...product,
              qty: product.occurrences,
              special_price: product.occurrences * product.special_price,
              date: date,
              time: time,
            },
          ]);
        } else {
          setCartItems([
            ...cartItems,
            {
              ...product,
              qty: product.occurrences,
              price: product.occurrences * product.price,
              date: date,
              time: time,
            },
          ]);
        }
      } else {
        setCartItems([
          ...cartItems,
          { ...product, qty: product.occurrences, date: date, time: time },
        ]);
      }
      toast.success("Added to cart!");
      handleClose();
    }
  };
  //------------------------Increment------------------------------
  const inc = (id, name) => {
    // console.log("id", id)
    const updatedCart = cartItems.map((curElem) => {
      if (curElem.id === id && curElem.name === name) {
        return { ...curElem, qty: curElem.qty + 1 };
      }
      return curElem;
    });
    // console.log("updatedCart", updatedCart)
    setCartItems(updatedCart);
  };

  //-------------------------------Decrement------------------------------------
  const dec = (id, name) => {
    const updatedCart = cartItems
      .map((curElem) => {
        if (curElem.id === id && curElem.name === name) {
          return { ...curElem, qty: curElem.qty - 1 };
        }
        return curElem;
      })
      .filter((curElem) => curElem.qty != 0);
    setCartItems(updatedCart);
  };

  //--------------------Remove from cart---------------------
  const onRemove = (product) => {
    setAddBack(product.id);
    setCartItems(cartItems.filter((x) => x.id !== product.id));
    toast.warning("Removed from the cart!");
  };

  // single shop realted data
      const { data, loading: shopLoading,  refetch: refetchShop } = useQuery(SINGLE_SHOP, {
        variables: {
            slug: 'test-business'
        },
        fetchPolicy: "network-only"
    });
    const [shopSlotDuration, setShopSlotDuration] = useState(0);
    const [business, setBusiness] = useState(null);
    const [bID, setBID] = useState(0);
    const [country, setCountry] = useState("");
    const [upfront, setUpfront] = useState(0);
    const [bName, setBName] = useState("");
    const [videoVetting, setVideoVetting] = useState(false);
    const [voucherList, setVoucherList] = useState([]);
    const [closeDays, setCloseDays] = useState([]);
    const [closeDate, setCloseDate] = useState([]);
    const [blockedTime, setBlockedTime] = useState([]);
    const [name, setName] = useState("");
    const [guestStatus, setGuestStatus] = useState("");
    const [blockStatus, setBlockStatus] = useState("");
    const [canList, setCanList] = useState([]);
    const [gStatus, setGStatus] = useState(null);
    const [singdataleShop, setSingleShop] = useState(null);
    const [slotData, setSlotData] = useState(null);

    const { error: slotError, refetch: slotRefetch } = useQuery(TIME_SLOT, {
      variables: {
        business_id: parseInt(3),
        date: date,
        services: "",
      },
    });

    //-----------------------get services and vouchers------------------
    useEffect(() => {
      if (data) {
        if (data?.single_business) {
          setBusiness(data.single_business?.business);
          if (data?.single_business?.business) {
            setShopSlotDuration(data.single_business?.business?.slot_duration);
            setBID(data.single_business.business.id);
            setCountry(data.single_business.business.country);
            setUpfront(data.single_business.business.upfront_amount);
            setBName(data.single_business.business.name);
            setVideoVetting(data.single_business.business?.video_vetting);
          }
          setVoucherList(data?.single_business?.business_vouchers);
          setCloseDays(data?.single_business?.close_weekday);
          setCloseDate(data?.single_business?.close_date);
          setBlockedTime(data?.single_business?.block_date);
        }
        if (data?.me) {
          //console.log("singleShop?.me", singleShop?.me);
          setName(`${data.me.first_name} ${data.me.last_name}`);
        }
      }
      if (gStatus) {
        setGuestStatus(gStatus.guest_status?.status);
        setBlockStatus(gStatus.guest_status?.block);
        //console.log("gStatus-------------", gStatus)
      }
      if (slotError) {
        console.log("slotError", slotError);
      }
    }, [data, shopLoading, gStatus, slotError]);

  return (
    <CartList.Provider
      value={{
        handleShow,
        cartItems,
        setCartItems,
        currentCartItem,
        setCurrentCartItem,
        setDate,
        date,
        setTime,
        time,
      }}
    >
      <div id="ShopServicesRoot">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 pe-md-0">
              {/* normal service list */}
              {serviceList && serviceList?.length > 0 && (
                <Fragment>
                  <h2 className="sectionHeading">Book A Service</h2>
                  <div className="servicesItemWrap">
                    {serviceList?.map((item) => (
                      <Services
                        key={item.id}
                        content={item}
                        onAdd={onAdd}
                        addBack={addBack}
                        currency={currency}
                        defaultCartIcon={true}
                      />
                    ))}
                  </div>
                </Fragment>
              )}
              {/* group and course service list */}
              {groupServices && groupServices?.length > 0 && (
                <Fragment>
                  <h2 className="sectionHeading">Book A Class or Course</h2>
                  <div className="servicesItemWrap">
                    {groupServices.map((item) => (
                      <Services
                        key={item.id}
                        content={item}
                        onAdd={onAdd}
                        addBack={addBack}
                        currency={currency}
                        defaultCartIcon={false}
                      />
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
            <div className="col-lg-5">
              <div className="servicesCartWrap">
                <section id="cart">
                  <div className="cartInner">
                    {/* <h3>{bName ? bName : ""}</h3> */}
                    <h2>My Cart</h2>
                    {cartItems?.length === 0 ? (
                      <div className="Category">
                        {" "}
                        <div className="default-text">Cart is empty</div>
                      </div>
                    ) : (
                      cartItems?.map((item) => (
                        <Basket
                          key={item.id}
                          content={item}
                          onAdd={onAdd}
                          onRemove={onRemove}
                          inc={inc}
                          dec={dec}
                          currency={currency}
                        />
                      ))
                    )}
                  </div>
                </section>
              </div>
              <Modal
                size="md"
                animation={true}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Select date and time</Modal.Title>
                </Modal.Header>
                <DateTimeModal
                  closeDays={closeDays}
                  bID={bID}
                  onAdd={onAdd}
                  shopSlotDuration={shopSlotDuration}
                  closeDate={closeDate}
                  canList={canList}
                  vetting={false}
                  formatServices={""}
                  blockedTime={blockedTime}
                  notification={false}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </CartList.Provider>
  );
}

export default Widget;