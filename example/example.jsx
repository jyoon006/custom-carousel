import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ArtCarousel from '../src/index.jsx';

class Example extends Component {
    render() {
        let options = {
            carouselHeight: 300,
            carouselWidth: 800,
            showImages: 3
        };

        return (
            <div>
                <h2>Carousel Example</h2>
                <ArtCarousel { ...options }>
                    <div><img src='http://cdn.akc.org/Marketplace/Breeds/Rottweiler_SERP.jpg' /></div>
                    <div><img src='http://cdn.akc.org/Marketplace/Breeds/Rottweiler_SERP.jpg' /></div>
                    <div><img src='http://cdn.akc.org/Marketplace/Breeds/Rottweiler_SERP.jpg' /></div>
                    <div><img src='http://cdn.akc.org/Marketplace/Breeds/Rottweiler_SERP.jpg' /></div>
                    <div><img src='http://cdn.akc.org/Marketplace/Breeds/Rottweiler_SERP.jpg' /></div>
                    <div><img src='http://cdn.akc.org/Marketplace/Breeds/Rottweiler_SERP.jpg' /></div>
                </ArtCarousel>
                    
            </div>
        )
    }
}

ReactDOM.render(<Example />, document.getElementById('app'));
