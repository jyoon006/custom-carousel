import React, { Component } from 'react';
import './index.css';
import rightArrowSVG from './svg/Down-Arrow.svg';

class Carousel extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            currentShiftedPosition: 0
        };
    }
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
    handleClick(event) {
        if(event.currentTarget.title === 'chevron-right') {
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', -(Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2)) * this.props.showImages) || -(500 * this.props.showImages));
            else this.handleTransform('.carousel-inside-container', -200);
        } else {

        }
    }

    handleTransform(target, shift) {
        let maxShift = null;
        const carouselWidth = Number(document.querySelector('#carousel-container').style.width.slice(0, -2));
        const imageWidth = Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2));
        const imageDivWidth = imageWidth * this.props.children.length;
        console.log('arguments', shift, imageWidth, imageDivWidth, carouselWidth)

        if(shift < 0) {
            console.log(this.state.currentShiftedPosition + shift, -imageDivWidth)
            // console.log(imageDivWidth + shift, this.state.currentShiftedPosition + carouselWidth)

            console.log(this.state.currentShiftedPosition + (shift * 2) > -imageDivWidth)

            if(this.state.currentShiftedPosition + (shift * 2) > -imageDivWidth) {
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                const maxImagesToShow = carouselWidth / imageWidth;
                let maxShift = -(imageDivWidth - (maxImagesToShow * imageWidth));
                this.setState({ currentShiftedPosition: maxShift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            }
        }
        //if shift is negative, carousel transforms negative pixels

        // console.log((currentShift), imageDivWidth)

        // if(imageDivWidth <= )

        // if(currentShift > imageDivWidth) maxShift = imageDivWidth + currentShift;
        // console.log('maxShift', maxShift)

        
     
        //     document.querySelector(target).style.transform = maxShift ? `translateX(-${maxShift}px` : `translateX(${currentShift}px)`;
        //     document.querySelector(target).style.transition = '0.5s ease-in';
    
        

        // this.setState({ currentPosition: -maxShift || currentShift  });
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
                <div title="chevron-left" className= "chevron-left" onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>
                <div id="carousel-container" style={ styles }>
                    <div className="carousel-inside-container" style= { styles }>
                    { this.changeImageWidth(this.props.children) }
                    </div>
                </div>
                <div title="chevron-right" className= "chevron-right" onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>
            </div>
            
        )
    }
}

export default Carousel;