import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import {useNavigate} from "react-router-dom"


const ProductDisplay = () => {
  const navigate = useNavigate()
  const onSubmit = async(e) =>{
    try {
      e.preventDefault();
      let {data} = await axios.post("/create-checkout-session")
      console.log(data)
      window.location = data
      // navigate(res.request.responseURL)
  
    } catch (error) {
      console.log(error)
    }
  }
  
  
  return(
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
        <h3>Stubborn Attachments</h3>
        <h5>$20.00</h5>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <button type="submit">
          Checkout
        </button>
      </form>
    </section>
  );
}
const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}