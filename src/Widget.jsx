import { useQuery } from '@apollo/client';
import React, { useState, useEffect, createContext } from 'react';
import { Button } from 'react-bootstrap';
import { SERVICE_LIST } from './gql/Query';
import Services from './Services';
import { toast, ToastContainer } from 'react-toastify';

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
  return (
    <CartList.Provider
      value={{
        handleShow,
        cartItems,
        setCartItems,
        currentCartItem,
        setCurrentCartItem,
      }}
    >
      <div id="ShopServicesRoot">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 pe-md-0">
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
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </CartList.Provider>
  );
}

export default Widget;