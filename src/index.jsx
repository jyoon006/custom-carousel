import React, { Component } from 'react';
import './index.css';
import rightArrowSVG from './svg/Down-Arrow.svg';
import _debounce from './debounce';

class Carousel extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.mousemoveListener = this.mousemoveListener.bind(this);
        this.mouseupListener = this.mouseupListener.bind(this);
        this.captureMouseEvents = this.captureMouseEvents.bind(this);
        this.state = {
            currentShiftedPosition: 0,
            previousMovementX: 0,
            mouseDown: false,
            carouselWidth: null,
            imageWidth: null,
            imageDivWidth: null,
            maxImagesToShow: null,
            showLeftArrow: 'hidden',
            showRightArrow: 'initial'
        };
    }

    componentDidMount() {
        const carouselWidth = document.querySelector('#carousel-container').offsetWidth;
        const imageWidth = Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2));
        const imageDivWidth = imageWidth * this.props.children.length;
        const maxImagesToShow = carouselWidth / imageWidth;

        this.setState({
            carouselWidth: carouselWidth,
            imageWidth: imageWidth,
            imageDivWidth: imageDivWidth,
            maxImagesToShow: maxImagesToShow
        });

    }
 
    mousemoveListener(event) {
        event.preventDefault();
        if(this.state.mouseDown) this.setState({ previousMovementX: event.layerX });
        if(this.state.currentShiftedPosition < (-(this.state.imageDivWidth) + (this.props.showImages ? Math.floor(this.state.maxImagesToShow) : this.state.maxImagesToShow) * this.state.imageWidth)) this.setState({ showRightArrow: 'hidden' });
        if(this.state.currentShiftedPosition === 0) this.setState({ showLeftArrow: 'hidden'});

        if(this.state.previousMovementX - event.layerX > 0 && this.state.currentShiftedPosition > (-(this.state.imageDivWidth) + (this.props.showImages ? Math.floor(this.state.maxImagesToShow) : this.state.maxImagesToShow) * this.state.imageWidth)) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition - 15, showLeftArrow: 'visible' }, () => {
                document.querySelector('.carousel-inside-container').style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.transition = '0.1s linear'; 
            })
                
        } else if(this.state.previousMovementX - event.layerX < 0 && this.state.currentShiftedPosition < 0) {
            this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + 15, showRightArrow: 'visible' }, () => {
                document.querySelector('.carousel-inside-container').style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                document.querySelector('.carousel-inside-container').style.transition = '0.1s linear'; 
            })
        }

        if(this.state.mouseDown) this.setState({ mouseDown: false });     
       
    }

    mouseupListener(event) {
        event.stopPropagation();
        document.removeEventListener('mouseup', this.mouseupListener, true);
        document.querySelector('.carousel-inside-container').removeEventListener('mousemove', this.mousemoveListener, true);
    }

    captureMouseEvents() {
        document.addEventListener('mouseup', this.mouseupListener, true);
        document.querySelector('.carousel-inside-container').addEventListener('mousemove', this.mousemoveListener, true);
    }

    handleMouseDown(event) { 
        event.preventDefault();
        event.stopPropagation();
        this.setState({mouseDown: true}, () => {
            this.captureMouseEvents();
        });    
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
            if(this.state.currentShiftedPosition === (-(this.state.imageDivWidth) + Math.floor(this.state.maxImagesToShow) * this.state.imageWidth)) return;
            this.setState({ showLeftArrow: 'visible' });
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', -(Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2)) * this.props.showImages) || -(500 * this.props.showImages));
            else this.handleTransform('.carousel-inside-container', 'negative');
        } else {
            if(this.state.currentShiftedPosition === 0) return;
            this.setState({ showRightArrow: 'visible' });
            if(this.props.showImages > 0) this.handleTransform('.carousel-inside-container', Number(document.querySelector('.carousel-inside-container div').style.width.slice(0, -2) * this.props.showImages) || 500 * this.props.showImages);
            else this.handleTransform('.carousel-inside-container', 'positive');
        }
    }

    handleTransform(target, shift) {
        
        let maxShift = null;
       
        if(shift === 'negative') shift = -(Math.floor(this.state.maxImagesToShow) * this.state.imageWidth);
        else if(shift === 'positive') shift = Math.floor(this.state.maxImagesToShow) * this.state.imageWidth;

        if(shift < 0) {
            if(this.state.currentShiftedPosition + (shift * 2) > -(this.state.imageDivWidth)) {
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                maxShift = -(this.state.imageDivWidth - (this.state.maxImagesToShow * this.state.imageWidth));
                this.setState({ currentShiftedPosition: maxShift, showRightArrow: 'hidden' }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            }
        } else {
            if(this.state.currentShiftedPosition + (shift) <= 0) {
                this.setState({ currentShiftedPosition: this.state.currentShiftedPosition + shift }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            } else {
                maxShift = 0;
                this.setState({ currentShiftedPosition: maxShift, showLeftArrow: 'hidden' }, () => {
                    document.querySelector(target).style.transform = `translateX(${this.state.currentShiftedPosition}px)`;
                    document.querySelector(target).style.transition = '0.2s ease-in';
                });
            }
        }
        
    }

    render() { 
        let carouselStyles = {
            height: typeof this.props.carouselHeight === 'number' ? `${this.props.carouselHeight}px`: this.props.carouselHeight || 'auto',
            width: typeof this.props.carouselWidth === 'number'? `${this.props.carouselWidth}px`: this.props.carouselWidth || '90vw'
        };

        if (this.props.showImages > 0) {
            if(this.props.imageWidth) carouselStyles.width = this.props.imageWidth * this.props.showImages;
            else carouselStyles.width = 500 * this.props.showImages;
        }



        return (
            <div id="main-container">
                { this.props.showArrows ? null : <div title="chevron-left" className= "chevron-left" style={{ visibility: this.state.showLeftArrow }} onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>}
                <div id="carousel-container" style={ carouselStyles } onMouseDown={ this.handleMouseDown }>
                    <div className="carousel-inside-container">
                    { this.changeImageWidth(this.props.children) }
                    </div>
                </div>
                { this.props.showArrows ? null : <div title="chevron-right" className= "chevron-right" style={{ visibility: this.state.showRightArrow }} onClick={ this.handleClick } dangerouslySetInnerHTML={{ __html: rightArrowSVG }}></div>}
            </div>
            
        )
    }
}

export default Carousel;