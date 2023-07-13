import React, { useEffect, useState } from 'react';
import { Widget } from '@buildwithlayer/sdk';
import './App.css';
import data from './assets/sample.json';

const customPrompt = `Justify the policy action in this json data using the other data in 
the obejct and respond very concisely and use numbers: \n\n`;

function App() {
  const [listItems, setListItems] = useState([]);

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
    data.find((item) => {
      if (item.product_code === payload.product_code) {
        return item;
      }
    });
  }

  const [once, setOnce] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  useEffect(() => {
    if (!once) {
      setOnce(true);
      generateListItems();
    }

    console.log("OpenAI Key: ", process.env.REACT_APP_OPEN_AI_API_KEY);
  });
  return (
    <div className="main-background">
      <Widget
        // Optional title for the header
        title="Optional Title"
        // Optional function to render a logo in the header
        renderLogo={() => <p>Logo</p>}
        // Optional function to render a custom fab
        renderFab={(onClick) => (
          <button onClick={onClick}>Open Layer Assistant</button>
        )}
        // Optional string to override the default message in the chat
        defaultMessage={`Sample Message`}
        // Open AI Key
        openAIApi={process.env.REACT_APP_OPEN_AI_API_KEY}
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
      />
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
      </div>
    </div>
  );
}

export default App;
