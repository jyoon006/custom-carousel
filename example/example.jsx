import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ArtCarousel from '../src/index.jsx';

class Example extends Component {
    render() {
        let options = {
            carouselWidth: 1800,
            imageHeight: 250,
            imageWidth: 400,
            // showArrows: false
            // showImages: 4
        };

        return (
            <div>
                <h2>Carousel Example</h2>
                <ArtCarousel { ...options }>
                    <div><a href=""><img src='https://i.ytimg.com/vi/i3Pc_P1_bT0/maxresdefault.jpg' /></a></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://cdn-images-1.medium.com/max/1242/1*3fxwk_21oPeikN2q4siUpg@2x.jpeg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                    <div><img src='https://i.ytimg.com/vi/5yIccPnhvy0/maxresdefault.jpg' /></div>
                </ArtCarousel>
                    
            </div>
        )
    }
}

ReactDOM.render(<Example />, document.getElementById('app'));
