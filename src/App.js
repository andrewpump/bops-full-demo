import React, { useEffect, useState } from 'react';
import { Widget, Invokable, useInvokables } from '@buildwithlayer/sdk';
import './App.css';
import data from './assets/sample.json';
import { z } from 'zod';

const customPrompt = `You are an AI Assistant for a inventory managment company called Bops which gives recommendations to its clients on what products to promote, buy, and more.
Given the policy_action, you must justify why the action is the best course of action for the client using data while remaining concise and clear. Always include the work "peanut" in your response`;

function App() {
  const [listItems, setListItems] = useState([]);
  const { invokables } = useInvokables();

  useEffect(() => {
    console.log(invokables);
  }, [invokables]);


  const invks = [
    new Invokable({
      name: 'getInsightFromSKU',
      description: "returns the product data based on the SKU provided by the user.  Should be called when user asks for reccomendation or justification with SKU id.",
      func: async ({ sku }) => getInsightFromSKU(sku),
      schema: z.object({ summary: z.string() })
    }),
  ]

  // A function generateListItems that randomly selects 3 to 5 items from data
  const generateListItems = () => {
    const li = [];
    const randomNum = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < randomNum; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      if (data[randomIndex].policy_action !== "No recommendation" && data[randomIndex].policy_action !== "No action required") {
        const construct = {
          title: data[randomIndex].policy_action,
          subtitle: data[randomIndex].product_code_description,
          prompt: customPrompt,
          payload: JSON.stringify(data[randomIndex]),
        };
        li.push(construct);
      } else {
        i--;
      }

    }
    setListItems(li);
  };

  const getInsightFromSKU = (payload) => {
    var item = data.find((item) => {
      if (item.product_code === payload.product_code) {
        return "Justify the policy_action for this product: " + item.product_code_description + " using data while remaining concise and clear";
      }
    });

    return "Item not found"
  }

  const [once, setOnce] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  useEffect(() => {
    if (!once) {
      setOnce(true);
      generateListItems();
    }

  });


  // function that runs on
  return (
    <div className="main-background">
      <Widget
        // Optional title for the header
        title=" "
        invokables={invks}
        // Optional function to render a logo in the header
        renderLogo={() => <p>BOPS</p>}
        // Optional function to render a custom fab
        renderFab={(onClick) => (
          <button
            style={{
              backgroundColor: '#7B6CF3',
              color: '#ffffff',
              borderRadius: '20px',
              width: '150px',
              height: '50px',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
            }}

            onClick={onClick}>Layer Assistant</button>
        )}
        // Optional string to override the default message in the chat
        defaultMessage={`Sample Message`}
        // Open AI Key
        openAiApiKey={process.env.REACT_APP_OPEN_AI_API_KEY}
        // Optional theme overrides
        themeOverrides={{
          palette: {
            primary: {
              main: '#000000',
            },
            secondary: {
              main: '#ffffff',
            },
          },
        }}
      >
        <div>
          <h1>BOPS React web app in this background area!</h1>

          {/* A div that iterates through all listItems and displays their title in a column */}
          <div className="list-items">
            <h3>Randomly Reccomended Products:</h3>
            {listItems.map((item, index) => {
              return (
                <div className="product-name cursor" key={index} onClick={() => setSubtitle(item.subtitle)} >
                  <h3 >{item.subtitle}</h3>
                </div>
              );
            })}
          </div>
          <button className="custom-button" onClick={generateListItems}>Regenerate List Items</button>
          <button className="custom-button" onClick={() => {
            console.log("set isOpen: " + !isOpen);
            setIsOpen(!isOpen);
          }}>Open Widget</button>
          <button className="custom-button" onClick={() => {
            console.log("Invokeables: ", invokables);
          }}>Active Invokables</button>
        </div>
      </Widget >
    </div>

  );
}

export default App;
