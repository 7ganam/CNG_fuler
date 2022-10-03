import React, { useState } from "react";

import "./CarPlateComponent.css";

function CarPlateComponent(props) {
  return (
    <div>
      <div className="plate_card_all">
        <div className="plate_card_top">
          <div
            style={{
              display: "flex",
              height: "100%",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                flexGrow: "1",
                display: "flex",
                marginLeft: "20px",
                alignItems: "center",
                fontSize: "50px",
              }}
            >
              EGYPT
            </div>
            <div
              style={{
                flexGrow: "1",
                display: "flex",
                marginLeft: "20px",
                alignItems: "center",
                fontSize: "50px",
              }}
            >
              <div style={{ marginBottom: "30px" }}>مصر</div>
            </div>
          </div>
        </div>

        <div className="plate_card_bottom">
          <div
            style={{
              display: "flex",
              height: "100%",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                fontSize: "70px",
              }}
            >
              <div style={{ width: "100%" }}>
                <input
                  name="plate_no"
                  type="text"
                  value={props.plate_no}
                  style={{ width: "90%", textAlign: "center" }}
                  disabled
                />
              </div>
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                fontSize: "70px",
              }}
            >
              <div style={{ width: "100%" }}>
                <input
                  name="plate_no"
                  type="text"
                  value={props.plate_str.split("").join(" ")}
                  style={{ width: "90%", textAlign: "center" }}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarPlateComponent;
