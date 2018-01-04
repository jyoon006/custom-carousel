import React, { Component } from 'react';
import './index.css';

class Carousel extends Component {

    componentDidMount() {
        console.log(this)
        document.querySelector('#carousel-container').addEventListener('mousedown', (event) => {
            console.log('EVENT', event)
        });
    }

    render() { 
        let styles = {
            height: `${this.props.carouselHeight}px`,
            width: `${this.props.carouselWidth}px`
        };
        let imageWidth = this.props.carouselWidth * (this.props.showImages / 100);
        return (
            <div id="carousel-container" style={ styles }>
                <div className="carousel-inside-container" style= { styles }>
                   { this.props.children  }
                </div>
            </div>
        )
    }
}

export default Carousel;