import React, { Component } from 'react';
import './index.css';
import rightArrowSVG from './svg/Down-Arrow.svg';

class Carousel extends Component {

    componentDidMount() {
        console.log(this)
        // document.querySelector('#carousel-container').addEventListener('mousedown', (event) => {
        //     console.log('EVENT', event)
        // });
    }

    changeImageWidth(children) {
        return React.Children.map(children, (childNode) => {
            return React.cloneElement(childNode, { 
                style: {
                    width: this.props.imageWidth ? `${this.props.imageWidth}px` : '500px',
                    height: this.props.imageHeight ? `${this.props.imageHeight}px` : '500px'
                }
            });
        });
    }

    render() { 
        let styles = {
            height: typeof this.props.carouselHeight === 'number' ? `${this.props.carouselHeight}px`: this.props.carouselHeight || 'auto',
            width: typeof this.props.carouselWidth === 'number'? `${this.props.carouselWidth}px`: this.props.carouselWidth || '90vw'
        };

        if( this.props.showImages > 0 ) {
            if(this.props.imageWidth) styles.width = this.props.imageWidth * this.props.showImages;
            else styles.width = 500 * this.props.showImages;
        }


        return (
            <div id="main-container">
                <div className= "chevron-left" dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>
                <div id="carousel-container" style={ styles }>
                    <div className="carousel-inside-container" style= { styles }>
                    { this.changeImageWidth(this.props.children) }
                    </div>
                </div>
                <div className= "chevron-right" dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>
            </div>
            
        )
    }
}

export default Carousel;