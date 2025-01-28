import React from "react";
import styled from "styled-components";

export const validateAndResizeImage = (file) => {
  return new Promise((resolve, reject) => {
    // Check minimum dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < 190 || img.height < 254) {
        reject(
          new Error(
            `Image must be at least 190x254 pixels. Current size: ${img.width}x${img.height}`
          )
        );
        return;
      }

      // Create canvas for resizing
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 190;
      canvas.height = 254;

      // Calculate scaling to maintain aspect ratio while covering entire card
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const x = (canvas.width - img.width * scale) * 0.5;
      const y = (canvas.height - img.height * scale) * 0.5;

      // Draw image with background fill
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

const FlipCard = ({ photo, story }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="content">
          <div className="back">
            <div className="back-content">
              <img
                src={photo}
                alt="Memory"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
          <div className="front">
            <div className="img">
              <div className="circle"></div>
              <div className="circle" id="right"></div>
              <div className="circle" id="bottom"></div>
            </div>
            <div className="front-content">
              <div className="description">
                <div className="title">
                  <p>{story}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    overflow: visible;
    width: 190px;
    height: 254px;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 300ms;
    box-shadow: 0px 0px 10px 1px #000000ee;
    border-radius: 5px;
  }

  .front,
  .back {
    background-color: #151515;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 5px;
    overflow: hidden;
  }

  .back {
    width: 100%;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .back::before {
    position: absolute;
    content: " ";
    display: block;
    width: 160px;
    height: 160%;
    background: linear-gradient(
      90deg,
      transparent,
      #ff9966,
      #ff9966,
      #ff9966,
      #ff9966,
      transparent
    );
    animation: rotation_481 5000ms infinite linear;
  }

  .back-content {
    position: absolute;
    width: 99%;
    height: 99%;
    background-color: #151515;
    border-radius: 5px;
    overflow: hidden;
  }

  .card:hover .content {
    transform: rotateY(180deg);
  }

  @keyframes rotation_481 {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

  .front {
    transform: rotateY(180deg);
    color: white;
  }

  .front .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .description {
    box-shadow: 0px 0px 10px 5px #00000088;
    width: 100%;
    padding: 15px;
    background-color: #00000099;
    backdrop-filter: blur(5px);
    border-radius: 5px;
  }

  .title {
    font-size: 10px;
    font-family: "Courier New", monospace;
    max-width: 100%;
    line-height: 1.5;
  }

  .title p {
    font-size: 7px;
    text-align: justify;
    margin: 0;
    padding: 0;
  }

  .front .img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #ffbb66;
    position: relative;
    filter: blur(15px);
    animation: floating 2600ms infinite linear;
  }

  #bottom {
    background-color: #ff8866;
    left: 50px;
    top: 0px;
    width: 150px;
    height: 150px;
    animation-delay: -800ms;
  }

  #right {
    background-color: #ff2233;
    left: 160px;
    top: -80px;
    width: 30px;
    height: 30px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

export default FlipCard;
