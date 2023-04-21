import { AiAssistant } from 'duckdevatgit-layer';
import './App.css';
import DemoImage from "./assets/images/demoImage.png"
import data from './assets/sample.json';
import React, { useEffect, useState } from 'react';

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
  
  const [once, setOnce] = useState(false);

  useEffect(() => {
    if (!once) {
      setOnce(true);
      generateListItems();
    }
  });

  return (
    <div className="main-background">
      <AiAssistant itemList={listItems} color="#7b6cf3" image={DemoImage} />
      <div>
        <h1>BOPS React web app in this background area!</h1>

        {/* A div that iterates through all listItems and displays their title in a column */}
        <div className="list-items">
          <h3>Randomly Reccomended Products:</h3>
          {listItems.map((item, index) => {
            return (
              <div className="product-name" key={index}>
                <h3>{item.subtitle}</h3>
              </div>
            );
          })}
        </div>
        <button className="custom-button" onClick={generateListItems}>Regenerate List Items</button>
      </div>
    </div>
  );
}

export default App;
