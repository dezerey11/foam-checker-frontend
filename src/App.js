import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const options = [
    { label: "Foaming", value: "FOAMING" },
    { label: "Not Foaming", value: "NOT_FOAMING" },
    { label: "Unclassified", value: "UNCLASSIFIED" },
  ];

  const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {label}
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  };

  const [images, setImages] = useState([]);

  const getImages = async (classification) => {
    const response = await axios.get(
      `http://localhost:4000/images/classification/${classification}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    setImages(response.data.images);
  };

  const [value, setValue] = React.useState("UNCLASSIFIED");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    getImages(value);
  }, [value]);

  let classification;

  const checkClassification = (c) => {
    if (c === "FOAMING") {
      classification = <h4 className="foaming">Foaming</h4>;
    } else if (c === "NOT_FOAMING") {
      classification = <h4 className="not-foaming">Not Foaming</h4>;
    } else {
      classification = <h4 className="unclassified">Unclassified</h4>;
    }
  };

  const changeClassification = async (id, c) => {
    await axios.patch(`http://localhost:4000/images/${id}`, {
      classification: c,
    });
  };
  return (
    <div className="App">
      <h1>FoamCheck</h1>
      <Dropdown
        label="Filter: "
        options={options}
        value={value}
        onChange={handleChange}
      />
      <div className="images-container">
        {images.map((image) => (
          <div className="image" key={image._id}>
            <img className="culture-img" src={image.url} alt="culture" />
            <br />
            <button
              onClick={() => changeClassification(image._id, "FOAMING")}
              className="foaming-btn"
            >
              Foaming
            </button>
            <button
              onClick={() => changeClassification(image._id, "NOT_FOAMING")}
              className="not-foaming-btn"
            >
              Not Foaming
            </button>
            {checkClassification(image.classified)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
