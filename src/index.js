import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import "./App.css";

class App extends PureComponent {

  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handlePrint= this.handlePrint.bind(this);
  }

  state = {
    src: null,
    crop: {},
    isPrintEnabled: false,
    imageUrl: false,
  };

  handleSave(imageFile) {
    let promise = Promise.resolve("http://lorempixel.com/800/100/cats/");

    promise.then((imageUrl) => {
      this.setState({ isPrintEnabled : true, imageUrl: imageUrl});
    });
  }

  handlePrint(imageSrc) {
    window.print();
    window.close();
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image, pixelCrop) => {
    this.imageRef = image;
  };

  onCropComplete = async (crop, pixelCrop) => {
    let croppedImageUrl = null
    if (pixelCrop.width > 800 || pixelCrop.height > 100) {
      alert("Wrong dimension. Maximum dimension is 800x100.");
    } else {
      croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        "newFile.jpeg"
      );
    }

    this.setState({ croppedImageUrl });
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(file);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    const { croppedImageUrl, imageUrl, isPrintEnabled } = this.state;

    return (
      <div className="App">

        {!imageUrl &&
          <div>
            <div>
              <label>Please select a file to upload:</label>
              &nbsp;
              <input type="file" onChange={this.onSelectFile} />
            </div>

            <div>
              {this.state.src && (
                <ReactCrop
                  src={this.state.src}
                  crop={this.state.crop}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />

              )}
            </div>

            <div>
              <h2>Preview:</h2>
              {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
            </div>


            <div>
              <button type="submit" class='btn' onClick={ () => { this.handleSave(croppedImageUrl) }}>Save</button>
            </div>
          </div>
        }

        { imageUrl &&
          <div>
            <img alt="Preview" src={imageUrl} />
          </div>
        }

        <div>
          <button type='submit' disabled={!isPrintEnabled} class='btn' onClick={ ()=> this.handlePrint(imageUrl) }>
            Print Preview
          </button>
        </div>

      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
