import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ArtCarousel from '../src/index.jsx';

class Example extends Component {
    render() {
        let options = {
            carouselWidth: 1800,
            imageHeight: 203,
            imageWidth: 251,
            // showArrows: false
            // showImages: 1
        };

        return (
            <div>
                <h2>Carousel Example</h2>
                <ArtCarousel { ...options }>
                    <div><a href=""><img src='https://qa1-imgsrc.art.com/img/print/print/karine-aigner-full-frame-close-up-portrait-of-a-male-white-lion-with-blue-eyes-south-africa_a-l-9557823-13061158.jpg' /></a></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999R18Q.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999QFVD.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999M6P8.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999FYB3.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999FW9X.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999DBI5.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q110199KJ8BS.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q110199BFT60.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999UHOE.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999H88S.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999J55L.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999JSMM.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q1101999D57R.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q110199KJKBR.jpg?w=400&h=400&q=80&p=0' /></div>
                    <div><img src='https://qa1-imgsrc.art.com/img/print/u-g-Q110199AZL5T.jpg?w=400&h=400&q=80&p=0' /></div>
                </ArtCarousel>
                    
            </div>
        )
    }
}

ReactDOM.render(<Example />, document.getElementById('app'));
